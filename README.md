# 🎯 Gestor de Turnos – Sistema Full-Stack Universitario

Sistema completo de gestión de turnos desarrollado con **NestJS** y **React**, integrando tres materias universitarias: **IHC**, **IS** y **SD**.

## 🎓 **Contexto Académico**

Este proyecto integra conocimientos de tres asignaturas:

- **🎨 IHC (Interacción Humano-Computador)**: Diseño UX/UI, usabilidad, accesibilidad
- **⚙️ IS (Ingeniería de Software)**: Arquitectura, metodologías ágiles, testing 
- **🌐 SD (Sistemas Distribuidos)**: Microservicios, escalabilidad, comunicación asíncrona

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

## Estructura del repositorio

```
Gestor-Turnos
├─ README.md
├─ docs
│  ├─ overview
│  ├─ gestion-proyectos
│  ├─ calidad
│  └─ sistemas-distribuidos
├─ services
│  ├─ auth-service
│  ├─ scheduling-service
│  ├─ events-service
│  ├─ notifications-service
│  └─ reporting-service
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
