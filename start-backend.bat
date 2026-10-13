@echo off
title Annapurna Food Rescue Backend (Spring Boot 3)
echo ===================================================
echo Starting Annapurna Food Rescue Backend (Port 8080)
echo ===================================================
cd backend
if exist "target\food-rescue-backend-1.0.0.jar" (
    java -jar target\food-rescue-backend-1.0.0.jar
) else (
    call .\mvnw.cmd spring-boot:run
)
pause
