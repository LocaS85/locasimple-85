
@echo off
echo Checking Python installation...
where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Python not found. Please install Python 3.
    exit /b 1
)

echo Installing required packages...
pip install -r requirements.txt

echo Starting Flask server...
python app.py
