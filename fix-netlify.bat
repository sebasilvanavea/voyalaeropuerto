@echo off
echo 🔧 Solucionando problemas de despliegue en Netlify...

REM Limpiar caché y dependencias
echo 🧹 Limpiando node_modules y package-lock.json...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

REM Reinstalar dependencias con legacy peer deps
echo 📦 Reinstalando dependencias...
npm install --legacy-peer-deps

REM Limpiar caché de Angular
echo 🗂️ Limpiando caché de Angular...
npx ng cache clean

REM Probar build local
echo 🔨 Probando build local...
npm run build:netlify

REM Verificar estructura de build
echo 🔍 Verificando estructura del build...
if exist dist\demo\browser (
    echo ✅ Estructura correcta: dist/demo/browser encontrada
    dir dist\demo\browser
    echo.
    echo 📁 Directorio para Netlify: dist/demo/browser
) else if exist dist\demo (
    echo ⚠️ Estructura antigua: dist/demo encontrada
    dir dist\demo
    echo.
    echo 📁 Directorio para Netlify: dist/demo
) else (
    echo ❌ No se encontró directorio de build
)

if %errorlevel% equ 0 (
    echo ✅ Build local exitoso! Listo para desplegar.
    echo.
    echo 🚀 Opciones de despliegue:
    echo 1. Git push (despliegue automático^)
    echo 2. Manual: arrastra la carpeta correcta a netlify.com
    echo 3. CLI: netlify deploy --prod --dir [directorio-correcto]
) else (
    echo ❌ Error en build local. Revisa los errores arriba.
)

pause
