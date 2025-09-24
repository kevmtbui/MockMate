@echo off
REM ========================================
REM Launches MockMate Frontend & Backend (Node.js)
REM ========================================

REM Get current directory
SET ROOT=%~dp0

REM Launch Backend
start "Backend Server" cmd /k "cd /d %ROOT%backend && npm install && npm run dev"

REM Launch Frontend
start "Frontend Server" cmd /k "cd /d %ROOT%frontend && npm install && npm run dev"

echo.
echo Both servers launched
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
pause
