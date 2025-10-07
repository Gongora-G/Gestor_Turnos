# Backlog Inicial por Iteraciones

**Fecha:** 2 de octubre de 2025  
**Responsable:** Ana Martínez (Product Owner)

## Estructura de iteraciones
| Iteración | Ventana | Objetivo principal | Resultado esperado |
| --- | --- | --- | --- |
| 0 – Preparación | 2 oct – 12 oct | Documentación, setup repositorio, contratos API | Repos listo, plan aprobado, backlog refinado |
| 1 – MVP Base | 10 oct – 30 oct | Autenticación + gestión básica de turnos | Usuarios pueden iniciar sesión y asignar turnos manualmente |
| 2 – Flujo completo | 1 nov – 20 nov | Solicitudes de cambio + notificaciones | Caddies solicitan cambios y notificaciones informan a coordinadores |
| 3 – Analítica y calidad | 21 nov – 5 dic | Reporting + observabilidad | Coordinadores obtienen reportes y el sistema está monitoreado |
| 4 – Cierre | 6 dic – 15 dic | Pulido, hardening y presentación | Producto listo para demo final |

## Iteración 0 – Preparación
- RF-00: Configurar repositorio y estructura de microservicios.
- RF-00.1: Definir contratos de API y modelos de datos iniciales.
- RNF-00: Configurar linting, formateo y pipeline base.
- DOC-00: Finalizar acta, plan de calidad, cronograma y plan de seguimiento.

## Iteración 1 – MVP Base
| ID | Historia | Prioridad | Criterios de aceptación |
| --- | --- | --- | --- |
| HU-LOGIN | Como Administrador quiero iniciar sesión | Alta | Login con email/contraseña, bloqueo tras 5 intentos fallidos, JWT emitido. |
| HU-ROLES | Gestionar roles y usuarios | Alta | Crear/editar/desactivar usuarios, validar datos obligatorios. |
| HU-TURNOS-MANUAL | Crear turnos manualmente | Alta | CRUD de turnos con fecha, hora, ubicación, responsable. |
| HU-CALENDARIO | Visualizar calendario de turnos | Media | Frontend muestra calendario semanal con filtros básicos. |
| RNF-SEC-01 | Seguridad básica | Alta | Validación de entrada, hashing de contraseñas, logs de acceso. |

## Iteración 2 – Flujo completo
| ID | Historia | Prioridad | Criterios de aceptación |
| --- | --- | --- | --- |
| HU-SOLICITUD-CAMBIO | Caddie solicita cambio | Alta | Formulario con motivo, estado de solicitud visible, registro en la base. |
| HU-APROBAR-CAMBIO | Coordinador aprueba/rechaza | Alta | Notificaciones y cambios reflejados en el calendario. |
| HU-NOTIFICACIONES | Enviar alertas | Alta | Enviar email/in-app al crear o cambiar turnos; reintentos ante fallos. |
| HU-ASIGNACION-AUTO | Asignación automática básica | Media | Algoritmo sugiere caddie según disponibilidad y reglas simples. |
| RNF-PERF-01 | Pruebas de carga iniciales | Media | Soportar 100 peticiones concurrentes sin degradación > 10 %. |

## Iteración 3 – Analítica y calidad
| ID | Historia | Prioridad | Criterios de aceptación |
| --- | --- | --- | --- |
| HU-REPORTES | Generar reportes de asistencia | Alta | Reporte por rango de fechas en tabla y exportable CSV/PDF. |
| HU-KPIS | Dashboard de KPIs | Media | Mostrar gráficos de conflictos resueltos, horas por caddie, cumplimiento. |
| RNF-OBS-01 | Observabilidad | Alta | Métricas en Prometheus, panel básico en Grafana, alertas simuladas. |
| RNF-QA-01 | Cobertura de pruebas | Alta | ≥ 80 % en servicios Auth y Scheduling, ≥ 70 % general. |
| RNF-SEC-02 | Hardening | Media | Revisar dependencias, policies de contraseña, auditoría completa. |

## Iteración 4 – Cierre
- DOC-CL-01: Manual de usuario y guía de despliegue.
- DOC-CL-02: Informe final y presentación académica.
- RNF-CL-01: Pruebas de aceptación con tutores + feedback incorporado.
- RNF-CL-02: Retrospectiva final y lecciones aprendidas documentadas.

## Gestión del backlog
- Refinar historias semanalmente durante la reunión de planeación.
- Mantener actualizados criterios de aceptación y dependencias.
- Vincular historias a tareas técnicas específicas en el tablero (por microservicio o componente frontend).
