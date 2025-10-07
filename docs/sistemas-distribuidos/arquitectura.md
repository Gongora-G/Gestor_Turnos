# Arquitectura Distribuida – Gestor de Turnos

**Responsable principal:** Carlos Rodríguez (Tech Lead)  
**Colaboradores:** Ana Martínez (PO), Jhoan Góngora (QA/DevOps)  
**Fecha:** 2 de octubre de 2025  
**Estado:** ✅ Infraestructura base implementada (3 oct 2025)

## 1. Enfoque general
La plataforma implementa una arquitectura de microservicios desacoplados desplegados en contenedores Docker. Cada servicio expone API REST y comunica eventos a través de RabbitMQ. La comunicación síncrona se realiza mediante HTTP con autenticación JWT y la comunicación asíncrona mediante colas y topics.

### Estado de implementación actual:
- ✅ **Docker Compose configurado** con PostgreSQL 16, RabbitMQ 3.13, pgAdmin 4
- ✅ **Herramientas de desarrollo** instaladas (Node.js 22, NestJS CLI 11, TypeScript 5.9)
- ✅ **Servicios base funcionando** en localhost con credenciales configuradas
- 🔄 **Próxima fase**: Desarrollo de auth-service como primer microservicio 

```
[Frontend React] ⇄ [Gateway API / BFF]
                      │
                      ├─► Auth Service
                      ├─► Scheduling Service
                      ├─► Events Service
                      ├─► Notifications Service
                      └─► Reporting Service

                    [RabbitMQ Broker]
                        ▲      ▲
                        │      └─ consumidores (Notifications, Reporting)
                        └─ emisores (Scheduling, Events)

                [PostgreSQL Cluster] (instancia principal + réplica read-only)
```

## 2. Microservicios y responsabilidades
| Servicio | Descripción | Principales endpoints / eventos | Base de datos |
| --- | --- | --- | --- |
| **Gateway / BFF** | Puerta de entrada para el frontend. Gestiona autenticación, rate limiting y delegación a servicios internos. | REST `/api/*` | No persistencia propia (cache Redis opcional). |
| **Auth Service** | Manejo de usuarios, roles (Administrador, Coordinador, Caddie) y autenticación JWT. | REST `/auth/login`, `/auth/register`, `/auth/refresh` | Postgres (tabla `users`, `roles`, `audit_logs`). |
| **Scheduling Service** | Generación y administración de turnos, asignaciones automáticas, reglas de negocio. | REST `/schedules`, eventos `schedule.created`, `schedule.updated` | Postgres (`shifts`, `assignments`, `rules`). |
| **Events Service** | Gestión de eventos (partidos, prácticas) y relación con turnos. | REST `/events`, `/events/{id}/assignments` | Postgres (`events`, `event_assignments`). |
| **Notifications Service** | Suscrito a eventos de turno/cambios para enviar emails/push/notificaciones internas. | Evento consumidor `schedule.*`, `event.*` | MongoDB o Redis (cola de envíos) + mailer externo (simulado). |
| **Reporting Service** | Genera informes de asistencia, rendimiento y métricas para coordinadores. | REST `/reports/attendance`, `/reports/performance`, evento `report.generated` | Data warehouse (Postgres read replica) + caché interno. |

## 3. Comunicación y patrones
- **API Gateway:** Expone un contrato consistente al frontend y facilita políticas de seguridad y versionado.
- **Mensajería asíncrona:** RabbitMQ con exchanges tipo `topic`. 
  - Ejemplo: `schedule.created` → Notifications envía avisos; Reporting actualiza métricas.
  - Se utilizarán DLQ (dead-letter queues) para manejo de fallos y reintentos exponenciales.
- **Circuit Breaker y Retry:** Implementados con librerías como `@nestjs/terminus` + `opossum` o configuración propia para garantizar resiliencia.
- **Service Discovery:** En entornos simples, Compose; para ambientes avanzados, K8s con `kube-dns`.

## 4. Persistencia y datos
- **PostgreSQL principal** para datos transaccionales.
- **Replica read-only** para consultas pesadas/reporting.
- **Redis opcional** para caching de sesiones y datos frecuentemente accedidos.
- **Migraciones** gestionadas con TypeORM (o Prisma en NestJS) y pipelines de CI/CD.

### Modelo lógico simplificado
- `users (id, email, password_hash, role, status)`
- `employees (id, name, skill_level, status)`
- `shifts (id, date, start_time, end_time, location)`
- `assignments (id, shift_id, employee_id, status)`
- `events (id, title, type, scheduled_at, coordinator_id)`
- `event_assignments (id, event_id, employee_id, role)`
- `change_requests (id, assignment_id, requester_id, status, reason)`

## 5. Infraestructura
- **Docker Compose (fase inicial):** orquesta servicios, base de datos y broker.
- **CI/CD (GitHub Actions):**
  - Stage 1: lint + pruebas unitarias por servicio.
  - Stage 2: build de contenedores y publicación en registry.
  - Stage 3: pruebas de contrato y end-to-end mediante Cypress/Playwright.
  - Stage 4: despliegue a ambiente de staging (Compose o Kubernetes).
- **Kubernetes (fase avanzada opcional):** Plantillas Helm para cada servicio, configuraciones `HorizontalPodAutoscaler`, `PodDisruptionBudget`.

## 6. Observabilidad
- **Logs estructurados:** Winston + Elastic Stack o Loki.
- **Métricas:** Prometheus con exporters de NestJS (`@willsoto/nestjs-prometheus`).
- **Tracing:** OpenTelemetry + Jaeger para seguir flujos entre servicios.

## 7. Seguridad
- Autenticación/Autorización con JWT y `role-based access control`.
- Hardening de contenedores (imágenes slim, `npm audit`, `trivy`).
- Políticas de CORS, rate limiting y validación de entrada (`class-validator`).
- Gestión de secretos mediante variables de entorno y archivos `.env` administrados por el servicio de configuración.

## 8. Roadmap técnico
1. Prototipo con 3 servicios (Auth, Scheduling, Notifications) + RabbitMQ + PostgreSQL (octubre).
2. Agregar Events Service y reporting básico + dashboard en frontend (noviembre).
3. Automatizar pipelines de observabilidad y pruebas de resiliencia (noviembre).
4. Optimización, documentación final y empaquetado para entrega (diciembre).

Esta arquitectura servirá como base para las decisiones de implementación, documentación y pruebas exigidas por las materias.
