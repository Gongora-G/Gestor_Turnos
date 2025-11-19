-- Crear tabla de tareas predefinidas
CREATE TABLE IF NOT EXISTS auth.tareas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(50),
    tiempo_estimado INTEGER, -- en minutos
    prioridad VARCHAR(20), -- alta, media, baja
    activa BOOLEAN DEFAULT TRUE,
    club_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de tareas asignadas a registros de asistencia
CREATE TABLE IF NOT EXISTS auth.tareas_asignadas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registro_asistencia_id UUID NOT NULL REFERENCES auth.registro_asistencia(id) ON DELETE CASCADE,
    tarea_id INTEGER NOT NULL REFERENCES auth.tareas(id) ON DELETE CASCADE,
    completada BOOLEAN DEFAULT FALSE,
    hora_completada TIMESTAMP,
    notas TEXT,
    club_id UUID NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_tareas_club ON auth.tareas(club_id);
CREATE INDEX IF NOT EXISTS idx_tareas_activa ON auth.tareas(activa);
CREATE INDEX IF NOT EXISTS idx_tareas_asignadas_registro ON auth.tareas_asignadas(registro_asistencia_id);
CREATE INDEX IF NOT EXISTS idx_tareas_asignadas_club ON auth.tareas_asignadas(club_id);
CREATE INDEX IF NOT EXISTS idx_tareas_asignadas_completada ON auth.tareas_asignadas(completada);

-- Insertar tareas de ejemplo (ajustar según el club)
INSERT INTO auth.tareas (nombre, descripcion, categoria, tiempo_estimado, prioridad, club_id)
SELECT 
    'Limpiar pista 1', 
    'Barrer y limpiar la pista número 1', 
    'Limpieza',
    30,
    'alta',
    club_id
FROM auth.clubs
WHERE name = 'TestClub'
ON CONFLICT DO NOTHING;

INSERT INTO auth.tareas (nombre, descripcion, categoria, tiempo_estimado, prioridad, club_id)
SELECT 
    'Regar canchas', 
    'Regar todas las canchas del club', 
    'Mantenimiento',
    45,
    'media',
    club_id
FROM auth.clubs
WHERE name = 'TestClub'
ON CONFLICT DO NOTHING;

INSERT INTO auth.tareas (nombre, descripcion, categoria, tiempo_estimado, prioridad, club_id)
SELECT 
    'Revisar equipamiento', 
    'Verificar estado de redes, pelotas y equipamiento', 
    'Mantenimiento',
    20,
    'media',
    club_id
FROM auth.clubs
WHERE name = 'TestClub'
ON CONFLICT DO NOTHING;

INSERT INTO auth.tareas (nombre, descripcion, categoria, tiempo_estimado, prioridad, club_id)
SELECT 
    'Atención al público', 
    'Atender consultas y solicitudes de socios', 
    'Servicio',
    60,
    'alta',
    club_id
FROM auth.clubs
WHERE name = 'TestClub'
ON CONFLICT DO NOTHING;

COMMENT ON TABLE auth.tareas IS 'Tareas predefinidas del club que pueden asignarse al personal';
COMMENT ON TABLE auth.tareas_asignadas IS 'Tareas asignadas a cada registro de asistencia del personal';
