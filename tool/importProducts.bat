@echo off
setlocal disableDelayedExpansion
:: Load the file path "array"
for /f "tokens=1* delims=:" %%A in ('dir /s /b^|findstr /n "^"') do (
  set "file.%%A=%%B"
  set "file.count=%%A"
)

set importdb="C:\Program Files\MongoDB\Server\3.4\bin\mongoimport.exe"

:: Access the values
setlocal enableDelayedExpansion
for /l %%N in (1 1 %file.count%) do %importdb% -h ds019829.mlab.com:19829 -d react-redux-demo -c products -u grace -p 1qazXSW2 --file !file.%%N!

REM mongoimport -h ds019829.mlab.com:19829 -d react-redux-demo -c products -u grace -p 1qazXSW2 --file D:\ChingChing\dev\node-api-server-demo\public\json\details\4ch-ir-bullet-kit.json