-- Corregir definitivamente el problema del enum
-- Eliminar todos los enums relacionados con turnos y recrear uno limpio

-- Paso 1: Cambiar temporalmente la columna a VARCHAR
ALTER TABLE auth.turnos ALTER COLUMN estado TYPE VARCHAR(20);

-- Paso 2: Eliminar todos los tipos enum relacionados con turnos
DROP TYPE IF EXISTS auth.turnos_estado_enum CASCADE;
DROP TYPE IF EXISTS auth.turnos_estado_enum_correcto CASCADE;
DROP TYPE IF EXISTS auth.turnos_estado_enum_final CASCADE;
DROP TYPE IF EXISTS auth.turnos_estado_enum_new CASCADE;
DROP TYPE IF EXISTS auth.turnos_estado_enum_old CASCADE;
DROP TYPE IF EXISTS auth.turnos_estado_enum_correcto_old CASCADE;

-- Paso 3: Crear el enum con el nombre exacto que espera TypeORM
CREATE TYPE auth.turnos_estado_enum AS ENUM ('en_progreso', 'completado');

-- Paso 4: Cambiar la columna para usar el nuevo enum
ALTER TABLE auth.turnos 
ALTER COLUMN estado TYPE auth.turnos_estado_enum USING estado::auth.turnos_estado_enum;

-- Paso 5: Establecer el default
ALTER TABLE auth.turnos ALTER COLUMN estado SET DEFAULT 'en_progreso';

-- Verificación final
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'turnos' 
  AND table_schema = 'auth'
  AND column_name = 'estado';

SELECT estado, COUNT(*) as cantidad 
FROM auth.turnos 
GROUP BY estado;