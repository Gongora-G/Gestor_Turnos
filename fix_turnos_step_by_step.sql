-- Migración step by step más cuidadosa

-- Paso 1: Ver el estado actual
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'turnos' 
  AND table_schema = 'auth';

-- Paso 2: Ver los enum values actuales
SELECT enumlabel 
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'auth' AND t.typname = 'turnos_estado_enum';

-- Paso 3: Agregar la nueva columna temporal
ALTER TABLE auth.turnos ADD COLUMN estado_new VARCHAR(20);

-- Paso 4: Poblar la nueva columna con los valores mapeados
UPDATE auth.turnos 
SET estado_new = CASE 
    WHEN estado = 'pendiente' OR estado = 'confirmada' THEN 'en_progreso'
    WHEN estado = 'completada' OR estado = 'cancelada' THEN 'completado'
    ELSE 'en_progreso'
END;

-- Paso 5: Eliminar la columna estado vieja
ALTER TABLE auth.turnos DROP COLUMN estado;

-- Paso 6: Crear el nuevo enum
DROP TYPE IF EXISTS auth.turnos_estado_enum_final CASCADE;
CREATE TYPE auth.turnos_estado_enum_final AS ENUM ('en_progreso', 'completado');

-- Paso 7: Cambiar la columna temporal al nuevo enum
ALTER TABLE auth.turnos 
ALTER COLUMN estado_new TYPE auth.turnos_estado_enum_final USING estado_new::auth.turnos_estado_enum_final;

-- Paso 8: Renombrar la columna
ALTER TABLE auth.turnos RENAME COLUMN estado_new TO estado;

-- Paso 9: Establecer el default
ALTER TABLE auth.turnos ALTER COLUMN estado SET DEFAULT 'en_progreso';

-- Paso 10: Renombrar el tipo
ALTER TYPE auth.turnos_estado_enum_final RENAME TO turnos_estado_enum;

-- Verificación final
SELECT estado, COUNT(*) as cantidad 
FROM auth.turnos 
GROUP BY estado;