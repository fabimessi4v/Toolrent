# 🎭 Sistema de Datos Mock - Toolrent

Este README explica cómo funciona el sistema de datos de prueba (mock) en Toolrent.

## ¿Qué es?

Un sistema que permite trabajar en el frontend **sin necesidad de tener el backend funcionando**, mostrando datos de prueba realistas para visualizar cómo se ve la aplicación.

## ¿Cómo funciona?

### Automático 🤖

El sistema detecta automáticamente si el backend está disponible:

1. **Backend disponible** → Usa datos reales
2. **Backend no disponible** → Usa datos mock automáticamente

### Manual 🎛️

Puedes forzar el uso de datos mock editando `.env.development`:

```bash
# Forzar datos mock (sin llamar al backend)
VITE_USE_MOCK_DATA=true

# Forzar datos reales (intentar backend)
VITE_USE_MOCK_DATA=false
```

## Datos Mock Disponibles

### 🔧 Herramientas (5 items)
- Taladro Percutor Bosch GSB - $5.000/día - Stock: 3
- Sierra Circular DeWalt - $7.500/día - Stock: 1
- Amoladora Makita - $4.500/día - Stock: 5
- Martillo Demoledor Hilti - $12.000/día - Stock: 0 (En reparación)
- Llave de Impacto Stanley - $2.500/día - Stock: 8

### 👥 Clientes (4 items)
- Juan Pérez González (Activo)
- María López Fernández (Activo)
- Carlos Muñoz Silva (Suspendido)
- Ana Torres Rojas (Activo)

### 📦 Préstamos (5 items)
- 2 activos
- 1 vencido (con multa)
- 2 devueltos

## Ver en Acción

Cuando los datos mock están activos, verás en la consola del navegador:

```
🎭 Using MOCK data (VITE_USE_MOCK_DATA=true)
```

## Archivos Importantes

- `src/mocks/mockData.js` - Datos de prueba
- `src/mocks/mockServices.js` - Servicios simulados
- `src/services/serviceWrapper.js` - Wrapper inteligente
- `.env.development` - Configuración de desarrollo

## ¿Se pierde la lógica real?

**NO** ❌ 

El sistema está diseñado para **NO romper nada**:
- Los componentes no saben si usan datos mock o reales
- El código de servicios reales permanece intacto
- Solo cambian los imports de servicios (ahora usan `serviceWrapper.js`)

## Desarrollo

```bash
# Modo desarrollo con mock (por defecto)
npm run dev

# Ver herramientas
# Ver préstamos  
# Ver clientes
# Todas las secciones tienen datos de prueba
```

## Producción

```bash
# Siempre usa backend real
npm run build
```

El sistema automáticamente usa `VITE_USE_MOCK_DATA=false` en producción.
