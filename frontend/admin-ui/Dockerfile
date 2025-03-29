# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install && \
    chmod +x ./node_modules/.bin/* && \
    ls -l ./node_modules/.bin/

# 复制源代码
COPY . .

# 构建
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_ENV=production
ENV VITE_BUILD_MODE=production

# 添加调试信息
RUN echo "Current directory contents:" && ls -la && \
    echo "Node version:" && node --version && \
    echo "NPM version:" && npm --version && \
    echo "TypeScript version:" && npx tsc --version && \
    echo "Vite version:" && npx vite --version

# 确保所有依赖都正确安装
RUN npm install @types/react @types/react-dom @types/node --save-dev

# 直接使用 node 执行构建命令，而不是通过 npm 脚本
RUN node ./node_modules/typescript/bin/tsc --noEmit && \
    node ./node_modules/vite/bin/vite.js build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 