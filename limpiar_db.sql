-- Limpiar todas las tablas
DELETE FROM auth.turnos;
DELETE FROM auth.socios;
DELETE FROM auth.canchas;
DELETE FROM auth.tipos_membresia;
DELETE FROM auth.configuracion_club;
DELETE FROM auth.users;
DELETE FROM auth.clubs;

-- Insertar club de prueba
INSERT INTO auth.clubs (id, name, address, city, country, \"totalCourts\", \"contactEmail\", \"contactPhone\", status, \"monthlyFee\", \"createdAt\", \"updatedAt\") 
VALUES ('11111111-1111-1111-1111-111111111111', 'Club Test', 'Calle Test 123', 'Medellín', 'Colombia', 5, 'test@club.com', '1234567890', 'active', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insertar usuarios de prueba
INSERT INTO auth.users (id, email, password, \"firstName\", \"lastName\", phone, role, \"clubId\", status, \"createdAt\", \"updatedAt\") VALUES
('22222222-2222-2222-2222-222222222222', 'admin@testclub.com', '\\\.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Test', '1234567890', 'caddie_master', '11111111-1111-1111-1111-111111111111', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('33333333-3333-3333-3333-333333333333', 'profesor@testclub.com', '\\\.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Profesor', 'Tenis', '1234567891', 'profesor', '11111111-1111-1111-1111-111111111111', 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Crear 5 canchas automáticamente para el club
INSERT INTO auth.canchas (id, nombre, ubicacion, capacidad, activa, tipo, \"clubId\", \"createdAt\", \"updatedAt\") VALUES
('44444444-4444-4444-4444-444444444444', 'Cancha 1', 'Sector 1', 4, true, 'tenis', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('55555555-5555-5555-5555-555555555555', 'Cancha 2', 'Sector 2', 4, true, 'tenis', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('66666666-6666-6666-6666-666666666666', 'Cancha 3', 'Sector 3', 4, true, 'tenis', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('77777777-7777-7777-7777-777777777777', 'Cancha 4', 'Sector 4', 4, true, 'tenis', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('88888888-8888-8888-8888-888888888888', 'Cancha 5', 'Sector 5', 4, true, 'tenis', '11111111-1111-1111-1111-111111111111', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
