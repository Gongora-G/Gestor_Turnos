-- ==========================================
-- Agregar columnas para soft delete (papelera)
-- ==========================================

-- Agregar columnas a registro_jornadas_diarias
ALTER TABLE auth.registro_jornadas_diarias
ADD COLUMN IF NOT EXISTS eliminado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fecha_eliminacion TIMESTAMP,
ADD COLUMN IF NOT EXISTS eliminado_por UUID;

-- Agregar columnas a registros_jornadas
ALTER TABLE auth.registros_jornadas
ADD COLUMN IF NOT EXISTS eliminado BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS fecha_eliminacion TIMESTAMP,
ADD COLUMN IF NOT EXISTS eliminado_por UUID;

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX IF NOT EXISTS idx_registro_jornadas_diarias_eliminado 
ON auth.registro_jornadas_diarias(eliminado);

CREATE INDEX IF NOT EXISTS idx_registro_jornadas_diarias_fecha_eliminacion 
ON auth.registro_jornadas_diarias(fecha_eliminacion);

CREATE INDEX IF NOT EXISTS idx_registros_jornadas_eliminado 
ON auth.registros_jornadas(eliminado);

CREATE INDEX IF NOT EXISTS idx_registros_jornadas_fecha_eliminacion 
ON auth.registros_jornadas(fecha_eliminacion);

-- Comentarios para documentación
COMMENT ON COLUMN auth.registro_jornadas_diarias.eliminado IS 'Indica si el registro está en la papelera (soft delete)';
COMMENT ON COLUMN auth.registro_jornadas_diarias.fecha_eliminacion IS 'Fecha en que se movió el registro a la papelera';
COMMENT ON COLUMN auth.registro_jornadas_diarias.eliminado_por IS 'ID del usuario que eliminó el registro';

COMMENT ON COLUMN auth.registros_jornadas.eliminado IS 'Indica si el registro está en la papelera (soft delete)';
COMMENT ON COLUMN auth.registros_jornadas.fecha_eliminacion IS 'Fecha en que se movió el registro a la papelera';
COMMENT ON COLUMN auth.registros_jornadas.eliminado_por IS 'ID del usuario que eliminó el registro';
