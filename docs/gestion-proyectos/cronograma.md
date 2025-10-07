# Cronograma y Milestones – Gestor de Turnos

**Responsable principal:** Ana Martínez (Product Owner)  
**Fecha de elaboración:** 2 de octubre de 2025  
**Última revisión:** 2 de octubre de 2025

## 1. Calendario general
| Fase | Fechas | Objetivo | Entregables clave |
| --- | --- | --- | --- |
| Planificación | 2 oct – 12 oct | Consolidar documentación base, cronograma y backlog | Acta, cronograma, plan de calidad inicial |
| Iteración 1 (MVP) | 10 oct – 30 oct | Autenticación + turnos básicos + frontend inicial | Servicios Auth y Scheduling, UI de login/calendario, pruebas unitarias básicas |
| Iteración 2 | 1 nov – 20 nov | Solicitudes de cambio y notificaciones automáticas | Servicio Notifications, workflows de aprobación, pruebas E2E |
| Iteración 3 | 21 nov – 5 dic | Reporting avanzado y observabilidad | Servicio Reporting, dashboards, monitoreo y pruebas de rendimiento |
| Cierre y presentación | 6 dic – 15 dic | Pulido final, documentación y demo | Manual de usuario, reporte final, presentación académica |

## 2. Cronograma detallado (semanal)
| Semana | Rango de fechas | Actividades prioritarias | Responsable líder |
| --- | --- | --- | --- |
| Semana 1 | 02/10 – 08/10 | Completar backlog, RACI, tablero Kanban, infraestructura base de repositorio | Ana |
| Semana 2 | 09/10 – 15/10 | Diseño técnico detallado, scaffolding de microservicios, definición de contratos API | Carlos |
| Semana 3 | 16/10 – 22/10 | Implementar Auth Service (login, roles) + frontend de autenticación | Carlos / Jhoan |
| Semana 4 | 23/10 – 30/10 | Implementar Scheduling Service (CRUD turnos, asignación manual) + pruebas unitarias | Carlos |
| Semana 5 | 31/10 – 06/11 | Construir Notifications Service, integrar RabbitMQ, pruebas de integración | Jhoan |
| Semana 6 | 07/11 – 13/11 | Implementar flujo de solicitudes de cambio, UI correspondiente, pruebas E2E iniciales | Ana / Jhoan |
| Semana 7 | 14/11 – 20/11 | Endurecer seguridad (RBAC), finalizar iteración 2, demo intermedia | Equipo |
| Semana 8 | 21/11 – 27/11 | Desarrollar Reporting Service (KPIs, exportables) y dashboards frontend | Carlos |
| Semana 9 | 28/11 – 05/12 | Observabilidad (Prometheus, Grafana), pruebas de rendimiento con k6 | Jhoan |
| Semana 10 | 06/12 – 12/12 | Ajustes finales, documentación, preparación de presentación | Equipo |
| Semana 11 | 13/12 – 15/12 | Defensa académica, recopilación de feedback | Equipo |

## 3. Hitosemanales
- **H1 (12 oct):** Documentación base aprobada por tutores.
- **H2 (30 oct):** MVP funcionando (login + turnos manuales) con demo interna.
- **H3 (20 nov):** Flujo completo de solicitudes de cambio y notificaciones.
- **H4 (5 dic):** Reportes y monitoreo implementados, pruebas superadas.
- **H5 (15 dic):** Entrega final y presentación académica.

## 4. Dependencias
- Disponibilidad de datos de prueba del club (inicio de octubre).
- Acceso a infraestructura de laboratorio para pruebas de contenedores (semanas 4-5).
- Feedback docente después de cada hito (máximo 3 días hábiles).

## 5. Plan de contingencia
- **Deslizamiento en Iteración 1:** Repriorizar funcionalidades no críticas (ej. dashboard avanzado) para Iteración 2.
- **Riesgo de disponibilidad del sponsor:** Utilizar documentación y grabaciones de demos para obtener aprobación asíncrona.
- **Problemas técnicos con RabbitMQ:** Tener preparado fallback con colas internas (BullMQ) para no frenar la iteración.

## 6. Seguimiento del cronograma
- Actualización semanal durante la reunión de planeación.
- Registro de avances/delays en el tablero Kanban y burndown chart.
- Ajuste de fechas documentado en esta hoja con control de versiones.
