# ✅ Checklist: Conexión Frontend-Backend

## 🔴 Lo que FALTA hacer antes de ejecutar:

### 1. **Configurar Variables de Entorno del Backend** ⚠️ IMPORTANTE

Crea el archivo `backend/.env` con estas variables:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=tu-secret-key-muy-seguro-aqui-cambiar-en-produccion
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-supabase-anon-key
```

**¿Dónde conseguir las credenciales de Supabase?**
1. Ve a tu proyecto en [supabase.com](https://supabase.com)
2. Settings → API
3. Copia `Project URL` → `SUPABASE_URL`
4. Copia `anon public` key → `SUPABASE_KEY`

### 2. **Configurar Base de Datos en Supabase** ⚠️ IMPORTANTE

Ejecuta el archivo `backend/SCHEMA.sql` en el SQL Editor de Supabase para crear las tablas.

### 3. **Configurar Storage en Supabase** (Opcional, para archivos)

Si quieres subir archivos (Carta C), necesitas crear un bucket en Supabase Storage:
1. Ve a Storage en Supabase
2. Crea un bucket llamado `cartas`
3. Configura permisos según necesites

### 4. **Instalar Dependencias** ✅ (Ya deberías tenerlas)

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🟢 Lo que YA está configurado:

✅ Servicios de API creados (`frontend/src/services/`)
✅ Páginas conectadas al backend
✅ React Router configurado
✅ CORS configurado en el backend
✅ Autenticación JWT implementada
✅ Manejo de tokens en localStorage
✅ Puertos configurados:
   - Frontend: 3000
   - Backend: 4000

## 🚀 Cómo Ejecutarlo:

### Paso 1: Iniciar Backend
```bash
cd backend
npm run dev
```
Deberías ver: `:3 Corriendo en puerto 4000`

### Paso 2: Iniciar Frontend (en otra terminal)
```bash
cd frontend
npm run dev
```
Deberías ver: `Local: http://localhost:3000`

### Paso 3: Probar la Conexión

1. Abre `http://localhost:3000` en el navegador
2. Deberías ver la página de login
3. Intenta hacer login con un usuario de tu base de datos

## 🔍 Verificar que Todo Funciona:

### Test 1: Backend responde
Abre: `http://localhost:4000`
Deberías ver:
```json
{
  "message": "API de Prácticas Profesionales",
  "version": "1.0.0"
}
```

### Test 2: Frontend se conecta al backend
1. Abre la consola del navegador (F12)
2. Intenta hacer login
3. Si hay errores, aparecerán en la consola

### Test 3: Login funciona
1. Usa credenciales válidas de tu base de datos
2. Deberías ser redirigido al dashboard correspondiente

## ⚠️ Errores Comunes:

### "Cannot connect to API"
- ✅ Verifica que el backend esté corriendo en puerto 4000
- ✅ Verifica que no haya errores en la terminal del backend
- ✅ Revisa la consola del navegador para ver el error exacto

### "CORS policy"
- ✅ Verifica que `FRONTEND_URL=http://localhost:3000` en `backend/.env`
- ✅ Reinicia el backend después de cambiar `.env`

### "Token inválido" o "Usuario no encontrado"
- ✅ Verifica que las credenciales de Supabase sean correctas
- ✅ Verifica que las tablas existan en Supabase
- ✅ Verifica que el usuario exista en la base de datos

### "Error 401 Unauthorized"
- ✅ Verifica que el token se esté guardando en localStorage
- ✅ Abre DevTools → Application → Local Storage
- ✅ Deberías ver `token` y `user`

## 📝 Notas Finales:

- El frontend está en: `http://localhost:3000`
- El backend está en: `http://localhost:4000`
- La API está en: `http://localhost:4000/api`
- Los tokens se guardan automáticamente en `localStorage`

¡Todo listo para funcionar! 🎉

