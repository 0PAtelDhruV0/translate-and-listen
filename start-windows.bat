@echo off
cd /d "%~dp0"
where py >nul 2>&1
if %ERRORLEVEL%==0 (
  start "" http://localhost:8765
  py -m http.server 8765
) else (
  where python >nul 2>&1
  if %ERRORLEVEL%==0 (
    start "" http://localhost:8765
    python -m http.server 8765
  ) else (
    echo Python not found. You can open index.html in a browser, or install Python.
    pause
  )
)
