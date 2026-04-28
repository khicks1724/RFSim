@echo off
setlocal
title RF Planner GenAI.mil Relay
color 0A

set "SCRIPT_DIR=%~dp0"
set "PROXY_SCRIPT=%SCRIPT_DIR%genai-proxy.js"
set "NODE_EXE="

call :printFlag

echo.
echo  ==========================================
echo   RF Planner GenAI.mil Relay
echo  ==========================================
echo.

call :resolveNode
if not defined NODE_EXE (
    echo  Node.js was not found on this Windows machine.
    echo  Install Node.js from https://nodejs.org/en/download, then close and reopen this launcher.
    echo  If Node.js was just installed, Windows may need a new shell session before cmd can see it.
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

echo  Starting the secure relay for the GenAI.mil provider...
echo  Leave this window open while using www.rfsim.us.
echo  Using Node.js at: %NODE_EXE%
echo.

"%NODE_EXE%" "%PROXY_SCRIPT%" --local-model

set "EXIT_CODE=%ERRORLEVEL%"
echo.
echo  Relay stopped with exit code %EXIT_CODE%.
pause
exit /b %EXIT_CODE%

:resolveNode
for /f "delims=" %%I in ('where.exe node 2^>nul') do (
    set "NODE_EXE=%%I"
    goto :eof
)

if exist "%ProgramFiles%\nodejs\node.exe" (
    set "NODE_EXE=%ProgramFiles%\nodejs\node.exe"
    goto :eof
)

if exist "%LocalAppData%\Programs\nodejs\node.exe" (
    set "NODE_EXE=%LocalAppData%\Programs\nodejs\node.exe"
    goto :eof
)

if exist "%ProgramFiles(x86)%\nodejs\node.exe" (
    set "NODE_EXE=%ProgramFiles(x86)%\nodejs\node.exe"
    goto :eof
)

for /f "usebackq delims=" %%I in (`powershell -NoProfile -Command "$cmd = Get-Command node.exe -ErrorAction SilentlyContinue; if ($cmd) { $cmd.Source }"`) do (
    set "NODE_EXE=%%I"
    goto :eof
)
goto :eof

:printFlag
powershell -NoProfile -Command "Write-Host '* * * * * * * * * * * * * * * * * * * *' -ForegroundColor Blue; Write-Host ' * * * * * * * * * * * * * * * * * * * ' -ForegroundColor Blue; Write-Host '* * * * * * * * * * * * * * * * * * * *' -ForegroundColor Blue; Write-Host ' * * * * * * * * * * * * * * * * * * * ' -ForegroundColor Blue; Write-Host '* * * * * * * * * * * * * * * * * * * *' -ForegroundColor Blue; Write-Host ' * * * * * * * * * * * * * * * * * * * ' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Blue; Write-Host '========================================' -ForegroundColor Red; Write-Host '========================================' -ForegroundColor White; Write-Host '========================================' -ForegroundColor Red; Write-Host '========================================' -ForegroundColor White; Write-Host '========================================' -ForegroundColor Red; Write-Host '========================================' -ForegroundColor White; Write-Host '========================================' -ForegroundColor Red"
exit /b 0
