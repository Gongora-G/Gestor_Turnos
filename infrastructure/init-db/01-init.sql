-- 🗄️ Inicialización de Base de Datos
-- Este script se ejecuta automáticamente al crear la BD

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear esquemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS scheduling;
CREATE SCHEMA IF NOT EXISTS events;

-- Comentarios de documentación
COMMENT ON SCHEMA auth IS 'Esquema para autenticación y usuarios';
COMMENT ON SCHEMA scheduling IS 'Esquema para gestión de turnos y empleados';
COMMENT ON SCHEMA events IS 'Esquema para eventos y actividades';

-- Configuración de timezone
SET timezone = 'America/Bogota';