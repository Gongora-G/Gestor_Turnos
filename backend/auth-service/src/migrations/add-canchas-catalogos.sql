-- Crear tabla tipo_superficie_cancha
CREATE TABLE IF NOT EXISTS auth.tipo_superficie_cancha (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    color VARCHAR(7) DEFAULT '#3B82F6',
    velocidad VARCHAR(20) DEFAULT 'media',
    requiere_mantenimiento_especial BOOLEAN DEFAULT FALSE,
    activa BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0,
    club_id UUID NOT NULL REFERENCES auth.clubs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla estado_cancha
CREATE TABLE IF NOT EXISTS auth.estado_cancha (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion VARCHAR(500),
    color VARCHAR(7) DEFAULT '#10B981',
    icono VARCHAR(50),
    permite_reservas BOOLEAN DEFAULT TRUE,
    visible_en_turnos BOOLEAN DEFAULT TRUE,
    activa BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0,
    es_predeterminado BOOLEAN DEFAULT FALSE,
    club_id UUID NOT NULL REFERENCES auth.clubs(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agregar columnas a la tabla canchas
ALTER TABLE auth.canchas 
ADD COLUMN IF NOT EXISTS numero INTEGER,
ADD COLUMN IF NOT EXISTS superficie_id INTEGER REFERENCES auth.tipo_superficie_cancha(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS estado_id INTEGER REFERENCES auth.estado_cancha(id) ON DELETE SET NULL;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_tipo_superficie_club ON auth.tipo_superficie_cancha(club_id);
CREATE INDEX IF NOT EXISTS idx_tipo_superficie_activa ON auth.tipo_superficie_cancha(activa);
CREATE INDEX IF NOT EXISTS idx_estado_cancha_club ON auth.estado_cancha(club_id);
CREATE INDEX IF NOT EXISTS idx_estado_cancha_activa ON auth.estado_cancha(activa);
CREATE INDEX IF NOT EXISTS idx_canchas_superficie ON auth.canchas(superficie_id);
CREATE INDEX IF NOT EXISTS idx_canchas_estado ON auth.canchas(estado_id);

-- Comentarios
COMMENT ON TABLE auth.tipo_superficie_cancha IS 'Catálogo configurable de tipos de superficie para canchas';
COMMENT ON TABLE auth.estado_cancha IS 'Catálogo configurable de estados para canchas';
COMMENT ON COLUMN auth.tipo_superficie_cancha.velocidad IS 'Velocidad de la superficie: rapida, media, lenta';
COMMENT ON COLUMN auth.estado_cancha.permite_reservas IS 'Si permite crear turnos cuando está en este estado';
COMMENT ON COLUMN auth.estado_cancha.visible_en_turnos IS 'Si se muestra en el módulo de turnos';
COMMENT ON COLUMN auth.estado_cancha.es_predeterminado IS 'Estado por defecto al crear cancha';
