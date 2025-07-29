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

if %errorlevel% equ 0 (
    echo ✅ Build local exitoso! Listo para desplegar.
    echo.
    echo 🚀 Opciones de despliegue:
    echo 1. Git push (despliegue automático^)
    echo 2. Manual: arrastra la carpeta dist/demo a netlify.com
    echo 3. CLI: netlify deploy --prod --dir dist/demo
) else (
    echo ❌ Error en build local. Revisa los errores arriba.
)

pause
