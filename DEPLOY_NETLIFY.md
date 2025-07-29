# 🚀 Guía Completa de Despliegue en Netlify

## Método 1: Despliegue Automático desde GitHub (RECOMENDADO)

### Pasos:

1. **Subir código a GitHub:**
   ```bash
   git add .
   git commit -m "Preparar para despliegue en Netlify"
   git push origin main
   ```

2. **Conectar con Netlify:**
   - Ve a [netlify.com](https://netlify.com)
   - Haz clic en "New site from Git"
   - Conecta tu repositorio de GitHub
   - Selecciona el repositorio `voyalaeropuerto`

3. **Configurar Build Settings:**
   - **Build command:** `npm run build:prod`
   - **Publish directory:** `dist/voyalaeropuerto`
   - **Node version:** `18`

4. **¡Deploy automático!**
   - Netlify detectará el archivo `netlify.toml`
   - Cada push a `main` desplegará automáticamente

---

## Método 2: Despliegue Manual Rápido

### Para Windows:
```bash
# 1. Construir la aplicación
npm run build:prod

# 2. Usar el script automático
./deploy-netlify.bat
```

### Para Mac/Linux:
```bash
# 1. Dar permisos al script
chmod +x deploy-netlify.sh

# 2. Ejecutar
./deploy-netlify.sh
```

---

## Método 3: Netlify CLI (Para desarrollo)

### Instalación:
```bash
npm install -g netlify-cli
```

### Configuración inicial:
```bash
# Autenticarse
netlify login

# En el directorio del proyecto
netlify init
```

### Despliegue:
```bash
# Build local
npm run build:prod

# Preview (borrador)
netlify deploy --dir dist/voyalaeropuerto

# Producción
netlify deploy --prod --dir dist/voyalaeropuerto
```

---

## Método 4: Drag & Drop Manual

1. **Construir:**
   ```bash
   npm run build:prod
   ```

2. **Arrastrar carpeta:**
   - Ve a [netlify.com](https://netlify.com)
   - Arrastra la carpeta `dist/voyalaeropuerto` a la zona de deploy
   - ¡Listo!

---

## 🔧 Configuraciones Importantes

### Variables de Entorno (si las usas):
En Netlify Dashboard → Site Settings → Environment Variables:
- `NODE_ENV=production`
- Cualquier API key que uses

### Dominio Personalizado:
1. Site Settings → Domain Management
2. Add custom domain
3. Seguir instrucciones DNS

### SSL Automático:
- Netlify lo activa automáticamente
- Tu sitio tendrá HTTPS gratis

---

## 🚨 Troubleshooting Común

### Error 404 en rutas:
- ✅ **Solucionado** con el `netlify.toml` incluido

### Build failed:
```bash
# Verificar que funciona localmente
npm run build:prod

# Si hay errores, revisar:
# - Node version (debe ser 18+)
# - Dependencias faltantes
# - Errores de TypeScript
```

### App muy lenta:
- ✅ **Optimizado** con headers de caché en `netlify.toml`

---

## 📊 Monitoreo

### Analytics:
- Netlify Analytics (de pago)
- Google Analytics (gratis)

### Performance:
- Lighthouse en Chrome DevTools
- Netlify Speed insights

---

## 🎯 Comandos Útiles

```bash
# Ver estado del sitio
netlify status

# Ver logs de build
netlify build --dry

# Abrir dashboard
netlify open

# Ver sitio en vivo
netlify open:site
```

---

## 🌟 Próximos Pasos

1. **Configurar dominio personalizado**
2. **Activar formularios Netlify** (si los usas)
3. **Configurar redirects** adicionales si es necesario
4. **Monitoreo y analytics**

---

**¡Tu app de transporte al aeropuerto estará online en minutos!** 🎉
