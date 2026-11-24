@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo No se encontro Python. Instala Python 3 o usa otro servidor estatico.
  pause
  exit /b 1
)
start "THE KINGDOM OF LOVE" http://localhost:8000/
python -m http.server 8000
