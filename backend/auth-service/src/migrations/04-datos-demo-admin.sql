-- Script para completar datos de demostración para admin@testclub.com
-- Fecha: 24 de octubre de 2025

-- 1. Obtener el club_id del usuario admin@testclub.com
-- (Necesitamos esto para asociar los datos)

-- Primero, vamos a insertar algunas canchas
INSERT INTO auth.canchas (
    id, 
    nombre, 
    ubicacion, 
    descripcion, 
    capacidad, 
    activa, 
    tipo, 
    precio_hora, 
    club_id,
    created_at,
    updated_at
) VALUES 
-- Cancha 1
(
    gen_random_uuid(),
    'Cancha Central 1',
    'Sector Norte',
    'Cancha principal con césped sintético',
    4,
    true,
    'tenis',
    25000,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Cancha 2
(
    gen_random_uuid(),
    'Cancha Central 2',
    'Sector Norte',
    'Cancha secundaria con césped natural',
    4,
    true,
    'tenis',
    20000,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Cancha 3
(
    gen_random_uuid(),
    'Cancha VIP',
    'Sector Premium',
    'Cancha premium con todas las comodidades',
    4,
    true,
    'tenis',
    35000,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Cancha 4
(
    gen_random_uuid(),
    'Cancha Práctica',
    'Sector Sur',
    'Cancha para entrenamientos y práctica',
    2,
    true,
    'tenis',
    15000,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. Insertar tipos de membresía
INSERT INTO auth.tipos_membresia (
    id,
    nombre,
    descripcion,
    precio_mensual,
    beneficios,
    duracion_meses,
    activo,
    club_id,
    created_at,
    updated_at
) VALUES
-- Membresía Básica
(
    gen_random_uuid(),
    'Membresía Básica',
    'Acceso básico a las instalaciones',
    50000,
    '["Acceso a canchas básicas", "Uso de vestuarios", "1 invitado por mes"]',
    12,
    true,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Membresía Premium
(
    gen_random_uuid(),
    'Membresía Premium',
    'Acceso completo con beneficios adicionales',
    80000,
    '["Acceso a todas las canchas", "Uso de vestuarios premium", "3 invitados por mes", "Descuentos en eventos"]',
    12,
    true,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Membresía VIP
(
    gen_random_uuid(),
    'Membresía VIP',
    'Acceso exclusivo y servicios premium',
    120000,
    '["Acceso ilimitado", "Cancha VIP incluida", "Invitados ilimitados", "Servicios de caddie", "Eventos exclusivos"]',
    12,
    true,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 3. Insertar algunos socios de ejemplo
INSERT INTO auth.socios (
    id,
    nombre,
    apellido,
    email,
    telefono,
    tipo_documento,
    numero_documento,
    fecha_nacimiento,
    direccion,
    ciudad,
    tipo_membresia_id,
    fecha_inicio_membresia,
    fecha_fin_membresia,
    estado,
    observaciones,
    club_id,
    created_at,
    updated_at
) VALUES
-- Socio 1
(
    gen_random_uuid(),
    'Carlos',
    'Rodriguez',
    'carlos.rodriguez@email.com',
    '+57 300 123 4567',
    'cedula',
    '12345678',
    '1985-03-15',
    'Calle 123 #45-67',
    'Bogotá',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía Premium' LIMIT 1),
    CURRENT_DATE - INTERVAL '2 months',
    CURRENT_DATE + INTERVAL '10 months',
    'activo',
    'Socio fundador, excelente jugador',
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Socio 2
(
    gen_random_uuid(),
    'Ana',
    'Martinez',
    'ana.martinez@email.com',
    '+57 310 987 6543',
    'cedula',
    '87654321',
    '1990-07-22',
    'Carrera 456 #78-90',
    'Medellín',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía VIP' LIMIT 1),
    CURRENT_DATE - INTERVAL '1 month',
    CURRENT_DATE + INTERVAL '11 months',
    'activo',
    'Jugadora profesional, participante en torneos',
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Socio 3
(
    gen_random_uuid(),
    'Luis',
    'Hernández',
    'luis.hernandez@email.com',
    '+57 320 555 1234',
    'cedula',
    '11223344',
    '1982-11-08',
    'Avenida 789 #12-34',
    'Cali',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía Básica' LIMIT 1),
    CURRENT_DATE - INTERVAL '3 months',
    CURRENT_DATE + INTERVAL '9 months',
    'activo',
    'Socio regular, juega los fines de semana',
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
),
-- Socio 4
(
    gen_random_uuid(),
    'Patricia',
    'Gómez',
    'patricia.gomez@email.com',
    '+57 315 444 7777',
    'cedula',
    '99887766',
    '1988-05-17',
    'Transversal 321 #56-78',
    'Barranquilla',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía Premium' LIMIT 1),
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '6 months',
    'activo',
    'Instructora de tenis, muy activa en el club',
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 4. Insertar configuración del club (si no existe)
INSERT INTO auth.configuracion_club (
    id,
    club_id,
    nombre_club,
    direccion,
    telefono,
    email,
    hora_apertura,
    hora_cierre,
    dias_operacion,
    precio_base_hora,
    moneda,
    zona_horaria,
    configuraciones_adicionales,
    activo,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    'Club de Tenis Los Pinos',
    'Avenida Principal 123, Zona Norte',
    '+57 1 234 5678',
    'info@clubtenislospinos.com',
    '06:00:00',
    '22:00:00',
    '["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]',
    20000,
    'COP',
    'America/Bogota',
    '{"reserva_anticipada_dias": 7, "cancelacion_horas": 2, "descuento_socios": 10}',
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (club_id) DO UPDATE SET
    nombre_club = EXCLUDED.nombre_club,
    direccion = EXCLUDED.direccion,
    telefono = EXCLUDED.telefono,
    email = EXCLUDED.email,
    hora_apertura = EXCLUDED.hora_apertura,
    hora_cierre = EXCLUDED.hora_cierre,
    updated_at = CURRENT_TIMESTAMP;

-- 5. Mostrar resumen de lo que se insertó
SELECT 
    'Canchas creadas' as tipo,
    COUNT(*) as cantidad
FROM auth.canchas 
WHERE club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com')

UNION ALL

SELECT 
    'Tipos de membresía creados' as tipo,
    COUNT(*) as cantidad
FROM auth.tipos_membresia 
WHERE club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com')

UNION ALL

SELECT 
    'Socios creados' as tipo,
    COUNT(*) as cantidad
FROM auth.socios 
WHERE club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com');

-- Mostrar información del club
SELECT 
    u.email as usuario,
    c.name as nombre_club,
    COUNT(DISTINCT ca.id) as total_canchas,
    COUNT(DISTINCT s.id) as total_socios,
    COUNT(DISTINCT tm.id) as tipos_membresia
FROM auth.users u
LEFT JOIN auth.clubs c ON c.id = u."clubId"
LEFT JOIN auth.canchas ca ON ca.club_id = u."clubId"
LEFT JOIN auth.socios s ON s.club_id = u."clubId"
LEFT JOIN auth.tipos_membresia tm ON tm.club_id = u."clubId"
WHERE u.email = 'admin@testclub.com'
GROUP BY u.email, c.name;