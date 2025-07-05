# VoyAlAeropuerto 🛫

**Aplicación web moderna para reserva de traslados al aeropuerto**

## 🌟 Características

- ✈️ **Reserva de traslados** al aeropuerto y servicios de transporte
- 📱 **Diseño 100% responsive** optimizado para móvil, tablet y desktop
- 🎨 **UI/UX moderna** con Tailwind CSS y componentes personalizados
- ⚡ **Performance optimizada** con lazy loading y best practices
- 🌐 **Multiidioma** (Español/Português)
- 📞 **Contacto fácil** con formulario optimizado y opciones de contacto rápido
- 🔒 **Backend seguro** con Supabase
- ♿ **Accesible** cumpliendo estándares WCAG 2.1

## 🚀 Tecnologías

- **Frontend**: Angular 17+ con componentes standalone
- **Estilos**: Tailwind CSS con configuración personalizada
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Responsive**: Mobile-first con clamp(), CSS Grid y Flexbox
- **Performance**: Lazy loading, tree shaking, optimizaciones CSS

## 📱 Diseño Responsive

### Mobile-First Approach
- **Base**: Diseñado desde 320px hacia arriba
- **Breakpoints**: 480px (móvil) → 768px (tablet) → 1024px (desktop)
- **Unidades**: clamp() para escalado fluido, rem/em para tipografía
- **Touch-friendly**: Elementos mínimos de 44px para interfaces táctiles

### Componentes Optimizados
- **Header**: Logo adaptativo, menú hamburguesa, navegación fluida
- **Hero**: Background video/imagen responsivo, booking card compacto
- **Contact**: Formulario ultra-compacto en grid, validaciones en tiempo real
- **Layout**: Grid inteligente que se adapta a cualquier resolución

## 🛠️ Instalación y Desarrollo

### Prerrequisitos
```bash
Node.js 18+
npm 9+
Angular CLI 17+
```

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/sebasilvanavea/voyalaeropuerto.git
cd voyalaeropuerto

# Instalar dependencias
npm install

# Configurar variables de entorno
cp src/environments/environment.ts.example src/environments/environment.ts
# Editar environment.ts con tus credenciales de Supabase
```

### Desarrollo
```bash
# Servidor de desarrollo
ng serve
# La app estará disponible en http://localhost:4200

# Build para producción
ng build --prod

# Ejecutar tests
ng test

# Linting
ng lint
```

## 📋 Configuración de Entornos

### environment.ts
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'TU_SUPABASE_URL',
  supabaseKey: 'TU_SUPABASE_ANON_KEY'
};
```

## 🎨 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Header responsive con navegación
│   │   ├── hero/            # Hero section con booking card
│   │   ├── contact/         # Formulario de contacto optimizado
│   │   ├── contact-section/ # Sección completa de contacto
│   │   ├── booking/         # Sistema de reservas
│   │   ├── admin/           # Panel administrativo
│   │   └── ...
│   ├── services/            # Servicios Angular
│   └── ...
├── assets/                  # Imágenes, videos, iconos
├── environments/            # Configuraciones de entorno
└── ...
```

## 📞 Funcionalidades Principales

### Sistema de Reservas
- Formulario de booking paso a paso
- Calculadora de precios en tiempo real
- Selección de vehículos y servicios
- Confirmación y seguimiento

### Panel de Contacto
- Formulario ultra-compacto con validaciones
- Botones de contacto rápido (llamada/WhatsApp)
- Sistema de tickets de soporte
- Chat en vivo (próximamente)

### Panel Administrativo
- Dashboard con analytics
- Gestión de reservas y conductores
- Sistema de pagos
- Configuración de tarifas

## 🌐 Optimizaciones Responsive

### CSS Moderno
```css
/* Tipografía fluida */
.title {
  font-size: clamp(1.5rem, 4vw, 3rem);
}

/* Espaciado adaptativo */
.container {
  padding: clamp(1rem, 4vw, 3rem);
}

/* Grid inteligente */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}
```

### Performance
- **Lazy loading** de componentes y rutas
- **Tree shaking** automático
- **Critical CSS** inlined
- **Images** optimizadas y responsive

## 📱 Testing

### Dispositivos Probados
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- Samsung Galaxy (360px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1200px+)

### Navegadores
- Chrome/Edge (Chromium)
- Firefox
- Safari (iOS/macOS)

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Netlify
```bash
ng build --prod
# Subir carpeta dist/ a Netlify
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 4200
CMD ["npm", "start"]
```

## 📄 Documentación Adicional

- [Mejoras de Contacto](./CONTACT_IMPROVEMENTS.md)
- [Optimizaciones Responsive](./RESPONSIVE_OPTIMIZATIONS.md)
- [Sistema de Reviews](./REVIEW_SYSTEM_FIXES.md)
- [Implementación de Tarifas](./TARIFAS_IMPLEMENTATION.md)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📧 Contacto

**Sebastián Silva**
- Email: sebastian.silvanavea@gmail.com
- GitHub: [@sebasilvanavea](https://github.com/sebasilvanavea)

## 🙏 Agradecimientos

- Diseño inspirado en las mejores prácticas de UX/UI modernas
- Iconografía de Heroicons
- Imágenes y assets optimizados para web

---

⭐ **¡No olvides dar una estrella al proyecto si te ha sido útil!**
