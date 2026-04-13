@echo off
chcp 65001 >nul
set "PATH=%ProgramFiles%\Git\bin;%ProgramFiles(x86)%\Git\bin;%LocalAppData%\Programs\Git\bin;%PATH%"
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\push-repo.ps1"
set EXITCODE=%ERRORLEVEL%
if %EXITCODE% neq 0 (
  echo.
  pause
)
exit /b %EXITCODE%
