-- Corregir la configuración final de la columna estado

-- Actualizar los valores NULL a 'en_progreso'
UPDATE auth.turnos 
SET estado = 'en_progreso' 
WHERE estado IS NULL;

-- Hacer la columna NOT NULL
ALTER TABLE auth.turnos 
ALTER COLUMN estado SET NOT NULL;

-- Renombrar el tipo de enum si es necesario
DO $$ 
BEGIN
    -- Verificar si existe el tipo con el nombre incorrecto
    IF EXISTS (SELECT 1 FROM pg_type t JOIN pg_namespace n ON t.typnamespace = n.oid 
               WHERE n.nspname = 'auth' AND t.typname = 'turnos_estado_enum_final') THEN
        -- Renombrar el tipo
        ALTER TYPE auth.turnos_estado_enum_final RENAME TO turnos_estado_enum_correcto;
    END IF;
END $$;

-- Verificar el resultado final
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'turnos' 
  AND table_schema = 'auth'
  AND column_name = 'estado';

-- Verificar los datos
SELECT estado, COUNT(*) as cantidad 
FROM auth.turnos 
GROUP BY estado;

-- Verificar los tipos enum disponibles
SELECT t.typname, n.nspname
FROM pg_type t 
JOIN pg_namespace n ON t.typnamespace = n.oid 
WHERE n.nspname = 'auth' AND t.typname LIKE '%estado%';