import { fetchAPI } from './api.js';

/**
 * Obtener notificaciones del usuario autenticado
 */
export const obtenerNotificaciones = async () => {
  try {
    const response = await fetchAPI('/notificaciones');
    return response;
  } catch (error) {
    console.error('Error en obtenerNotificaciones:', error);
    throw error;
  }
};

/**
 * Obtener contador de notificaciones no leídas
 */
export const obtenerContadorNoLeidas = async () => {
  try {
    const response = await fetchAPI('/notificaciones/contador');
    return response;
  } catch (error) {
    console.error('Error en obtenerContadorNoLeidas:', error);
    throw error;
  }
};

/**
 * Marcar una notificación como leída
 */
export const marcarComoLeida = async (notificacionId) => {
  try {
    const response = await fetchAPI(`/notificaciones/${notificacionId}/leida`, {
      method: 'PUT',
    });
    return response;
  } catch (error) {
    console.error('Error en marcarComoLeida:', error);
    throw error;
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
export const marcarTodasComoLeidas = async () => {
  try {
    const response = await fetchAPI('/notificaciones/marcar-todas', {
      method: 'PUT',
    });
    return response;
  } catch (error) {
    console.error('Error en marcarTodasComoLeidas:', error);
    throw error;
  }
};

export default {
  obtenerNotificaciones,
  obtenerContadorNoLeidas,
  marcarComoLeida,
  marcarTodasComoLeidas,
};

