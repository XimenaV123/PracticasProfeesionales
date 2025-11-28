// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

/**
 * Obtiene el token de autenticación del localStorage
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Guarda el token de autenticación en localStorage
 */
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Elimina el token de autenticación del localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Guarda los datos del usuario en localStorage
 */
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * Obtiene los datos del usuario del localStorage
 */
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Función helper para hacer peticiones fetch con autenticación
 */
export const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  // Agregar token si existe
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Merge de headers
  const headers = {
    ...defaultHeaders,
    ...options.headers,
  };

  // Si hay FormData, no establecer Content-Type (el navegador lo hará)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Si la respuesta no es JSON, retornar la respuesta tal cual
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      return response;
    }

    const data = await response.json();

    // Si hay error en la respuesta
    if (!response.ok) {
      throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error en fetchAPI:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  getToken,
  setToken,
  removeToken,
  setUser,
  getUser,
  fetchAPI,
};

