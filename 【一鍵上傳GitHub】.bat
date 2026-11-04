@echo off
cd /d "%~dp0"
echo ========================================================
echo Pushing to https://github.com/enzo-w1106/SongGuessing.git
echo [TIP] Click "Sign in with your browser" in the popup window!
echo ========================================================
echo.
git push -u origin main
echo.
pause
