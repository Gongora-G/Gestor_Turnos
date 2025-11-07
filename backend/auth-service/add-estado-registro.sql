-- Agregar enum para estado_registro
CREATE TYPE auth.estado_registro AS ENUM ('ACTIVO', 'GUARDADO');

-- Agregar columna estado_registro a la tabla turnos
ALTER TABLE auth.turnos 
ADD COLUMN estado_registro auth.estado_registro DEFAULT 'ACTIVO';

-- Actualizar turnos existentes para que sean ACTIVO por defecto
UPDATE auth.turnos 
SET estado_registro = 'ACTIVO' 
WHERE estado_registro IS NULL;