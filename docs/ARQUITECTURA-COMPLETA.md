# 🎾 CaddieFlow - ARQUITECTURA COMPLETA

## 🎯 **PROBLEMÁTICA REAL - CLUB PUERTO PEÑALIZA**

### **🏆 Contexto Específico:**
- **30 Caddies + 8 Boleadores** en sede de tenis
- **12 canchas** de tenis disponibles  
- **2 jornadas rotativas (A y B)**: mañana/tarde alternado
- **Caddie Master + Profesor** coordinan operación diaria

### **⚠️ Problema Crítico Identificado:**
**Los caddies mienten sobre cantidad de turnos realizados el día anterior para mejorar su posición en el orden de prioridad**

**Proceso Manual Actual (PROBLEMÁTICO):**
1. Caddie Master pregunta: *"¿Cuántos turnos hiciste ayer?"*
2. Caddie responde: *"Solo 2"* (cuando realmente hizo 6)
3. Caddie Master anota en papel sin verificación
4. Caddie obtiene mejor posición injustamente

### **💡 Solución Tecnológica:**
**Eliminar auto-reporte** → **Registro automático** → **Transparencia total**

---

## 👥 **USUARIOS DEL SISTEMA**

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **🔧 Super Admin** | Desarrollador | Acceso total, configuración sistema |
| **🏆 Caddie Master** | Gestiona empleados y turnos | CRUD empleados, asignar turnos, reportes |
| **🎾 Profesor** | Apoyo en gestión | Ver turnos, asignar empleados |
| **👤 Caddie** | Empleado de campo | Registrar asistencia |
| **🎯 Boleador** | Empleado especializado | Registrar asistencia |

---

## 🏗️ **ARQUITECTURA DE MICROSERVICIOS**

### **🔐 AUTH-SERVICE** (Puerto 3002) ✅ Implementado
**Responsabilidades:**
- Autenticación tradicional (email/password)
- OAuth Google diferenciado (login/registro)
- Gestión de roles y permisos
- JWT token management
- Validación de sesiones

**Tecnologías:** NestJS + PostgreSQL + JWT + Google OAuth

### **🎯 SCHEDULING-SERVICE** (Puerto 3003) 🔄 Por implementar
**Responsabilidades:**
- Gestión de empleados (caddies/boleadores)
- Registro de asistencia diaria
- Asignación de turnos en tiempo real
- Cálculo automático de prioridades
- Gestión de las 12 canchas

**Entidades principales:**
```typescript
Employee {
  id, clubId, name, phone, 
  type: 'caddie'|'boleador',
  jornada: 'A'|'B'|'C',
  isActive: boolean
}

WorkShift {
  id, employeeId, cancha: 1-12,
  socioName: string,
  horaInicio, horaFin,
  status: 'asignado'|'en_progreso'|'completado'
}

Attendance {
  id, employeeId, date, jornada,
  horaLlegada, turnosAyer, 
  prioridad: number
}
```

### **📊 REPORTING-SERVICE** (Puerto 3004) 📅 Por implementar
**Responsabilidades:**
- Reportes diarios de turnos
- Lista de prioridades para siguiente jornada
- Analytics de rendimiento por empleado
- Estadísticas por jornada y cancha
- Exportación PDF/Excel

### **🔔 NOTIFICATIONS-SERVICE** (Puerto 3005) 📅 Por implementar
**Responsabilidades:**
- Notificaciones en tiempo real
- Recordatorios de turnos
- Alertas de tareas pendientes
- Comunicación entre roles

### **⚡ EVENTS-SERVICE** (Puerto 3006) 📅 Por implementar
**Responsabilidades:**
- Event-driven architecture
- Procesamiento de eventos: turno_iniciado, turno_completado
- Integración entre microservicios
- Auditoria de acciones

---

## 🌐 **FRONTEND (React + TypeScript)**

### **📱 Páginas Implementadas** ✅
- **LoginPage:** Autenticación tradicional + Google OAuth
- **RegisterPage:** Registro de usuarios del sistema
- **DashboardPage:** Panel principal (con datos mock)
- **TermsOfServicePage:** Términos legales
- **PrivacyPolicyPage:** Política de privacidad

### **📱 Páginas Por Implementar** 🔄
- **EmployeesPage:** CRUD de caddies y boleadores
- **AttendancePage:** Registro de asistencia diaria
- **WorkShiftsPage:** Gestión de turnos en tiempo real  
- **TasksPage:** Asignación de tareas (barrer canchas, etc.)
- **ReportsPage:** Visualización de reportes y analytics
- **SettingsPage:** Configuración de jornadas y canchas

### **🎯 Funcionalidades por Rol:**

**🏆 Caddie Master:**
- Dashboard con resumen diario
- Lista de asistencia con hora real
- Consultar turnos del día anterior
- Asignar turnos cancha por cancha
- Asignar tareas específicas
- Generar reportes de jornada

**🎾 Profesor:**
- Ver turnos activos
- Asignar empleados disponibles
- Consultar estadísticas básicas

**👤 Empleados (Caddie/Boleador):**
- Registrar hora de llegada
- Ver turnos asignados
- Marcar tareas como completadas

---

## 🗄️ **BASE DE DATOS (PostgreSQL)**

### **Schema: `auth`**
```sql
users (
  id UUID PRIMARY KEY,
  clubId UUID,
  email VARCHAR UNIQUE,
  firstName VARCHAR,
  lastName VARCHAR,
  phone VARCHAR,
  role VARCHAR CHECK (role IN ('super_admin', 'caddie_master', 'profesor', 'caddie', 'boleador')),
  jornada VARCHAR CHECK (jornada IN ('A', 'B', 'C')),
  googleId VARCHAR,
  isActive BOOLEAN,
  createdAt TIMESTAMP
);
```

### **Schema: `scheduling`**
```sql
-- Configuración del club
clubs (
  id UUID PRIMARY KEY,
  name VARCHAR,
  totalCanchas INTEGER,
  jornadasActivas VARCHAR[],
  horarios JSONB,
  settings JSONB,
  isActive BOOLEAN
);

-- Empleados
employees (
  id UUID PRIMARY KEY,
  clubId UUID REFERENCES clubs(id),
  name VARCHAR,
  phone VARCHAR,
  type VARCHAR CHECK (type IN ('caddie', 'boleador')),
  jornada VARCHAR CHECK (jornada IN ('A', 'B', 'C')),
  isActive BOOLEAN,
  createdAt TIMESTAMP
);

-- Asistencia diaria
attendance (
  id UUID PRIMARY KEY,
  employeeId UUID REFERENCES employees(id),
  date DATE,
  jornada VARCHAR,
  horaLlegada TIME,
  turnosAyer INTEGER,
  prioridad DECIMAL,
  status VARCHAR CHECK (status IN ('presente', 'ausente')),
  createdAt TIMESTAMP
);

-- Turnos de trabajo
work_shifts (
  id UUID PRIMARY KEY,
  employeeId UUID REFERENCES employees(id),
  cancha INTEGER CHECK (cancha >= 1 AND cancha <= 12),
  socioName VARCHAR,
  date DATE,
  horaInicio TIME,
  horaFin TIME,
  duracionHoras DECIMAL,
  status VARCHAR CHECK (status IN ('asignado', 'en_progreso', 'completado', 'cancelado')),
  createdAt TIMESTAMP
);

-- Tareas asignadas
tasks (
  id UUID PRIMARY KEY,
  employeeId UUID REFERENCES employees(id),
  date DATE,
  jornada VARCHAR,
  descripcion TEXT,
  canchasAsignadas INTEGER[],
  status VARCHAR CHECK (status IN ('pendiente', 'en_progreso', 'completada')),
  createdAt TIMESTAMP
);
```

---

## ⚡ **ALGORITMO DE PRIORIDADES**

### **Fórmula:**
```typescript
// Menos turnos ayer = mayor prioridad
// Llegada temprano = mayor prioridad
const calcularPrioridad = (turnosAyer: number, horaLlegada: string) => {
  const maxTurnos = 10; // Máximo histórico del club
  const [hora, minutos] = horaLlegada.split(':').map(Number);
  const horaDecimal = hora + (minutos / 60);
  
  // Prioridad base por turnos (más peso)
  const prioridadTurnos = (maxTurnos - turnosAyer) * 100;
  
  // Bonificación por llegada temprana (menos peso)
  const prioridadHorario = Math.max(0, (8 - horaDecimal) * 10);
  
  return prioridadTurnos + prioridadHorario;
};

// Ejemplos:
// Juan: 2 turnos ayer, llegó 6:00 AM → (10-2)*100 + (8-6)*10 = 820
// Pedro: 5 turnos ayer, llegó 6:30 AM → (10-5)*100 + (8-6.5)*10 = 515
// Juan va PRIMERO
```

---

## 🔄 **FLUJO OPERACIONAL DIARIO**

### **🌅 INICIO DE JORNADA (6:00 AM)**
1. **Empleados llegan** → Sistema registra hora exacta
2. **Caddie Master consulta** turnos de ayer → Datos reales del sistema
3. **Sistema calcula** prioridades automáticamente
4. **Se genera** lista ordenada para el día
5. **Se asignan** tareas específicas (barrer canchas X-Y)

### **⚡ DURANTE EL DÍA**
1. **Llega socio** → Caddie Master asigna empleado disponible
2. **Sistema registra:** Empleado + Cancha + Socio + Hora inicio
3. **Turno activo** → Status "en_progreso"
4. **Socio termina** → Sistema registra hora fin automática
5. **Turno completado** → Actualiza contador del empleado

### **🌙 FIN DE JORNADA**
1. **Reporte automático** de turnos del día
2. **Preparación datos** para siguiente jornada
3. **Cálculo prioridades** para mañana siguiente
4. **Archivado** de información diaria

---

## 📊 **REPORTES Y ANALYTICS**

### **📈 Reporte Diario:**
- Lista de prioridades para mañana
- Turnos realizados por empleado
- Horas trabajadas por empleado
- Tareas completadas/pendientes
- Ocupación por cancha

### **📅 Reporte Semanal:**
- Promedio turnos por empleado
- Empleados más y menos activos
- Distribución por jornadas
- Tendencias de ocupación
- Análisis de puntualidad

### **📊 Analytics Avanzados:**
- Predicción de demanda por horarios
- Optimización de asignación de empleados
- Identificación de patrones de uso
- Métricas de eficiencia operacional

---

## 🛠️ **TECNOLOGÍAS UTILIZADAS**

| Componente | Tecnología | Versión |
|------------|------------|---------|
| **Backend** | NestJS + TypeScript | 10.4.4 |
| **Frontend** | React + TypeScript | 18.3.1 |
| **Build Tool** | Vite | 5.4.8 |
| **Base de Datos** | PostgreSQL | 16+ |
| **ORM** | TypeORM | 0.3+ |
| **Autenticación** | JWT + Google OAuth | - |
| **Styling** | CSS Modules + Tailwind | 3.4+ |
| **Containerización** | Docker + Docker Compose | - |
| **Testing** | Jest + Testing Library | - |

---

## 🚀 **ROADMAP DE DESARROLLO**

### **🎯 FASE 1 - MVP (4-6 semanas)**
- ✅ Auth Service completo
- 🔄 Scheduling Service básico
- 🔄 Frontend adaptado para caddies
- 🔄 Algoritmo de prioridades
- 🔄 CRUD empleados

### **📊 FASE 2 - Reportes (3-4 semanas)**
- 📅 Reporting Service
- 📅 Dashboard con datos reales
- 📅 Reportes diarios/semanales
- 📅 Exportación PDF/Excel

### **🔔 FASE 3 - Notificaciones (2-3 semanas)**
- 📅 Notifications Service
- 📅 Alertas en tiempo real
- 📅 Recordatorios automáticos

### **⚡ FASE 4 - Optimización (2-3 semanas)**
- 📅 Events Service
- 📅 Performance optimization
- 📅 Testing completo
- 📅 Documentation final

---

## 🎓 **INTEGRACIÓN ACADÉMICA**

### **🎨 IHC (Interacción Humano-Computador):**
- Diseño UX específico para caddie masters
- Interfaz intuitiva para uso diario
- Accesibilidad y usabilidad
- Responsive design

### **⚙️ IS (Ingeniería de Software):**
- Arquitectura de microservicios
- Metodologías ágiles
- Testing automatizado
- Documentación técnica

### **🌐 SD (Sistemas Distribuidos):**
- Comunicación entre servicios
- Escalabilidad horizontal
- Event-driven architecture
- Resiliencia y fault tolerance

---

Este documento se actualizará conforme avance el desarrollo del proyecto.