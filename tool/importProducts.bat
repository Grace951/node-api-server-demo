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
for /l %%N in (1 1 %file.count%) do %importdb% -h <host>:<port> -d <db> -c products -u <user> -p <password> --file !file.%%N!
