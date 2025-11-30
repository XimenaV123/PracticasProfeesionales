# 📚 Documentación Técnica del Backend

## 🎯 Descripción General

El backend de **Prácticas Profesionales** es una API REST desarrollada en Node.js que gestiona el sistema de cartas de prácticas profesionales para estudiantes universitarios. Proporciona endpoints para autenticación, gestión de cartas, usuarios y notificaciones.

---

## 🛠️ Stack Tecnológico

### Framework: Express.js

**¿Por qué Express.js?**

1. **Simplicidad y Flexibilidad**
   - Express es minimalista y no impone una estructura rígida, permitiendo adaptar la arquitectura a las necesidades específicas del proyecto
   - Facilita el desarrollo rápido sin sobrecargar con abstracciones innecesarias

2. **Ecosistema Maduro**
   - Amplia comunidad y documentación extensa
   - Gran cantidad de middlewares disponibles (CORS, autenticación, validación, etc.)
   - Compatibilidad con la mayoría de librerías de Node.js

3. **Rendimiento**
   - Framework ligero con bajo overhead
   - Ideal para APIs REST que requieren alta performance
   - Soporte nativo para operaciones asíncronas

4. **Compatibilidad con Supabase**
   - Express se integra perfectamente con el cliente de Supabase
   - Permite manejar fácilmente operaciones de base de datos asíncronas

5. **Facilidad de Mantenimiento**
   - Código más legible y fácil de entender para el equipo
   - Estructura de rutas y controladores clara y organizada

### Base de Datos: Supabase (PostgreSQL)

**¿Por qué Supabase?**

1. **PostgreSQL como Base de Datos**
   - Base de datos relacional robusta y confiable
   - Soporte para JSONB para datos flexibles
   - Transacciones ACID garantizadas

2. **Ventajas de Supabase**
   - API REST automática
   - Autenticación integrada (aunque usamos JWT propio)
   - Storage para archivos
   - Real-time subscriptions (para futuras mejoras)
   - Hosting gestionado sin necesidad de configurar servidor de BD

3. **Escalabilidad**
   - Fácil escalado horizontal
   - Plan gratuito generoso para desarrollo
   - Migración sencilla a producción

### Autenticación: JWT (JSON Web Tokens)

**¿Por qué JWT?**

1. **Stateless**
   - No requiere almacenar sesiones en el servidor
   - Escalable horizontalmente sin problemas de sesiones compartidas

2. **Seguridad**
   - Tokens firmados digitalmente
   - Expiración automática
   - Información del usuario incluida en el token

3. **Compatibilidad**
   - Estándar ampliamente adoptado
   - Fácil integración con frontend
   - Soporte en todos los navegadores modernos

---

## 🏗️ Arquitectura del Backend

### Estructura de Carpetas

```
backend/
├── src/
│   ├── app.js              # Configuración de Express y middleware
│   ├── server.js            # Punto de entrada del servidor
│   ├── config/
│   │   └── supabase.js      # Configuración del cliente Supabase
│   ├── controllers/         # Lógica de negocio
│   │   ├── authController.js
│   │   ├── cartaController.js
│   │   ├── usuarioController.js
│   │   └── notificacionController.js
│   ├── middleware/
│   │   └── auth.js          # Middleware de autenticación y autorización
│   └── routes/              # Definición de rutas
│       ├── authRoutes.js
│       ├── cartaRoutes.js
│       ├── usuarioRoutes.js
│       └── notificacionRoutes.js
├── package.json
└── SCHEMA.sql               # Esquema de base de datos
```

### Patrón Arquitectónico: MVC (Model-View-Controller)

**¿Por qué MVC?**

1. **Separación de Responsabilidades**
   - **Routes**: Define endpoints y delega a controladores
   - **Controllers**: Contiene la lógica de negocio
   - **Middleware**: Maneja autenticación y validación
   - **Config**: Configuración centralizada

2. **Mantenibilidad**
   - Código organizado y fácil de navegar
   - Cambios en una capa no afectan directamente a otras
   - Facilita la colaboración en equipo

3. **Escalabilidad**
   - Fácil agregar nuevas funcionalidades
   - Reutilización de código
   - Testing más sencillo

### Flujo de una Petición

```
Cliente (Frontend)
    ↓
Express App (app.js)
    ↓
CORS Middleware
    ↓
JSON Parser
    ↓
Routes (routes/)
    ↓
Auth Middleware (si es necesario)
    ↓
Controller (controllers/)
    ↓
Supabase (Base de Datos)
    ↓
Response JSON
    ↓
Cliente
```

---

## 📡 Endpoints de la API

### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | Iniciar sesión | No |
| POST | `/api/auth/register` | Registrar usuario | No |
| GET | `/api/auth/verify` | Verificar token | Sí |
| POST | `/api/auth/recuperar` | Solicitar recuperación | No |
| POST | `/api/auth/restablecer` | Restablecer contraseña | No |

### Cartas (`/api/cartas`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/cartas` | Crear carta | Sí |
| GET | `/api/cartas` | Obtener mis cartas | Sí |
| GET | `/api/cartas/:id` | Obtener carta específica | Sí |
| PUT | `/api/cartas/:id` | Editar carta | Sí |
| POST | `/api/cartas/:id/enviar` | Enviar carta | Sí |
| POST | `/api/cartas/:id/subir-carta-c` | Subir archivo Carta C | Sí |
| GET | `/api/cartas/:id/estado` | Ver estado de carta | Sí |
| GET | `/api/cartas/admin/todas` | Obtener todas (admin) | Sí (Admin) |
| PUT | `/api/cartas/admin/:id/estado` | Actualizar estado (admin) | Sí (Admin) |

### Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/usuarios/perfil` | Obtener perfil | Sí |
| PUT | `/api/usuarios/perfil` | Actualizar perfil | Sí |
| GET | `/api/usuarios/estadisticas` | Obtener estadísticas | Sí |

### Notificaciones (`/api/notificaciones`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/notificaciones` | Obtener notificaciones | Sí |
| GET | `/api/notificaciones/contador` | Contador no leídas | Sí |
| PUT | `/api/notificaciones/:id/leida` | Marcar como leída | Sí |
| PUT | `/api/notificaciones/marcar-todas` | Marcar todas leídas | Sí |

---

## 🔐 Seguridad

### Autenticación JWT

1. **Generación de Token**
   - Se genera al hacer login exitoso
   - Contiene: `userId`, `expediente`, `rol`
   - Expiración: 24 horas

2. **Validación de Token**
   - Middleware `authenticateToken` verifica cada petición protegida
   - Valida firma y expiración
   - Verifica que el usuario exista en la base de datos

3. **Autorización**
   - Middleware `isAdmin` verifica permisos de administrador
   - Roles: `estudiante`, `coordinador`, `admin`

### CORS (Cross-Origin Resource Sharing)

- Configurado para permitir peticiones desde `http://localhost:3000`
- Credentials habilitados para cookies (si se necesitan en el futuro)
- Métodos permitidos: GET, POST, PUT, DELETE, OPTIONS

### Validación de Datos

- Validación de campos requeridos en controladores
- Validación de tipos de archivo en uploads (PDF, JPG, PNG)
- Límite de tamaño de archivo: 10MB

### Hash de Contraseñas

- Uso de `bcrypt` con salt rounds = 10
- Las contraseñas nunca se almacenan en texto plano
- Comparación segura en el login

---

## 📦 Dependencias Principales

### Producción

- **express**: Framework web para Node.js
- **@supabase/supabase-js**: Cliente oficial de Supabase
- **jsonwebtoken**: Generación y verificación de JWT
- **bcrypt**: Hash de contraseñas
- **cors**: Middleware para CORS
- **dotenv**: Variables de entorno
- **multer**: Manejo de uploads de archivos

### Desarrollo

- **nodemon**: Auto-reload durante desarrollo

---

## 🗄️ Modelo de Datos

### Tabla: `usuarios`

```sql
- id (UUID, PK)
- expediente (VARCHAR, UNIQUE)
- contraseña (TEXT, hasheada)
- nombre (VARCHAR)
- curp (VARCHAR)
- carrera (VARCHAR)
- semestre (INTEGER)
- imss (VARCHAR)
- telefono (VARCHAR)
- email (VARCHAR, UNIQUE)
- fechaNacimiento (DATE)
- rol (VARCHAR: 'estudiante', 'coordinador', 'admin')
- reset_token (TEXT)
- reset_token_expires (TIMESTAMP)
- created_at, updated_at
```

### Tabla: `cartas`

```sql
- id (UUID, PK)
- usuario_id (UUID, FK → usuarios)
- tipo (VARCHAR: 'A', 'B', 'C', 'D')
- empresa (VARCHAR)
- datos_adicionales (JSONB)
- estado (VARCHAR: 'pendiente', 'enviando', 'en_proceso', ...)
- fecha_creacion (TIMESTAMP)
- fecha_envio (TIMESTAMP)
- fecha_revision (TIMESTAMP)
- comentarios (TEXT)
- archivo_url (TEXT)
- archivo_nombre (VARCHAR)
- created_at, updated_at
```

### Tabla: `notificaciones`

```sql
- id (UUID, PK)
- usuario_id (UUID, FK → usuarios)
- tipo (VARCHAR)
- titulo (VARCHAR)
- mensaje (TEXT)
- leida (BOOLEAN)
- referencia_id (UUID)
- created_at
```

---

## 🔄 Flujos Principales

### 1. Flujo de Login

```
1. Cliente envía expediente y contraseña
2. Backend busca usuario por expediente
3. Compara contraseña con hash almacenado
4. Si es válida, genera JWT
5. Retorna token y datos del usuario (sin contraseña)
6. Cliente guarda token en localStorage
```

### 2. Flujo de Crear/Enviar Carta A

```
1. Cliente envía datos de carta (tipo A, empresa, datos adicionales)
2. Backend valida datos
3. Crea registro en tabla 'cartas' con estado 'pendiente'
4. Cliente puede editar mientras esté en 'pendiente'
5. Cliente envía petición de envío
6. Backend cambia estado a 'enviando'
7. Se crea notificación para administradores
```

### 3. Flujo de Subir Carta C

```
1. Cliente envía archivo (PDF/imagen)
2. Backend valida tipo y tamaño
3. Sube archivo a Supabase Storage
4. Obtiene URL pública del archivo
5. Actualiza registro de carta con URL y estado 'enviando'
6. Crea notificación para administradores
```

---

## 🚀 Despliegue

### Variables de Entorno Requeridas

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=secret-key-muy-seguro
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-key
```

### Consideraciones para Producción

1. **JWT_SECRET**: Debe ser una cadena larga y aleatoria
2. **CORS**: Actualizar `FRONTEND_URL` con la URL de producción
3. **Rate Limiting**: Considerar agregar límites de peticiones
4. **Logging**: Implementar sistema de logs estructurado
5. **Error Handling**: Mejorar mensajes de error (no exponer detalles internos)
6. **HTTPS**: Usar siempre HTTPS en producción

---

## 📝 Mejoras Futuras

1. **Validación con Joi/Zod**: Validación más robusta de esquemas
2. **Rate Limiting**: Prevenir abuso de API
3. **Caché**: Redis para mejorar rendimiento
4. **Testing**: Unit tests y integration tests
5. **Documentación API**: Swagger/OpenAPI
6. **WebSockets**: Notificaciones en tiempo real
7. **Email Service**: Envío de emails para recuperación de contraseña
8. **File Validation**: Validación más estricta de archivos

---

## 📖 Referencias

- [Express.js Documentation](https://expressjs.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [JWT.io](https://jwt.io/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Versión**: 1.0.0  
**Última actualización**: 2024

