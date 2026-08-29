@echo off
start "DSA Quest API" cmd /k "cd server && npm install && npm run seed && npm run dev"
timeout /t 5 >nul
start "DSA Quest Client" cmd /k "cd client && npm install && npm run dev"
