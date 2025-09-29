@echo off
REM ========================================
REM Launches MockMate Frontend & Backend
REM ========================================

REM Get current directory
SET ROOT=%~dp0

echo Starting MockMate servers...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

REM Launch Backend (Python FastAPI)
echo Starting Backend Server...
start "MockMate Backend" cmd /k "cd /d %ROOT%backend && echo Activating virtual environment... && .\venv\Scripts\activate && echo Installing dependencies... && pip install fastapi uvicorn python-multipart && echo Starting FastAPI server with network access... && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Launch Frontend (React)
echo Starting Frontend Server...
start "MockMate Frontend" cmd /k "cd /d %ROOT%frontend && echo Installing dependencies... && npm install && echo Starting Vite dev server with network access... && npm run dev -- --host 0.0.0.0"

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo Both servers are launching with network access...
echo ========================================
echo.
echo LOCAL ACCESS:
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo NETWORK ACCESS (for other devices on your WiFi):
echo Frontend: http://192.168.0.214:5173
echo Backend:  http://192.168.0.214:8000
echo API Docs: http://192.168.0.214:8000/docs
echo.
echo Share the network URL with others on your WiFi!
echo.
echo Press any key to close this window...
pause >nul