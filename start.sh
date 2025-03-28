#!/bin/bash

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 函数：输出带颜色的消息
log() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# 函数：检查并加载环境变量
load_env() {
    local env_file="$PROJECT_ROOT/.env"
    local env_example="$PROJECT_ROOT/.env.example"

    if [ ! -f "$env_file" ]; then
        log $YELLOW "⚠️ .env file not found, creating from .env.example..."
        if [ ! -f "$env_example" ]; then
            log $RED "❌ .env.example not found!"
            exit 1
        fi
        cp "$env_example" "$env_file"
        log $GREEN "✅ Created .env file. Please edit it with your configurations."
        exit 0
    fi

    log $BLUE "📚 Loading environment variables..."
    set -a
    source "$env_file"
    set +a

    # 设置默认值
    export NODE_ENV=${NODE_ENV:-development}
    export DOMAIN=${DOMAIN:-localhost}
    export PROJECT_NAME=${PROJECT_NAME:-trading}
}

# 函数：检查必要的命令
check_requirements() {
    log $BLUE "🔍 Checking system requirements..."
    local required_commands=("docker" "docker-compose" "openssl")
    
    for cmd in "${required_commands[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            log $RED "❌ Required command not found: $cmd"
            exit 1
        fi
    done
    log $GREEN "✅ All required commands are available"
}

# 函数：创建必要的目录
create_directories() {
    log $BLUE "📁 Creating required directories..."
    local directories=(
        "$PROJECT_ROOT/docker/nginx/ssl"
        "$PROJECT_ROOT/docker/nginx/logs"
        "$PROJECT_ROOT/docker/nginx/cache"
        "$PROJECT_ROOT/docker/mongo/init"
        "$PROJECT_ROOT/docker/mongo/data"
        "$PROJECT_ROOT/logs"
    )

    for dir in "${directories[@]}"; do
        mkdir -p "$dir"
        log $GREEN "✅ Created: $dir"
    done
}

# 函数：处理 SSL 证书
handle_ssl_certificates() {
    local ssl_dir="$PROJECT_ROOT/docker/nginx/ssl"
    local cert_file="$ssl_dir/server.crt"
    local key_file="$ssl_dir/server.key"

    log $BLUE "🔒 Checking SSL certificates..."

    if [ "$NODE_ENV" = "development" ]; then
        log $YELLOW "🚧 Development environment detected"
        if [ ! -f "$cert_file" ] || [ ! -f "$key_file" ]; then
            log $YELLOW "🔑 Generating self-signed certificates for development..."
            openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
                -keyout "$key_file" \
                -out "$cert_file" \
                -subj "/CN=localhost" \
                -addext "subjectAltName=DNS:localhost,DNS:*.localhost"
            
            # 创建管理后台证书的软链接
            ln -sf "$cert_file" "$ssl_dir/admin.server.crt"
            ln -sf "$key_file" "$ssl_dir/admin.server.key"
            
            log $GREEN "✅ Self-signed certificates generated successfully"
        fi
    else
        log $YELLOW "🏭 Production environment detected"
        if [ ! -f "$cert_file" ] || [ ! -f "$key_file" ]; then
            log $RED "❌ Production SSL certificates not found!"
            log $YELLOW "Required certificate files in $ssl_dir:"
            log $YELLOW "  - server.crt"
            log $YELLOW "  - server.key"
            log $YELLOW "  - admin.server.crt"
            log $YELLOW "  - admin.server.key"
            
            read -p "Generate temporary self-signed certificates? (y/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                handle_ssl_certificates
            else
                exit 1
            fi
        fi
    fi
}

# 函数：启动 Docker 服务
start_services() {
    log $BLUE "🚀 Starting services..."
    
    # 停止现有服务
    log $YELLOW "⏹️ Stopping existing services..."
    cd "$PROJECT_ROOT/docker" && docker-compose down

    # 清理（如果指定了 --clean 参数）
    if [ "$1" == "--clean" ]; then
        log $YELLOW "🧹 Cleaning up old containers and images..."
        docker system prune -af
    fi

    # 启动服务
    log $GREEN "▶️ Starting Docker services..."
    docker-compose up -d --build

    # 显示服务状态
    log $GREEN "\n📊 Service Status:"
    docker-compose ps
}

# 函数：显示访问信息
show_access_info() {
    log $GREEN "\n🌟 Application is running!"
    if [ "$NODE_ENV" = "development" ]; then
        log $BLUE "📱 Local Access URLs:"
        log $YELLOW "- User Interface: https://localhost:${NGINX_HTTPS_PORT}"
        log $YELLOW "- Admin Interface: https://localhost:${NGINX_HTTPS_PORT}/admin"
        log $YELLOW "- User API: https://localhost:${NGINX_HTTPS_PORT}/api"
        log $YELLOW "- Admin API: https://localhost:${NGINX_HTTPS_PORT}/admin/api"
    else
        log $BLUE "🌍 Production Access URLs:"
        log $YELLOW "- User Interface: https://${DOMAIN}"
        log $YELLOW "- Admin Interface: https://admin.${DOMAIN}"
        log $YELLOW "- User API: https://${DOMAIN}/api"
        log $YELLOW "- Admin API: https://admin.${DOMAIN}/api"
    fi

    log $BLUE "\n🔍 Monitoring Commands:"
    log $YELLOW "- View logs: docker-compose logs -f [service_name]"
    log $YELLOW "- Monitor containers: docker stats"
    log $YELLOW "- Check processes: docker-compose top"
}

# 主函数
main() {
    log $GREEN "\n🚀 Starting ${PROJECT_NAME} deployment...\n"
    
    # 执行各个步骤
    load_env
    check_requirements
    create_directories
    handle_ssl_certificates
    start_services "$1"
    show_access_info
    
    log $GREEN "\n✨ Deployment completed successfully!\n"
}

# 执行主函数
main "$@" 