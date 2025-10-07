# Plan de Seguimiento y Coordinación

**Responsable principal:** Ana Martínez (Product Owner)  
**Colaboradores:** Carlos Rodríguez (Tech Lead), Jhoan Góngora (QA & DevOps)  
**Fecha:** 2 de octubre de 2025

## 1. Roles y responsabilidades (RACI)
| Actividad | Ana (PO) | Carlos (Tech Lead) | Jhoan (QA/DevOps) |
| --- | --- | --- | --- |
| Gestión del backlog | R | C | I |
| Definición arquitectónica | C | R | I |
| Desarrollo de microservicios | I | R | C |
| Desarrollo frontend | C | R | I |
| Plan de calidad y pruebas | I | C | R |
| CI/CD y despliegues | I | C | R |
| Comunicación con stakeholders | R | I | I |
| Documentación académica | R | C | C |

> R = Responsible (ejecuta), A = Accountable (aprueba), C = Consulted (asesora), I = Informed (recibe información). Ana es accountable en gestión del backlog; Carlos en arquitectura; Jhoan en calidad/DevOps.

## 2. Ritualidades
| Reunión | Frecuencia | Duración | Objetivo | Participantes |
| --- | --- | --- | --- | --- |
| Planeación de iteración | Quincenal (lunes) | 60 min | Seleccionar historias, estimar esfuerzo y definir objetivos de sprint. | Equipo completo |
| Daily asíncrona | Diario | 10 min (texto) | Compartir avances, bloqueos y prioridades del día. | Equipo completo |
| Revisión de sprint | Quincenal (jueves final de iteración) | 45 min | Demostrar incrementos y recopilar feedback de stakeholders. | Equipo + stakeholders |
| Retrospectiva | Quincenal (viernes) | 45 min | Identificar mejoras de proceso y plan de acción. | Equipo completo |
| Sync académico | Mensual | 30 min | Alinear entregables con tutores de las materias. | Equipo + tutores |

## 3. Herramientas de seguimiento
- **Tablero Kanban:** se gestionará en Trello/Notion/GitHub Projects con columnas `Backlog`, `To Do`, `In Progress`, `In Review`, `Done`.
- **Burndown/Burnup:** gráficos generados al final de cada sprint para medir avance.
- **Registro de decisiones (ADR):** cada decisión técnica relevante se documenta en `/docs/overview/adr/`.
- **Control de versiones:** cada merge request debe referenciar historia y pasar la pipeline.

## 4. Indicadores de monitoreo
| Métrica | Descripción | Frecuencia | Fuente |
| --- | --- | --- | --- |
| % Historias completadas vs plan | Historias finalizadas / planeadas por sprint | Semanal | Tablero Kanban |
| Tiempo de ciclo | Días desde que inicia una tarea hasta que se termina | Semanal | Tablero |
| Cobertura de pruebas | % de cobertura reportado por Jest/Playwright | Quincenal | Pipeline CI |
| Defectos abiertos | Número de bugs activos | Semanal | Issue tracker |
| Cumplimiento de cronograma | % de hitos cumplidos en fecha | Mensual | Cronograma |

## 5. Gestión de riesgos en seguimiento
- Revisión del registro de riesgos cada planeación.
- Actualizar estatus (Abierto, Mitigado, Escalado) y registrar acciones.
- Mantener un canal de comunicación rápido para incidencias urgentes (ej. chat dedicado).

## 6. Documentación y control
- Cada iteración generará un acta breve con: historias completadas, métricas destacadas, bloqueos y acuerdos.
- Se mantendrá una carpeta `/docs/gestion-proyectos/reportes/` para almacenar informes mensuales.
- Los cambios al cronograma o backlog mayor se aprobarán en la reunión de planeación y se registrarán aquí con fecha y responsable.

## 7. Plan de capacitación
- Semana 1: taller interno de RabbitMQ y microservicios NestJS (dirigido por Carlos).
- Semana 5: sesión sobre pruebas E2E y pipelines (dirigido por Jhoan).
- Semana 8: análisis de KPIs y reporting (dirigido por Ana).

## 8. Política de control de cambios
- Todo cambio significativo en alcance o fechas debe:
  1. Registrarse en el tablero como issue tipo “Change Request”.
  2. Evaluarse en términos de impacto (alcance, tiempo, calidad).
  3. Ser aprobado por Ana (PO) y comunicado al equipo y tutores.

Este plan asegura visibilidad constante del avance y facilita simular la colaboración entre los tres roles definidos.
