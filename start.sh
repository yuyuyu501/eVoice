#!/bin/bash
# eVoice 启动脚本
# 需要先安装依赖：pip install -r backend/requirements.txt && cd frontend && npm install && cd ..

echo "=== eVoice 启动中 ==="

# 清理旧进程
trap 'kill 0; exit' SIGINT SIGTERM

# 启动后端 (端口 8010)
echo "[后端] 启动 FastAPI (端口 8010)..."
cd backend
uvicorn main:app --reload --port 8010 &
BACKEND_PID=$!
cd ..

# 等待后端就绪
sleep 2

# 启动前端 (端口 5173)
echo "[前端] 启动 Vite (端口 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "=== eVoice 已启动 ==="
echo "  前端: http://localhost:5173"
echo "  后端: http://localhost:8010"
echo ""
echo "按 Ctrl+C 停止所有服务"

wait
