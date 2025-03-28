# 使用 Node.js 20 版本
FROM node:20

WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖并显示详细日志
RUN npm install --verbose

# 给 tsc 添加执行权限
RUN chmod +x ./node_modules/.bin/tsc

# 复制源代码
COPY . .

# 显示目录内容
RUN ls -la && \
    ls -la node_modules/.bin/

# 使用完整路径调用 tsc 并显示详细日志
RUN ./node_modules/.bin/tsc --verbose

CMD ["npm", "start"] 