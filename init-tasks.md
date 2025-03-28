请在当前 panda-trade 项目目录下创建以下完整项目结构，包括前端和后端子项目，每个项目均为独立的工程结构：

---

【一】frontend 目录下：

1. user-ui（用户端前端）
- 使用 React + TypeScript + Tailwind CSS
- 初始化 Vite 项目结构
- 包含 src/pages、src/components、src/styles 目录
- 预置首页页面（UserHome.tsx）和基本布局
- 监听端口：4000

2. admin-ui（管理端前端）
- 使用 React + TypeScript + Tailwind CSS
- 初始化 Vite 项目结构
- 包含 src/pages、src/components、src/styles 目录
- 预置首页页面（AdminDashboard.tsx）
- 监听端口：4001

---

【二】backend 目录下：

1. user-api（用户端后端）
- 使用 NestJS + TypeScript
- 包含基础模块：auth、user、strategy、earnings、referral
- 使用 @nestjs/mongoose 接入 MongoDB
- 配置 JWT 登录机制
- 监听端口：3000

2. admin-api（管理端后端）
- 使用 NestJS + TypeScript
- 包含基础模块：auth、admin、users、config、report
- 接入 MongoDB
- 提供管理员权限接口（例如设定收益率）
- 监听端口：3001

---

【三】docker 目录下（部署用）：

- 创建 docker-compose.yml 文件，用于统一启动 mongo、user-api、admin-api、user-ui、admin-ui 五个服务
- 每个服务暴露端口，支持开发环境部署
- MongoDB 使用 mongo:6 镜像，挂载数据卷

---

请依照以上说明，在当前项目结构中创建对应的项目文件夹和内容，不需要写具体业务代码，只需要搭好结构和初始化内容即可。
