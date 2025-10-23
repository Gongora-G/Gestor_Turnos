-- Migración para eliminar la columna precio de la tabla turnos
-- Fecha: 2025-10-22
-- Motivo: El campo precio ya no es necesario en el sistema

-- Eliminar la columna precio de la tabla turnos
ALTER TABLE auth.turnos DROP COLUMN IF EXISTS precio;

-- Verificar que la columna se eliminó correctamente
-- SELECT column_name FROM information_schema.columns 
-- WHERE table_name = 'turnos' AND table_schema = 'auth';