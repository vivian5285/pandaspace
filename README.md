# Trading System

一个基于 React + NestJS + Docker 的量化交易系统。

## 🌟 功能特点

- 📊 实时交易数据监控
- 🤖 自动化交易策略执行
- 👥 用户邀请与分润系统
- 📈 多策略并行运行
- 🔐 安全的 API 密钥管理
- 📱 响应式界面设计

## 🏗️ 技术架构

### 前端
- React + Vite
- TailwindCSS
- React Query
- TypeScript

### 后端
- NestJS
- MongoDB
- Docker
- Nginx

### 交易引擎
- Node.js
- Binance API

## 📁 项目结构

```bash
trading-system/
├── frontend/               # 前端项目
│   ├── user-ui/           # 用户交易界面
│   └── admin-ui/          # 管理后台界面
├── backend/               # 后端服务
│   ├── user-api/         # 用户 API 服务
│   └── admin-api/        # 管理 API 服务
├── strategy-engine/       # 策略执行引擎
└── docker/               # Docker 配置文件
```

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Docker & Docker Compose
- MongoDB 6.0+

### 安装步骤

1. 克隆项目
```bash
git clone <repository-url>
cd trading-system
```

2. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填入必要的配置信息
```

3. 启动服务
```bash
./start.sh
```

4. 访问服务
- 用户界面: http://localhost:4000
- 管理后台: http://localhost:4001
- 用户 API: http://localhost:3000
- 管理 API: http://localhost:3001

## 📚 API 文档

### 用户 API

- `GET /api/earnings/summary` - 获取收益概览
- `GET /api/earnings/history` - 获取收益历史
- `GET /api/strategy/list` - 获取策略列表
- `POST /api/strategy/enable/:id` - 启用策略
- `POST /api/strategy/disable/:id` - 停用策略

### 管理 API

- `GET /api/admin/users` - 获取用户列表
- `GET /api/admin/strategies` - 获取所有策略
- `POST /api/admin/strategy` - 创建新策略

## 🔧 配置说明

### 环境变量

```env
# MongoDB 配置
MONGO_USER=admin
MONGO_PASSWORD=your_password

# JWT 配置
JWT_SECRET=your_jwt_secret

# Binance API
BINANCE_API_KEY=your_api_key
BINANCE_API_SECRET=your_api_secret
```

## 🛠️ 开发指南

### 前端开发

```bash
# 进入用户前端目录
cd frontend/user-ui

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 后端开发

```bash
# 进入用户 API 目录
cd backend/user-api

# 安装依赖
npm install

# 启动开发服务器
npm run start:dev
```

## 📦 部署指南

### Docker 部署

1. 确保安装了 Docker 和 Docker Compose
2. 配置环境变量
3. 执行部署脚本
```bash
./start.sh
```

### 手动部署

1. 构建前端
```bash
cd frontend/user-ui
npm run build
```

2. 构建后端
```bash
cd backend/user-api
npm run build
```

3. 配置 Nginx
```bash
cp docker/nginx/conf.d/default.conf /etc/nginx/conf.d/
```

## 🔒 安全说明

- API 密钥安全存储
- JWT 认证
- SSL 加密
- 请求限流
- 错误处理

## 🔍 监控和维护

### 日志查看
```bash
# 查看服务日志
docker-compose logs -f [service_name]
```

### 健康检查
```bash
# 检查服务状态
docker-compose ps
```

### 数据备份
```bash
# 备份 MongoDB 数据
./scripts/backup/backup-mongo.sh
```

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 📄 许可证

MIT License

## 👥 团队成员

- 开发团队
- 维护团队
- 贡献者

## 📞 联系方式

- Email: your-email@example.com
- Issues: GitHub Issues

## 🔄 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 