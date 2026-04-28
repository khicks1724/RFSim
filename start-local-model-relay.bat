@echo off
setlocal
title RF Planner Local Model Relay
color 0A

set "SCRIPT_DIR=%~dp0"
set "PROXY_SCRIPT=%SCRIPT_DIR%genai-proxy.js"

call :printFlag

echo.
echo  ==========================================
echo   RF Planner Local Model Relay
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

echo  Starting the secure relay for local models...
echo  Leave this window open while using the hosted site.
echo.

node "%PROXY_SCRIPT%" --local-model

set "EXIT_CODE=%ERRORLEVEL%"
echo.
echo  Relay stopped with exit code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%

:printFlag
powershell -NoProfile -Command "$blue = @(''* * * * * * * * * * * * * * * * * * * *'','' * * * * * * * * * * * * * * * * * * * '',''* * * * * * * * * * * * * * * * * * * *'','' * * * * * * * * * * * * * * * * * * * '',''* * * * * * * * * * * * * * * * * * * *'','' * * * * * * * * * * * * * * * * * * * '',''========================================''); $red = @(''========================================'',''========================================'',''========================================'',''========================================''); $white = @(''========================================'',''========================================'',''========================================''); foreach($line in $blue){ Write-Host $line -ForegroundColor Blue }; for($i = 0; $i -lt $red.Count; $i++){ Write-Host $red[$i] -ForegroundColor Red; if($i -lt $white.Count){ Write-Host $white[$i] -ForegroundColor White } }"
exit /b 0
