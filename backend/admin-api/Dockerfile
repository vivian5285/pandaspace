# 🔥 用完整镜像！
FROM node:18

WORKDIR /app

# 全局安装最新版本的 npm 和 typescript
RUN npm install -g npm@latest typescript@latest

# 确保指定正确的源文件路径
COPY ["package.json", "package-lock.json*", "./"]

# 安装项目依赖，添加 --no-audit 和 --no-fund 来减少警告
RUN npm install --no-audit --no-fund

# 复制所有源代码
COPY . .

# 使用全局安装的 tsc 进行编译
RUN tsc

# 启动命令
CMD ["npm", "start"]
