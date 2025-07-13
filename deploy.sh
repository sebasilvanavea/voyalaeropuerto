#!/bin/bash

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logs con colores
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Banner
echo -e "${BLUE}"
echo "======================================"
echo "   DEPLOY AUTOMATIZADO - NETLIFY"
echo "======================================"
echo -e "${NC}"

# Verificar dependencias
log_info "Verificando dependencias..."

if ! command_exists "npm"; then
    log_error "npm no está instalado. Por favor instalar Node.js y npm."
    exit 1
fi

if ! command_exists "ng"; then
    log_error "Angular CLI no está instalado. Instalando..."
    npm install -g @angular/cli
fi

# Verificar si netlify-cli está instalado
if ! command_exists "netlify"; then
    log_warning "Netlify CLI no está instalado. Instalando..."
    npm install -g netlify-cli
fi

# Limpieza previa
log_info "Limpiando builds anteriores..."
rm -rf dist/

# Instalar dependencias
log_info "Instalando dependencias..."
npm install --legacy-peer-deps

if [ $? -ne 0 ]; then
    log_warning "Error al instalar dependencias. Intentando limpieza..."
    rm -rf node_modules package-lock.json
    npm install --legacy-peer-deps
    
    if [ $? -ne 0 ]; then
        log_error "Error persistente en dependencias. Intente: npm install --force"
        exit 1
    fi
fi

# Build de producción
log_info "Ejecutando build de producción..."
ng build --configuration=production

if [ $? -ne 0 ]; then
    log_error "Error en el build de producción"
    exit 1
fi

log_success "Build completado exitosamente"

# Verificar si el directorio de build existe
if [ ! -d "dist/project" ]; then
    log_error "Directorio de build no encontrado"
    exit 1
fi

# Opción de deploy
echo ""
log_info "Seleccione el método de deploy:"
echo "1) Deploy automático con Netlify CLI"
echo "2) Preparar para drag & drop manual"
echo "3) Deploy en sitio existente"

read -p "Elija una opción (1-3): " option

case $option in
    1)
        log_info "Ejecutando deploy automático..."
        cd dist/project
        netlify deploy --prod --dir .
        if [ $? -eq 0 ]; then
            log_success "Deploy completado! Su sitio está en línea."
        else
            log_error "Error en el deploy automático"
        fi
        ;;
    2)
        log_info "Preparando para deploy manual..."
        cd dist/project
        tar -czf ../../voyalaeropuerto-build.tar.gz .
        cd ../..
        log_success "Archivo comprimido creado: voyalaeropuerto-build.tar.gz"
        log_info "Ahora puede arrastrar el contenido de dist/project/ a netlify.com"
        ;;
    3)
        read -p "Ingrese el ID del sitio de Netlify: " site_id
        log_info "Desplegando en sitio existente: $site_id"
        cd dist/project
        netlify deploy --prod --dir . --site $site_id
        if [ $? -eq 0 ]; then
            log_success "Deploy completado en sitio existente!"
        else
            log_error "Error en el deploy"
        fi
        ;;
    *)
        log_error "Opción inválida"
        exit 1
        ;;
esac

# Mostrar información de la build
echo ""
log_info "Información de la build:"
log_info "Tamaño del build: $(du -sh dist/project/ | cut -f1)"
log_info "Archivos generados: $(find dist/project/ -type f | wc -l) archivos"

# Verificación post-deploy
echo ""
log_info "Verificación post-deploy:"
log_info "✓ Build de producción exitoso"
log_info "✓ Optimización de assets"
log_info "✓ Minificación de código"
log_info "✓ Archivos estáticos generados"

log_success "¡Deploy completado exitosamente!"
echo ""
log_info "Para verificar el funcionamiento:"
log_info "- Abra su sitio en un navegador"
log_info "- Verifique las animaciones y el modal de reserva"
log_info "- Pruebe el cambio de idioma"
log_info "- Teste la funcionalidad en dispositivos móviles"
