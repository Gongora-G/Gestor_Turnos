-- Migración completa para simplificar estados de turnos
-- Fecha: 2025-10-22
-- Cambios:
-- 1. Eliminar columna precio 
-- 2. Cambiar enum de estados a solo 2 opciones: en_progreso, completado

-- Paso 1: Eliminar la columna precio si existe
ALTER TABLE auth.turnos DROP COLUMN IF EXISTS precio;

-- Paso 2: Crear nuevo tipo enum con solo 2 estados
DO $$ 
BEGIN
    -- Eliminar el tipo enum existente si existe
    DROP TYPE IF EXISTS estado_turno_enum CASCADE;
    
    -- Crear nuevo enum con solo 2 estados
    CREATE TYPE estado_turno_enum AS ENUM ('en_progreso', 'completado');
    
    -- Actualizar la columna estado para usar el nuevo enum
    -- Primero convertir los estados existentes:
    -- pendiente, confirmada -> en_progreso
    -- completada -> completado
    -- cancelada -> completado (se considera terminado)
    
    UPDATE auth.turnos 
    SET estado = 'en_progreso'::varchar 
    WHERE estado IN ('pendiente', 'confirmada');
    
    UPDATE auth.turnos 
    SET estado = 'completado'::varchar 
    WHERE estado IN ('completada', 'cancelada');
    
    -- Cambiar el tipo de la columna al nuevo enum
    ALTER TABLE auth.turnos 
    ALTER COLUMN estado TYPE estado_turno_enum USING estado::estado_turno_enum;
    
    -- Establecer valor por defecto
    ALTER TABLE auth.turnos 
    ALTER COLUMN estado SET DEFAULT 'en_progreso';
    
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Error durante la migración: %', SQLERRM;
END $$;

-- Verificar los cambios
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'turnos' 
  AND table_schema = 'auth'
  AND column_name IN ('estado', 'precio');

-- Mostrar distribución de estados después de la migración
SELECT estado, COUNT(*) as cantidad 
FROM auth.turnos 
GROUP BY estado;