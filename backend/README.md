# Backend - Sistema de Prácticas Profesionales

Backend completo con Express.js y Supabase para el sistema de gestión de cartas de prácticas profesionales.

## 🚀 Características

- ✅ Autenticación con expediente + contraseña
- ✅ Sistema de cartas (crear, enviar, ver estado)
- ✅ Gestión de usuarios y perfiles
- ✅ Control de acceso basado en roles
- ✅ API RESTful completa

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- Cuenta de Supabase
- Variables de entorno configuradas

## 🔧 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno en `.env`:
```env
PORT=4000
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
JWT_SECRET=tu_secret_key_segura
```

3. Crear las tablas en Supabase ejecutando el archivo `SCHEMA.sql` en el SQL Editor de Supabase.

## 🏃 Ejecutar

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
node src/server.js
```

## 📚 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── supabase.js          # Configuración de Supabase
│   ├── controllers/
│   │   ├── authController.js    # Controlador de autenticación
│   │   ├── cartaController.js   # Controlador de cartas
│   │   └── usuarioController.js # Controlador de usuarios
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticación
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   ├── cartaRoutes.js       # Rutas de cartas
│   │   └── usuarioRoutes.js     # Rutas de usuarios
│   ├── app.js                   # Configuración de Express
│   └── server.js                # Punto de entrada
├── SCHEMA.sql                   # Esquema de base de datos
└── package.json
```

## 🔌 Endpoints de la API

### Autenticación

- `POST /api/auth/login` - Login con expediente y contraseña
- `POST /api/auth/register` - Registrar nuevo usuario
- `GET /api/auth/verify` - Verificar token (requiere autenticación)

### Cartas

- `POST /api/cartas` - Crear nueva carta (requiere autenticación)
- `GET /api/cartas` - Obtener mis cartas (requiere autenticación)
- `GET /api/cartas/:cartaId` - Obtener carta específica (requiere autenticación)
- `GET /api/cartas/:cartaId/estado` - Ver estado de carta (requiere autenticación)
- `POST /api/cartas/:cartaId/enviar` - Enviar carta (requiere autenticación)
- `GET /api/cartas/admin/todas` - Obtener todas las cartas (requiere admin)
- `PUT /api/cartas/admin/:cartaId/estado` - Actualizar estado de carta (requiere admin)

### Usuarios

- `GET /api/usuarios/perfil` - Obtener perfil (requiere autenticación)
- `PUT /api/usuarios/perfil` - Actualizar perfil (requiere autenticación)
- `GET /api/usuarios/estadisticas` - Obtener estadísticas (requiere autenticación)

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

El token se obtiene al hacer login y expira en 24 horas.

## 📝 Tipos de Cartas

- **A**: Carta de Presentación
- **B**: Carta de Aceptación
- **C**: Carta de Cumplimiento
- **D**: Carta de Liberación

## 📊 Estados de Cartas

- `pendiente`: Carta creada pero no enviada
- `enviada`: Carta enviada para revisión
- `revisada`: Carta revisada por coordinador
- `aprobada`: Carta aprobada
- `rechazada`: Carta rechazada

## 👥 Roles

- `estudiante`: Usuario regular, puede crear y gestionar sus propias cartas
- `coordinador`: Puede revisar y actualizar el estado de todas las cartas
- `admin`: Acceso completo al sistema

## 🛠️ Ejemplos de Uso

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "expediente": "12345",
  "contraseña": "mi_contraseña"
}
```

### Crear Carta
```bash
POST /api/cartas
Authorization: Bearer <token>
Content-Type: application/json

{
  "tipo": "A",
  "empresa": "Empresa XYZ",
  "datosAdicionales": {
    "puesto": "Desarrollador",
    "fechaInicio": "2024-01-15"
  }
}
```

### Enviar Carta
```bash
POST /api/cartas/:cartaId/enviar
Authorization: Bearer <token>
```

## ⚠️ Notas Importantes

1. Cambiar `JWT_SECRET` en producción por una clave segura
2. Las contraseñas se almacenan con hash usando bcrypt
3. Asegúrate de configurar correctamente las políticas de seguridad en Supabase
4. El archivo `SCHEMA.sql` debe ejecutarse en Supabase antes de usar la API

