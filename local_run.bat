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

echo  [1/4] Backend API server   ^(port  3000^)
start "RF Planner - Backend" /min cmd /c "node "%~dp0backend\src\server.js" & pause"

REM Give backend time to bind before frontend proxy tries to reach it
timeout /t 2 /nobreak >nul

echo  [2/4] Frontend web server  ^(port  8080^)
start "RF Planner - Frontend" /min cmd /c "node "%~dp0frontend-dev-server.js" & pause"

timeout /t 1 /nobreak >nul

echo  [3/4] GenAI proxy          ^(ports 8787 / 8788^)
start "RF Planner - GenAI Proxy" /min cmd /c "node "%~dp0genai-proxy.js" --local-model & pause"

timeout /t 1 /nobreak >nul

echo  [4/4] Local data server    ^(port  8789^)
start "RF Planner - Local Data Server" /min cmd /c "node "%~dp0local-data-server.js" & pause"

echo.
echo  All services are running in separate windows.
echo.
echo  Open the app:   http://localhost:8080
echo.
echo  Ports in use:
echo    3000  Backend API ^(Node + PostgreSQL^)
echo    8080  Frontend web app  ^(proxies /api/* to 3000^)
echo    8787  GenAI.mil proxy  ^(HTTP fallback^)
echo    8788  Secure AI relay  ^(GenAI.mil + local model over HTTPS^)
echo    8789  Offline data server
echo.
echo  Close this window at any time - services keep running in the background.
echo  To stop: close the two minimized proxy windows, or run taskkill /f /im node.exe
echo.
pause
