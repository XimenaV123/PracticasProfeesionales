import { supabase } from '../config/supabase.js';
import { crearNotificacion } from './notificacionController.js';

/**
 * Crear una nueva carta
 */
export const crearCarta = async (req, res) => {
  try {
    const { tipo, empresa, datosAdicionales } = req.body;
    const usuarioId = req.user.id;

    // Validar tipo de carta
    const tiposValidos = ['A', 'B', 'C', 'D'];
    if (!tiposValidos.includes(tipo)) {
      return res.status(400).json({ 
        error: 'Tipo de carta inválido. Debe ser A, B, C o D' 
      });
    }

    // Validar campos requeridos según el tipo
    if (!empresa) {
      return res.status(400).json({ 
        error: 'El nombre de la empresa es requerido' 
      });
    }

    // Crear la carta en Supabase
    const { data: nuevaCarta, error: insertError } = await supabase
      .from('cartas')
      .insert({
        usuario_id: usuarioId,
        tipo,
        empresa,
        datos_adicionales: datosAdicionales || {},
        estado: 'pendiente', // Estado inicial
        fecha_creacion: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error al crear carta:', insertError);
      return res.status(500).json({ 
        error: 'Error al crear la carta', 
        details: insertError.message 
      });
    }

    res.status(201).json({
      message: 'Carta creada exitosamente',
      carta: nuevaCarta
    });
  } catch (error) {
    console.error('Error en crearCarta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Editar una carta antes de enviarla
 */
export const editarCarta = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const { empresa, datosAdicionales } = req.body;
    const usuarioId = req.user.id;

    // Verificar que la carta existe y pertenece al usuario
    const { data: carta, error: fetchError } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .single();

    if (fetchError || !carta) {
      return res.status(404).json({ 
        error: 'Carta no encontrada' 
      });
    }

    // Solo se puede editar si está en estado pendiente
    if (carta.estado !== 'pendiente') {
      return res.status(400).json({ 
        error: 'Solo se pueden editar cartas en estado pendiente' 
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (empresa !== undefined) updateData.empresa = empresa;
    if (datosAdicionales !== undefined) updateData.datos_adicionales = datosAdicionales;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ 
        error: 'No se proporcionaron datos para actualizar' 
      });
    }

    // Actualizar carta
    const { data: cartaActualizada, error: updateError } = await supabase
      .from('cartas')
      .update(updateData)
      .eq('id', cartaId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar carta:', updateError);
      return res.status(500).json({ 
        error: 'Error al actualizar la carta', 
        details: updateError.message 
      });
    }

    res.json({
      message: 'Carta actualizada exitosamente',
      carta: cartaActualizada
    });
  } catch (error) {
    console.error('Error en editarCarta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Enviar una carta (cambiar estado a "enviada")
 */
export const enviarCarta = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la carta existe y pertenece al usuario
    const { data: carta, error: fetchError } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .single();

    if (fetchError || !carta) {
      return res.status(404).json({ 
        error: 'Carta no encontrada' 
      });
    }

    // Verificar que la carta esté en estado válido para enviar
    if (carta.estado === 'enviando' || carta.estado === 'en_proceso' || carta.estado === 'recibido') {
      return res.status(400).json({ 
        error: 'La carta ya ha sido enviada' 
      });
    }

    // Actualizar estado a "enviando" (según casos de uso)
    const { data: cartaActualizada, error: updateError } = await supabase
      .from('cartas')
      .update({
        estado: 'enviando',
        fecha_envio: new Date().toISOString()
      })
      .eq('id', cartaId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al enviar carta:', updateError);
      return res.status(500).json({ 
        error: 'Error al enviar la carta', 
        details: updateError.message 
      });
    }

    res.json({
      message: 'Carta enviada exitosamente',
      carta: cartaActualizada
    });
  } catch (error) {
    console.error('Error en enviarCarta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener todas las cartas del usuario autenticado
 */
export const obtenerCartas = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { tipo, estado } = req.query; // Filtros opcionales

    // Construir query
    let query = supabase
      .from('cartas')
      .select('*')
      .eq('usuario_id', usuarioId)
      .order('fecha_creacion', { ascending: false });

    // Aplicar filtros si existen
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    if (estado) {
      query = query.eq('estado', estado);
    }

    const { data: cartas, error } = await query;

    if (error) {
      console.error('Error al obtener cartas:', error);
      return res.status(500).json({ 
        error: 'Error al obtener las cartas', 
        details: error.message 
      });
    }

    res.json({
      cartas: cartas || []
    });
  } catch (error) {
    console.error('Error en obtenerCartas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener una carta específica por ID
 */
export const obtenerCartaPorId = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la carta existe y pertenece al usuario
    const { data: carta, error } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .single();

    if (error || !carta) {
      return res.status(404).json({ 
        error: 'Carta no encontrada' 
      });
    }

    res.json({
      carta
    });
  } catch (error) {
    console.error('Error en obtenerCartaPorId:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Ver estado de una carta específica
 */
export const verEstadoCarta = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la carta existe y pertenece al usuario
    const { data: carta, error } = await supabase
      .from('cartas')
      .select('id, tipo, estado, fecha_creacion, fecha_envio, fecha_revision, comentarios')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .single();

    if (error || !carta) {
      return res.status(404).json({ 
        error: 'Carta no encontrada' 
      });
    }

    res.json({
      carta: {
        id: carta.id,
        tipo: carta.tipo,
        estado: carta.estado,
        fecha_creacion: carta.fecha_creacion,
        fecha_envio: carta.fecha_envio,
        fecha_revision: carta.fecha_revision,
        comentarios: carta.comentarios
      }
    });
  } catch (error) {
    console.error('Error en verEstadoCarta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Actualizar estado de una carta (solo para administradores/coordinadores)
 */
export const actualizarEstadoCarta = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const { estado, comentarios } = req.body;

    // Validar estado
    const estadosValidos = ['pendiente', 'enviando', 'en_proceso', 'recibido', 'revisada', 'aprobada', 'rechazada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        error: 'Estado inválido' 
      });
    }

    // Verificar que la carta existe
    const { data: carta, error: fetchError } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .single();

    if (fetchError || !carta) {
      return res.status(404).json({ 
        error: 'Carta no encontrada' 
      });
    }

    // Preparar datos de actualización
    const updateData = {
      estado,
      fecha_revision: new Date().toISOString()
    };

    if (comentarios) {
      updateData.comentarios = comentarios;
    }

    // Actualizar carta
    const { data: cartaActualizada, error: updateError } = await supabase
      .from('cartas')
      .update(updateData)
      .eq('id', cartaId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar carta:', updateError);
      return res.status(500).json({ 
        error: 'Error al actualizar la carta', 
        details: updateError.message 
      });
    }

    // Crear notificación para el usuario sobre el cambio de estado
    const mensajesEstado = {
      'enviando': 'Tu carta ha sido enviada y está en proceso de revisión',
      'en_proceso': 'Tu carta está siendo procesada por el administrativo',
      'recibido': 'Tu carta ha sido recibida',
      'revisada': 'Tu carta ha sido revisada',
      'aprobada': 'Tu carta ha sido aprobada',
      'rechazada': 'Tu carta ha sido rechazada'
    };

    const mensaje = mensajesEstado[estado] || `El estado de tu carta ha cambiado a: ${estado}`;
    
    await crearNotificacion(
      carta.usuario_id,
      'carta_estado',
      `Actualización de Carta ${carta.tipo}`,
      mensaje,
      cartaId
    );

    res.json({
      message: 'Estado de carta actualizado exitosamente',
      carta: cartaActualizada
    });
  } catch (error) {
    console.error('Error en actualizarEstadoCarta:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Obtener todas las cartas (solo para administradores/coordinadores)
 */
export const obtenerTodasLasCartas = async (req, res) => {
  try {
    const { tipo, estado, usuario_id } = req.query;

    // Construir query
    let query = supabase
      .from('cartas')
      .select(`
        *,
        usuarios:usuario_id (
          id,
          expediente,
          nombre,
          carrera
        )
      `)
      .order('fecha_creacion', { ascending: false });

    // Aplicar filtros
    if (tipo) {
      query = query.eq('tipo', tipo);
    }
    if (estado) {
      query = query.eq('estado', estado);
    }
    if (usuario_id) {
      query = query.eq('usuario_id', usuario_id);
    }

    const { data: cartas, error } = await query;

    if (error) {
      console.error('Error al obtener cartas:', error);
      return res.status(500).json({ 
        error: 'Error al obtener las cartas', 
        details: error.message 
      });
    }

    res.json({
      cartas: cartas || []
    });
  } catch (error) {
    console.error('Error en obtenerTodasLasCartas:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Subir carta C (cumplimiento) firmada
 */
export const subirCartaC = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const usuarioId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ 
        error: 'Archivo requerido' 
      });
    }

    // Verificar que la carta existe, es tipo C y pertenece al usuario
    const { data: carta, error: fetchError } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .eq('tipo', 'C')
      .single();

    if (fetchError || !carta) {
      return res.status(404).json({ 
        error: 'Carta C no encontrada' 
      });
    }

    // Subir archivo a Supabase Storage
    const fileExt = req.file.originalname.split('.').pop();
    const fileName = `carta-c-${cartaId}-${Date.now()}.${fileExt}`;
    const filePath = `cartas-c/${usuarioId}/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cartas')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      console.error('Error al subir archivo:', uploadError);
      return res.status(500).json({ 
        error: 'Error al subir el archivo', 
        details: uploadError.message 
      });
    }

    // Obtener URL pública del archivo
    const { data: urlData } = supabase.storage
      .from('cartas')
      .getPublicUrl(filePath);

    // Actualizar carta con la URL del archivo
    const { data: cartaActualizada, error: updateError } = await supabase
      .from('cartas')
      .update({
        archivo_url: urlData.publicUrl,
        archivo_nombre: req.file.originalname,
        estado: 'enviando', // Cambiar a enviando después de subir
        fecha_envio: new Date().toISOString()
      })
      .eq('id', cartaId)
      .select()
      .single();

    if (updateError) {
      console.error('Error al actualizar carta:', updateError);
      return res.status(500).json({ 
        error: 'Error al actualizar la carta', 
        details: updateError.message 
      });
    }

    res.json({
      message: 'Carta C subida exitosamente',
      carta: cartaActualizada
    });
  } catch (error) {
    console.error('Error en subirCartaC:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Descargar carta B (aceptación)
 */
export const descargarCartaB = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la carta existe, es tipo B y pertenece al usuario
    const { data: carta, error: fetchError } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .eq('tipo', 'B')
      .single();

    if (fetchError || !carta) {
      return res.status(404).json({ 
        error: 'Carta B no encontrada' 
      });
    }

    // Verificar que la carta tiene archivo
    if (!carta.archivo_url) {
      return res.status(404).json({ 
        error: 'La carta B aún no ha sido generada por el administrativo' 
      });
    }

    // Redirigir a la URL del archivo o retornar la URL
    res.json({
      message: 'Carta B disponible',
      url: carta.archivo_url,
      nombre: carta.archivo_nombre || 'carta-aceptacion.pdf'
    });
  } catch (error) {
    console.error('Error en descargarCartaB:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

/**
 * Descargar carta D (liberación)
 */
export const descargarCartaD = async (req, res) => {
  try {
    const { cartaId } = req.params;
    const usuarioId = req.user.id;

    // Verificar que la carta existe, es tipo D y pertenece al usuario
    const { data: carta, error: fetchError } = await supabase
      .from('cartas')
      .select('*')
      .eq('id', cartaId)
      .eq('usuario_id', usuarioId)
      .eq('tipo', 'D')
      .single();

    if (fetchError || !carta) {
      return res.status(404).json({ 
        error: 'Carta D no encontrada' 
      });
    }

    // Verificar que la carta tiene archivo
    if (!carta.archivo_url) {
      return res.status(404).json({ 
        error: 'La carta D aún no ha sido generada por el administrativo' 
      });
    }

    // Redirigir a la URL del archivo o retornar la URL
    res.json({
      message: 'Carta D disponible',
      url: carta.archivo_url,
      nombre: carta.archivo_nombre || 'carta-liberacion.pdf'
    });
  } catch (error) {
    console.error('Error en descargarCartaD:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor' 
    });
  }
};

