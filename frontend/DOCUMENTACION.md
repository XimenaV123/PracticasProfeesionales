# 📚 Documentación Técnica del Frontend

## 🎯 Descripción General

El frontend de **Prácticas Profesionales** es una aplicación web desarrollada en React que proporciona una interfaz de usuario para gestionar cartas de prácticas profesionales. Permite a estudiantes crear, enviar y dar seguimiento a sus cartas, y a administradores revisar y aprobar documentos.

---

## 🛠️ Stack Tecnológico

### Framework: React 19

**¿Por qué React?**

1. **Componentización**
   - Arquitectura basada en componentes reutilizables
   - Facilita el mantenimiento y la reutilización de código
   - Permite crear una UI modular y escalable

2. **Ecosistema Maduro**
   - Amplia comunidad y recursos disponibles
   - Gran cantidad de librerías compatibles
   - Documentación extensa y actualizada

3. **Rendimiento**
   - Virtual DOM para actualizaciones eficientes
   - React 19 incluye mejoras de rendimiento significativas
   - Optimizaciones automáticas de re-renderizado

4. **Developer Experience**
   - JSX para escribir código más legible
   - Hooks para manejo de estado y efectos
   - Herramientas de desarrollo excelentes (React DevTools)

5. **Flexibilidad**
   - No impone una estructura rígida
   - Permite elegir librerías complementarias según necesidades
   - Fácil integración con otras tecnologías

### Build Tool: Vite

**¿Por qué Vite en lugar de Create React App?**

1. **Velocidad de Desarrollo**
   - Hot Module Replacement (HMR) extremadamente rápido
   - Inicio del servidor de desarrollo casi instantáneo
   - No necesita empaquetar todo el código en desarrollo

2. **Rendimiento de Build**
   - Usa esbuild (escrito en Go) para builds ultra-rápidos
   - Optimizaciones automáticas para producción
   - Code splitting inteligente

3. **Configuración Moderna**
   - Soporte nativo para ES modules
   - Configuración mínima requerida
   - Mejor experiencia con TypeScript (si se migra en el futuro)

4. **Optimizaciones**
   - Tree-shaking automático
   - Lazy loading de componentes
   - Pre-carga de módulos

### Router: React Router DOM v7

**¿Por qué React Router DOM?**

1. **Declarativo**
   - Rutas definidas de forma clara y mantenible
   - Integración perfecta con React
   - Componentes `<Link>` y `<Navigate>` para navegación

2. **Funcionalidades**
   - Rutas protegidas (aunque implementadas manualmente)
   - Parámetros dinámicos en URLs
   - Navegación programática con hooks

3. **Estándar de la Industria**
   - Librería más popular para routing en React
   - Documentación excelente
   - Actualizaciones frecuentes

---

## 🏗️ Arquitectura del Frontend

### Estructura de Carpetas

```
frontend/
├── public/                 # Archivos estáticos
│   ├── LogoUAQ.png
│   └── profile.png
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── HeaderInstitucional.jsx
│   │   ├── FooterInstitucional.jsx
│   │   ├── Navbar.jsx
│   │   ├── SidebarAdmin.jsx
│   │   └── SidebarPract.jsx
│   ├── pages/             # Páginas/Views
│   │   ├── Login.jsx
│   │   ├── admin/
│   │   │   ├── DashboardA.jsx
│   │   │   ├── RevisarCartaA.jsx
│   │   │   └── RevisarCartaC.jsx
│   │   └── practicante/
│   │       ├── DashboardP.jsx
│   │       ├── CartaA.jsx
│   │       ├── CartaC.jsx
│   │       └── Perfil.jsx
│   ├── services/          # Servicios de API
│   │   ├── api.js         # Configuración base y helpers
│   │   ├── authService.js
│   │   ├── cartaService.js
│   │   ├── usuarioService.js
│   │   └── notificacionService.js
│   ├── styles/            # Archivos CSS
│   │   ├── global.css
│   │   ├── login.css
│   │   ├── dashboardP.css
│   │   └── ...
│   ├── App.jsx            # Componente raíz con rutas
│   ├── main.jsx           # Punto de entrada
│   └── supabaseClient.js  # (Legacy, no se usa actualmente)
├── vite.config.js         # Configuración de Vite
└── package.json
```

### Patrón Arquitectónico: Service Layer + Component Pattern

**¿Por qué esta arquitectura?**

1. **Separación de Responsabilidades**
   - **Services**: Toda la lógica de comunicación con el backend
   - **Components**: Solo se encargan de la UI y la interacción
   - **Pages**: Orquestan componentes y llaman a servicios

2. **Reutilización**
   - Servicios pueden ser usados desde cualquier componente
   - Componentes reutilizables en diferentes páginas
   - Lógica de API centralizada

3. **Mantenibilidad**
   - Cambios en la API solo afectan los servicios
   - Fácil agregar nuevas funcionalidades
   - Testing más sencillo (mockear servicios)

4. **Escalabilidad**
   - Fácil agregar nuevos servicios
   - Estructura clara para nuevos desarrolladores
   - Preparado para crecer

### Flujo de Datos

```
Usuario interactúa con UI
    ↓
Componente llama a Service
    ↓
Service hace fetch al Backend
    ↓
Backend responde
    ↓
Service procesa respuesta
    ↓
Componente actualiza estado
    ↓
UI se re-renderiza
```

---

## 🔌 Integración con Backend

### Capa de Servicios (`src/services/`)

#### `api.js` - Configuración Base

**Responsabilidades:**
- Configuración de URL base de la API
- Manejo de tokens JWT (get, set, remove)
- Función helper `fetchAPI` para todas las peticiones
- Headers automáticos (Content-Type, Authorization)

**Características:**
- Manejo automático de autenticación
- Soporte para FormData (uploads)
- Manejo centralizado de errores
- Configuración mediante variables de entorno

#### Servicios Específicos

1. **authService.js**: Login, registro, verificación de token
2. **cartaService.js**: CRUD de cartas, subida de archivos
3. **usuarioService.js**: Perfil y estadísticas
4. **notificacionService.js**: Gestión de notificaciones

### Autenticación

**Flujo:**
1. Usuario hace login
2. `authService.login()` envía credenciales al backend
3. Backend responde con token JWT y datos del usuario
4. Token se guarda en `localStorage`
5. Token se incluye automáticamente en todas las peticiones

**Almacenamiento:**
- `localStorage.token`: Token JWT
- `localStorage.user`: Datos del usuario (JSON)

---

## 📱 Páginas y Componentes

### Páginas de Usuario (Practicante)

#### `Login.jsx`
- Formulario de autenticación
- Redirección según rol (admin/practicante)
- Manejo de errores de login

#### `DashboardP.jsx`
- Vista general de cartas del practicante
- Estados de cada carta (A, B, C, D)
- Navegación a páginas específicas

#### `CartaA.jsx`
- Formulario para crear/enviar Carta A
- Campos: empresa, responsable, motivo
- Validación antes de enviar

#### `CartaC.jsx`
- Subida de archivo (Carta C firmada)
- Validación de tipo y tamaño de archivo
- Visualización de estado

#### `Perfil.jsx`
- Visualización y edición de perfil
- Modo edición/visualización
- Actualización de datos personales

### Páginas de Administrador

#### `DashboardA.jsx`
- Lista de todos los practicantes
- Estado de cartas por practicante
- Acceso rápido a revisión de cartas

#### `RevisarCartaA.jsx`
- Detalles de Carta A específica
- Aprobar/Rechazar carta
- Información del practicante

#### `RevisarCartaC.jsx`
- Visualización de archivo subido
- Aprobar/Rechazar carta C
- Enlace para descargar/ver archivo

### Componentes Reutilizables

- **HeaderInstitucional**: Header con logo y título
- **FooterInstitucional**: Footer institucional
- **SidebarPract**: Navegación lateral para practicantes
- **SidebarAdmin**: Navegación lateral para administradores
- **Navbar**: Barra de navegación superior (legacy)

---

## 🎨 Estilos

### Organización

- **global.css**: Estilos globales y variables CSS
- **Archivos por página**: Un archivo CSS por página principal
- **Nomenclatura**: BEM (Block Element Modifier) en algunos casos

### Responsive Design

- Diseño principalmente desktop-first
- Algunos componentes adaptativos
- Mejora futura: Implementar diseño responsive completo

---

## 🔄 Estado de la Aplicación

### Estado Local (useState)

Cada componente maneja su propio estado:
- Formularios: Estado local con `useState`
- Datos de API: Estado local, se recargan al montar componente
- Modo edición: Estado booleano local

### Estado Global (localStorage)

- Token de autenticación
- Datos del usuario logueado

**Consideración Futura:**
- Implementar Context API o Redux para estado global
- Evitar prop drilling
- Mejorar sincronización de datos

---

## 🛣️ Routing

### Configuración en `App.jsx`

```jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/practicante/dashboard" element={<DashboardP />} />
    <Route path="/practicante/cartaA" element={<CartaA />} />
    <Route path="/practicante/cartaC" element={<CartaC />} />
    <Route path="/practicante/perfil" element={<Perfil />} />
    <Route path="/admin/dashboard" element={<DashboardA />} />
    <Route path="/admin/revisarCartaA/:cartaId" element={<RevisarCartaA />} />
    <Route path="/admin/revisarCartaC/:cartaId" element={<RevisarCartaC />} />
  </Routes>
</BrowserRouter>
```

### Rutas Protegidas

Actualmente no hay rutas protegidas implementadas. **Mejora futura:**
- Componente `<ProtectedRoute>` que verifique token
- Redirección automática a login si no está autenticado

---

## 📦 Dependencias Principales

### Producción

- **react**: Framework UI
- **react-dom**: Renderizado de React
- **react-router-dom**: Routing
- **@supabase/supabase-js**: (Legacy, no se usa actualmente)

### Desarrollo

- **@vitejs/plugin-react-swc**: Plugin de Vite para React
- **eslint**: Linter de código
- **@types/react**: Tipos TypeScript (preparación futura)

---

## 🔐 Seguridad Frontend

### Almacenamiento de Tokens

- Tokens en `localStorage` (vulnerable a XSS)
- **Mejora futura**: Considerar `httpOnly` cookies o sessionStorage

### Validación

- Validación básica de formularios (HTML5)
- Validación de archivos antes de subir
- **Mejora futura**: Validación más robusta con librerías (Yup, Zod)

### Sanitización

- React escapa automáticamente valores en JSX
- **Mejora futura**: Sanitizar inputs de usuario antes de enviar

---

## 🚀 Optimizaciones

### Code Splitting

- Vite hace code splitting automático
- Componentes cargados bajo demanda

### Lazy Loading

**Mejora futura:**
```jsx
const DashboardP = lazy(() => import('./pages/practicante/DashboardP'));
```

### Memoización

**Mejora futura:**
- `React.memo()` para componentes pesados
- `useMemo()` para cálculos costosos
- `useCallback()` para funciones pasadas como props

---

## 🧪 Testing (Futuro)

### Estrategia de Testing

1. **Unit Tests**: Servicios y funciones puras
2. **Component Tests**: Componentes aislados
3. **Integration Tests**: Flujos completos
4. **E2E Tests**: Flujos críticos de usuario

### Herramientas Recomendadas

- **Vitest**: Testing framework (compatible con Vite)
- **React Testing Library**: Testing de componentes
- **MSW**: Mock Service Worker para mockear API

---

## 📝 Mejoras Futuras

### Corto Plazo

1. **Rutas Protegidas**: Implementar autenticación en rutas
2. **Manejo de Errores Global**: Error boundary y notificaciones
3. **Loading States**: Skeleton loaders y spinners consistentes
4. **Validación de Formularios**: Librería de validación
5. **Mensajes de Error**: Mejor UX en errores

### Mediano Plazo

1. **Estado Global**: Context API o Redux
2. **TypeScript**: Migración gradual
3. **Testing**: Suite de tests completa
4. **PWA**: Convertir en Progressive Web App
5. **Optimizaciones**: Lazy loading, memoización

### Largo Plazo

1. **Micro-frontends**: Si el proyecto crece
2. **Server-Side Rendering**: Next.js si se necesita SEO
3. **Real-time**: WebSockets para notificaciones en vivo
4. **Offline Support**: Service Workers
5. **Internacionalización**: Multi-idioma

---

## 🔧 Configuración

### Variables de Entorno

```env
VITE_API_URL=http://localhost:4000/api
```

### Vite Config

```js
server: {
  port: 3000,
  open: true
}
```

---

## 📖 Referencias

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

---

## 🎯 Principios de Diseño

1. **Simplicidad**: Código claro y fácil de entender
2. **Reutilización**: Componentes y servicios reutilizables
3. **Mantenibilidad**: Estructura organizada y documentada
4. **Escalabilidad**: Preparado para crecer
5. **UX**: Interfaz intuitiva y responsiva

---

**Versión**: 1.0.0  
**Última actualización**: 2024

