@echo off
REM Kill any existing processes
taskkill /F /IM node.exe >nul 2>&1

REM Wait for cleanup
timeout /t 2 /nobreak

REM Start backend in new window
echo Starting Backend...
start "Food Recommendation - Backend" cmd /k "cd /d d:\project\backend && npm start"

REM Start frontend in new window
timeout /t 3 /nobreak
echo Starting Frontend...
start "Food Recommendation - Frontend" cmd /k "cd /d d:\project\frontend && node server.js"

REM Wait for services to start
timeout /t 5 /nobreak

REM Open Chrome
echo Opening Chrome...
start chrome.exe http://localhost:3000

REM Show status
echo.
echo ========================================
echo  Food Recommendation System Started
echo ========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo ========================================
