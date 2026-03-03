#!/bin/bash

# LeetCode 可视化平台一键启动脚本

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/Users/qinsx/project/AI/leetcode_visualizer"
FRONTEND_DIR="$PROJECT_DIR/frontend"
ADMIN_DIR="$FRONTEND_DIR/admin"
NGINX_CONF="$PROJECT_DIR/nginx/nginx.conf"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  LeetCode 可视化平台一键启动脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}错误: $1 未安装${NC}"
        exit 1
    fi
}

# 检查前置条件
echo -e "${YELLOW}[1/5] 检查前置条件...${NC}"
check_command mvn
check_command npm
check_command nginx

# 检查 MySQL 和 Redis
echo -e "${YELLOW}[2/5] 检查数据库服务...${NC}"
if ! pgrep -x "mysqld" > /dev/null; then
    echo -e "${RED}警告: MySQL 未运行，请先启动 MySQL${NC}"
    echo -e "${YELLOW}  brew services start mysql${NC}"
fi

if ! pgrep -x "redis-server" > /dev/null; then
    echo -e "${RED}警告: Redis 未运行，请先启动 Redis${NC}"
    echo -e "${YELLOW}  brew services start redis${NC}"
fi

# 启动后端
echo -e "${YELLOW}[3/5] 启动后端服务 (端口 8080)...${NC}"
cd "$PROJECT_DIR"

# 检查是否已经有后端在运行
if lsof -i :8080 > /dev/null 2>&1; then
    echo -e "${YELLOW}  后端服务已在运行，跳过${NC}"
else
    nohup mvn spring-boot:run > /tmp/leetcode-backend.log 2>&1 &
    echo -e "${GREEN}  后端服务已启动 (PID: $!)${NC}"
    echo -e "${YELLOW}  查看日志: tail -f /tmp/leetcode-backend.log${NC}"

    # 等待后端启动
    echo -n "  等待后端服务启动"
    for i in {1..10}; do
        if curl -s http://localhost:8080/api/solutions/list?page=1 > /dev/null 2>&1; then
            echo -e "${GREEN} OK${NC}"
            break
        fi
        echo -n "."
        sleep 2
    done
fi

# 构建前端
echo -e "${YELLOW}[4/5] 构建前端...${NC}"

# 构建用户端
echo -  "  构建用户端..."
cd "$FRONTEND_DIR"
npm run build
echo -e "${GREEN}  用户端构建完成${NC}"

# 构建管理后台
echo -  "  构建管理后台..."
cd "$ADMIN_DIR"
npm run build
echo -e "${GREEN}  管理后台构建完成${NC}"

# 启动 Nginx
echo -e "${YELLOW}[5/5] 启动 Nginx...${NC}"

# 先检查并停止可能存在的旧 Nginx 进程
if lsof -i :8082 > /dev/null 2>&1 || lsof -i :8083 > /dev/null 2>&1; then
    echo -e "${YELLOW}  停止现有 Nginx 进程...${NC}"
    pkill -f "nginx" 2>/dev/null
    sleep 1
fi

# 启动 Nginx
nginx -c "$NGINX_CONF"
echo -e "${GREEN}  Nginx 启动完成${NC}"

# 完成
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  启动完成！${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "访问地址:"
echo -e "  ${GREEN}用户端:   http://localhost:8082${NC}"
echo -e "  ${GREEN}管理后台: http://localhost:8083/admin${NC}"
echo -e "  ${GREEN}后端 API: http://localhost:8080/api${NC}"
echo ""
echo -e "常用命令:"
echo -e "  ${YELLOW}查看后端日志: tail -f /tmp/leetcode-backend.log${NC}"
echo -e "  ${YELLOW}重启 Nginx:   nginx -s reload -c $NGINX_CONF${NC}"
echo -e "  ${YELLOW}停止后端:     lsof -i :8080 | awk 'NR>1 {print $2}' | xargs kill${NC}"
echo ""
