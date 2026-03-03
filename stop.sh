#!/bin/bash

# LeetCode 可视化平台一键停止脚本

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  LeetCode 可视化平台停止脚本${NC}"
echo -e "${GREEN}========================================${NC}"

# 停止后端
echo -e "${YELLOW}[1/3] 停止后端服务...${NC}"
if lsof -i :8080 > /dev/null 2>&1; then
    PID=$(lsof -i :8080 | awk 'NR==2 {print $2}')
    kill $PID
    echo -e "${GREEN}  后端服务已停止 (PID: $PID)${NC}"
else
    echo -e "${YELLOW}  后端服务未运行${NC}"
fi

# 停止 Nginx
echo -e "${YELLOW}[2/3] 停止 Nginx...${NC}"
if lsof -i :80 > /dev/null 2>&1; then
    nginx -s stop -c /Users/qinsx/project/AI/nginx/nginx.conf 2>/dev/null
    echo -e "${GREEN}  Nginx 已停止${NC}"
else
    echo -e "${YELLOW}  Nginx 未运行${NC}"
fi

# 清理 Maven 进程
echo -e "${YELLOW}[3/3] 清理相关进程...${NC}"
pkill -f "spring-boot:run" 2>/dev/null
pkill -f "leetcode-visualizer" 2>/dev/null
echo -e "${GREEN}  清理完成${NC}"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  所有服务已停止${NC}"
echo -e "${GREEN}========================================${NC}"
