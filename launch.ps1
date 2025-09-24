# launch.ps1
# ========================================
# Launches MockMate Frontend & Backend
# ========================================

# Paths
$frontend = "frontend"
$backend = "backend"

# Launch Backend (FastAPI)
Write-Host "Starting FastAPI backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PWD\$backend`"; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload"

# Launch Frontend (React + Vite)
Write-Host "Starting React frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$PWD\$frontend`"; npm run dev"

Write-Host "`n✅ Both servers launched in separate windows!"
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://127.0.0.1:8000"
