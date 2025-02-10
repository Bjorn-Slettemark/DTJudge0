@echo off
echo Starting deployment to the Judge0 server...
REM Adjust variables as needed:
set REMOTE_USER=ubuntu
set REMOTE_HOST=ec2-51-20-253-201.eu-north-1.compute.amazonaws.com
set REMOTE_PATH=/home/ubuntu/codechallenge
set KEY_PATH="C:\Users\bjorn\Downloads\BjornsKey.ppk"

REM Use -v for verbose output to help debugging.
pscp -v -r -i %KEY_PATH% * %REMOTE_USER%@%REMOTE_HOST%:%REMOTE_PATH%

if errorlevel 1 (
    echo Deployment FAILED.
    pause
    exit /b %errorlevel%
) else (
    echo Deployment SUCCESSFUL.
    pause
)
