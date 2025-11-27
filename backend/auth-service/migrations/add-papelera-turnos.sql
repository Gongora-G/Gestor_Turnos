-- Agregar columnas para funcionalidad de papelera en turnos
-- Fecha: 2025-11-25
-- Descripción: Implementar soft delete con papelera para turnos

-- Agregar columnas de soft delete
ALTER TABLE auth.turnos 
ADD COLUMN IF NOT EXISTS eliminado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "fechaEliminacion" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "eliminadoPor" UUID;

-- Agregar comentarios
COMMENT ON COLUMN auth.turnos.eliminado IS 'Indica si el turno está en la papelera';
COMMENT ON COLUMN auth.turnos."fechaEliminacion" IS 'Fecha en que se movió a la papelera';
COMMENT ON COLUMN auth.turnos."eliminadoPor" IS 'ID del usuario que eliminó el turno';

-- Crear índice para mejorar rendimiento de consultas de papelera
CREATE INDEX IF NOT EXISTS idx_turnos_eliminado ON auth.turnos(eliminado) WHERE eliminado = TRUE;
CREATE INDEX IF NOT EXISTS idx_turnos_fecha_eliminacion ON auth.turnos("fechaEliminacion") WHERE "fechaEliminacion" IS NOT NULL;

-- Actualizar registros existentes para que no estén eliminados
UPDATE auth.turnos 
SET eliminado = FALSE 
WHERE eliminado IS NULL;

COMMIT;

-- Verificar los cambios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'auth' 
  AND table_name = 'turnos'
  AND column_name IN ('eliminado', 'fechaEliminacion', 'eliminadoPor');
