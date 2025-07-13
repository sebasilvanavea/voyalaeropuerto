@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   SOLUCION RAPIDA DE DEPENDENCIAS
echo ========================================
echo.

echo [INFO] Limpiando instalacion anterior...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

echo [INFO] Instalando con legacy peer deps...
npm install --legacy-peer-deps

if errorlevel 1 (
    echo [ERROR] Fallo la instalacion. Intentando con force...
    npm install --force
    
    if errorlevel 1 (
        echo [ERROR] Instalacion fallida. Intente manualmente:
        echo npm install --legacy-peer-deps
        pause
        exit /b 1
    )
)

echo [SUCCESS] Dependencias instaladas correctamente!
echo.
echo Ahora puede ejecutar:
echo .\deploy.bat
echo.
pause
