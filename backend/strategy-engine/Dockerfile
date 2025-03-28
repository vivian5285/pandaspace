FROM node:20

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install

# 关键修改：给 tsc 添加执行权限
RUN chmod +x ./node_modules/.bin/tsc

# 复制源代码
COPY . .

# 关键修改：使用完整路径调用 tsc
RUN ./node_modules/.bin/tsc

CMD ["npm", "start"] 