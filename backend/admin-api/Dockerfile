# 🔥 用完整镜像！
FROM node:18

WORKDIR /app

# 首先全局安装 TypeScript
RUN npm install -g typescript

COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制源代码
COPY . .

# 使用全局安装的 tsc 进行编译
RUN tsc

# 启动命令
CMD ["npm", "start"]
