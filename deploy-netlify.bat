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
npm run build:prod

REM Verificar que el build fue exitoso
if %errorlevel% equ 0 (
    echo ✅ Build completado exitosamente
    
    REM Desplegar a Netlify
    echo 🌐 Desplegando a Netlify...
    
    REM Para despliegue a producción:
    netlify deploy --prod --dir dist/voyalaeropuerto
    
    echo 🎉 ¡Despliegue completado!
    echo 🔗 Tu aplicación está online en tu dominio de Netlify
) else (
    echo ❌ Error en el build. Revisa los logs arriba.
    pause
    exit /b 1
)

pause
