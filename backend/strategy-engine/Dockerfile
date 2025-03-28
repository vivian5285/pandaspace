FROM node:18

WORKDIR /app

# 更明确的 COPY 命令
COPY package.json ./
COPY package-lock.json* ./

# 安装依赖
RUN npm install --no-audit --no-fund

# 复制所有源代码
COPY . .

# 编译 TypeScript
RUN tsc

CMD ["npm", "start"] 