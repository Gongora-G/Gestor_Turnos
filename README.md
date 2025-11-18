# 🎾 TennisFlow - Sistema de Gestión de Turnos para Clubs de Tenis

Sistema especializado para la **gestión automática de auxiliares de cancha y boleadores** en clubs de tenis, eliminando la manipulación manual de turnos y asegurando transparencia total. Desarrollado con arquitectura de microservicios usando **NestJS** y **React**.

## 🎯 **Problemática Real Solucionada**

### **🏆 Club Puerto Peñaliza - Sede Tenis (Caso Real)**
- **30 Auxiliares de Cancha + 8 Boleadores** distribuidos en **2 jornadas (A y B)**
- **12 canchas de tenis** disponibles
- **Rotación diaria**: Jornada A (mañana→tarde), Jornada B (tarde→mañana)
- **Problema crítico**: Auxiliares mienten sobre turnos realizados para mejorar su posición

### **💡 Solución Tecnológica**
**Registro automático con timestamp** → **Algoritmo transparente** → **Orden justo basado en datos reales**

**Flujo Operacional:**
1. **Coordinador de Cancha** registra llegadas con timestamp automático
2. **Sistema** calcula orden basado en: puntualidad + turnos previos + reglas del club
3. **Algoritmo** elimina manipulación humana del proceso
4. **Reportes** automáticos para transparencia total

### **👥 Usuarios del Sistema**
- 👨‍💼 **Coordinador de Cancha**: Control total, registro llegadas, asignación tareas
- 👨‍🏫 **Profesor de Tenis**: Backup del Coordinador de Cancha, supervisión  
- 🎾 **Auxiliares/Boleadores**: Solo consulta orden y estadísticas (sin auto-registro)

### **🎓 Proyecto Académico Integrado**
- **🎨 IHC**: UX optimizado para uso diario en clubes deportivos
- **⚙️ IS**: Arquitectura escalable multi-club con metodologías ágiles  
- **🌐 SD**: Event-driven architecture con middleware y brokers de mensajería

## Stack tecnológico propuesto

| Capa | Tecnología | Justificación |
| --- | --- | --- |
| Microservicios backend | [NestJS](https://nestjs.com/) (Node.js + TypeScript) | Arquitectura modular, soporte nativo para microservicios, tipado fuerte y ecosistema maduro para testing. |
| Base de datos | PostgreSQL | Motor relacional robusto, soporte a transacciones y escalabilidad vertical/horizontal. |
| Mensajería | RabbitMQ (opcional Kafka) | Permite comunicación asíncrona entre servicios, patrones event-driven y resiliencia. |
| Frontend | React + Vite + TypeScript | Experiencia de usuario moderna, componentes reutilizables y compatibilidad con buenas prácticas de accesibilidad. |
| Observabilidad | Prometheus, Grafana, OpenTelemetry | Métricas, trazas y logs centralizados para monitoreo y diagnóstico. |
| Contenedores | Docker + Docker Compose (futuro Kubernetes) | Empaquetado reproducible, despliegue consistente en cualquier entorno. |
| CI/CD | GitHub Actions (o GitLab CI) | Automatización de pruebas, análisis estático y despliegue continuo. |

## 🏗️ **Arquitectura del Sistema**

```
TennisFlow/
├─ README.md
├─ docs/                        # 📚 Documentación académica completa
│  ├─ overview/                 # Visión general y setup
│  ├─ gestion-proyectos/        # Metodología y planificación
│  ├─ calidad/                  # Testing y QA
│  └─ sistemas-distribuidos/    # Arquitectura de microservicios
├─ backend/
│  └─ auth-service/ ✅          # Autenticación, roles y configuración
│     ├─ users/                 # Gestión usuarios y roles
│     ├─ clubs/                 # Multi-club management
│     ├─ canchas/               # 🎾 Gestión canchas de tenis
│     ├─ jornadas/              # 🔄 Configuración jornadas A/B
│     └─ configuracion/         # ⚙️ Catálogos del sistema
├─ services/ (Por implementar)
│  ├─ auxiliar-service/ 🔄      # Gestión auxiliares/boleadores
│  ├─ shift-service/ 📅         # Algoritmo turnos y prioridades
│  ├─ reporting-service/ 📅     # Reportes diarios/semanales
│  └─ notifications-service/ 📅 # Alertas tiempo real
├─ frontend/ ✅                 # React + TypeScript + Vite
│  ├─ Dashboard                 # Panel principal coordinador
│  ├─ Gestión de Turnos         # Registro llegadas y asignaciones
│  ├─ Personal                  # Auxiliares y boleadores
│  ├─ Reportes                  # Estadísticas y transparencia
│  └─ Configuración ✨          # ⚙️ Módulo Canchas (nuevo)
│     ├─ Gestión de Canchas     # CRUD canchas con toast notifications
│     ├─ Tipos de Superficie    # Catalogación superficies (arcilla, cemento)
│     └─ Estados de Cancha      # Estados operativos (disponible, mantenimiento)
└─ infrastructure
```

- `docs/`: documentación académica y técnica alineada con cada materia.
- `services/`: microservicios NestJS (a generar con herramientas como Nx o la CLI de Nest).
- `frontend/`: aplicación React responsable de la interfaz de los distintos roles.
- `infrastructure/`: scripts de despliegue, definición de contenedores, configuración de observabilidad.

## ✅ **Módulos Implementados**

### 🎯 **Módulo de Configuración de Canchas** (Recién completado)
- **✨ Gestión de Canchas**: CRUD completo con diseño oscuro profesional
  - Tabla responsiva con información detallada
  - Validación de campos (superficieId, estadoId con prevención NaN)
  - Fix backend: cambio a snake_case `precio_hora` para compatibilidad
  - Campos comentados: `tipo_deporte` y `precio_hora` (sistema enfocado en tenis)
  
- **🎨 Tipos de Superficie**: Catalogación de superficies de juego
  - Cards con gradientes y efectos hover
  - Campo `velocidad` comentado (no necesario actualmente)
  - Indicadores visuales de mantenimiento especial
  - Sistema de colores personalizables
  
- **🚦 Estados de Cancha**: Estados operativos del sistema
  - Diseño de cards profesional con iconos
  - Selector de iconos interactivo (8 opciones)
  - Checkboxes mejorados: permite_reservas, visible_en_turnos, predeterminado
  - Estados activo/inactivo con indicadores visuales

- **🎉 Toast Notifications**: Sistema de feedback implementado
  - Notificaciones success/error en todas las operaciones CRUD
  - 4 tipos: success (verde), error (rojo), warning (amarillo), info (azul)
  - Auto-dismiss con animaciones suaves
  - Diseño consistente con tema oscuro del sistema

### 🎨 **Mejoras de Diseño**
- **Eliminados warnings React DOM**: Migración de Tailwind a inline styles
- **Border properties**: Cambio de shorthand a propiedades específicas
- **Tema oscuro consistente**: #1f2937, #111827, #374151
- **Efectos visuales**: Hover, sombras dinámicas, gradientes
- **Responsive**: Grid adaptable con minmax(320px, 1fr)

## 🚀 **Próximos Módulos**

### 📅 **Gestión de Jornadas** (En desarrollo)
- Configuración de jornadas A/B con horarios
- Rotación automática diaria
- Visualización de esquemas de trabajo

### 👥 **Gestión de Personal** (Planificado)
- CRUD auxiliares de cancha
- CRUD boleadores
- Asignación a jornadas
- Estados del personal (activo, inactivo, incapacitado)

### 🔄 **Sistema de Turnos** (Planificado)
- Registro de llegadas con timestamp
- Algoritmo de orden transparente
- Cola de espera en tiempo real

### 📊 **Reportes y Estadísticas** (Planificado)
- Reportes diarios por jornada
- Estadísticas de auxiliares/boleadores
- Gráficos de rendimiento
- Exportación a Excel/PDF

## 📚 **Documentación Académica**

- ✅ Acta de constitución y plan de proyecto (Gestión de Proyectos)
- ✅ Arquitectura detallada de microservicios (Sistemas Distribuidos)
- ✅ Modelo de datos especializado (Bases de Datos)
- 🔄 Plan de aseguramiento de la calidad (Calidad de Software)
- 🔄 Cronograma de entregas y seguimiento (Metodologías Ágiles)
