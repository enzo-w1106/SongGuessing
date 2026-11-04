@echo off
cd /d "%~dp0"
title Campfire Song Quiz Server

echo ========================================================
echo   Campfire Song Quiz - Starting Server...
echo ========================================================
echo.

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

if not exist node_modules (
    call npm install
)

start http://localhost:3000
node server/index.js
pause
