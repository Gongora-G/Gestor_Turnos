# Guía General del Proyecto Gestor de Turnos

> Documento vivo: actualiza esta guía conforme avance el proyecto. Mantén una versión en el repositorio para que cualquier integrante (real o simulado) pueda entender rápidamente la visión, el enfoque técnico y la organización del trabajo.

## 1. Descripción breve
- **Nombre:** Gestor de Turnos para el Club Puerto Peñalisa.
- **Propósito:** Automatizar la asignación de turnos de caddies en canchas de tenis, reducir conflictos y ofrecer información clara a coordinadores y empleados.
- **Usuarios clave:** Administradores del club, coordinadores de turnos, caddies.

## 2. Materias que cubre
| Materia | Enfoque dentro del proyecto |
| --- | --- |
| Gestión de Proyectos | Planificación (acta, cronograma, riesgos), coordinación de roles y seguimiento del trabajo. |
| Sistemas Distribuidos | Diseño e implementación de microservicios, comunicación entre servicios, despliegue en contenedores. |
| Calidad de Software | Definición de requisitos, plan de pruebas, métricas de calidad y mejora continua. |

## 3. Arquitectura general
El sistema se basa en **microservicios** comunicados por HTTP y mensajería. Cada servicio se ejecuta como un contenedor independiente y expone APIs limpias para el frontend.

```
Frontend React ─▶ Gateway API ─▶ Servicios (Auth, Scheduling, Events, Notifications, Reporting)
                               └▶ Broker de mensajes RabbitMQ (eventos y tareas asíncronas)
                               └▶ Base de datos PostgreSQL (datos principales)
```

## 4. Tecnologías principales
- **Frontend:** React + Vite + TypeScript.
- **Backend:** NestJS (Node.js + TypeScript) organizando cada microservicio.
- **Base de datos:** PostgreSQL (tabla principal) y replicas de lectura para reportes.
- **Mensajería:** RabbitMQ para enviar eventos (por ejemplo, “nuevo turno creado”).
- **Contenedores y despliegue:** Docker y Docker Compose (más adelante Kubernetes si es requerido).
- **Pruebas y calidad:** Jest (unitarias), Playwright/Cypress (end-to-end), k6 (rendimiento), SonarQube (análisis estático).
- **Observabilidad:** Prometheus + Grafana + OpenTelemetry para métricas, logs y trazas.

## 5. Módulos / Microservicios planeados
| Servicio | Rol principal | Ejemplos de funciones |
| --- | --- | --- |
| Gateway / BFF | Puerta de entrada para el frontend | Autenticación, enrutamiento, rate limiting |
| Auth Service | Usuarios y roles | Registrar usuarios, iniciar sesión, manejar contraseñas |
| Scheduling Service | Turnos y asignaciones | Crear horarios, aplicar reglas automáticas, gestionar cambios |
| Events Service | Eventos deportivos | Programar partidos/prácticas, vincular caddies a eventos |
| Notifications Service | Comunicación | Enviar correos/alertas cuando cambian turnos o eventos |
| Reporting Service | Informes y métricas | Generar reportes de asistencia y desempeño |

> Nota: podemos añadir servicios auxiliares (por ejemplo, `analytics-service`) si surgen nuevas necesidades.

## 6. Flujo principal del sistema
1. El coordinador inicia sesión y crea turnos o eventos.
2. El servicio de asignación recomienda o asigna caddies automáticamente.
3. Los caddies reciben notificaciones de sus turnos.
4. Si un caddie solicita un cambio, la solicitud viaja al coordinador para aprobar o rechazar.
5. El servicio de reportes analiza la actividad y genera informes para la dirección.

## 7. Entregables clave (por materia)
- **Gestión de Proyectos:** acta de constitución, cronograma, matriz de riesgos, tablero de seguimiento, informes de avance.
- **Sistemas Distribuidos:** documentación de arquitectura, diagramas, contratos de API, evidencia de microservicios en contenedores.
- **Calidad de Software:** plan de calidad, matriz de trazabilidad, casos de prueba, reportes de métricas.

## 8. Organización del repositorio
```
Gestor-Turnos
├─ README.md (resumen rápido del repositorio)
├─ Proyecto-Guia.md (este documento)
├─ docs
│  ├─ overview (visión general, objetivos SMART)
│  ├─ gestion-proyectos (acta, cronograma, riesgos)
│  ├─ calidad (plan de pruebas, trazabilidad)
│  └─ sistemas-distribuidos (arquitectura, diagramas)
├─ services (microservicios NestJS)
├─ frontend (aplicación React)
└─ infrastructure (Docker Compose, scripts de despliegue, monitoreo)
```

## 9. Preparación del entorno
Consulta `docs/overview/setup-tecnologias.md` para conocer:
- Herramientas obligatorias (Git, Node.js 20, Nest CLI, Docker Desktop, VS Code y extensiones).
- Cómo levantar PostgreSQL, RabbitMQ y pgAdmin mediante `docker compose`.
- Recomendaciones para editar diagramas (`*.drawio`) y gestionar variables de entorno.
- Checklist previo antes de iniciar el desarrollo.

## 10. Plan inicial por fases
| Fase | Ventana de tiempo (tentativa) | Objetivo |
| --- | --- | --- |
| Planificación | 2 – 12 oct | Documentos base, backlog actualizado, cronograma. |
| Iteración 1 (MVP) | 10 – 30 oct | Servicios Auth + Scheduling + Frontend sencillo. |
| Iteración 2 | 1 – 20 nov | Solicitudes de cambio, notificaciones, pruebas automatizadas. |
| Iteración 3 | 21 nov – 5 dic | Reporting avanzado, optimizaciones, observabilidad. |
| Cierre | 6 – 15 dic | Documentación final, demo y retroalimentación. |

## 11. Glosario básico
- **Backend:** Parte lógica del sistema que procesa datos y reglas de negocio.
- **Frontend:** Interfaz con la que interactúan los usuarios finales.
- **Microservicio:** Servicio pequeño e independiente que cumple una única responsabilidad.
- **RabbitMQ:** Herramienta que permite que los servicios se envíen mensajes entre sí de forma asíncrona.
- **Docker:** Tecnología para empacar aplicaciones y sus dependencias en contenedores.
- **CI/CD:** Automatización para integrar cambios de código y desplegarlos rápidamente.

## 12. Cómo mantener este documento
- Actualiza la tabla de fases cuando cambien fechas o hitos.
- Añade nuevos microservicios o módulos en la sección 5 cuando se definan.
- Incluye decisiones importantes en forma de viñetas o enlaces a los documentos detallados.
- Marca con fecha las actualizaciones relevantes (`Actualizado: dd/mm/aaaa`).

---
**Actualizado por:** _[Nombre del estudiante]_  
**Fecha:** 02/10/2025
