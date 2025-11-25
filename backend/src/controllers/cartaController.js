import { supabase } from '../config/supabase.js';

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
    if (carta.estado === 'enviada') {
      return res.status(400).json({ 
        error: 'La carta ya ha sido enviada' 
      });
    }

    // Actualizar estado a "enviada"
    const { data: cartaActualizada, error: updateError } = await supabase
      .from('cartas')
      .update({
        estado: 'enviada',
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
    const estadosValidos = ['pendiente', 'enviada', 'revisada', 'aprobada', 'rechazada'];
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

