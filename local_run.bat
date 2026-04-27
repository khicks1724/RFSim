@echo off
title RF Planner Local Stack
color 0A

echo.
echo  ==========================================
echo   RF Planner - Local Development Stack
echo  ==========================================
echo.
echo  Starting services...
echo.

REM Check Node is available
where node >nul 2>&1
if errorlevel 1 (
    echo  ERROR: Node.js not found. Install from https://nodejs.org/
    pause
    exit /b 1
)

REM Start GenAI proxy (port 8787 / 8788)
echo  [1/2] GenAI proxy          ^(ports 8787 / 8788^)
start "RF Planner - GenAI Proxy" /min cmd /c "node "%~dp0genai-proxy.js" --local-model & pause"

REM Short delay so proxy binds first
timeout /t 1 /nobreak >nul

REM Start local data server (port 8789)
echo  [2/2] Local data server    ^(port  8789^)
start "RF Planner - Local Data Server" /min cmd /c "node "%~dp0local-data-server.js" & pause"

echo.
echo  Both services are running in separate windows.
echo.
echo  Open the app:   file://%~dp0index.html
echo    (or serve via a local HTTP server for full functionality)
echo.
echo  Ports in use:
echo    8787  GenAI.mil proxy  ^(HTTP^)
echo    8788  Local model      ^(HTTPS^)
echo    8789  Offline data server
echo.
echo  Close this window at any time - services keep running in the background.
echo  To stop: close the two minimized proxy windows, or run taskkill /f /im node.exe
echo.
pause
