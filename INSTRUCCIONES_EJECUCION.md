# 🚀 Instrucciones para Ejecutar el Proyecto

## 📋 Requisitos Previos

- Node.js instalado (versión 16 o superior)
- npm o yarn
- Cuenta de Supabase configurada

## 🔧 Configuración Inicial

### 1. Configurar el Backend

1. Ve a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Crea un archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Edita el archivo `.env` y completa las variables:
   ```env
   PORT=4000
   FRONTEND_URL=http://localhost:3000
   JWT_SECRET=tu-secret-key-muy-seguro-aqui
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_KEY=tu-supabase-anon-key
   ```

4. Instala las dependencias:
   ```bash
   npm install
   ```

### 2. Configurar el Frontend

1. Ve a la carpeta `frontend`:
   ```bash
   cd frontend
   ```

2. (Opcional) Crea un archivo `.env` si quieres cambiar la URL de la API:
   ```bash
   cp .env.example .env
   ```
   
   Por defecto, el frontend buscará el backend en `http://localhost:4000/api`

3. Instala las dependencias:
   ```bash
   npm install
   ```

## ▶️ Ejecutar el Proyecto

### Opción 1: Terminales Separadas (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

El backend estará corriendo en: `http://localhost:4000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

El frontend estará corriendo en: `http://localhost:3000`

### Opción 2: Usando un Script (Opcional)

Puedes crear un script en la raíz del proyecto para ejecutar ambos a la vez, pero es más fácil usar terminales separadas.

## ✅ Verificar que Todo Funciona

1. **Backend**: Abre `http://localhost:4000` en el navegador. Deberías ver:
   ```json
   {
     "message": "API de Prácticas Profesionales",
     "version": "1.0.0"
   }
   ```

2. **Frontend**: Abre `http://localhost:3000` en el navegador. Deberías ver la página de login.

3. **Probar Login**: Intenta hacer login con credenciales válidas de tu base de datos.

## 🔍 Solución de Problemas

### Error: "Puerto ya en uso"
- Si el puerto 4000 está ocupado, cambia el `PORT` en el `.env` del backend
- Si el puerto 3000 está ocupado, cambia el `port` en `vite.config.js`

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en el `.env` del backend sea `http://localhost:3000`
- Asegúrate de que el backend esté corriendo antes que el frontend

### Error: "Cannot connect to API"
- Verifica que el backend esté corriendo en el puerto 4000
- Verifica que la URL en `frontend/src/services/api.js` sea correcta
- Revisa la consola del navegador para ver errores de red

### Error: "Supabase connection"
- Verifica que `SUPABASE_URL` y `SUPABASE_KEY` estén correctos en el `.env` del backend
- Asegúrate de que las tablas existan en Supabase según el schema

## 📝 Notas Importantes

- **Puertos**:
  - Frontend: `3000` (configurado en `vite.config.js`)
  - Backend: `4000` (configurado en `backend/.env`)

- **Base de Datos**: Asegúrate de que Supabase esté configurado y las tablas creadas según `backend/SCHEMA.sql`

- **Tokens**: El token JWT se guarda automáticamente en `localStorage` después del login

## 🎯 Próximos Pasos

1. Ejecuta ambos servidores
2. Abre el frontend en el navegador
3. Prueba hacer login
4. Explora las funcionalidades

¡Listo! 🎉

