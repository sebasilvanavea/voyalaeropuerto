@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   SERVIDOR DE DESARROLLO OPTIMIZADO
echo ========================================
echo.

echo [INFO] Verificando dependencias...
if not exist "node_modules" (
    echo [WARN] node_modules no encontrado. Ejecutando instalacion...
    call fix-deps.bat
    if errorlevel 1 (
        echo [ERROR] Fallo la instalacion de dependencias
        pause
        exit /b 1
    )
)

echo [INFO] Iniciando servidor de desarrollo...
echo [INFO] La aplicacion estara disponible en:
echo          http://localhost:4200
echo          http://127.0.0.1:4200
echo.
echo [INFO] Para acceso desde otros dispositivos:
npm run start:lan

echo.
echo [SUCCESS] Para detener el servidor presione Ctrl+C
pause
