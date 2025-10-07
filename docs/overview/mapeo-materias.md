# Mapeo de Desarrollo por Materias Académicas

## Información del Proyecto
- **Proyecto**: Gestor de Turnos para Corporación de Caddies
- **Modalidad**: Integración de 3 materias universitarias
- **Enfoque**: Teoría aplicada + Desarrollo práctico

---

## 1. INTERACCIÓN HUMANO-COMPUTADOR (IHC)

### 🎯 **Objetivos Académicos**
- Diseño centrado en el usuario (DCU)
- Evaluación de usabilidad y experiencia de usuario
- Prototipado y testing de interfaces
- Accesibilidad y diseño inclusivo

### 🛠️ **Implementación Práctica**

#### **Fase 1: Investigación de Usuarios** 
**Artefactos desarrollados:**
- Historias de usuario detalladas (19 HU con criterios de aceptación)
- Personas: Coordinador operativo, Empleado/Caddie, Administrador sistema
- Journey maps del proceso actual vs. proceso optimizado

**Herramientas utilizadas:**
- Entrevistas con stakeholders (coordinadores actuales)
- Análisis de tareas y flujos de trabajo existentes
- Documentación en `docs/overview/documento-academico.md`

#### **Fase 2: Diseño de Interfaz**
**Componentes a implementar:**
```typescript
// React Components estructura planificada
frontend/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx        // HU-06: Inicio sesión seguro
│   │   └── PasswordReset.tsx    // HU-02: Restablecer contraseña
│   ├── employees/
│   │   ├── EmployeeList.tsx     // HU-03: Gestión empleados
│   │   ├── EmployeeForm.tsx     // HU-04: Editar datos empleado
│   │   └── EmployeeCalendar.tsx // HU-15: Visualizar agenda personal
│   ├── events/
│   │   ├── EventCreator.tsx     // HU-09: Crear eventos
│   │   ├── EventScheduler.tsx   // HU-14: Generador automático
│   │   └── AssignmentBoard.tsx  // HU-16: Tablero asignaciones
│   └── shared/
│       ├── DatePicker.tsx       // Componente reutilizable
│       ├── NotificationBanner.tsx // HU-17: Sistema notificaciones
│       └── DataTable.tsx        // Tablas con filtros y paginación
```

#### **Fase 3: Prototipado y Testing**
**Metodología DCU aplicada:**
1. **Wireframes** → Sketches iniciales de pantallas principales
2. **Mockups interactivos** → Figma/Adobe XD para validación
3. **Prototipos funcionales** → React components con datos mock
4. **Testing de usabilidad** → Cypress E2E tests + métricas UX

**Métricas de usabilidad a medir:**
- Tiempo promedio para completar tareas principales
- Tasa de errores por flujo de usuario  
- Nivel de satisfacción (SUS - System Usability Scale)
- Accesibilidad (WCAG 2.1 AA compliance)

#### **Entregables IHC:**
- [ ] Documentación DCU completa
- [ ] Prototipo funcional React
- [ ] Reporte de testing de usabilidad
- [ ] Guías de estilo y design system

---

## 2. INGENIERÍA DE SOFTWARE (IS)

### 🎯 **Objetivos Académicos**
- Metodologías ágiles (Scrum/Kanban)
- Arquitectura de software escalable
- Gestión de calidad y testing
- DevOps y CI/CD

### 🛠️ **Implementación Práctica**

#### **Fase 1: Metodología y Gestión**
**Marco de trabajo implementado:**
- **Scrum híbrido** con elementos Kanban
- Sprints de 2 semanas, 9 iteraciones totales  
- Roles definidos: Product Owner, Scrum Master, Dev Team

**Artefactos de gestión:**
```
docs/gestion-proyectos/
├── acta-proyecto.md          # Project charter
├── cronograma.md            # Planificación temporal
├── plan-seguimiento.md      # Metodología Scrum
└── backlog-iteraciones.md   # Product backlog priorizado
```

**Herramientas de gestión:**
- Control de versiones: Git + GitHub
- Tracking: GitHub Issues/Projects (kanban board)
- CI/CD: GitHub Actions
- Comunicación: Documentación en Markdown

#### **Fase 2: Arquitectura de Software**
**Patrón arquitectónico:** Microservicios + Event-Driven Architecture

```typescript
// Arquitectura de microservicios implementada
services/
├── auth-service/           // Autenticación JWT + RBAC
│   ├── src/
│   │   ├── auth/          // Módulo autenticación  
│   │   ├── users/         // Gestión usuarios
│   │   ├── roles/         // Control acceso basado en roles
│   │   └── shared/        // DTOs, guards, decorators
│   ├── package.json       // Dependencias NestJS
│   └── Dockerfile         // Containerización

├── scheduling-service/     // Lógica de negocio principal
│   ├── src/
│   │   ├── employees/     // HU-03, HU-04, HU-05: CRUD empleados
│   │   ├── events/        // HU-09, HU-10, HU-11: Gestión eventos  
│   │   ├── assignments/   // HU-12, HU-13: Asignaciones manuales
│   │   ├── scheduling/    // HU-14: Algoritmo automático
│   │   └── shared/        // Entities, DTOs, utils
│   └── ...

├── events-service/        // Eventos de dominio y comunicación
├── notifications-service/ // HU-17, HU-18: Notificaciones multicanal  
└── reporting-service/     // HU-01, HU-19: Reportes y auditoría
```

**Comunicación entre servicios:**
- **RabbitMQ** para mensajería asíncrona
- **API Gateway** para exponer endpoints unificados
- **Event Sourcing** para auditoría y trazabilidad

#### **Fase 3: Gestión de Calidad**
**Testing strategy implementada:**
```typescript
// Pirámide de testing
├── Unit Tests (70%)
│   ├── Jest + Testing Library
│   ├── Coverage > 80% por servicio
│   └── TDD para lógica crítica
├── Integration Tests (20%)  
│   ├── Supertest para APIs REST
│   ├── TestContainers para DB
│   └── Postman/Newman para E2E APIs
└── E2E Tests (10%)
    ├── Playwright para flujos completos
    ├── Cypress para UI testing
    └── k6 para load testing
```

**Métricas de calidad:**
- Cobertura de código > 80%
- Complejidad ciclomática < 10
- Technical debt ratio < 5%
- Performance: Response time < 200ms (p95)

#### **Entregables IS:**
- [ ] Arquitectura de microservicios funcional
- [ ] Pipeline CI/CD automatizado
- [ ] Suite de testing completa  
- [ ] Documentación técnica (APIs, deployment)

---

## 3. SISTEMAS DISTRIBUIDOS (SD)

### 🎯 **Objetivos Académicos**  
- Arquitecturas distribuidas y escalabilidad
- Consistencia y tolerancia a fallos
- Comunicación entre procesos
- Observabilidad y monitoring

### 🛠️ **Implementación Práctica**

#### **Fase 1: Infraestructura Distribuida**
**Stack tecnológico implementado:**
```yaml
# infrastructure/docker-compose.yml
services:
  # Capa de persistencia
  postgres:          # Base datos principal (ACID)
  redis:            # Cache distribuido + sessions
  
  # Capa de mensajería  
  rabbitmq:         # Message broker (pub/sub, queues)
  
  # Servicios de aplicación
  auth-service:     # Servicio autenticación
  scheduling-service: # Servicio scheduling  
  events-service:   # Servicio eventos
  notifications-service: # Servicio notificaciones
  reporting-service: # Servicio reportes
  
  # API Gateway
  api-gateway:      # Reverse proxy + load balancer
  
  # Observabilidad
  prometheus:       # Métricas y alertas
  grafana:         # Dashboards y visualización
  elasticsearch:    # Logs centralizados
  kibana:          # Análisis de logs
```

#### **Fase 2: Patrones de Sistemas Distribuidos**
**Patrones implementados:**

1. **API Gateway Pattern**
   - Punto único de entrada
   - Rate limiting y authentication
   - Request/response transformation

2. **Circuit Breaker Pattern**  
   - Tolerancia a fallos entre servicios
   - Fallback mechanisms
   - Health checks automatizados

3. **Event-Driven Architecture**
   ```typescript
   // Eventos de dominio
   export enum EventType {
     EMPLOYEE_CREATED = 'employee.created',
     ASSIGNMENT_CHANGED = 'assignment.changed', 
     EVENT_CANCELLED = 'event.cancelled',
     NOTIFICATION_SENT = 'notification.sent'
   }
   
   // Publishers y subscribers
   @EventHandler(EventType.ASSIGNMENT_CHANGED)
   async handleAssignmentChanged(event: AssignmentChangedEvent) {
     // Notificar empleado afectado
     await this.notificationService.sendAssignmentUpdate(event);
   }
   ```

4. **SAGA Pattern**
   - Transacciones distribuidas
   - Compensating transactions
   - Orquestación vs coreografía

#### **Fase 3: Observabilidad y Monitoring**
**Implementación de observabilidad:**

```typescript
// Métricas personalizadas con Prometheus
@Injectable()
export class MetricsService {
  private assignmentDuration = new Histogram({
    name: 'assignment_creation_duration_seconds',
    help: 'Duration of assignment creation process'
  });
  
  async createAssignment(assignmentData: CreateAssignmentDto) {
    const timer = this.assignmentDuration.startTimer();
    try {
      const result = await this.doCreateAssignment(assignmentData);
      timer({ status: 'success' });
      return result;
    } catch (error) {
      timer({ status: 'error' });
      throw error;
    }
  }
}
```

**Logging distribuido:**
```typescript
// Structured logging con correlation IDs
export class CorrelationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId = request.headers['x-correlation-id'] || uuidv4();
    
    return next.handle().pipe(
      tap(() => {
        this.logger.log({ 
          correlationId,
          method: request.method,
          url: request.url,
          statusCode: context.switchToHttp().getResponse().statusCode
        });
      })
    );
  }
}
```

#### **Fase 4: Escalabilidad y Performance**
**Estrategias implementadas:**
- **Horizontal scaling**: Kubernetes deployments
- **Database sharding**: Partición por región/club  
- **Caching strategy**: Redis para queries frecuentes
- **CDN**: Assets estáticos del frontend
- **Load balancing**: NGINX + multiple instances

#### **Entregables SD:**
- [ ] Cluster distribuido funcional (Docker Swarm/K8s)
- [ ] Implementación patrones distribuidos
- [ ] Dashboard de observabilidad completo
- [ ] Documentación de arquitectura distribuida

---

## 4. INTEGRACIÓN INTERDISCIPLINARIA

### 🔄 **Conexiones entre Materias**

#### **IHC + IS: Desarrollo Frontend**
- Componentes React implementan historias de usuario (IHC)  
- Testing E2E valida tanto UX como funcionalidad (IS)
- Design system asegura consistencia y mantenibilidad

#### **IS + SD: Backend Architecture**  
- Microservicios implementan bounded contexts (IS)
- Comunicación asíncrona asegura desacoplamiento (SD)
- CI/CD permite deployments independientes

#### **IHC + SD: Performance UX**
- Métricas de usabilidad se monitorean en tiempo real (SD)
- Optimización de performance impacta directamente UX (IHC)
- Notificaciones push requieren infraestructura distribuida

### 📊 **Métricas Unificadas**
```typescript
// Dashboard integrado que muestra métricas de las 3 áreas
interface UnifiedMetrics {
  // IHC Metrics
  userSatisfactionScore: number;      // SUS score
  taskCompletionRate: number;         // % tareas completadas exitosamente
  averageTaskDuration: number;        // Tiempo promedio por tarea
  
  // IS Metrics  
  codeQualityScore: number;          // Cobertura tests + complexity
  deploymentFrequency: number;       // Deployments por semana
  leadTime: number;                  // Tiempo feature -> production
  
  // SD Metrics
  systemAvailability: number;        // Uptime %
  averageResponseTime: number;       // Latencia promedio
  throughput: number;               // Requests por segundo
}
```

---

## 5. CRONOGRAMA DE DESARROLLO POR MATERIA

### **Iteración 1-2: Fundaciones (IHC + IS + SD)**
- ✅ Setup entorno desarrollo
- ✅ Arquitectura base y servicios Docker
- ✅ Historias de usuario y DCU inicial
- [ ] Wireframes y primeros mockups

### **Iteración 3-4: MVP Backend (IS + SD)**  
- [ ] auth-service: JWT + RBAC
- [ ] scheduling-service: CRUD básico
- [ ] Base datos + migraciones
- [ ] API Gateway básico

### **Iteración 5-6: MVP Frontend (IHC + IS)**
- [ ] React app + routing básico  
- [ ] Componentes principales (login, dashboard)
- [ ] Integración APIs backend
- [ ] Testing E2E inicial

### **Iteración 7-8: Funcionalidades Avanzadas (SD + IHC)**
- [ ] Sistema notificaciones distribuido
- [ ] Algoritmo asignación automática
- [ ] Optimizaciones UX basadas en métricas  
- [ ] Monitoring y observabilidad completa

### **Iteración 9: Integración y Entrega (IS)**
- [ ] Testing completo y performance
- [ ] Documentación final por materia
- [ ] Deployment producción
- [ ] Presentación académica integrada

---

**Próxima actualización**: Al completar primera iteración de desarrollo  
**Responsables**: Equipo académico integrado  
**Estado**: 📋 Planificación completada, iniciando desarrollo