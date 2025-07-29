#!/bin/bash

# Script de despliegue automático para Netlify
# Asegúrate de tener Netlify CLI instalado: npm install -g netlify-cli

echo "🚀 Iniciando despliegue en Netlify..."

# Limpiar dist anterior
echo "🧹 Limpiando builds anteriores..."
rm -rf dist/

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Construir para producción
echo "🔨 Construyendo aplicación para producción..."
npm run build:netlify

# Verificar que el build fue exitoso y determinar directorio
if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente"
    
    # Verificar estructura y desplegar
    if [ -d "dist/demo/browser" ]; then
        echo "🌐 Desplegando desde dist/demo/browser..."
        netlify deploy --prod --dir dist/demo/browser
    elif [ -d "dist/demo" ]; then
        echo "🌐 Desplegando desde dist/demo..."
        netlify deploy --prod --dir dist/demo
    else
        echo "❌ No se encontró directorio de build válido"
        exit 1
    fi
    
    echo "🎉 ¡Despliegue completado!"
    echo "🔗 Tu aplicación está online en tu dominio de Netlify"
else
    echo "❌ Error en el build. Revisa los logs arriba."
    exit 1
fi
