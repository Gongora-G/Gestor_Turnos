# 📊 Catálogo de Diagramas - Gestor de Turnos

## 🎯 **Diagramas Requeridos para el Proyecto**

### **📋 Lista Completa de Gráficas:**

1. **Gráfica 1**: Diagrama de Casos de Uso General
2. **Gráfica 2**: Casos de Uso - Módulo Autenticación  
3. **Gráfica 3**: Casos de Uso - Módulo Gestión Empleados
4. **Gráfica 4**: Casos de Uso - Módulo Gestión Eventos
5. **Gráfica 5**: Casos de Uso - Módulo Asignaciones
6. **Gráfica 6**: Diagrama de Modelo de Datos (ER)
7. **Gráfica 7**: Arquitectura de Microservicios
8. **Gráfica 8**: Flujo de Procesos de Negocio
9. **Gráfica 9**: Diagrama de Secuencia - Login
10. **Gráfica 10**: Diagrama de Secuencia - Asignación Automática
11. **Gráfica 11**: Arquitectura de Despliegue
12. **Gráfica 12**: Wireframes - Pantallas Principales

---

## 🛠️ **Herramientas Recomendadas**

### **Opción 1: Draw.io (Gratuita y Fácil) ⭐ RECOMENDADA**
- **URL**: https://app.diagrams.net/
- **Ventajas**: 
  - Gratuita y online
  - Plantillas UML integradas
  - Exporta a PNG, PDF, SVG
  - Integración con Google Drive/GitHub
  - Símbolos para casos de uso, ER, arquitectura

### **Opción 2: Lucidchart (Profesional)**
- **URL**: https://lucid.app/
- **Ventajas**:
  - Interface profesional
  - Colaboración en tiempo real
  - Templates académicos
  - Versión gratuita limitada

### **Opción 3: PlantUML (Código)**
- **URL**: https://plantuml.com/
- **Ventajas**:
  - Diagramas como código
  - Versionable con Git
  - Perfecto para desarrolladores
  - Integración VS Code

### **Opción 4: Figma (Para Wireframes)**
- **URL**: https://figma.com/
- **Ventajas**:
  - Ideal para UI/UX
  - Wireframes y mockups
  - Colaboración equipo
  - Gratuito para estudiantes

---

## 📐 **GRÁFICA 1: Diagrama de Casos de Uso General**

### **Descripción:**
Vista completa del sistema con todos los actores y casos de uso principales.

### **Diseño en Draw.io:**

```
Actores:
┌─────────────────┐
│   Coordinador   │ (Principal)
└─────────────────┘

┌─────────────────┐
│   Empleado      │ (Secundario)  
└─────────────────┘

┌─────────────────┐
│  Administrador  │ (Sistema)
└─────────────────┘

Sistema: "Gestor de Turnos"
┌─────────────────────────────────────────────┐
│                                             │
│  • Autenticar Usuario                       │
│  • Gestionar Empleados                     │
│  • Crear Eventos                           │
│  • Asignar Turnos                          │
│  • Generar Horarios Automáticos            │
│  • Enviar Notificaciones                   │
│  • Generar Reportes                        │
│  • Consultar Agenda Personal               │
│                                             │
└─────────────────────────────────────────────┘
```

### **Pasos en Draw.io:**
1. Crear nuevo diagrama → UML → Use Case Diagram
2. Agregar 3 actores (Actor shape)
3. Crear sistema boundary (Rectangle)
4. Agregar 8 casos de uso (Ellipse shapes)  
5. Conectar con líneas (Connector tool)

---

## 📐 **GRÁFICA 2: Casos de Uso - Autenticación**

### **PlantUML Code (Copia y pega en plantuml.com):**

```plantuml
@startuml
title Casos de Uso - Módulo Autenticación

left to right direction

actor "Usuario" as U
actor "Coordinador" as C  
actor "Empleado" as E
actor "Administrador" as A

package "Sistema de Autenticación" {
  usecase "Iniciar Sesión" as UC1
  usecase "Cerrar Sesión" as UC2
  usecase "Restablecer Contraseña" as UC3
  usecase "Cambiar Contraseña" as UC4
  usecase "Gestionar Perfiles" as UC5
}

U --> UC1 : HU-06
U --> UC2
U --> UC3 : HU-02

C --> UC1
C --> UC2  
C --> UC4
C --> UC5

E --> UC1
E --> UC2
E --> UC4

A --> UC5
A --> UC4

UC1 ..> UC2 : <<include>>
UC3 ..> UC4 : <<include>>

note right of UC1
  Validación JWT
  Control de roles
  Registro de auditoría
end note

@enduml
```

---

## 📐 **GRÁFICA 3: Casos de Uso - Gestión Empleados**

### **PlantUML Code:**

```plantuml
@startuml
title Casos de Uso - Gestión de Empleados

actor "Coordinador" as C
actor "Empleado" as E
actor "Sistema" as S

package "Gestión de Empleados" {
  usecase "Registrar Empleado" as UC3
  usecase "Editar Empleado" as UC4  
  usecase "Desactivar Empleado" as UC5
  usecase "Consultar Empleados" as UC6
  usecase "Validar Datos" as UC7
  usecase "Enviar Notificación" as UC8
}

C --> UC3 : HU-03
C --> UC4 : HU-04
C --> UC5 : HU-05
C --> UC6

E --> UC6 : Ver compañeros

UC3 ..> UC7 : <<include>>
UC4 ..> UC7 : <<include>>
UC3 ..> UC8 : <<extend>>
UC4 ..> UC8 : <<extend>>

S --> UC8
S --> UC7

note bottom of UC3
  - Validar unicidad email
  - Asignar rol inicial
  - Generar credenciales
end note

note bottom of UC5
  - Cambiar estado a inactivo
  - Revocar acceso
  - Conservar historial
end note

@enduml
```

---

## 📐 **GRÁFICA 4: Casos de Uso - Gestión Eventos**

### **PlantUML Code:**

```plantuml
@startuml
title Casos de Uso - Gestión de Eventos

actor "Coordinador" as C
actor "Empleado" as E

package "Gestión de Eventos" {
  usecase "Crear Evento" as UC9
  usecase "Modificar Evento" as UC10
  usecase "Cancelar Evento" as UC11
  usecase "Consultar Eventos" as UC12
  usecase "Validar Disponibilidad" as UC13
  usecase "Notificar Cambios" as UC14
}

C --> UC9 : HU-09
C --> UC10 : HU-10  
C --> UC11 : HU-11
C --> UC12
E --> UC12

UC9 ..> UC13 : <<include>>
UC10 ..> UC13 : <<include>>
UC10 ..> UC14 : <<extend>>
UC11 ..> UC14 : <<extend>>

note right of UC9
  - Definir fecha/hora
  - Especificar requisitos
  - Calcular cupos necesarios
end note

note right of UC11
  - Liberar asignaciones
  - Notificar empleados
  - Registrar motivo
end note

@enduml
```

---

## 📐 **GRÁFICA 5: Casos de Uso - Asignaciones**

### **PlantUML Code:**

```plantuml
@startuml
title Casos de Uso - Módulo Asignaciones

actor "Coordinador" as C
actor "Empleado" as E
actor "Sistema" as S

package "Gestión de Asignaciones" {
  usecase "Asignar Empleado Manual" as UC12
  usecase "Modificar Asignación" as UC13
  usecase "Generar Horarios Auto" as UC14
  usecase "Visualizar Agenda" as UC15
  usecase "Solicitar Cambio" as UC7
  usecase "Aprobar Cambio" as UC8
  usecase "Detectar Conflictos" as UC16
  usecase "Optimizar Distribución" as UC17
}

C --> UC12 : HU-12
C --> UC13 : HU-13
C --> UC14 : HU-14
C --> UC8 : HU-08

E --> UC15 : HU-15
E --> UC7 : HU-07

S --> UC16
S --> UC17

UC12 ..> UC16 : <<include>>
UC13 ..> UC16 : <<include>>
UC14 ..> UC17 : <<include>>
UC14 ..> UC16 : <<include>>

UC7 ..> UC8 : <<extend>>

note bottom of UC14
  Algoritmo de optimización:
  - Distribuir carga equitativamente
  - Respetar disponibilidad
  - Minimizar conflictos
end note

@enduml
```

---

## 📐 **GRÁFICA 6: Modelo de Datos (ER)**

### **Herramienta recomendada**: Draw.io con template "Entity Relationship"

### **Entidades principales:**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      User       │    │    Employee     │    │     Event       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ email           │    │ user_id (FK)    │    │ title           │
│ password_hash   │    │ first_name      │    │ description     │
│ role            │    │ last_name       │    │ date            │
│ created_at      │    │ phone           │    │ start_time      │
│ updated_at      │    │ status          │    │ end_time        │
└─────────────────┘    │ hire_date       │    │ location        │
                       │ created_at      │    │ status          │
                       └─────────────────┘    │ created_at      │
                                              └─────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Assignment    │    │  Notification   │    │     Report      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ employee_id(FK) │    │ user_id (FK)    │    │ title           │
│ event_id (FK)   │    │ type            │    │ content         │
│ role            │    │ message         │    │ generated_by(FK)│
│ status          │    │ sent_at         │    │ created_at      │
│ assigned_at     │    │ read_at         │    │ filters         │
│ notes           │    └─────────────────┘    └─────────────────┘
└─────────────────┘
```

### **Relaciones:**
- User (1) → (0,*) Employee
- Employee (0,*) → (0,*) Event (através Assignment)
- User (1) → (0,*) Notification
- User (1) → (0,*) Report

---

## 📐 **GRÁFICA 7: Arquitectura de Microservicios**

### **PlantUML Code (Deployment Diagram):**

```plantuml
@startuml
title Arquitectura de Microservicios - Gestor de Turnos

!define RECTANGLE class

node "Cliente Web" {
  [React Frontend]
}

node "API Gateway" {
  [NGINX/Kong]
}

cloud "Microservicios" {
  [Auth Service]
  [Scheduling Service]  
  [Events Service]
  [Notifications Service]
  [Reporting Service]
}

database "Persistencia" {
  [PostgreSQL]
  [Redis Cache]
}

queue "Mensajería" {
  [RabbitMQ]
}

node "Observabilidad" {
  [Prometheus]
  [Grafana]
  [ELK Stack]
}

[React Frontend] --> [NGINX/Kong] : HTTPS
[NGINX/Kong] --> [Auth Service] : REST API
[NGINX/Kong] --> [Scheduling Service] : REST API
[NGINX/Kong] --> [Events Service] : REST API
[NGINX/Kong] --> [Notifications Service] : REST API
[NGINX/Kong] --> [Reporting Service] : REST API

[Auth Service] --> [PostgreSQL]
[Scheduling Service] --> [PostgreSQL]
[Events Service] --> [PostgreSQL]
[Notifications Service] --> [PostgreSQL]
[Reporting Service] --> [PostgreSQL]

[Auth Service] --> [RabbitMQ] : Events
[Scheduling Service] --> [RabbitMQ] : Events
[Events Service] --> [RabbitMQ] : Events
[Notifications Service] <-- [RabbitMQ] : Consume

[Auth Service] --> [Redis Cache]
[Scheduling Service] --> [Redis Cache]

[Prometheus] --> [Auth Service] : Metrics
[Prometheus] --> [Scheduling Service] : Metrics
[Grafana] --> [Prometheus]

@enduml
```

---

## 📐 **GRÁFICA 8: Flujo de Procesos de Negocio**

### **Draw.io - Business Process Model:**

```
Proceso: "Asignación de Turnos"

[Inicio] → [Crear Evento] → [¿Asignación Manual?] 
                                   ↓ NO
                           [Ejecutar Algoritmo Automático]
                                   ↓
                           [Verificar Disponibilidad]
                                   ↓
                           [Detectar Conflictos] → [¿Hay Conflictos?]
                                                        ↓ SÍ
                                                  [Resolver Conflictos]
                                                        ↓ NO
                           [Confirmar Asignaciones] 
                                   ↓
                           [Enviar Notificaciones]
                                   ↓
                                 [Fin]
```

---

## 📐 **GRÁFICA 9: Diagrama de Secuencia - Login**

### **PlantUML Code:**

```plantuml
@startuml
title Secuencia de Autenticación

actor Usuario
participant "React App" as React
participant "API Gateway" as Gateway
participant "Auth Service" as Auth
database "PostgreSQL" as DB

Usuario -> React: Ingresa credenciales
React -> Gateway: POST /auth/login
Gateway -> Auth: Forward request
Auth -> DB: Buscar usuario por email
DB --> Auth: User data
Auth -> Auth: Verificar password (bcrypt)
Auth -> Auth: Generar JWT token
Auth --> Gateway: {access_token, user_info}
Gateway --> React: Response con token
React -> React: Guardar token en localStorage
React --> Usuario: Redirección a dashboard

note right of Auth
  Token incluye:
  - user_id
  - role
  - exp (expiración)
end note

@enduml
```

---

## 📐 **GRÁFICA 10: Diagrama de Secuencia - Asignación Automática**

### **PlantUML Code:**

```plantuml
@startuml
title Secuencia de Asignación Automática

actor Coordinador
participant "React App" as React
participant "Scheduling Service" as Sched
participant "Events Service" as Events
participant "RabbitMQ" as MQ
participant "Notification Service" as Notif
database "PostgreSQL" as DB

Coordinador -> React: Solicita generación automática
React -> Sched: POST /scheduling/auto-generate
Sched -> Events: GET /events (filtrar por fecha)
Events --> Sched: Lista de eventos
Sched -> DB: Consultar empleados disponibles
DB --> Sched: Lista empleados + restricciones
Sched -> Sched: Ejecutar algoritmo optimización
Sched -> DB: Crear asignaciones en lote
Sched -> MQ: Publicar evento "assignments.created"
MQ -> Notif: Consumir evento
Notif -> Notif: Generar notificaciones por empleado
Notif -> DB: Guardar notificaciones
Sched --> React: Resultado con estadísticas
React --> Coordinador: Mostrar resumen asignaciones

note right of Sched
  Algoritmo considera:
  - Disponibilidad horaria
  - Carga de trabajo previa
  - Habilidades requeridas
  - Restricciones personales
end note

@enduml
```

---

## 🛠️ **INSTRUCCIONES PASO A PASO**

### **Para Draw.io (Casos de Uso):**

1. **Acceder**: Ir a https://app.diagrams.net/
2. **Nuevo diagrama**: Create New Diagram → UML → Use Case
3. **Agregar actores**:
   - Buscar "Actor" en la barra izquierda
   - Arrastrar 3 actores al canvas
   - Renombrar: Coordinador, Empleado, Administrador

4. **Crear sistema boundary**:
   - Usar Rectangle tool
   - Dibujar marco alrededor del área central
   - Agregar título: "Gestor de Turnos"

5. **Agregar casos de uso**:
   - Buscar "Use Case" (óvalo)
   - Crear 8-10 casos según el módulo
   - Nombrar según las HU

6. **Conectar elementos**:
   - Usar Connector tool
   - Líneas sólidas: Actor → Use Case
   - Líneas punteadas: <<include>>, <<extend>>

### **Para PlantUML (Secuencias/Arquitectura):**

1. **Acceder**: Ir a https://plantuml.com/plantuml
2. **Copiar código**: Usa los códigos que proporcioné arriba
3. **Generar**: Click en "Submit" 
4. **Exportar**: Download como PNG/SVG/PDF

### **Para el Modelo de Datos:**

1. **Draw.io**: Template "Entity Relationship"
2. **Agregar entidades**: Usar Rectangle + Text
3. **Definir atributos**: Lista dentro de cada entidad
4. **Conectar relaciones**: Lines con cardinalidad (1, *, 0..1)

---

## 📋 **Checklist de Diagramas**

### **Para entregar:**
- [ ] **Gráfica 1**: Casos de Uso General (PNG + Draw.io)
- [ ] **Gráfica 2**: Casos de Uso Autenticación (PNG + PlantUML)  
- [ ] **Gráfica 3**: Casos de Uso Empleados (PNG + PlantUML)
- [ ] **Gráfica 4**: Casos de Uso Eventos (PNG + PlantUML)
- [ ] **Gráfica 5**: Casos de Uso Asignaciones (PNG + PlantUML)
- [ ] **Gráfica 6**: Modelo de Datos ER (PNG + Draw.io)
- [ ] **Gráfica 7**: Arquitectura Microservicios (PNG + PlantUML)
- [ ] **Gráfica 8**: Flujo Procesos (PNG + Draw.io)
- [ ] **Gráfica 9**: Secuencia Login (PNG + PlantUML)
- [ ] **Gráfica 10**: Secuencia Asignación (PNG + PlantUML)

### **Formatos a entregar:**
- **PNG/JPG**: Para insertar en documentos Word
- **PDF**: Para presentaciones  
- **Archivos fuente**: .drawio, .puml para modificaciones

¿Quieres que genere algún diagrama específico primero o prefieres que te guíe paso a paso con una herramienta en particular?