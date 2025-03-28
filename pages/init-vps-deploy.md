请检查整个项目结构，并生成用于部署到 VPS 的完整 Docker 化配置，包含：

---

【一】检查模块完整性 ✅

请确保以下目录结构存在，并各自包含初始化代码（不需要完整业务，只确认结构和启动入口）：

1. frontend/user-ui（React + Vite + Tailwind）
2. frontend/admin-ui（React + Vite + Tailwind）
3. backend/user-api（NestJS）
4. backend/admin-api（NestJS）
5. strategy-engine（NodeJS）
6. docker/docker-compose.yml（即将生成）

---

【二】生成 docker-compose.yml 文件 ✅

包含以下服务：

- mongo：使用 mongo:6，映射 27017 端口
- user-api：暴露 3000 端口
- admin-api：暴露 3001 端口
- user-ui：打包构建后 Nginx 服务，暴露 4000
- admin-ui：打包构建后 Nginx 服务，暴露 4001
- strategy-engine：定时运行策略模拟器
- 可选 nginx：统一反代、开启 SSL

使用 volumes 管理数据、使用 .env 提取变量，设置服务依赖关系、重启策略等。

---

【三】每个服务生成对应的 Dockerfile ✅

比如：

- user-ui / admin-ui：基于 node 构建 ➜ nginx 托管
- user-api / admin-api：基于 node:18 + NestJS 启动
- strategy-engine：基于 node:18，定时任务循环执行
- nginx：提供反向代理配置模版（挂载 conf）

---

【四】其他部署准备 ✅

- 提供 `.env.example` 模板文件
- 建议在项目根目录写 `start.sh` 脚本（自动构建 + 启动）
- 可输出最终部署命令：`docker compose up -d --build`

---

总结完后请打印所有关键配置文件，包括 docker-compose.yml、Dockerfile、nginx 配置、env 示例。

