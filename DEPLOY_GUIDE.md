# 🚀 Guía de Deploy y Uso - Voy al Aeropuerto

## 📋 Índice
- [Deploy Automático](#deploy-automático)
- [Deploy Manual](#deploy-manual)
- [Comandos Disponibles](#comandos-disponibles)
- [Testing Local](#testing-local)
- [Verificación Post-Deploy](#verificación-post-deploy)
- [Troubleshooting](#troubleshooting)

## 🚀 Deploy Automático

### Opción 1: Script Automatizado (Recomendado)

**Windows (PowerShell):**
```powershell
.\deploy.bat
# O usando npm:
npm run deploy:windows
```

**Windows (CMD):**
```cmd
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh
```

### Opción 2: Netlify CLI
```bash
# Instalar Netlify CLI (si no está instalado)
npm install -g netlify-cli

# Deploy completo
npm run deploy

# Deploy en sitio existente
npm run deploy:site YOUR_SITE_ID
```

### 🔧 Solución de Problemas de Dependencias

Si encuentras errores de dependencias, ejecuta:

**Windows:**
```powershell
.\fix-deps.bat
# O manualmente:
npm run clean:install:windows
```

**Linux/Mac:**
```bash
npm run clean:install
```

## 📦 Deploy Manual

### 1. Build de Producción
```bash
npm run build:prod
```

### 2. Deploy Manual en Netlify
1. Ve a [netlify.com](https://netlify.com)
2. Arrastra la carpeta `dist/project/` a la zona de deploy
3. ¡Listo!

### 3. Preparar para Deploy Manual
```bash
npm run deploy:manual
```

## 🛠 Comandos Disponibles

### Desarrollo
```bash
npm start                    # Servidor local (localhost:4200)
npm run start:lan           # Servidor LAN (0.0.0.0:4200)
npm run start:tunnel        # Servidor con túneles habilitados
npm run dev                 # Alias para development
```

### Túneles para Testing Público
```bash
npm run tunnel              # LocalTunnel básico
npm run tunnel:custom       # LocalTunnel con subdominio
npm run tunnel:serveo       # Serveo.net (SSH)
```

### Build y Deploy
```bash
npm run build              # Build de desarrollo
npm run build:prod         # Build de producción
npm run build:analyze      # Build con análisis de bundle
npm run test:build         # Test de build sin generar archivos

npm run deploy             # Deploy automático a Netlify
npm run deploy:manual      # Preparar para deploy manual
npm run deploy:auto        # Script de deploy automatizado
npm run deploy:windows     # Script de deploy para Windows
```

### Utilidades
```bash
npm run preview            # Preview del build de producción
npm run format             # Formatear código con Prettier
npm run lint               # Verificar código con ESLint
npm run check:dependencies # Verificar dependencias y vulnerabilidades
```

## 🧪 Testing Local

### 1. Servidor de Desarrollo
```bash
npm start
```
Abre http://localhost:4200

### 2. Testing en LAN (dispositivos móviles)
```bash
npm run start:lan
```
Abre http://TU_IP_LOCAL:4200 en otros dispositivos

### 3. Testing Público (túneles)
```bash
npm run tunnel
```
Comparte la URL generada para testing externo

### 4. Preview de Producción
```bash
npm run preview
```
Simula el entorno de producción localmente

## ✅ Verificación Post-Deploy

### Lista de Verificación
- [ ] ✅ Página carga correctamente
- [ ] 🎨 Animaciones funcionan (hero, cards, modals)
- [ ] 📱 Modal de reserva se abre y funciona
- [ ] 🔄 Sistema de loading aparece
- [ ] 🔔 Notificaciones se muestran
- [ ] 🌍 Cambio de idioma (ES/PT) funciona
- [ ] 📱 Responsive design en móviles
- [ ] 🚀 Velocidad de carga aceptable
- [ ] 🔗 Todas las rutas funcionan

### Testing en Dispositivos
```bash
# Para testing en múltiples dispositivos
npm run start:lan

# Para testing público (compartir con otros)
npm run tunnel
```

### URLs de Testing
- **Local:** http://localhost:4200
- **LAN:** http://[TU_IP]:4200  
- **Túnel:** https://[RANDOM].loca.lt
- **Producción:** https://[TU_SITIO].netlify.app

## 🔧 Troubleshooting

### Problema: Error de Build
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run build:prod
```

### Problema: Conflictos de Dependencias Angular
```bash
# Windows
.\fix-deps.bat

# Linux/Mac
npm run clean:install

# Manual
npm install --legacy-peer-deps
```

### Problema: PowerShell no Encuentra deploy.bat
```powershell
# Use .\ antes del nombre del archivo
.\deploy.bat

# O use npm script
npm run deploy:windows
```

### Problema: Deploy Falla
```bash
# Verificar Netlify CLI
netlify --version

# Re-autenticar
netlify logout
netlify login

# Deploy manual
npm run deploy:manual
```

### Problema: Animaciones no Funcionan
- Verificar que los archivos CSS están incluidos
- Comprobar que las traducciones están cargadas
- Verificar consola de desarrollador para errores

### Problema: Modal no se Abre
- Verificar que el componente está importado
- Comprobar que las rutas están configuradas
- Verificar que no hay errores de JavaScript

### Problema: Cambio de Idioma no Funciona
- Verificar que los archivos JSON están en `assets/i18n/`
- Comprobar que el servicio de traducción está configurado
- Verificar que las traducciones tienen las claves correctas

## 📊 Optimización

### Análisis de Bundle
```bash
npm run build:analyze
```
Esto abrirá un análisis visual del tamaño del bundle

### Mejores Prácticas
1. **Imágenes:** Optimizar imágenes antes de incluirlas
2. **Código:** Usar lazy loading para componentes grandes
3. **Dependencies:** Mantener dependencias actualizadas
4. **Caching:** Configurar headers de cache en Netlify

## 🆘 Soporte

### Logs Útiles
```bash
# Ver logs de build
npm run build:prod 2>&1 | tee build.log

# Ver logs de deploy
netlify deploy --debug
```

### Recursos
- [Documentación de Angular](https://angular.io/docs)
- [Documentación de Netlify](https://docs.netlify.com)
- [GitHub Repository](https://github.com/tu-usuario/voyalaeropuerto)

---

*Última actualización: Julio 2025*
