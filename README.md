# 熊猫量化平台 (PandaSpace)

## 项目概述
熊猫量化平台是一个集成了量化交易策略、托管服务和多链充值提现功能的在线交易平台。平台支持用户通过邮箱注册、选择多种主题样式、进行多链USDT充值和提现。平台支持用户通过 API 托管 或 充值托管费 两种方式进行量化交易，提供灵活的结算模式，并能够支持多语言。

## 功能概述

### 1. 用户注册与登录
- 用户通过邮箱注册完成账户创建，平台无需实名验证
- 用户通过邮箱登录平台，进行后续操作
- 支持邮箱验证和密码重置功能

### 2. 托管费用与结算
- 支持两种托管方式：
  - 充值托管费（用于支付平台和领导人抽成）
  - 交易所 API 托管资金
- 托管费用支持充值抵扣，并可随时提现
- 灵活的结算机制：
  - 每单结算
  - 每周/每日结算（取决于用户使用方式）
  - 平台和领导人分成自动计算

### 3. 多链充值与提现
- 支持多种区块链网络：
  - BSC (Binance Smart Chain)
  - ETH 二层网络（ARB、OP等）
  - TRC (TRON)
  - SOL (Solana)
- 支持USDT多链充值和提现
- 实时余额更新和交易记录

### 4. 多语言支持
- 支持中英文界面切换
- 所有提示信息和错误信息多语言显示
- 支持动态语言包加载

### 5. 主题切换功能
- 支持多种主题模式：
  - 浅色模式
  - 深色模式
  - 自定义模式
- 主题设置实时生效
- 支持主题持久化存储

### 6. 后台管理系统
- 用户管理功能：
  - 查看所有用户列表
  - 管理用户状态
  - 执行禁用/删除用户操作
- 数据管理功能：
  - 分页显示
  - 搜索过滤
  - 数据排序
- 多语言管理界面

## 项目结构
```
├── backend/                   # 后端代码目录
│   ├── models/               # 数据模型
│   ├── routers/              # API路由
│   ├── schemas/              # 数据验证模式
│   ├── services/             # 业务逻辑服务
│   ├── middleware/           # 中间件
│   ├── api/                  # API实现
│   ├── strategy-engine/      # 策略引擎
│   ├── admin-api/           # 管理后台API
│   ├── user-api/            # 用户API
│   ├── prisma/              # 数据库ORM
│   ├── auth.py              # 认证相关
│   ├── config.py            # 配置文件
│   ├── i18n.py              # 国际化支持
│   ├── exchange_client.py   # 交易所客户端
│   └── main.py              # 主程序入口
├── frontend/                 # 前端代码目录
│   ├── src/                 # 源代码
│   ├── user-ui/             # 用户界面
│   └── admin-ui/            # 管理后台界面
├── docker/                  # Docker配置
├── nginx/                   # Nginx配置
├── scripts/                 # 脚本文件
├── strategy/               # 交易策略
├── services/               # 服务
├── database/               # 数据库相关
├── migrations/             # 数据库迁移
├── tests/                  # 测试文件
├── .env.example           # 环境变量示例
├── docker-compose.yml     # Docker编排配置
├── start.sh               # 启动脚本
└── README.md              # 项目说明文档
```

## 环境要求
- Python 3.8+
- Node.js 14.x+
- MongoDB 4.4+
- Docker & Docker Compose
- Nginx
- Web3.js
- FastAPI
- React.js
- TypeScript

## 安装和运行步骤

### 1. 克隆项目
```bash
git clone [项目地址]
cd pandaspace
```

### 2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，配置必要的环境变量
```

### 3. 使用Docker启动服务
```bash
# 启动所有服务
./start.sh

# 清理并重新启动
./start.sh --clean
```

### 4. 访问服务
- 用户界面：https://localhost:${NGINX_HTTPS_PORT}
- 管理后台：https://localhost:${NGINX_HTTPS_PORT}/admin
- 用户API：https://localhost:${NGINX_HTTPS_PORT}/api
- 管理API：https://localhost:${NGINX_HTTPS_PORT}/admin/api

## 开发环境设置

### 1. 后端开发
```bash
# 创建并激活虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r backend/requirements.txt

# 启动开发服务器
cd backend
uvicorn main:app --reload
```

### 2. 前端开发
```bash
# 安装依赖
cd frontend
npm install

# 启动开发服务器
npm start
```

## 数据库迁移
```bash
# 生成迁移文件
cd backend
alembic revision --autogenerate -m "migration message"

# 应用迁移
alembic upgrade head
```

## 测试
```bash
# 运行后端测试
cd backend
pytest

# 运行前端测试
cd frontend
npm test
```

## SSL证书配置
1. 将SSL证书文件放置在 `nginx/ssl/` 目录下
2. 更新 `nginx/nginx.conf` 中的证书路径
3. 重启Nginx服务

## 贡献指南
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证
本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 联系方式
- 项目维护者：[维护者姓名]
- 邮箱：[联系邮箱]
- 项目链接：[项目地址] 