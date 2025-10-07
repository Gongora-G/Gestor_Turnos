# Acta de Constitución del Proyecto

**Nombre del proyecto:** Gestor de Turnos – Club Puerto Peñalisa  
**Fecha:** 2 de octubre de 2025  
**Versión:** 1.0

## 1. Propósito y justificación
El Club Puerto Peñalisa requiere optimizar la administración de turnos de los caddies de tenis para reducir conflictos de agenda, asegurar trato equitativo y mejorar la experiencia de los socios. El proyecto Gestor de Turnos entregará una solución tecnológica escalable que permita gestionar horarios, eventos y solicitudes de cambio de forma eficiente.

## 2. Objetivos SMART
- **Objetivo general:** Implementar una plataforma distribuida para la gestión de turnos, alcanzando un MVP funcional el 30 de octubre de 2025 y la liberación final el 15 de diciembre de 2025.
- **Indicadores clave:**
  - Cobertura de pruebas automatizadas ≥ 80 %.
  - Disponibilidad simulada ≥ 99 % (pruebas de carga y resiliencia).
  - Reducción del 70 % en conflictos de turnos durante pruebas piloto controladas.
  - Cumplimiento del cronograma con desviación máxima del 10 %.

## 3. Alcance
- **Incluye:**
  - Módulos de autenticación, gestión de turnos, eventos, notificaciones y reporting.
  - Interfaces adaptadas para coordinadores y caddies.
  - Integración con mensajería asíncrona (RabbitMQ) para programación automática y notificaciones.
  - Documentación completa para las tres asignaturas (gestión, distribuidos y calidad).
- **No incluye:**
  - Integraciones con sistemas externos del club (payroll, contabilidad).
  - Aplicaciones móviles nativas (se ofrecerá PWA responsive).
  - Procesamiento de pagos.

## 4. Entregables principales
| Nº | Entregable | Fecha objetivo | Responsable principal |
| --- | --- | --- | --- |
| 1 | Acta de proyecto y plan de gestión | 5-oct | Ana Martínez (PO) |
| 2 | Arquitectura distribuida y diagramas | 12-oct | Carlos Rodríguez (Tech Lead) |
| 3 | MVP (autenticación + turnos básicos) | 30-oct | Carlos Rodríguez / Jhoan Góngora |
| 4 | Plan de calidad y casos de prueba | 5-nov | Jhoan Góngora (QA/DevOps) |
| 5 | Iteración 2: solicitudes de cambio + notificaciones | 20-nov | Equipo completo |
| 6 | Reportes, métricas y cierre | 10-dic | Equipo completo |

## 5. Organización del equipo
| Rol | Integrante | Responsabilidades |
| --- | --- | --- |
| Product Owner | Ana Martínez | Gestión del backlog, validación funcional, enlace con stakeholders. |
| Tech Lead / Arquitecto | Carlos Rodríguez | Definir arquitectura, revisar código, coordinar microservicios. |
| QA & DevOps Lead | Jhoan Góngora | Plan de calidad, pruebas automatizadas, CI/CD, observabilidad. |

## 6. Cronograma inicial (alto nivel)
- **Fase de planificación:** 2 – 12 oct.
- **Fase de diseño y arquitectura:** 5 – 20 oct.
- **Desarrollo Iteración 1 (MVP):** 10 – 30 oct.
- **Desarrollo Iteración 2 (Solicitudes y notificaciones):** 1 – 20 nov.
- **Desarrollo Iteración 3 (Reportes y refinamientos):** 21 nov – 5 dic.
- **Pruebas finales y cierre:** 6 – 15 dic.

## 7. Riesgos iniciales
| ID | Riesgo | Probabilidad | Impacto | Mitigación | Responsable |
| --- | --- | --- | --- | --- | --- |
| R1 | Falta de experiencia con RabbitMQ | Media | Media | Capacitación temprana, PoC en primera semana. | Carlos |
| R2 | Sobrecarga académica cerca de exámenes | Alta | Alta | Ajustar cronograma, bloquear tiempo específico para el proyecto. | Ana |
| R3 | Integración tardía entre servicios | Media | Alta | Definir contratos API desde el inicio y usar pruebas de contrato. | Jhoan |
| R4 | Inestabilidad en pruebas de carga | Baja | Alta | Automatizar pruebas de resiliencia y usar circuit breakers. | Carlos |

## 8. Supuestos
- El club proporcionará datos históricos suficientes para simular escenarios.
- Los profesores aceptarán evidencia digital (documentos, tableros, repositorio) como prueba de avance.
- Se cuenta con infraestructura de laboratorio (máquinas para ejecutar Docker) cuando sea necesario.

## 9. Restricciones
- Entregas deben alinearse con fechas académicas.
- Presupuesto nulo: se utilizarán herramientas gratuitas o con licencias académicas.
- Tiempo limitado: el equipo dedica en promedio 12 horas semanales al proyecto.

## 10. Plan de comunicaciones
| Reunión | Frecuencia | Medio | Participantes | Objetivo |
| --- | --- | --- | --- | --- |
| Daily (modo asíncrono) | Diario | Kanban + chat | Equipo | Actualizar estado y desbloquear tareas. |
| Revisión de sprint | Quincenal | Videoconferencia | Equipo + stakeholders | Mostrar avances, recolectar feedback. |
| Retrospectiva | Quincenal | Videoconferencia | Equipo | Identificar mejoras de proceso. |
| Reporte académico | Mensual | Informe escrito | Tutores | Comunicar progreso respecto a cada materia. |

## 11. Aprobación
La aprobación del presente documento autoriza el inicio del proyecto bajo los lineamientos aquí descritos.

- **Sponsor académico:** ________________________
- **Product Owner:** Ana Martínez  
- **Tech Lead:** Carlos Rodríguez  
- **QA & DevOps Lead:** Jhoan Góngora
