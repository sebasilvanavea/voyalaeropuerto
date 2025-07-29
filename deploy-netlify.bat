@echo off
echo 🚀 Iniciando despliegue en Netlify...

REM Limpiar dist anterior
echo 🧹 Limpiando builds anteriores...
if exist dist rmdir /s /q dist

REM Instalar dependencias
echo 📦 Instalando dependencias...
npm install

REM Construir para producción
echo 🔨 Construyendo aplicación para producción...
npm run build:netlify

REM Verificar que el build fue exitoso y determinar directorio
if %errorlevel% equ 0 (
    echo ✅ Build completado exitosamente
    
    REM Verificar estructura y desplegar
    if exist dist\demo\browser (
        echo 🌐 Desplegando desde dist/demo/browser...
        netlify deploy --prod --dir dist/demo/browser
    ) else if exist dist\demo (
        echo 🌐 Desplegando desde dist/demo...
        netlify deploy --prod --dir dist/demo
    ) else (
        echo ❌ No se encontró directorio de build válido
        pause
        exit /b 1
    )
    
    echo 🎉 ¡Despliegue completado!
    echo 🔗 Tu aplicación está online en tu dominio de Netlify
) else (
    echo ❌ Error en el build. Revisa los logs arriba.
    pause
    exit /b 1
)

pause
