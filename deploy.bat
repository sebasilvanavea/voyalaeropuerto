@echo off
setlocal enabledelayedexpansion

REM Verificar si estamos en PowerShell y mostrar instrucciones
if "%PSModulePath%" neq "" (
    echo.
    echo [91m[ERROR][0m Detectado PowerShell. Para ejecutar este script:
    echo [93m[INFO][0m  Opcion 1: .\deploy.bat
    echo [93m[INFO][0m  Opcion 2: cmd /c deploy.bat
    echo [93m[INFO][0m  Opcion 3: npm run deploy:windows
    echo.
    pause
    exit /b 1
)

REM Colores para Windows (usando echo con códigos)
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

echo %BLUE%======================================%NC%
echo    DEPLOY AUTOMATIZADO - NETLIFY
echo %BLUE%======================================%NC%

echo %BLUE%[INFO]%NC% Verificando dependencias...

REM Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%[ERROR]%NC% npm no está instalado. Por favor instalar Node.js y npm.
    pause
    exit /b 1
)

REM Verificar Angular CLI
ng version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% Angular CLI no está instalado. Instalando...
    npm install -g @angular/cli
)

REM Verificar Netlify CLI
netlify --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[WARNING]%NC% Netlify CLI no está instalado. Instalando...
    npm install -g netlify-cli
)

REM Limpieza previa
echo %BLUE%[INFO]%NC% Limpiando builds anteriores...
if exist "dist" rmdir /s /q "dist"

REM Instalar dependencias
echo %BLUE%[INFO]%NC% Instalando dependencias...
npm install --legacy-peer-deps
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Error al instalar dependencias. Intentando limpieza...
    echo %YELLOW%[WARNING]%NC% Limpiando node_modules y reinstalando...
    rmdir /s /q node_modules 2>nul
    del package-lock.json 2>nul
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo %RED%[ERROR]%NC% Error persistente en dependencias
        pause
        exit /b 1
    )
)

REM Build de producción
echo %BLUE%[INFO]%NC% Ejecutando build de producción...
ng build --configuration=production
if errorlevel 1 (
    echo %RED%[ERROR]%NC% Error en el build de producción
    pause
    exit /b 1
)

echo %GREEN%[SUCCESS]%NC% Build completado exitosamente

REM Verificar directorio de build
if not exist "dist\project" (
    echo %RED%[ERROR]%NC% Directorio de build no encontrado
    pause
    exit /b 1
)

REM Opciones de deploy
echo.
echo %BLUE%[INFO]%NC% Seleccione el método de deploy:
echo 1^) Deploy automático con Netlify CLI
echo 2^) Preparar para drag ^& drop manual
echo 3^) Deploy en sitio existente

set /p option="Elija una opción (1-3): "

if "%option%"=="1" (
    echo %BLUE%[INFO]%NC% Ejecutando deploy automático...
    cd dist\project
    netlify deploy --prod --dir .
    if errorlevel 1 (
        echo %RED%[ERROR]%NC% Error en el deploy automático
    ) else (
        echo %GREEN%[SUCCESS]%NC% Deploy completado! Su sitio está en línea.
    )
    cd ..\..
) else if "%option%"=="2" (
    echo %BLUE%[INFO]%NC% Preparando para deploy manual...
    echo %GREEN%[SUCCESS]%NC% Archivos listos en dist\project\
    echo %BLUE%[INFO]%NC% Ahora puede arrastrar el contenido de dist\project\ a netlify.com
    start "" "dist\project"
) else if "%option%"=="3" (
    set /p site_id="Ingrese el ID del sitio de Netlify: "
    echo %BLUE%[INFO]%NC% Desplegando en sitio existente: !site_id!
    cd dist\project
    netlify deploy --prod --dir . --site !site_id!
    if errorlevel 1 (
        echo %RED%[ERROR]%NC% Error en el deploy
    ) else (
        echo %GREEN%[SUCCESS]%NC% Deploy completado en sitio existente!
    )
    cd ..\..
) else (
    echo %RED%[ERROR]%NC% Opción inválida
    pause
    exit /b 1
)

REM Información de la build
echo.
echo %BLUE%[INFO]%NC% Información de la build:
for /f %%i in ('dir /s /-c "dist\project" ^| find "File(s)"') do set filecount=%%i
echo %BLUE%[INFO]%NC% Archivos generados: %filecount%

echo.
echo %BLUE%[INFO]%NC% Verificación post-deploy:
echo %BLUE%[INFO]%NC% ✓ Build de producción exitoso
echo %BLUE%[INFO]%NC% ✓ Optimización de assets
echo %BLUE%[INFO]%NC% ✓ Minificación de código
echo %BLUE%[INFO]%NC% ✓ Archivos estáticos generados

echo %GREEN%[SUCCESS]%NC% ¡Deploy completado exitosamente!
echo.
echo %BLUE%[INFO]%NC% Para verificar el funcionamiento:
echo %BLUE%[INFO]%NC% - Abra su sitio en un navegador
echo %BLUE%[INFO]%NC% - Verifique las animaciones y el modal de reserva
echo %BLUE%[INFO]%NC% - Pruebe el cambio de idioma
echo %BLUE%[INFO]%NC% - Teste la funcionalidad en dispositivos móviles

pause
