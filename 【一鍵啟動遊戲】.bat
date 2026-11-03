@echo off
chcp 65001 > nul
title 🏕️ 露營盲盒猜歌派對

echo ========================================================
echo        🏕️  露營盲盒猜歌派對 - 一鍵快速啟動器
echo        (房主也能一起玩的零劇透多人猜歌遊戲)
echo ========================================================
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [錯誤] 系統未偵測到 Node.js 環境，請先前往 https://nodejs.org 安裝。
    pause
    exit /b
)

if not exist node_modules (
    echo [提示] 首次啟動正在安裝必要套件，請稍候約 10 秒...
    call npm install
)

echo [啟動中] 正在啟動猜歌伺服器並開啟瀏覽器...
start http://localhost:3000

node server/index.js
pause
