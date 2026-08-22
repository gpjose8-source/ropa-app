@echo off
powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Process -FilePath 'cmd.exe' -ArgumentList '/c cd /d C:\Users\jose-\ropa-app && npm.cmd run dev > server.log 2>&1' -WorkingDirectory 'C:\Users\jose-\ropa-app' -WindowStyle Hidden"
