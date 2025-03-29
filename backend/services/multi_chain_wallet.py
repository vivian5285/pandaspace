from typing import Dict, Optional
from decimal import Decimal
import logging
from datetime import datetime
from web3 import Web3
from solana.rpc.api import Client as SolanaClient
from tronpy import Tron
from ..models.user import User
from ..database import get_database

logger = logging.getLogger(__name__)

class MultiChainWallet:
    def __init__(self):
        self.db = get_database()
        # 初始化各个链的连接
        self.bsc_web3 = Web3(Web3.HTTPProvider('https://bsc-dataseed.binance.org/'))
        self.eth_web3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'))
        self.tron = Tron()
        self.solana = SolanaClient("https://api.mainnet-beta.solana.com")
        
        # USDT 合约地址
        self.usdt_contracts = {
            'BSC': '0x55d398326f99059fF775485246999027B3197955',
            'ETH': '0xdac17f958d2ee523a2206206994597c13d831ec7',
            'TRC': 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',  # TRC20 USDT
            'SOL': 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB'  # SPL USDT
        }

    async def create_deposit_address(self, user: User, chain: str) -> Dict:
        """
        为用户创建指定链的充值地址
        
        Args:
            user: 用户对象
            chain: 链名称 (BSC, ETH, TRC, SOL)
            
        Returns:
            Dict: 充值地址信息
        """
        try:
            # 检查是否已存在该链的充值地址
            existing_address = await self.db.deposit_addresses.find_one({
                'user_id': user.id,
                'chain': chain
            })
            
            if existing_address:
                return {
                    'address': existing_address['address'],
                    'chain': existing_address['chain'],
                    'created_at': existing_address['created_at']
                }
            
            # 根据链创建新的充值地址
            if chain == 'BSC':
                account = self.bsc_web3.eth.account.create()
                address = account.address
            elif chain == 'ETH':
                account = self.eth_web3.eth.account.create()
                address = account.address
            elif chain == 'TRC':
                account = self.tron.create_account()
                address = account.address.base58
            elif chain == 'SOL':
                # 使用 Solana SDK 创建新账户
                account = self.solana.create_account()
                address = str(account.public_key)
            else:
                raise ValueError(f"Unsupported chain: {chain}")
            
            # 保存充值地址信息
            await self.db.deposit_addresses.insert_one({
                'user_id': user.id,
                'chain': chain,
                'address': address,
                'created_at': datetime.utcnow()
            })
            
            return {
                'address': address,
                'chain': chain,
                'created_at': datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error creating deposit address for user {user.id} on chain {chain}: {str(e)}")
            raise

    async def process_deposit(self, user: User, chain: str, amount: Decimal, tx_hash: str) -> Dict:
        """
        处理用户充值
        
        Args:
            user: 用户对象
            chain: 链名称
            amount: 充值金额
            tx_hash: 交易哈希
            
        Returns:
            Dict: 充值处理结果
        """
        try:
            # 验证交易
            if not await self.verify_transaction(chain, tx_hash):
                raise ValueError("Invalid transaction")
            
            # 更新用户余额
            result = await self.db.users.update_one(
                {'_id': user.id},
                {
                    '$inc': {
                        'balance': float(amount),
                        'available_balance': float(amount)
                    }
                }
            )
            
            if result.modified_count == 0:
                raise ValueError("Failed to update user balance")
            
            # 记录充值历史
            await self.db.deposit_history.insert_one({
                'user_id': user.id,
                'chain': chain,
                'amount': float(amount),
                'tx_hash': tx_hash,
                'status': 'completed',
                'timestamp': datetime.utcnow()
            })
            
            return {
                'status': 'success',
                'amount': float(amount),
                'tx_hash': tx_hash
            }
        except Exception as e:
            logger.error(f"Error processing deposit for user {user.id} on chain {chain}: {str(e)}")
            raise

    async def process_withdrawal(
        self,
        user: User,
        chain: str,
        amount: Decimal,
        to_address: str
    ) -> Dict:
        """
        处理用户提现
        
        Args:
            user: 用户对象
            chain: 链名称
            amount: 提现金额
            to_address: 提现地址
            
        Returns:
            Dict: 提现处理结果
        """
        try:
            # 检查用户余额
            if user.available_balance < amount:
                raise ValueError("Insufficient balance")
            
            # 根据链执行提现
            tx_hash = None
            if chain == 'BSC':
                tx_hash = await self._withdraw_bsc(amount, to_address)
            elif chain == 'ETH':
                tx_hash = await self._withdraw_eth(amount, to_address)
            elif chain == 'TRC':
                tx_hash = await self._withdraw_trc(amount, to_address)
            elif chain == 'SOL':
                tx_hash = await self._withdraw_sol(amount, to_address)
            else:
                raise ValueError(f"Unsupported chain: {chain}")
            
            # 更新用户余额
            result = await self.db.users.update_one(
                {'_id': user.id},
                {
                    '$inc': {
                        'balance': -float(amount),
                        'available_balance': -float(amount)
                    }
                }
            )
            
            if result.modified_count == 0:
                raise ValueError("Failed to update user balance")
            
            # 记录提现历史
            await self.db.withdrawal_history.insert_one({
                'user_id': user.id,
                'chain': chain,
                'amount': float(amount),
                'to_address': to_address,
                'tx_hash': tx_hash,
                'status': 'completed',
                'timestamp': datetime.utcnow()
            })
            
            return {
                'status': 'success',
                'amount': float(amount),
                'tx_hash': tx_hash
            }
        except Exception as e:
            logger.error(f"Error processing withdrawal for user {user.id} on chain {chain}: {str(e)}")
            raise

    async def verify_transaction(self, chain: str, tx_hash: str) -> bool:
        """
        验证交易是否有效
        
        Args:
            chain: 链名称
            tx_hash: 交易哈希
            
        Returns:
            bool: 交易是否有效
        """
        try:
            if chain == 'BSC':
                tx = self.bsc_web3.eth.get_transaction(tx_hash)
                return tx is not None and tx['blockNumber'] is not None
            elif chain == 'ETH':
                tx = self.eth_web3.eth.get_transaction(tx_hash)
                return tx is not None and tx['blockNumber'] is not None
            elif chain == 'TRC':
                tx = self.tron.get_transaction(tx_hash)
                return tx is not None and tx.get('blockNumber') is not None
            elif chain == 'SOL':
                tx = self.solana.get_transaction(tx_hash)
                return tx is not None and tx.get('result') is not None
            else:
                return False
        except Exception as e:
            logger.error(f"Error verifying transaction {tx_hash} on chain {chain}: {str(e)}")
            return False

    async def _withdraw_bsc(self, amount: Decimal, to_address: str) -> str:
        """BSC 提现实现"""
        # 实现 BSC 提现逻辑
        pass

    async def _withdraw_eth(self, amount: Decimal, to_address: str) -> str:
        """ETH 提现实现"""
        # 实现 ETH 提现逻辑
        pass

    async def _withdraw_trc(self, amount: Decimal, to_address: str) -> str:
        """TRC 提现实现"""
        # 实现 TRC 提现逻辑
        pass

    async def _withdraw_sol(self, amount: Decimal, to_address: str) -> str:
        """SOL 提现实现"""
        # 实现 SOL 提现逻辑
        pass

    async def get_deposit_addresses(self, user: User) -> list:
        """
        获取用户的所有充值地址
        
        Args:
            user: 用户对象
            
        Returns:
            list: 充值地址列表
        """
        try:
            cursor = self.db.deposit_addresses.find({'user_id': user.id})
            return await cursor.to_list(length=None)
        except Exception as e:
            logger.error(f"Error getting deposit addresses for user {user.id}: {str(e)}")
            raise

    async def get_transaction_history(
        self,
        user: User,
        chain: Optional[str] = None,
        start_time: Optional[datetime] = None,
        end_time: Optional[datetime] = None
    ) -> Dict:
        """
        获取用户的交易历史
        
        Args:
            user: 用户对象
            chain: 链名称（可选）
            start_time: 开始时间（可选）
            end_time: 结束时间（可选）
            
        Returns:
            Dict: 交易历史
        """
        try:
            # 构建查询条件
            query = {'user_id': user.id}
            if chain:
                query['chain'] = chain
            if start_time:
                query['timestamp'] = {'$gte': start_time}
            if end_time:
                if 'timestamp' in query:
                    query['timestamp']['$lte'] = end_time
                else:
                    query['timestamp'] = {'$lte': end_time}
            
            # 获取充值历史
            deposits = await self.db.deposit_history.find(query).to_list(length=None)
            
            # 获取提现历史
            withdrawals = await self.db.withdrawal_history.find(query).to_list(length=None)
            
            return {
                'deposits': deposits,
                'withdrawals': withdrawals
            }
        except Exception as e:
            logger.error(f"Error getting transaction history for user {user.id}: {str(e)}")
            raise 