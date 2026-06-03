# eVoice startup script (PowerShell)
# Prerequisites: pip install -r backend/requirements.txt
#              cd frontend; npm install; cd ..

Write-Host "=== eVoice Starting ===" -ForegroundColor Cyan

# Start backend (port 8010)
Write-Host "[Backend] Starting FastAPI (port 8010)..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    uvicorn main:app --reload --port 8010
}

Start-Sleep -Seconds 3

# Start frontend (port 5173)
Write-Host "[Frontend] Starting Vite (port 5173)..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"
    npm run dev
}

Write-Host ""
Write-Host "=== eVoice Started ===" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:8010" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Gray

# Wait for user input then stop
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "Stopping services..." -ForegroundColor Yellow
Stop-Job $backendJob
Stop-Job $frontendJob
Remove-Job $backendJob
Remove-Job $frontendJob
Write-Host "Services stopped" -ForegroundColor Cyan
