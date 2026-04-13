@echo off
chcp 65001 >nul
set "PATH=%ProgramFiles%\Git\bin;%ProgramFiles(x86)%\Git\bin;%LocalAppData%\Programs\Git\bin;%PATH%"
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\push-repo.ps1"
set EXITCODE=%ERRORLEVEL%
echo.
if %EXITCODE% equ 0 (
  echo OK. Revisa el mensaje de arriba.
) else (
  echo Fallo codigo %EXITCODE%.
)
echo Pulsa una tecla para cerrar esta ventana.
pause
exit /b %EXITCODE%
