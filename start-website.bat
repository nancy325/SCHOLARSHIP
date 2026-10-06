@echo off
title ScholarHub website
REM Starts the NEW ScholarHub website (Laravel) and opens it in your browser.
REM Make sure WAMP is running (green icon) so MySQL is available.

cd /d "%~dp0backend"

set "PHP=php"
where php >NUL 2>NUL || set "PHP=D:\wamp64\bin\php\php8.3.28\php.exe"

echo Updating database (safe to run every time)...
"%PHP%" artisan migrate --force
"%PHP%" artisan optimize:clear

echo.
echo  ScholarHub is running at  http://127.0.0.1:8000
echo  Keep this window open. Press Ctrl+C to stop.
echo.
start "" http://127.0.0.1:8000
"%PHP%" artisan serve --host=127.0.0.1 --port=8000
pause
