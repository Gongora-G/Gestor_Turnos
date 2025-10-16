# 🎾 CaddieFlow - Sistema de Gestión de Turnos para Clubs de Tenis

Sistema especializado para la **gestión automática de caddies y boleadores** en clubs de tenis, eliminando la manipulación manual de turnos y asegurando transparencia total. Desarrollado con arquitectura de microservicios usando **NestJS** y **React**.

## 🎯 **Problemática Real Solucionada**

### **🏆 Club Puerto Peñaliza - Sede Tenis (Caso Real)**
- **30 Caddies + 8 Boleadores** distribuidos en **2 jornadas (A y B)**
- **12 canchas de tenis** disponibles
- **Rotación diaria**: Jornada A (mañana→tarde), Jornada B (tarde→mañana)
- **Problema crítico**: Caddies mienten sobre turnos realizados para mejorar su posición

### **💡 Solución Tecnológica**
**Registro automático con timestamp** → **Algoritmo transparente** → **Orden justo basado en datos reales**

**Flujo Operacional:**
1. **Caddie Master** registra llegadas con timestamp automático
2. **Sistema** calcula orden basado en: puntualidad + turnos previos + reglas del club
3. **Algoritmo** elimina manipulación humana del proceso
4. **Reportes** automáticos para transparencia total

### **👥 Usuarios del Sistema**
- 👨‍💼 **Caddie Master**: Control total, registro llegadas, asignación tareas
- 👨‍🏫 **Profesor de Tenis**: Backup del Caddie Master, supervisión  
- 🎾 **Caddies/Boleadores**: Solo consulta orden y estadísticas (sin auto-registro)

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
CaddieFlow/
├─ README.md
├─ docs/                        # 📚 Documentación académica completa
│  ├─ overview/                 # Visión general y setup
│  ├─ gestion-proyectos/        # Metodología y planificación
│  ├─ calidad/                  # Testing y QA
│  └─ sistemas-distribuidos/    # Arquitectura de microservicios
├─ backend/
│  └─ auth-service/ ✅          # Autenticación y roles
├─ services/ (Por implementar)
│  ├─ caddie-service/ 🔄        # Gestión caddies/boleadores/jornadas
│  ├─ shift-service/ 📅         # Algoritmo turnos y prioridades
│  ├─ reporting-service/ 📅     # Reportes diarios/semanales
│  ├─ notifications-service/ 📅 # Alertas tiempo real
│  └─ club-service/ 📅          # Multi-club configuration
├─ frontend
└─ infrastructure
```

- `docs/`: documentación académica y técnica alineada con cada materia.
- `services/`: microservicios NestJS (a generar con herramientas como Nx o la CLI de Nest).
- `frontend/`: aplicación React responsable de la interfaz de los distintos roles.
- `infrastructure/`: scripts de despliegue, definición de contenedores, configuración de observabilidad.

## Próximos artefactos clave

- Acta de constitución y plan de proyecto (Gestión de Proyectos).
- Arquitectura detallada de microservicios, diagramas y contratos API (Sistemas Distribuidos).
- Plan de aseguramiento de la calidad, matriz de trazabilidad y estrategia de pruebas (Calidad de Software).
- Cronograma de entregas y tablero de seguimiento simulando el trabajo colaborativo del equipo.

Cada documento especificará el responsable principal dentro del equipo simulado para reflejar la colaboración con los compañeros.
