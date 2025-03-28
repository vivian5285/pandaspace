#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found. Please install Docker first.${NC}"
    exit 1
fi

# 检查 Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose not found. Please install Docker Compose first.${NC}"
    exit 1
fi

# 检查环境文件
if [ ! -f .env ]; then
    echo -e "${RED}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${RED}Please edit .env file with your configurations and run again${NC}"
    exit 1
fi

# 创建必要的目录
echo -e "${GREEN}Creating required directories...${NC}"
mkdir -p docker/nginx/ssl docker/nginx/logs docker/nginx/cache

# 生成自签名证书（用于测试）
if [ ! -f docker/nginx/ssl/localhost.crt ]; then
    echo -e "${GREEN}Generating self-signed SSL certificate for testing...${NC}"
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout docker/nginx/ssl/localhost.key \
        -out docker/nginx/ssl/localhost.crt \
        -subj "/CN=localhost"
fi

# 启动服务
echo -e "${GREEN}Starting services...${NC}"
cd docker
docker-compose up -d --build

# 等待服务启动
echo -e "${GREEN}Waiting for services to start...${NC}"
sleep 10

# 检查服务状态
echo -e "${GREEN}Checking service status...${NC}"
docker-compose ps

# 检查服务健康状态
echo -e "${GREEN}Checking service health...${NC}"
for service in mongo user-api user-ui strategy-engine nginx; do
    if docker-compose ps $service | grep -q "Up"; then
        echo -e "${GREEN}$service is running${NC}"
    else
        echo -e "${RED}$service is not running${NC}"
    fi
done

# 显示访问信息
echo -e "\n${GREEN}Services are running!${NC}"
echo "Access the application at: https://localhost"
echo "API endpoint: https://localhost/api"
echo "To view logs, run: docker-compose logs -f [service_name]" 