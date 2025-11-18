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

## ✅ **Módulos Implementados** (Actualizado: 18/Nov/2025)

### 🎯 **Módulo de Configuración de Canchas** ✅ COMPLETO
**Componentes:**

1. **✨ Gestión de Canchas (GestionCanchas.tsx)**
   - Tabla responsiva con CRUD completo
   - Validación robusta (prevención de NaN en superficieId/estadoId)
   - Toast notifications en todas las operaciones
   - Toggle activo/inactivo con feedback visual
   - Backend con snake_case (`precio_hora`)
   - Campos comentados: `tipo_deporte`, `precio_hora` (opcional)

2. **🎨 Tipos de Superficie (TiposSuperficie.tsx)**
   - Cards con gradientes y efectos hover profesionales
   - Sistema de colores personalizables (color picker HTML5)
   - Checkbox: `requiere_mantenimiento_especial`
   - DeleteConfirmModal con validación de dependencias
   - Backend: muestra nombres de canchas que bloquean eliminación
   - Sistema de orden para listado

3. **🚦 Estados de Cancha (EstadosCanchas.tsx)**
   - Diseño de cards profesional con selector de iconos
   - 8 iconos disponibles: ✓, ✗, 🔧, ⚠, 🕐, ⏸, 🔒, ⭐
   - Checkboxes: `permite_reservas`, `visible_en_turnos`, `es_predeterminado`
   - Validación: no permite eliminar estados predeterminados
   - Backend: muestra canchas dependientes antes de eliminar
   - Sistema de colores con indicadores visuales

4. **🎉 Sistema de Notificaciones (ToastContext)**
   - 4 tipos: success (✓ verde), error (✗ rojo), warning (⚠ amarillo), info (ℹ azul)
   - Auto-dismiss configurable (3 segundos default)
   - Stack de notificaciones múltiples simultáneas
   - Animaciones suaves de entrada/salida
   - Diseño consistente con tema oscuro

5. **🗑️ Modal de Confirmación (DeleteConfirmModal)**
   - Componente reutilizable para todas las eliminaciones
   - Props: isOpen, title, message, onConfirm, onCancel
   - Estado de loading con spinner durante eliminación
   - Diseño responsive y accesible

### 🎨 **Mejoras de Diseño y Calidad**
- ✅ **TypeScript:** Imports corregidos (`CrearCanchaDto`, `CreateTipoSuperficieDto`)
- ✅ **React DOM:** Warnings eliminados (border properties inline)
- ✅ **Tema oscuro:** Paleta consistente #1f2937, #111827, #374151
- ✅ **Efectos visuales:** Hover states, sombras dinámicas, gradientes
- ✅ **Responsive:** Grid adaptable con `minmax(320px, 1fr)`
- ✅ **Backend:** Validaciones mejoradas con mensajes descriptivos
- ✅ **UX:** Feedback inmediato en todas las acciones del usuario

### 🔄 **Sistema de Jornadas** ✅ FUNCIONAL
- Configuración de esquemas de jornadas (A/B/C personalizables)
- Jornada activa con rotación automática
- Registros diarios con turnos asociados
- Timeline de horarios configurables
- Estados: abierta, en_progreso, cerrada
- Papelera de registros eliminados (soft delete)

### 👥 **Gestión de Personal** ✅ BASE IMPLEMENTADA
- Tipos de personal configurables (Caddie, Boleador, etc.)
- Estados del personal (activo, incapacitado, retirado)
- Campos personalizados por tipo
- Integración con sistema de jornadas

### 🏆 **Gestión de Socios** ✅ BASE IMPLEMENTADA
- Tipos de membresía con precios
- CRUD de socios con datos completos
- Estados de membresía (activa, vencida, suspendida)
- Fechas de vencimiento y renovación

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
