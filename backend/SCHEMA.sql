-- Esquema de base de datos para el sistema de Prácticas Profesionales
-- Ejecutar estos comandos en Supabase SQL Editor

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expediente VARCHAR(50) UNIQUE NOT NULL,
  contraseña TEXT NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  curp VARCHAR(18),
  carrera VARCHAR(100),
  semestre INTEGER,
  imss VARCHAR(20),
  telefono VARCHAR(20),
  email VARCHAR(255) UNIQUE NOT NULL,
  fechaNacimiento DATE,
  rol VARCHAR(20) DEFAULT 'estudiante' CHECK (rol IN ('estudiante', 'coordinador', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cartas
CREATE TABLE IF NOT EXISTS cartas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(1) NOT NULL CHECK (tipo IN ('A', 'B', 'C', 'D')),
  empresa VARCHAR(255) NOT NULL,
  datos_adicionales JSONB DEFAULT '{}',
  estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'enviada', 'revisada', 'aprobada', 'rechazada')),
  fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_envio TIMESTAMP WITH TIME ZONE,
  fecha_revision TIMESTAMP WITH TIME ZONE,
  comentarios TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_usuarios_expediente ON usuarios(expediente);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_cartas_usuario_id ON cartas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_cartas_tipo ON cartas(tipo);
CREATE INDEX IF NOT EXISTS idx_cartas_estado ON cartas(estado);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cartas_updated_at BEFORE UPDATE ON cartas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios sobre las tablas
COMMENT ON TABLE usuarios IS 'Tabla de usuarios del sistema (estudiantes, coordinadores, administradores)';
COMMENT ON TABLE cartas IS 'Tabla de cartas para prácticas profesionales (A: Presentación, B: Aceptación, C: Cumplimiento, D: Liberación)';

COMMENT ON COLUMN cartas.tipo IS 'Tipo de carta: A=Presentación, B=Aceptación, C=Cumplimiento, D=Liberación';
COMMENT ON COLUMN cartas.estado IS 'Estado de la carta: pendiente, enviada, revisada, aprobada, rechazada';

