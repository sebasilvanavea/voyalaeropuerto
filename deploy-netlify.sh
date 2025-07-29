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
npm run build:prod

# Verificar que el build fue exitoso
if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente"
    
    # Desplegar a Netlify (requiere configuración previa)
    echo "🌐 Desplegando a Netlify..."
    
    # Si es el primer despliegue, usar:
    # netlify deploy --dir dist/voyalaeropuerto
    
    # Para despliegue a producción:
    netlify deploy --prod --dir dist/voyalaeropuerto
    
    echo "🎉 ¡Despliegue completado!"
    echo "🔗 Tu aplicación está online en tu dominio de Netlify"
else
    echo "❌ Error en el build. Revisa los logs arriba."
    exit 1
fi
