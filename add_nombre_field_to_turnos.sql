-- Migración: Agregar campo 'nombre' y sistema de numeración diaria a turnos
-- Fecha: 2025-10-23
-- Sistema para club de tenis con numeración secuencial por día

-- Agregar las columnas necesarias
ALTER TABLE auth.turnos 
ADD COLUMN IF NOT EXISTS nombre VARCHAR(255) NOT NULL DEFAULT 'Turno - 001';

ALTER TABLE auth.turnos 
ADD COLUMN IF NOT EXISTS numero_turno_dia INTEGER NOT NULL DEFAULT 1;

-- Función para generar el siguiente número de turno del día
CREATE OR REPLACE FUNCTION generar_numero_turno_dia(fecha_turno DATE, club_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
    siguiente_numero INTEGER;
BEGIN
    SELECT COALESCE(MAX(numero_turno_dia), 0) + 1
    INTO siguiente_numero
    FROM auth.turnos
    WHERE fecha = fecha_turno AND club_id = club_id_param;
    
    RETURN siguiente_numero;
END;
$$ LANGUAGE plpgsql;

-- Actualizar los turnos existentes con numeración correlativa por día
WITH turnos_numerados AS (
    SELECT 
        id,
        fecha,
        club_id,
        ROW_NUMBER() OVER (PARTITION BY fecha, club_id ORDER BY created_at) as nuevo_numero
    FROM auth.turnos
)
UPDATE auth.turnos 
SET 
    numero_turno_dia = turnos_numerados.nuevo_numero,
    nombre = 'Turno - ' || LPAD(turnos_numerados.nuevo_numero::text, 3, '0')
FROM turnos_numerados 
WHERE auth.turnos.id = turnos_numerados.id;

-- Verificar los cambios
SELECT 
    fecha, 
    nombre, 
    numero_turno_dia,
    hora_inicio, 
    hora_fin, 
    estado,
    created_at
FROM auth.turnos 
ORDER BY fecha DESC, numero_turno_dia ASC
LIMIT 15;