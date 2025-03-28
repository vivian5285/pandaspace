# 🔥 用完整镜像！
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 给 tsc 添加执行权限
RUN chmod +x ./node_modules/.bin/tsc

# 复制源代码
COPY . .

# 使用本地 tsc 编译
RUN ./node_modules/.bin/tsc

# 启动命令
CMD ["node", "dist/main.js"]
