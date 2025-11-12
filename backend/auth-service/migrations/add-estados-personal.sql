-- Crear tabla estados_personal
CREATE TABLE IF NOT EXISTS auth.estados_personal (
  id SERIAL PRIMARY KEY,
  "clubId" INTEGER NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#6B7280',
  activo BOOLEAN DEFAULT true,
  "esOcupado" BOOLEAN DEFAULT false,
  "esSistema" BOOLEAN DEFAULT false,
  descripcion TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_club FOREIGN KEY ("clubId") REFERENCES auth.clubs(id) ON DELETE CASCADE,
  CONSTRAINT uk_club_estado UNIQUE ("clubId", nombre)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_estados_personal_club ON auth.estados_personal("clubId");
CREATE INDEX IF NOT EXISTS idx_estados_personal_activo ON auth.estados_personal(activo);

-- Agregar columna estado_id a la tabla personal
ALTER TABLE auth.personal ADD COLUMN IF NOT EXISTS estado_id INTEGER;
ALTER TABLE auth.personal ADD CONSTRAINT fk_personal_estado FOREIGN KEY (estado_id) REFERENCES auth.estados_personal(id);

-- Crear índice
CREATE INDEX IF NOT EXISTS idx_personal_estado ON auth.personal(estado_id);

-- Comentarios
COMMENT ON TABLE auth.estados_personal IS 'Tabla para gestionar estados personalizados del personal';
COMMENT ON COLUMN auth.estados_personal."esOcupado" IS 'Indica si el personal en este estado está ocupado en un turno';
COMMENT ON COLUMN auth.estados_personal."esSistema" IS 'Indica si es un estado del sistema que no se puede eliminar';
