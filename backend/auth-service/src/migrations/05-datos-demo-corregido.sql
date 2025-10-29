-- Script CORREGIDO para completar datos de demostración para admin@testclub.com
-- Fecha: 24 de octubre de 2025

-- 1. Insertar tipos de membresía (con nombres de columnas correctos)
INSERT INTO auth.tipos_membresia (
    id,
    nombre,
    descripcion,
    precio,
    color,
    activo,
    club_id,
    created_at,
    updated_at
) VALUES
-- Membresía Básica
(
    gen_random_uuid(),
    'Membresía Básica',
    'Acceso básico a las instalaciones del club',
    50000.00,
    '#10b981',
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
    80000.00,
    '#3b82f6',
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
    120000.00,
    '#8b5cf6',
    true,
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 2. Insertar algunos socios de ejemplo (con nombres de columnas correctos)
INSERT INTO auth.socios (
    id,
    nombre,
    apellido,
    email,
    telefono,
    documento,
    tipo_documento,
    fecha_nacimiento,
    direccion,
    tipo_membresia_id,
    fecha_inicio_membresia,
    fecha_vencimiento,
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
    '12345678',
    'cedula',
    '1985-03-15',
    'Calle 123 #45-67, Bogotá',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía Premium' AND club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com') LIMIT 1),
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
    '87654321',
    'cedula',
    '1990-07-22',
    'Carrera 456 #78-90, Medellín',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía VIP' AND club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com') LIMIT 1),
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
    '11223344',
    'cedula',
    '1982-11-08',
    'Avenida 789 #12-34, Cali',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía Básica' AND club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com') LIMIT 1),
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
    '99887766',
    'cedula',
    '1988-05-17',
    'Transversal 321 #56-78, Barranquilla',
    (SELECT id FROM auth.tipos_membresia WHERE nombre = 'Membresía Premium' AND club_id = (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com') LIMIT 1),
    CURRENT_DATE - INTERVAL '6 months',
    CURRENT_DATE + INTERVAL '6 months',
    'activo',
    'Instructora de tenis, muy activa en el club',
    (SELECT "clubId" FROM auth.users WHERE email = 'admin@testclub.com'),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- 3. Mostrar resumen de lo que se insertó
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

-- Mostrar información completa del club
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