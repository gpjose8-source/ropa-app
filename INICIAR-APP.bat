@echo off
title GARAGE ONLINE - Servidor
cd /d "C:\Users\jose-\ropa-app"
echo ============================================
echo   GARAGE ONLINE - http://localhost:3000
echo   Deja esta ventana abierta mientras usas la app
echo ============================================
call npm.cmd run dev
pause
