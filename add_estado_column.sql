-- Agregar la columna estado con el enum correcto

-- Verificar que el enum existe
SELECT enumlabel 
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE n.nspname = 'auth' AND t.typname = 'turnos_estado_enum';

-- Agregar la columna estado con el enum correcto y valor por defecto
ALTER TABLE auth.turnos 
ADD COLUMN estado auth.turnos_estado_enum DEFAULT 'en_progreso' NOT NULL;

-- Verificar la estructura final
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