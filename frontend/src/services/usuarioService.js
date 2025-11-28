import { fetchAPI } from './api.js';

/**
 * Obtener perfil del usuario autenticado
 */
export const obtenerPerfil = async () => {
  try {
    const response = await fetchAPI('/usuarios/perfil');
    return response;
  } catch (error) {
    console.error('Error en obtenerPerfil:', error);
    throw error;
  }
};

/**
 * Actualizar perfil del usuario autenticado
 */
export const actualizarPerfil = async (datosPerfil) => {
  try {
    const response = await fetchAPI('/usuarios/perfil', {
      method: 'PUT',
      body: JSON.stringify(datosPerfil),
    });
    return response;
  } catch (error) {
    console.error('Error en actualizarPerfil:', error);
    throw error;
  }
};

/**
 * Obtener estadísticas del usuario
 */
export const obtenerEstadisticas = async () => {
  try {
    const response = await fetchAPI('/usuarios/estadisticas');
    return response;
  } catch (error) {
    console.error('Error en obtenerEstadisticas:', error);
    throw error;
  }
};

export default {
  obtenerPerfil,
  actualizarPerfil,
  obtenerEstadisticas,
};

