@echo off
setlocal
title RF Planner GenAI.mil Relay
color 0A

set "SCRIPT_DIR=%~dp0"
set "PROXY_SCRIPT=%SCRIPT_DIR%genai-proxy.js"

echo.
echo  ==========================================
echo   RF Planner GenAI.mil Relay
echo  ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
    echo  Node.js was not found on this Windows machine.
    echo  Install Node.js, then run this launcher again.
    echo.
    pause
    exit /b 1
)

if not exist "%PROXY_SCRIPT%" (
    echo  Could not find genai-proxy.js in:
    echo    %SCRIPT_DIR%
    echo.
    echo  Save this launcher in the same folder as genai-proxy.js, then try again.
    echo.
    pause
    exit /b 1
)

echo  Starting local relay on https://127.0.0.1:8788 ...
echo  Leave this window open while using www.rfsim.us.
echo.

node "%PROXY_SCRIPT%" --local-model

set "EXIT_CODE=%ERRORLEVEL%"
echo.
echo  Relay stopped with exit code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%
