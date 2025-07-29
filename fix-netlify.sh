#!/bin/bash

echo "🔧 Solucionando problemas de despliegue en Netlify..."

# Limpiar caché y dependencias
echo "🧹 Limpiando node_modules y package-lock.json..."
rm -rf node_modules
rm -f package-lock.json

# Reinstalar dependencias con legacy peer deps (soluciona problemas comunes)
echo "📦 Reinstalando dependencias..."
npm install --legacy-peer-deps

# Limpiar caché de Angular
echo "🗂️ Limpiando caché de Angular..."
npx ng cache clean

# Probar build local
echo "🔨 Probando build local..."
npm run build:netlify

if [ $? -eq 0 ]; then
    echo "✅ Build local exitoso! Listo para desplegar."
    echo ""
    echo "🚀 Opciones de despliegue:"
    echo "1. Git push (despliegue automático)"
    echo "2. Manual: arrastra la carpeta dist/demo a netlify.com"
    echo "3. CLI: netlify deploy --prod --dir dist/demo"
else
    echo "❌ Error en build local. Revisa los errores arriba."
fi
