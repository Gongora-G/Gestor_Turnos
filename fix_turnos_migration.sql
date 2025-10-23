-- Migración para corregir los estados de turnos manualmente
-- Primero actualizar los datos existentes ANTES de cambiar el enum

-- Actualizar registros existentes para mapear a los nuevos estados
UPDATE auth.turnos 
SET estado = 'en_progreso'
WHERE estado IN ('pendiente', 'confirmada');

UPDATE auth.turnos 
SET estado = 'completado'
WHERE estado IN ('completada', 'cancelada');

-- Eliminar columna precio si existe
ALTER TABLE auth.turnos DROP COLUMN IF EXISTS precio;

-- Ahora crear el nuevo enum con un nombre temporal
CREATE TYPE auth.turnos_estado_enum_new AS ENUM ('en_progreso', 'completado');

-- Cambiar la columna para usar el nuevo enum
ALTER TABLE auth.turnos 
ALTER COLUMN estado TYPE auth.turnos_estado_enum_new USING estado::text::auth.turnos_estado_enum_new;

-- Eliminar el enum viejo y renombrar el nuevo
DROP TYPE IF EXISTS auth.turnos_estado_enum CASCADE;
ALTER TYPE auth.turnos_estado_enum_new RENAME TO turnos_estado_enum;

-- Establecer valor por defecto
ALTER TABLE auth.turnos 
ALTER COLUMN estado SET DEFAULT 'en_progreso';

-- Verificar los cambios
SELECT estado, COUNT(*) as cantidad 
FROM auth.turnos 
GROUP BY estado;