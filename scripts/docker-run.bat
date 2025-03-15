@echo off
setlocal enabledelayedexpansion

:: Check if scripts directory exists
if not exist scripts mkdir scripts

:: Help function
:help
echo Usage: scripts\docker-run.bat [COMMAND]
echo.
echo Available commands:
echo   setup      - Build Docker image and install dependencies
echo   start      - Start React Native application in Docker
echo   android    - Launch application on Android emulator/device
echo   ios        - Launch application on iOS simulator/device
echo   shell      - Open a shell in the container
echo   logs       - Display container logs
echo   stop       - Stop containers
echo   help       - Display this help message
echo.
goto :eof

:: Check if Docker is installed
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Docker is not installed. Please install it before continuing.
    exit /b 1
)

where docker-compose >nul 2>nul 
if %ERRORLEVEL% neq 0 (
    echo Docker Compose is not installed. Please install it before continuing.
    exit /b 1
)

:: Command processing
if "%1"=="" goto help
if "%1"=="help" goto help

if "%1"=="setup" (
    echo Setting up Docker environment...
    docker-compose build
    docker-compose run --rm expo npm install
    echo Setup complete!
    goto :eof
)

if "%1"=="start" (
    echo Starting React Native application in Docker...
    docker-compose up
    goto :eof
)

if "%1"=="android" (
    echo Launching application on Android...
    docker-compose exec expo npm run android
    goto :eof
)

if "%1"=="ios" (
    echo Launching application on iOS...
    docker-compose exec expo npm run ios
    goto :eof
)

if "%1"=="shell" (
    echo Opening a shell in the container...
    docker-compose exec expo /bin/bash
    goto :eof
)

if "%1"=="logs" (
    echo Displaying logs...
    docker-compose logs -f
    goto :eof
)

if "%1"=="stop" (
    echo Stopping containers...
    docker-compose down
    goto :eof
)

echo Command "%1" not recognized
goto help 