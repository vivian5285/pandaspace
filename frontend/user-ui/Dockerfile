# 构建阶段
FROM node:18-alpine as builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 给 tsc 和 vite 添加执行权限
RUN chmod +x ./node_modules/.bin/tsc && chmod +x ./node_modules/.bin/vite

# 复制源代码
COPY . .

# 构建
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
# 使用完整路径调用 tsc 和 vite
RUN ./node_modules/.bin/tsc && ./node_modules/.bin/vite build

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