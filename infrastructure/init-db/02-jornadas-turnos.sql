-- Crear tabla para gestión de jornadas de turnos
-- Esta tabla almacena capturas históricas de turnos por jornada
CREATE TABLE IF NOT EXISTS auth.jornadas_turnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_jornada DATE NOT NULL,
    nombre_jornada VARCHAR(255) NOT NULL,
    datos_turnos JSONB NOT NULL,
    total_turnos INTEGER NOT NULL DEFAULT 0,
    observaciones TEXT,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    usuario_creacion UUID REFERENCES auth.users(id),
    usuario_actualizacion UUID REFERENCES auth.users(id)
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_jornadas_turnos_fecha_jornada ON auth.jornadas_turnos(fecha_jornada);
CREATE INDEX IF NOT EXISTS idx_jornadas_turnos_activa ON auth.jornadas_turnos(activa);
CREATE INDEX IF NOT EXISTS idx_jornadas_turnos_fecha_creacion ON auth.jornadas_turnos(fecha_creacion);

-- Índice compuesto para búsquedas frecuentes
CREATE INDEX IF NOT EXISTS idx_jornadas_turnos_fecha_activa ON auth.jornadas_turnos(fecha_jornada, activa);

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION auth.update_jornadas_turnos_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_jornadas_turnos_updated_at ON auth.jornadas_turnos;
CREATE TRIGGER update_jornadas_turnos_updated_at
    BEFORE UPDATE ON auth.jornadas_turnos
    FOR EACH ROW
    EXECUTE FUNCTION auth.update_jornadas_turnos_updated_at();

-- Comentarios para documentación
COMMENT ON TABLE auth.jornadas_turnos IS 'Tabla para almacenar jornadas históricas de turnos con snapshot de datos';
COMMENT ON COLUMN auth.jornadas_turnos.fecha_jornada IS 'Fecha específica de la jornada de turnos';
COMMENT ON COLUMN auth.jornadas_turnos.nombre_jornada IS 'Nombre descriptivo de la jornada (ej: Jornada 15/01/2024)';
COMMENT ON COLUMN auth.jornadas_turnos.datos_turnos IS 'Snapshot completo de los turnos en formato JSON';
COMMENT ON COLUMN auth.jornadas_turnos.total_turnos IS 'Número total de turnos capturados en esta jornada';
COMMENT ON COLUMN auth.jornadas_turnos.observaciones IS 'Notas adicionales sobre la jornada';
COMMENT ON COLUMN auth.jornadas_turnos.activa IS 'Indica si la jornada está activa o archivada';