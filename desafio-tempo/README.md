# Desafío Tempo - Aplicación Pokédex

Una aplicación web moderna que muestra información de Pokémon utilizando tecnologías de vanguardia como Next.js, React 19, TypeScript y un enfoque optimizado para el rendimiento.

## Requisitos Previos

- **Node.js**: v20.x (requerido para Turbopack)
- **Yarn**: v1.22.x o superior

## Stack Técnico

- **Next.js 15.3**: Framework React con App Router para enrutamiento basado en archivos y Server/Client Components
- **React 19**: La última versión de React con mejoras de rendimiento
- **TypeScript**: Tipado estático para un desarrollo más robusto
- **Tailwind CSS 4**: Utilidades CSS para un desarrollo rápido y consistente
- **Geist Font**: Tipografía moderna y legible de Vercel

### Dependencias Principales y Justificación

- **@tanstack/react-query**: Gestión eficiente de estado del servidor, caché, sincronización y actualizaciones, crucial para manejar las solicitudes a la API de Pokémon
- **@tanstack/react-virtual**: Virtualización para renderizar eficientemente grandes listas de datos (sólo los elementos visibles en pantalla)
- **zustand**: Gestor de estado global liviano con persistencia para manejo de autenticación, elegido por su simplicidad y eficiencia frente a Redux
- **axios**: Cliente HTTP para comunicación con APIs, configurado para enviar tokens en cabeceras y manejar errores
- **tailwind-merge**: Utilidad para combinar clases de Tailwind sin conflictos, útil para componentes reutilizables

## Instrucciones para Levantar el Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TixeiraValentin/desafioTempo
   cd desafio-tempo
   ```

2. **Instalar dependencias**
   ```bash
   yarn install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   yarn dev
   ```

4. **Acceder a la aplicación**
   Abrir [http://localhost:3000](http://localhost:3000) en el navegador

## Características Implementadas

### Arquitectura Escalable
La aplicación implementa una arquitectura de carpetas que separa claramente:
- **Rutas públicas y privadas**: Usando grupos de rutas de Next.js con prefijos `(public)` y `(private)`
- **Componentes por dominio**: Separación en auth, ui, items
- **Servicios por responsabilidad**: API, autenticación, configuración HTTP

### Autenticación y Protección de Rutas
- Sistema de autenticación simulado con token persistente usando Zustand
- Protección de rutas privadas con redirección a 404 para usuarios no autenticados
- Manejo optimizado del proceso de logout para evitar parpadeos en la interfaz

### Visualización Eficiente de Datos
- **Virtualización**: Renderizado eficiente de listas largas utilizando TanStack Virtual
- **Paginación en cliente**: División de datos en páginas manejables
- **Optimización de carga de imágenes**: Uso de la directiva `loading="lazy"` y manejo de fallbacks

### Experiencia de Usuario
- **Feedback visual**: Indicadores de carga durante transiciones
- **Interfaces responsivas**: Diseño adaptable a diferentes tamaños de pantalla
- **Manejo de errores**: Fallbacks visuales para imágenes no disponibles

## Arquitectura Técnica

```
src/
├── app/                    # Rutas de Next.js App Router
│   ├── (public)/           # Rutas públicas (login)
│   ├── (private)/          # Rutas privadas (home)
│   └── page.tsx            # Redirección inicial
├── components/             # Componentes reutilizables
│   ├── auth/               # Componentes de autenticación
│   ├── items/              # Componentes para visualización de Pokémon
│   └── ui/                 # Componentes base (Button, Input)
└── lib/                    # Utilidades y servicios
    ├── service/            # Servicios por dominio
    │   ├── auth.service.ts # Autenticación con Zustand
    │   └── api.service.ts  # Comunicación con API
    ├── hooks/              # Hooks personalizados (preparado para expansión)
    ├── axios.ts            # Configuración del cliente HTTP
    ├── providers.tsx       # Proveedor global de contextos
    └── query.tsx           # Configuración de React Query
```

## Propuesta de Optimización para Llamadas al Backend

Para mejorar la eficiencia en las llamadas al backend y optimizar el rendimiento de la aplicación en un entorno de producción real, se proponen las siguientes estrategias:

1. **Implementación de paginación basada en cursor**: Reemplazar la carga de todos los Pokémon por una API paginada que utilice cursores en lugar de offsets numéricos, mejorando la eficiencia en bases de datos grandes y evitando problemas con inserciones/eliminaciones concurrentes.

2. **Modelo de datos optimizado**: Crear endpoints específicos que devuelvan solo los campos necesarios para cada vista, implementando una estrategia de "campos selectivos" donde el frontend especifique qué atributos necesita:
   ```
   GET /api/pokemon?fields=id,name,sprites.front_default,types
   ```

3. **Batch requests**: Implementar un endpoint que permita solicitar múltiples recursos en una sola llamada HTTP para reducir la sobrecarga de conexión:
   ```
   POST /api/batch
   { "requests": ["/pokemon/1", "/pokemon/4", "/pokemon/7"] }
   ```

4. **Cache inteligente con invalidación selectiva**:
   - Implementar cabeceras HTTP `Cache-Control` y `ETag` para recursos que cambian con poca frecuencia
   - Utilizar un sistema de invalidación basado en eventos para actualizar solo los datos modificados
   - Configurar TTL (Time-To-Live) variable según el tipo de recurso y su frecuencia de cambio

5. **Compresión y optimización de respuestas**:
   - Aplicar GZIP/Brotli a nivel de servidor para reducir el tamaño de transferencia (>70% en datos JSON)
   - Implementar GraphQL para permitir consultas precisas que eviten over-fetching y under-fetching
   - Normalizar estructuras de datos para eliminar redundancias

6. **Optimización de imágenes bajo demanda**:
   - Implementar un servicio de transformación de imágenes que redimensione y optimice los sprites según el dispositivo:
     ```
     GET /api/image/pokemon/25?width=200&format=webp
     ```
   - Utilizar técnicas de carga progresiva con placeholders de baja resolución

7. **Estrategia de sincronización inteligente**:
   - Implementar delta updates para sincronizar solo los cambios desde la última actualización
   - Utilizar websockets para notificaciones en tiempo real sobre actualizaciones de datos
   - Diseñar APIs para soportar actualizaciones parciales con PATCH según el estándar JSON Patch

## Decisiones Técnicas

### React 19 + Next.js 15
Se eligieron las versiones más recientes para aprovechar las mejoras de rendimiento y las funcionalidades del App Router, que facilitan la separación entre Server y Client Components.

### Zustand vs Redux
Zustand fue elegido por su API más simple y directa, reduciendo la cantidad de boilerplate necesario para gestionar estados globales como la autenticación.

### TanStack Virtual vs Alternativas
Se seleccionó TanStack Virtual por su enfoque no-opinativo y su excelente integración con React, permitiendo una implementación más flexible que alternativas como react-window.

### Tailwind CSS
Proporciona un desarrollo UI más rápido y consistente, con un bundle final menor que otras soluciones como styled-components o emotion.

## Notas Adicionales

El proyecto está configurado con persistent auth mediante localStorage, lo que permite mantener la sesión del usuario incluso después de refrescar la página.
