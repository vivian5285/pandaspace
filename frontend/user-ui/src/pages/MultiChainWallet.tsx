import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip,
  SelectChangeEvent
} from '@mui/material';
import {
  AccountBalanceWallet as WalletIcon,
  SwapHoriz as SwapIcon,
  History as HistoryIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

interface Chain {
  name: string;
  display_name: string;
  token: string;
  decimals: number;
}

interface Transaction {
  id: string;
  chain: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  tx_hash: string;
}

interface ChainStatus {
  chain: string;
  status: 'active' | 'maintenance' | 'error';
  last_block: number;
  gas_price?: number;
}

const MultiChainWallet: React.FC = () => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [chains, setChains] = useState<Chain[]>([]);
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [withdrawAddress, setWithdrawAddress] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chainStatuses, setChainStatuses] = useState<ChainStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    fetchChains();
    fetchTransactions();
    fetchChainStatuses();
  }, []);

  const fetchChains = async () => {
    try {
      const response = await fetch('/api/chains');
      const data = await response.json();
      setChains(data.chains);
      if (data.chains.length > 0) {
        setSelectedChain(data.chains[0].name);
      }
    } catch (err) {
      setError('Failed to fetch supported chains');
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transaction history');
    }
  };

  const fetchChainStatuses = async () => {
    try {
      const statuses = await Promise.all(
        chains.map(async (chain) => {
          const response = await fetch(`/api/chain/${chain.name}/status`);
          return response.json();
        })
      );
      setChainStatuses(statuses);
    } catch (err) {
      setError('Failed to fetch chain statuses');
    }
  };

  const createDepositAddress = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/deposit/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chain: selectedChain }),
      });
      const data = await response.json();
      setDepositAddress(data.address);
      setSuccess('Deposit address created successfully');
    } catch (err) {
      setError('Failed to create deposit address');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: selectedChain,
          amount: parseFloat(withdrawAmount),
          to_address: withdrawAddress,
        }),
      });
      const data = await response.json();
      setSuccess('Withdrawal initiated successfully');
      setWithdrawAmount('');
      setWithdrawAddress('');
      fetchTransactions();
    } catch (err) {
      setError('Failed to initiate withdrawal');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getChainStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleChainChange = (event: SelectChangeEvent<string>) => {
    setSelectedChain(event.target.value);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Multi-Chain Wallet
        </Typography>

        <Tabs
          value={activeTab}
          onChange={(event: React.SyntheticEvent, newValue: number) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Deposit" icon={<WalletIcon />} />
          <Tab label="Withdraw" icon={<SwapIcon />} />
          <Tab label="History" icon={<HistoryIcon />} />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Deposit USDT
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Chain</InputLabel>
                <Select
                  value={selectedChain}
                  onChange={handleChainChange}
                  label="Select Chain"
                >
                  {chains.map((chain) => (
                    <MenuItem key={chain.name} value={chain.name}>
                      {chain.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {depositAddress ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Your Deposit Address:
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {depositAddress}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => navigator.clipboard.writeText(depositAddress)}
                    >
                      Copy
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={createDepositAddress}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Generate Address'}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Withdraw USDT
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Chain</InputLabel>
                <Select
                  value={selectedChain}
                  onChange={handleChainChange}
                  label="Select Chain"
                >
                  {chains.map((chain) => (
                    <MenuItem key={chain.name} value={chain.name}>
                      {chain.display_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={withdrawAmount}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWithdrawAmount(event.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="To Address"
                value={withdrawAddress}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setWithdrawAddress(event.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleWithdraw}
                disabled={loading || !withdrawAmount || !withdrawAddress}
              >
                {loading ? <CircularProgress size={24} /> : 'Withdraw'}
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction History
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Chain</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Transaction Hash</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.chain}</TableCell>
                        <TableCell>
                          {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                        </TableCell>
                        <TableCell align="right">{tx.amount}</TableCell>
                        <TableCell>
                          <Chip
                            label={tx.status}
                            color={getStatusColor(tx.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(tx.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ fontFamily: 'monospace' }}
                          >
                            {tx.tx_hash.slice(0, 8)}...
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Chain Status
          </Typography>
          <Grid container spacing={2}>
            {chainStatuses.map((status) => (
              <Grid key={status.chain} xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="subtitle1">
                        {status.chain}
                      </Typography>
                      <Chip
                        label={status.status}
                        color={getChainStatusColor(status.status)}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Last Block: {status.last_block}
                    </Typography>
                    {status.gas_price && (
                      <Typography variant="body2" color="text.secondary">
                        Gas Price: {status.gas_price} Gwei
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MultiChainWallet; 