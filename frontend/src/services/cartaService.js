import { fetchAPI } from './api.js';

/**
 * Crear una nueva carta
 */
export const crearCarta = async (tipo, empresa, datosAdicionales = {}) => {
  try {
    const response = await fetchAPI('/cartas', {
      method: 'POST',
      body: JSON.stringify({ tipo, empresa, datosAdicionales }),
    });
    return response;
  } catch (error) {
    console.error('Error en crearCarta:', error);
    throw error;
  }
};

/**
 * Editar una carta antes de enviarla
 */
export const editarCarta = async (cartaId, empresa, datosAdicionales) => {
  try {
    const response = await fetchAPI(`/cartas/${cartaId}`, {
      method: 'PUT',
      body: JSON.stringify({ empresa, datosAdicionales }),
    });
    return response;
  } catch (error) {
    console.error('Error en editarCarta:', error);
    throw error;
  }
};

/**
 * Enviar una carta (cambiar estado a "enviando")
 */
export const enviarCarta = async (cartaId) => {
  try {
    const response = await fetchAPI(`/cartas/${cartaId}/enviar`, {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error('Error en enviarCarta:', error);
    throw error;
  }
};

/**
 * Obtener todas las cartas del usuario autenticado
 */
export const obtenerCartas = async (tipo = null, estado = null) => {
  try {
    let endpoint = '/cartas';
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (estado) params.append('estado', estado);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const response = await fetchAPI(endpoint);
    return response;
  } catch (error) {
    console.error('Error en obtenerCartas:', error);
    throw error;
  }
};

/**
 * Obtener una carta específica por ID
 */
export const obtenerCartaPorId = async (cartaId) => {
  try {
    const response = await fetchAPI(`/cartas/${cartaId}`);
    return response;
  } catch (error) {
    console.error('Error en obtenerCartaPorId:', error);
    throw error;
  }
};

/**
 * Ver estado de una carta específica
 */
export const verEstadoCarta = async (cartaId) => {
  try {
    const response = await fetchAPI(`/cartas/${cartaId}/estado`);
    return response;
  } catch (error) {
    console.error('Error en verEstadoCarta:', error);
    throw error;
  }
};

/**
 * Obtener todas las cartas (solo para administradores)
 */
export const obtenerTodasLasCartas = async (tipo = null, estado = null, usuario_id = null) => {
  try {
    let endpoint = '/cartas/admin/todas';
    const params = new URLSearchParams();
    if (tipo) params.append('tipo', tipo);
    if (estado) params.append('estado', estado);
    if (usuario_id) params.append('usuario_id', usuario_id);
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }

    const response = await fetchAPI(endpoint);
    return response;
  } catch (error) {
    console.error('Error en obtenerTodasLasCartas:', error);
    throw error;
  }
};

/**
 * Actualizar estado de una carta (solo para administradores)
 */
export const actualizarEstadoCarta = async (cartaId, estado, comentarios = null) => {
  try {
    const body = { estado };
    if (comentarios) body.comentarios = comentarios;

    const response = await fetchAPI(`/cartas/admin/${cartaId}/estado`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
    return response;
  } catch (error) {
    console.error('Error en actualizarEstadoCarta:', error);
    throw error;
  }
};

/**
 * Subir carta C (cumplimiento) firmada
 */
export const subirCartaC = async (cartaId, archivo) => {
  try {
    const formData = new FormData();
    formData.append('archivo', archivo);

    const response = await fetchAPI(`/cartas/${cartaId}/subir-carta-c`, {
      method: 'POST',
      body: formData,
    });
    return response;
  } catch (error) {
    console.error('Error en subirCartaC:', error);
    throw error;
  }
};

/**
 * Descargar carta B (aceptación)
 */
export const descargarCartaB = async (cartaId) => {
  try {
    const response = await fetchAPI(`/cartas/${cartaId}/descargar-b`);
    return response;
  } catch (error) {
    console.error('Error en descargarCartaB:', error);
    throw error;
  }
};

/**
 * Descargar carta D (liberación)
 */
export const descargarCartaD = async (cartaId) => {
  try {
    const response = await fetchAPI(`/cartas/${cartaId}/descargar-d`);
    return response;
  } catch (error) {
    console.error('Error en descargarCartaD:', error);
    throw error;
  }
};

export default {
  crearCarta,
  editarCarta,
  enviarCarta,
  obtenerCartas,
  obtenerCartaPorId,
  verEstadoCarta,
  obtenerTodasLasCartas,
  actualizarEstadoCarta,
  subirCartaC,
  descargarCartaB,
  descargarCartaD,
};

