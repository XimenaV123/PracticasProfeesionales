import { fetchAPI, setToken, setUser, removeToken } from './api.js';

/**
 * Iniciar sesión
 */
export const login = async (expediente, contraseña) => {
  try {
    const response = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ expediente, contraseña }),
    });

    // Guardar token y usuario
    if (response.token) {
      setToken(response.token);
    }
    if (response.user) {
      setUser(response.user);
    }

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

/**
 * Registrar nuevo usuario
 */
export const register = async (userData) => {
  try {
    const response = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Guardar token y usuario si se registra exitosamente
    if (response.token) {
      setToken(response.token);
    }
    if (response.user) {
      setUser(response.user);
    }

    return response;
  } catch (error) {
    console.error('Error en register:', error);
    throw error;
  }
};

/**
 * Verificar token y obtener información del usuario actual
 */
export const verifyToken = async () => {
  try {
    const response = await fetchAPI('/auth/verify');
    return response;
  } catch (error) {
    console.error('Error en verifyToken:', error);
    // Si el token es inválido, limpiar localStorage
    removeToken();
    throw error;
  }
};

/**
 * Solicitar recuperación de contraseña
 */
export const solicitarRecuperacion = async (expediente, email) => {
  try {
    const response = await fetchAPI('/auth/recuperar', {
      method: 'POST',
      body: JSON.stringify({ expediente, email }),
    });
    return response;
  } catch (error) {
    console.error('Error en solicitarRecuperacion:', error);
    throw error;
  }
};

/**
 * Restablecer contraseña con token
 */
export const restablecerContraseña = async (token, nuevaContraseña) => {
  try {
    const response = await fetchAPI('/auth/restablecer', {
      method: 'POST',
      body: JSON.stringify({ token, nuevaContraseña }),
    });
    return response;
  } catch (error) {
    console.error('Error en restablecerContraseña:', error);
    throw error;
  }
};

/**
 * Cerrar sesión
 */
export const logout = () => {
  removeToken();
};

export default {
  login,
  register,
  verifyToken,
  solicitarRecuperacion,
  restablecerContraseña,
  logout,
};

