# eVoice 启动脚本 (PowerShell)
# 需要先安装依赖：pip install -r backend/requirements.txt
# 和：cd frontend; npm install; cd ..

Write-Host "=== eVoice 启动中 ===" -ForegroundColor Cyan

# 启动后端 (端口 8001)
Write-Host "[后端] 启动 FastAPI (端口 8010)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    uvicorn main:app --reload --port 8010
}

Start-Sleep -Seconds 3

# 启动前端 (端口 5173)
Write-Host "[前端] 启动 Vite (端口 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"
    npm run dev
}

Write-Host ""
Write-Host "=== eVoice 已启动 ===" -ForegroundColor Green
Write-Host "  前端: http://localhost:5173" -ForegroundColor Green
Write-Host "  后端: http://localhost:8010" -ForegroundColor Green
Write-Host ""
Write-Host "按任意键停止所有服务..." -ForegroundColor Gray

# 等待用户按键后停止
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "正在停止服务..." -ForegroundColor Yellow
Stop-Job $backendJob
Stop-Job $frontendJob
Remove-Job $backendJob
Remove-Job $frontendJob
Write-Host "服务已停止" -ForegroundColor Cyan
