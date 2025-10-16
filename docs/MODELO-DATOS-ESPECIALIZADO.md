# 🏗️ CaddieFlow - Modelo de Datos Especializado

## 📊 **ESQUEMA DE BASE DE DATOS - PostgreSQL**

### **🏛️ TABLA: clubs**
```sql
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,           -- "Club Puerto Peñaliza"
    location VARCHAR(200),                -- "Sede Tenis"
    total_courts INTEGER NOT NULL,        -- 12 canchas
    timezone VARCHAR(50) DEFAULT 'America/Bogota',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **📅 TABLA: shifts (jornadas)**
```sql
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id),
    name VARCHAR(20) NOT NULL,            -- "A", "B", "C"
    morning_start TIME DEFAULT '06:00',   -- 6:00 AM
    morning_end TIME DEFAULT '14:00',     -- 2:00 PM  
    afternoon_start TIME DEFAULT '14:00', -- 2:00 PM
    afternoon_end TIME DEFAULT '22:00',   -- 10:00 PM
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### **👥 TABLA: users (Solo administradores)**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255),           -- bcrypt hash
    google_id VARCHAR(100),               -- OAuth Google
    full_name VARCHAR(100) NOT NULL,
    role user_role_enum NOT NULL,         -- CADDIE_MASTER, PROFESOR
    club_id INTEGER REFERENCES clubs(id),
    last_login TIMESTAMP,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE user_role_enum AS ENUM (
    'CADDIE_MASTER',
    'PROFESOR'
);
```

### **🎾 TABLA: employees (Caddies y Boleadores)**
```sql
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id),
    employee_code VARCHAR(20) UNIQUE,     -- "CAD001", "BOL001"
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    emergency_contact VARCHAR(100),
    role employee_role_enum NOT NULL,     -- CADDIE, BOLEADOR
    shift_id INTEGER REFERENCES shifts(id), -- Jornada asignada
    hire_date DATE NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_employees_club_active (club_id, active),
    INDEX idx_employees_shift (shift_id)
);

CREATE TYPE employee_role_enum AS ENUM (
    'CADDIE',
    'BOLEADOR'
);
```

### **📝 TABLA: daily_checkins (Registro de llegadas)**
```sql
CREATE TABLE daily_checkins (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    date DATE NOT NULL,                   -- 2025-10-13
    check_in_time TIMESTAMP NOT NULL,     -- 07:15:23 (timestamp automático)
    registered_by INTEGER REFERENCES users(id), -- ID del Caddie Master
    task_assigned VARCHAR(200),           -- "Barrer canchas 1-2"
    task_completed BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(employee_id, date),
    INDEX idx_checkins_date (date),
    INDEX idx_checkins_employee_date (employee_id, date)
);
```

### **⚡ TABLA: work_shifts (Turnos realizados)**
```sql
CREATE TABLE work_shifts (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    date DATE NOT NULL,
    court_number INTEGER,                 -- 1-12
    client_name VARCHAR(100),            -- "Sr. Rodríguez"
    start_time TIMESTAMP NOT NULL,       -- Inicio turno
    end_time TIMESTAMP,                  -- Fin turno
    duration_minutes INTEGER,            -- Calculado automáticamente
    earnings DECIMAL(10,2),              -- Ganancia del turno
    registered_by INTEGER REFERENCES users(id),
    status shift_status_enum DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_shifts_employee_date (employee_id, date),
    INDEX idx_shifts_date_status (date, status)
);

CREATE TYPE shift_status_enum AS ENUM (
    'ACTIVE',     -- En progreso
    'COMPLETED',  -- Finalizado
    'CANCELLED'   -- Cancelado
);
```

### **📊 TABLA: daily_priorities (Orden calculado)**
```sql
CREATE TABLE daily_priorities (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    employee_id INTEGER REFERENCES employees(id),
    priority_position INTEGER NOT NULL,  -- 1, 2, 3...
    check_in_time TIMESTAMP,
    previous_day_shifts INTEGER DEFAULT 0, -- Turnos día anterior
    previous_week_shifts INTEGER DEFAULT 0, -- Turnos semana anterior
    punctuality_score DECIMAL(3,2),      -- 0.85 = 85% puntualidad
    algorithm_version VARCHAR(10) DEFAULT '1.0',
    calculation_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(date, employee_id),
    UNIQUE(date, priority_position),
    INDEX idx_priorities_date_position (date, priority_position)
);
```

### **🔔 TABLA: notifications (Sistema de alertas)**
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type notification_type_enum NOT NULL,
    target_role user_role_enum,           -- Para quién es la notificación
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_notifications_club_read (club_id, read),
    INDEX idx_notifications_type (type)
);

CREATE TYPE notification_type_enum AS ENUM (
    'SYSTEM',
    'SHIFT_COMPLETED', 
    'EMPLOYEE_LATE',
    'DAILY_REPORT',
    'PRIORITY_UPDATED'
);
```

### **📈 TABLA: club_statistics (Reportes y analytics)**
```sql
CREATE TABLE club_statistics (
    id SERIAL PRIMARY KEY,
    club_id INTEGER REFERENCES clubs(id),
    date DATE NOT NULL,
    total_employees INTEGER,
    total_checkins INTEGER,
    total_shifts INTEGER,
    total_earnings DECIMAL(12,2),
    average_punctuality DECIMAL(5,2),
    most_active_employee_id INTEGER REFERENCES employees(id),
    report_data JSONB,                    -- Datos adicionales flexibles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(club_id, date),
    INDEX idx_statistics_club_date (club_id, date)
);
```

---

## 🔗 **RELACIONES CLAVE**

### **Flujo de Datos Principal:**
```
1. clubs (1) ←→ (N) employees
2. employees (1) ←→ (N) daily_checkins  
3. employees (1) ←→ (N) work_shifts
4. daily_checkins → daily_priorities (calculado)
5. work_shifts → club_statistics (agregado)
```

### **Consultas Críticas Optimizadas:**

**1. Orden del día:**
```sql
SELECT e.full_name, dp.priority_position, dc.check_in_time, 
       dp.previous_day_shifts
FROM daily_priorities dp
JOIN employees e ON dp.employee_id = e.id  
JOIN daily_checkins dc ON dp.employee_id = dc.employee_id 
    AND dp.date = dc.date
WHERE dp.date = CURRENT_DATE 
  AND e.club_id = ?
ORDER BY dp.priority_position;
```

**2. Turnos activos:**
```sql
SELECT ws.*, e.full_name, e.employee_code
FROM work_shifts ws
JOIN employees e ON ws.employee_id = e.id
WHERE ws.date = CURRENT_DATE 
  AND ws.status = 'ACTIVE'
  AND e.club_id = ?
ORDER BY ws.start_time DESC;
```

**3. Estadísticas empleado:**
```sql
SELECT 
    COUNT(*) as total_shifts,
    AVG(duration_minutes) as avg_duration,
    SUM(earnings) as total_earnings
FROM work_shifts 
WHERE employee_id = ? 
  AND date >= CURRENT_DATE - INTERVAL '7 days';
```

---

## 🎯 **ALGORITMO DE PRIORIDADES**

### **Fórmula de Cálculo:**
```
Priority Score = (Punctuality Weight × Punctuality Score) 
                + (Previous Shifts Weight × Inverse Shifts Score)
                + (Attendance Weight × Attendance Score)

Donde:
- Punctuality Score = 1.0 - (minutes_late / 60)
- Inverse Shifts Score = 1 / (1 + previous_day_shifts)  
- Attendance Score = days_worked_this_week / 7
```

### **Implementación en PostgreSQL:**
```sql
-- Función para calcular prioridades diarias
CREATE OR REPLACE FUNCTION calculate_daily_priorities(target_date DATE, club_id INTEGER)
RETURNS TABLE(employee_id INTEGER, priority_position INTEGER) AS $$
BEGIN
    RETURN QUERY
    WITH priority_calc AS (
        SELECT 
            e.id as employee_id,
            -- Puntualidad (más peso = mejor posición)
            GREATEST(0, 1.0 - (EXTRACT(EPOCH FROM (dc.check_in_time - (target_date + '06:00'::time))) / 3600.0)) * 0.4 as punctuality_score,
            -- Turnos previos (menos turnos = mejor posición) 
            (1.0 / (1.0 + COALESCE(prev_shifts.count, 0))) * 0.6 as shifts_score,
            -- Score total
            (GREATEST(0, 1.0 - (EXTRACT(EPOCH FROM (dc.check_in_time - (target_date + '06:00'::time))) / 3600.0)) * 0.4) +
            ((1.0 / (1.0 + COALESCE(prev_shifts.count, 0))) * 0.6) as total_score
        FROM employees e
        JOIN daily_checkins dc ON e.id = dc.employee_id AND dc.date = target_date
        LEFT JOIN (
            SELECT employee_id, COUNT(*) as count
            FROM work_shifts  
            WHERE date = target_date - INTERVAL '1 day'
            GROUP BY employee_id
        ) prev_shifts ON e.id = prev_shifts.employee_id
        WHERE e.club_id = club_id AND e.active = true
    )
    SELECT 
        pc.employee_id,
        ROW_NUMBER() OVER (ORDER BY pc.total_score DESC) as priority_position
    FROM priority_calc pc;
END;
$$ LANGUAGE plpgsql;
```

Este modelo de datos está completamente especializado para el contexto real de gestión de caddies en clubes de tenis y soporta perfectamente el flujo operacional que definimos. 

**¿Continuamos con la actualización del sistema de roles en el auth-service?** 🚀