# Configuración de la API

Este proyecto está conectado al backend mediante fetch. A continuación se explica cómo configurarlo.

## Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `frontend` con la siguiente variable:

```
VITE_API_URL=http://localhost:4000/api
```

Si no defines esta variable, por defecto se usará `http://localhost:4000/api`.

### Estructura de Servicios

Los servicios están organizados en la carpeta `frontend/src/services/`:

- **api.js**: Configuración base y funciones helper para fetch
- **authService.js**: Servicios de autenticación (login, registro, etc.)
- **cartaService.js**: Servicios para gestionar cartas
- **usuarioService.js**: Servicios para perfil y estadísticas
- **notificacionService.js**: Servicios para notificaciones

### Autenticación

El sistema usa JWT (JSON Web Tokens) para la autenticación. El token se guarda automáticamente en `localStorage` después del login y se incluye en todas las peticiones al backend.

### Uso de los Servicios

Ejemplo de uso en un componente:

```javascript
import { login } from "../services/authService";
import { obtenerCartas } from "../services/cartaService";

// Login
const response = await login(expediente, contraseña);

// Obtener cartas
const response = await obtenerCartas();
```

### Manejo de Errores

Todos los servicios lanzan errores que pueden ser capturados con try/catch:

```javascript
try {
  const response = await login(expediente, contraseña);
} catch (error) {
  console.error("Error:", error.message);
  alert(error.message);
}
```

## Endpoints del Backend

El backend debe estar corriendo en el puerto configurado (por defecto 4000). Los endpoints principales son:

- `/api/auth/login` - Iniciar sesión
- `/api/auth/register` - Registrar usuario
- `/api/cartas` - Gestionar cartas
- `/api/usuarios/perfil` - Perfil de usuario
- `/api/notificaciones` - Notificaciones

Para más detalles, consulta la documentación del backend.

