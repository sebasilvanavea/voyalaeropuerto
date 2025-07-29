# 🚨 SOLUCIÓN: Error en @netlify/angular-runtime plugin

## ⚡ Solución Rápida (RECOMENDADA)

### Para Windows:
```bash
# Ejecutar script de fix automático
./fix-netlify.bat
```

### Para Mac/Linux:
```bash
# Dar permisos y ejecutar
chmod +x fix-netlify.sh
./fix-netlify.sh
```

---

## 🔧 Solución Manual Paso a Paso

### 1. Limpiar Dependencias:
```bash
# Eliminar node_modules y package-lock.json
rm -rf node_modules package-lock.json

# Reinstalar con legacy peer deps
npm install --legacy-peer-deps
```

### 2. Limpiar Caché de Angular:
```bash
npx ng cache clean
```

### 3. Probar Build Local:
```bash
npm run build:netlify
```

### 4. Si el build funciona localmente:
```bash
# Commitear cambios
git add .
git commit -m "Fix: Configuración Netlify actualizada"
git push origin main
```

---

## 🎯 Configuraciones Corregidas

### ✅ `netlify.toml` actualizado:
- ✅ Comando de build correcto
- ✅ Directorio de publicación correcto (`dist/demo`)
- ✅ Versión de Node específica (18.17.0)
- ✅ Redirects para SPA configurados

### ✅ `package.json` actualizado:
- ✅ Script `build:netlify` optimizado
- ✅ Flags de build específicos para producción

### ✅ `.nvmrc` creado:
- ✅ Versión de Node fija para consistencia

---

## 🚀 Métodos de Despliegue Alternativos

### Método 1: Manual (Más Confiable)
```bash
# 1. Build local
npm run build:netlify

# 2. Ir a netlify.com
# 3. Arrastar carpeta dist/demo al área de deploy
```

### Método 2: Netlify CLI
```bash
# Instalar CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir dist/demo
```

### Método 3: GitHub Actions (Avanzado)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18.17.0'
      - run: npm ci --legacy-peer-deps
      - run: npm run build:netlify
      - uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist/demo
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

---

## 🔍 Diagnóstico de Errores Comunes

### Error: "Plugin failed"
**Solución:** Usar build manual sin plugin Angular
```toml
[build]
  command = "npm ci && npm run build:netlify"
  publish = "dist/demo"
```

### Error: "Directory not found"
**Verificar:** 
```bash
# Después del build, verificar que existe:
ls -la dist/demo/
```

### Error: "Node version mismatch"
**Solución:** Usar versión específica
```toml
[build.environment]
  NODE_VERSION = "18.17.0"
```

### Error: "Dependency resolution"
**Solución:** Usar legacy peer deps
```bash
npm install --legacy-peer-deps
```

---

## 💡 Tips para Evitar Errores

1. **Siempre probar build local primero**
2. **Usar versiones específicas de Node**
3. **Mantener dependencias actualizadas**
4. **Usar `--legacy-peer-deps` si hay conflictos**
5. **Verificar que `dist/demo` se genera correctamente**

---

## 🎉 Estado Después del Fix

Después de aplicar estas correcciones, tu app debería:
- ✅ Buildear sin errores
- ✅ Desplegarse automáticamente en cada push
- ✅ Mostrar las rutas correctamente (SPA routing)
- ✅ Cargar todos los assets (CSS, JS, imágenes)

**¡Tu aplicación de transporte VoyalAeropuerto estará online! 🚀**
