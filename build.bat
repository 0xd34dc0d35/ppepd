@echo off
echo ==============================================
echo Building Docker Image for SIPPEM (Nuxt App)
echo ==============================================
echo.

:: Build the docker image
docker build -t sippem-app:latest .

echo.
echo ==============================================
echo Build Completed Successfully!
echo ==============================================
echo.
echo To run the container, execute the following command:
echo docker run -d -p 3000:3000 --name sippem-container sippem-app:latest
echo.
pause
