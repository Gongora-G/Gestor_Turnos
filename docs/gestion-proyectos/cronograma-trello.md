# 📋 Cronograma Trello - Gestor de Turnos

## 🎯 **Información del Tablero**
- **Nombre del tablero**: "Gestor de Turnos - IHC + IS + SD"
- **Período**: 18 semanas (6 oct 2025 - 30 ene 2026)
- **Metodología**: Scrum híbrido (sprints de 2 semanas)
- **Eq- **[Card] Crear scheduling-service** (SD)
  - **Asignado**: Juan Camilo Avila Sanchez
  - **Fecha límite**: 8 nov 2025o**: 3 integrantes + roles académicos

---

## 👥 **Configuración del Equipo**

### **Miembros del Equipo**

1. **Jhoan Góngora** (Tech Lead)
   - Email: [jhoan.gongora@universidad.edu]
   - Rol principal: **Tech Lead + QA/DevOps**
   - Especialización: Sistemas Distribuidos + Ingeniería Software
   - Responsabilidades: Arquitectura, DevOps, Testing, Integración

2. **Luisa Loaiza Pavon** (Frontend/UX Lead)
   - Email: Luisaflp20@gmail.com
   - Rol principal: **Frontend Developer + UX Designer**
   - Especialización: Interacción Humano-Computador + React
   - Responsabilidades: UI/UX, Componentes React, Wireframes, Testing usabilidad

3. **Juan Camilo Avila Sanchez** (Backend Lead)
   - Email: @juancamiloavilasanchez2
   - Rol principal: **Backend Developer + Product Owner**
   - Especialización: Ingeniería Software + APIs
   - Responsabilidades: Microservicios, APIs REST, Base de datos, Lógica de negocio

---

## 🏗️ **Estructura del Tablero Trello**

### **📚 Listas (Columnas) del Tablero:**

1. **📋 BACKLOG GENERAL** - Todas las tareas planificadas
2. **� SPRINT ACTUAL: Iteración 1 (7-20 oct)** - Sprint en curso (cambiar título cada iteración)
3. **👨‍💻 EN DESARROLLO** - Tareas siendo desarrolladas
4. **🔍 EN REVISIÓN** - Tareas en code review / testing
5. **✅ COMPLETADO** - Tareas finalizadas y validadas
6. **🎓 ENTREGABLES ACADÉMICOS** - Documentos para materias
7. **⚠️ IMPEDIMENTOS** - Bloqueos y problemas

### **🏷️ Etiquetas por Materia:**
- 🎨 **IHC** (Verde) - Interacción Humano-Computador
- ⚙️ **IS** (Azul) - Ingeniería de Software  
- 🌐 **SD** (Naranja) - Sistemas Distribuidos
- 📚 **DOCS** (Amarillo) - Documentación
- 🐛 **BUG** (Rojo) - Errores y correcciones
- ⭐ **CRÍTICO** (Morado) - Prioridad alta

### **🏷️ Etiquetas por Iteración:**
- 🟢 **ITER-0** (Verde claro) - Setup y Planificación
- 🔵 **ITER-1** (Azul claro) - Backend Foundation
- 🟡 **ITER-2** (Amarillo claro) - Frontend Foundation  
- 🟠 **ITER-3** (Naranja claro) - Gestión Empleados
- 🟣 **ITER-4** (Morado claro) - Gestión Eventos
- 🔴 **ITER-5** (Rojo claro) - Asignaciones
- ⚫ **ITER-6** (Gris) - Algoritmo Automático
- 🟤 **ITER-7** (Marrón) - Notificaciones
- 🔷 **ITER-8** (Azul oscuro) - Reportes & Analytics
- ⚪ **ITER-9** (Blanco) - Finalización

---

## 🗓️ **CRONOGRAMA DETALLADO POR ITERACIONES**

### **📅 Iteración 0: Setup y Planificación (3-6 oct 2025)**
**Estado**: ✅ Completado

#### **Tarjetas Trello completadas:**
- [✅] **Setup entorno desarrollo** (SD) - Jhoan
  - Docker, PostgreSQL, RabbitMQ configurados
  - Herramientas: Node.js, NestJS CLI, TypeScript
  - Verificación completa de conectividad
  
  **Descripción completa:** Esta tarea estableció la base técnica fundamental para todo el proyecto de microservicios. Se configuró un entorno de desarrollo robusto y escalable que permitió al equipo trabajar de manera consistente desde el primer día. La implementación incluyó la configuración de contenedores Docker para PostgreSQL 16 y RabbitMQ 3.13, asegurando que todos los servicios de backend tengan acceso a una base de datos relacional y un sistema de mensajería confiables. Además, se instaló y verificó Node.js 22.18.0, NestJS CLI para scaffolding de microservicios, y TypeScript 5.9.3 para desarrollo type-safe. La verificación de conectividad incluyó pruebas de conexión entre servicios, validación de puertos, y documentación de variables de entorno, garantizando un entorno de desarrollo estable para las próximas 18 semanas del proyecto académico.

- [✅] **Documentación base** (DOCS) - Jhoan
  - Guía de setup, mapeo materias, roadmap
  - Índice navegable, referencias cruzadas
  - 4 documentos nuevos + actualizaciones
  
  **Descripción completa:** Se creó un sistema de documentación integral que servirá como guía maestra durante todo el desarrollo del proyecto. La documentación incluye una guía detallada de setup del entorno de desarrollo, un mapeo estratégico que conecta cada funcionalidad del sistema con las tres materias académicas (IHC, IS, SD), y un roadmap técnico de 9 iteraciones. Se implementó un sistema de navegación con índices interconectados y referencias cruzadas que permite al equipo moverse fácilmente entre documentos relacionados. Los 4 documentos principales creados (setup-desarrollo.md, mapeo-materias.md, guia-desarrollo.md, registro-actividades.md) establecen estándares de codificación, metodologías de trabajo, y criterios de evaluación académica. Esta base documental asegura que todos los miembros del equipo tengan claridad sobre objetivos, procesos y entregables esperados.

- [✅] **Historias de usuario** (IHC) - Equipo
  - 19 HU con criterios de aceptación
  - Tabla optimizada para copiar a Word
  - Mapeo con funcionalidades técnicas
  
  **Descripción completa:** Se definió un conjunto completo de 19 historias de usuario que capturan todos los requisitos funcionales del sistema de gestión de turnos desde la perspectiva del usuario final. Cada historia sigue la estructura estándar "Como [tipo de usuario] quiero [funcionalidad] para [beneficio]" y está acompañada de criterios de aceptación específicos y medibles. Las historias abarcan desde funcionalidades básicas como autenticación y registro de empleados, hasta características avanzadas como generación automática de horarios y reportes analíticos. Se implementó una priorización usando la metodología MoSCoW (Must have, Should have, Could have, Won't have) y se creó un mapeo directo entre cada HU y los componentes técnicos que las implementarán. La documentación está formateada para integración directa en documentos académicos de Word, facilitando la entrega de reportes para las tres materias involucradas.

---

### **📅 Iteración 1: Backend Foundation (7-20 oct 2025)**
**Sprint Goal**: Servicio de autenticación funcional + estructura base

#### **Tarjetas Trello:**

**🔧 SETUP TÉCNICO**
- **[Card] Crear auth-service** (IS + SD)
  - **Asignado**: Juan Camilo Avila Sanchez
  - **Fecha límite**: 11 oct 2025
  - **Checklist**:
    - [ ] `nest new auth-service`
    - [ ] Instalar dependencias JWT, Passport, bcrypt
    - [ ] Configurar TypeORM + PostgreSQL
    - [ ] Setup básico de testing
  - **Etiquetas**: IS, SD
  - **Tiempo estimado**: 8 horas
  
  **Descripción completa:** Esta tarea fundamental establece el microservicio de autenticación que servirá como puerta de entrada segura para todo el sistema de gestión de turnos. El auth-service implementará los principios de arquitectura de microservicios (materia SD) y patrones de ingeniería de software (materia IS) para crear un servicio autónomo, escalable y mantenible. Se utilizará NestJS como framework base por su excelente soporte para TypeScript, inyección de dependencias, y arquitectura modular. La configuración incluirá JWT para tokens stateless, Passport.js para estrategias de autenticación, y bcrypt para hashing seguro de contraseñas. TypeORM facilitará la integración con PostgreSQL manteniendo un código limpio y type-safe. El setup de testing establecerá las bases para TDD y asegurará cobertura de código >80% desde el inicio.

- **[Card] Configurar base de datos** (SD)
  - **Asignado**: Jhoan Góngora
  - **Fecha límite**: 9 oct 2025  
  - **Checklist**:
    - [ ] Crear migraciones iniciales
    - [ ] Entidad User con roles
    - [ ] Seeders con datos de prueba
    - [ ] Configurar conexiones por ambiente
  - **Etiquetas**: SD, IS
  - **Tiempo estimado**: 4 horas
  
  **Descripción completa:** Esta tarea crítica establece la base de datos como piedra angular del sistema distribuido, implementando principios de persistencia de datos y gestión de esquemas para arquitecturas de microservicios. Se creará un esquema de base de datos PostgreSQL robusto y escalable que soporte todos los servicios del sistema. Las migraciones iniciales establecerán las tablas fundamentales (users, roles, permissions) con índices optimizados y restricciones de integridad referencial. La entidad User incluirá campos para autenticación, autorización basada en roles (admin, coordinator, employee, client), y auditoría de actividades. Los seeders poblarán la base con datos de prueba realistas que permitan testing inmediato de funcionalidades. La configuración por ambientes (development, testing, staging, production) asegurará deployments seguros y consistentes. Esta configuración soportará el crecimiento futuro del sistema y facilitará la implementación de patrones de microservicios como database-per-service.

**👨‍💻 DESARROLLO**
- **[Card] Implementar JWT Authentication** (IS)
  - **Asignado**: Juan Camilo Avila Sanchez
  - **Fecha límite**: 14 oct 2025
  - **Checklist**:
    - [ ] POST /auth/login endpoint
    - [ ] JWT strategy implementation  
    - [ ] Guards para proteger rutas
    - [ ] Hash passwords con bcrypt
  - **Etiquetas**: IS, SD
  - **Tiempo estimado**: 12 horas
  
  **Descripción completa:** Esta tarea implementa el corazón del sistema de seguridad, estableciendo autenticación stateless y autorización basada en tokens JWT para el ecosistema de microservicios. Se desarrollará un sistema de autenticación robusto que siga estándares de la industria y mejores prácticas de seguridad. El endpoint POST /auth/login validará credenciales, generará tokens JWT con payload personalizado (user_id, roles, permissions), y manejará refresh tokens para sesiones extendidas. La JWT strategy de Passport.js extraerá y validará tokens de headers Authorization, verificando firma digital y expiración. Los Guards de NestJS protegerán endpoints sensibles, implementando control de acceso granular por roles y permisos. El hashing con bcrypt utilizará salt rounds optimizados para balancear seguridad y performance. Esta implementación servirá como modelo de seguridad para todos los microservicios, estableciendo patrones reutilizables y consistencia arquitectónica.

- **[Card] CRUD Usuarios básico** (IS)
  - **Asignado**: Juan Camilo Avila Sanchez  
  - **Fecha límite**: 16 oct 2025
  - **Checklist**:
    - [ ] GET /users/profile endpoint
    - [ ] POST /users/register endpoint
    - [ ] DTO validation con class-validator
    - [ ] Error handling global
  - **Etiquetas**: IS
  - **Tiempo estimado**: 8 horas
  
  **Descripción completa:** Esta tarea establece las operaciones fundamentales de gestión de usuarios, implementando patrones RESTful y principios de ingeniería de software para un API limpio y mantenible. Se desarrollarán endpoints que manejen el ciclo de vida completo de usuarios, desde registro hasta gestión de perfiles. El endpoint GET /users/profile proporcionará información del usuario autenticado, implementando autorización por tokens y filtrando datos sensibles. El POST /users/register manejará creación de cuentas con validación robusta, verificación de unicidad de email, y asignación automática de roles. Los DTOs (Data Transfer Objects) con class-validator asegurarán integridad de datos, validación de tipos, y sanitización de inputs, previniendo ataques de inyección. El sistema de error handling global proporcionará respuestas consistentes, logging estructurado, y manejo graceful de excepciones. Esta implementación servirá como base para futuras operaciones CRUD y establecerá estándares de calidad para todo el backend.

**🧪 TESTING & QA**  
- **[Card] Tests unitarios auth-service** (IS)
  - **Asignado**: Jhoan Góngora
  - **Fecha límite**: 18 oct 2025
  - **Checklist**:
    - [ ] Tests auth.service.spec.ts (>80% coverage)
    - [ ] Tests users.service.spec.ts 
    - [ ] Integration tests con Supertest
    - [ ] Setup CI/CD básico
  - **Etiquetas**: IS, CRÍTICO
  - **Tiempo estimado**: 6 horas
  
  **Descripción completa:** Esta tarea crítica establece la cultura de testing y aseguramiento de calidad que definirá la confiabilidad del sistema completo. Se implementará una estrategia de testing integral que cubra units tests, integration tests, y CI/CD automation para mantener alta calidad de código a lo largo del proyecto. Los tests unitarios para auth.service.spec.ts cubrirán todos los métodos de autenticación, mocking de dependencias externas, y casos edge incluidos escenarios de error. Los tests de users.service.spec.ts validarán operaciones CRUD, validación de datos, y lógica de negocio. Los integration tests con Supertest probarán endpoints completos end-to-end, incluyendo autenticación, autorización, y respuestas HTTP. El setup de CI/CD establecerá pipelines automatizados que ejecuten tests en cada push, generen reportes de cobertura, y bloqueen merges con tests fallidos. Esta base de testing asegurará maintainability, detectará regresiones temprano, y facilitará refactoring seguro durante el desarrollo.

**🎨 UX/UI PLANNING**
- **[Card] Wireframes autenticación** (IHC)
  - **Asignado**: Luisa Loaiza Pavon
  - **Fecha límite**: 13 oct 2025
  - **Checklist**:
    - [ ] Wireframe login form
    - [ ] Wireframe registro usuario  
    - [ ] Flow recuperar contraseña
    - [ ] Validaciones y mensajes error
  - **Etiquetas**: IHC
  - **Tiempo estimado**: 6 horas
  
  **Descripción completa:** Esta tarea de diseño UX establece los cimientos de la interacción humano-computador para el sistema de autenticación, aplicando principios de usabilidad, accesibilidad y experiencia de usuario. Los wireframes de baja fidelidad definirán la estructura, navegación y flujos de interacción antes del desarrollo, reduciendo costos de cambios posteriores. El wireframe del login incluirá campos optimizados, opciones de "recordar usuario", y accesos rápidos para diferentes tipos de usuarios. El flujo de registro considerará validación progresiva, feedback inmediato, y onboarding intuitivo. El proceso de recuperación de contraseña seguirá mejores prácticas de seguridad y UX, con pasos claros y comunicación efectiva. Se definirán estados de error, mensajes de validación user-friendly, y microinteracciones que mejoren la percepción de calidad. Los wireframes servirán como especificación para el desarrollo frontend y base para testing de usabilidad posterior.

----------------------------------------------------------AQUI VOY-------------------

### **📅 Iteración 2: Frontend Foundation (21 oct - 3 nov 2025)**  
**Sprint Goal**: Aplicación React con login funcional + componentes base

#### **Tarjetas Trello:**

**🎨 FRONTEND SETUP**
- **[Card] Crear proyecto React** (IHC + IS)
  - **Asignado**: Luisa Loaiza Pavon
  - **Fecha límite**: 25 oct 2025
  - **Checklist**:
    - [ ] `npm create vite@latest frontend -- --template react-ts`
    - [ ] Instalar Material-UI, React Router, Redux Toolkit
    - [ ] Configurar estructura de carpetas
    - [ ] Setup de ESLint + Prettier
  - **Etiquetas**: IHC, IS
  - **Tiempo estimado**: 6 horas
  
  **Descripción completa:** Esta tarea fundamental establece la arquitectura frontend moderna y escalable que servirá como interfaz principal del sistema de gestión de turnos. Se creará una aplicación React con TypeScript usando Vite como build tool por su velocidad superior y hot module replacement optimizado. La selección de tecnologías (Material-UI para componentes consistentes, React Router para navegación SPA, Redux Toolkit para state management) garantiza un stack moderno, mantenible y con amplia comunidad de soporte. La estructura de carpetas seguirá principios de clean architecture con separación clara entre components, pages, services, store, y utilities. ESLint y Prettier asegurarán consistencia de código, detectarán errores potenciales, y facilitarán colaboración en equipo. Esta configuración establecerá las bases para desarrollo ágil, testing automatizado, y deployment continuo del frontend.

- **[Card] Design system básico** (IHC)
  - **Asignado**: Luisa Loaiza Pavon
  - **Fecha límite**: 28 oct 2025
  - **Checklist**:
    - [ ] Theme de Material-UI personalizado
    - [ ] Componentes base (Button, Input, Card)
    - [ ] Paleta de colores corporativa
    - [ ] Tipografía y espaciado
  - **Etiquetas**: IHC
  - **Tiempo estimado**: 8 horas
  
  **Descripción completa:** Esta tarea establece las bases visuales y de experiencia de usuario que garantizarán consistencia y profesionalismo a lo largo de toda la aplicación. Se creará un design system cohesivo usando Material-UI como foundation, personalizándolo para reflejar identidad corporativa y necesidades específicas del sistema de turnos. El theme personalizado incluirá configuración de colores primarios/secundarios, breakpoints responsivos, y overrides de componentes para consistency. Los componentes base (Button con variants y states, Input con validation feedback, Card layouts) servirán como building blocks reutilizables que aceleren desarrollo. La paleta de colores corporativa seguirá principios de contraste WCAG para accesibilidad, incluyendo colores semánticos para estados (success, warning, error). El sistema tipográfico y de espaciado establecerá jerarquía visual clara y ritmo consistente usando escalas matemáticas.

**👨‍💻 COMPONENTES REACT**
- **[Card] Componente LoginForm** (IHC + IS)
  - **Asignado**: Luisa Loaiza Pavon
  - **Fecha límite**: 30 oct 2025
  - **Checklist**:
    - [ ] Formulario con validación
    - [ ] Integración Redux para estado auth
    - [ ] Llamadas API con RTK Query
    - [ ] Feedback visual (loading, errores)
  - **Etiquetas**: IHC, IS  
  - **Tiempo estimado**: 10 horas
  
  **Descripción completa:** Esta tarea desarrolla el componente central de autenticación que integra UX/UI excellence con architecture patterns modernos, sirviendo como referencia para todos los componentes de formulario del sistema. Se creará un LoginForm que demuestre mejores prácticas de React development, state management, y API integration. El formulario implementará validación client-side robusta con feedback inmediato, usando controlled components y custom hooks para reusability. Redux Toolkit manejará el estado de autenticación global, incluyendo user data, tokens, y authentication status, con proper serialization y persistence. RTK Query proporcionará data fetching optimizado con caching, background refetching, y automatic loading states. El feedback visual incluirá loading spinners, error messages contextuales, success confirmations, y disabled states durante API calls. Esta implementación establecerá patterns para form handling que se replicarán en todo el frontend.

- **[Card] Dashboard básico** (IHC)
  - **Asignado**: Luisa Loaiza Pavon
  - **Fecha límite**: 2 nov 2025
  - **Checklist**:
    - [ ] Layout con navegación
    - [ ] Mostrar datos usuario logueado  
    - [ ] Logout functionality
    - [ ] Rutas protegidas
  - **Etiquetas**: IHC, IS
  - **Tiempo estimado**: 8 horas
  
  **Descripción completa:** Esta tarea crea el centro de control principal del sistema, implementando un dashboard que sirva como hub central para todas las funcionalidades del gestor de turnos. Se desarrollará un layout responsivo y navegación intuitiva que proporcione acceso rápido a todas las áreas del sistema. El layout incluirá sidebar navigation con iconografía clara, breadcrumbs para orientación, y header con user profile dropdown. La visualización de datos del usuario logueado mostrará información relevante (nombre, rol, último acceso) obtenida del estado Redux y API calls optimizadas. La funcionalidad de logout implementará cleanup completo del estado de autenticación, invalidación de tokens, y redirección segura. Las rutas protegidas usarán React Router guards para verificar autenticación, mostrando fallbacks apropiados y redirects automáticos. Este dashboard establecerá el foundation para navigation patterns y layout consistency en toda la aplicación.

**🔗 INTEGRACIÓN**
- **[Card] Conectar Frontend-Backend** (IS + SD)
  - **Asignado**: Equipo completo
  - **Fecha límite**: 3 nov 2025
  - **Checklist**:
    - [ ] Configurar CORS en backend
    - [ ] API calls desde React
    - [ ] Manejo de tokens JWT
    - [ ] Testing E2E con Cypress
  - **Etiquetas**: IS, SD, CRÍTICO
  - **Tiempo estimado**: 6 horas
  
  **Descripción completa:** Esta tarea crítica establece la comunicación integral entre frontend y backend, creando el puente que permite el funcionamiento cohesivo del sistema distribuido. Se implementará la integración completa que demuestre arquitectura de microservicios funcionando end-to-end. La configuración CORS en el backend permitirá requests cross-origin seguros, con whitelist de dominios permitidos y headers específicos. Las API calls desde React utilizarán RTK Query para data fetching optimizado, con error handling robusto, retry logic, y caching inteligente. El manejo de JWT tokens incluirá automatic token refresh, intercepción de requests para agregar headers Authorization, y logout automático on token expiration. Los tests E2E con Cypress validarán user journeys completos desde login hasta operaciones CRUD, asegurando que la integración funcione correctamente en escenarios reales. Esta integración servirá como foundation para todas las futuras comunicaciones entre servicios.

---

### **📅 Iteración 3: Gestión Empleados (4-17 nov 2025)**
**Sprint Goal**: CRUD empleados completo + pantallas frontend

#### **Tarjetas Trello:**

**⚙️ SCHEDULING SERVICE**
- **[Card] Crear scheduling-service** (IS + SD)
  - **Asignado**: Juan Camilo Avila Sanchez
  - **Fecha límite**: 8 nov 2025
  - **Checklist**:
    - [ ] `nest new scheduling-service`
    - [ ] Entidad Employee + DTOs
    - [ ] CRUD endpoints employees
    - [ ] Validaciones de negocio
  - **Etiquetas**: IS, SD
  - **Tiempo estimado**: 12 horas
  
  **Descripción completa:** Esta tarea fundamental crea el segundo microservicio del ecosistema, especializado en la gestión de empleados y scheduling, demostrando patterns de domain-driven design y separation of concerns. Se desarrollará un servicio independiente que maneje toda la lógica relacionada con empleados, desde información personal hasta disponibilidad y asignaciones. La entidad Employee implementará un modelo de datos robusto con propiedades como personal info, contact details, role, department, availability preferences, y scheduling constraints. Los DTOs (CreateEmployeeDto, UpdateEmployeeDto, EmployeeResponseDto) asegurarán type safety, validation, y data transformation consistente. Los endpoints CRUD proporcionarán operations completas (POST /employees, GET /employees, GET /employees/:id, PATCH /employees/:id, DELETE /employees/:id) con query parameters para filtering y sorting. Las validaciones de negocio incluirán rules como unicidad de email, validación de roles, y constraints de disponibilidad. Esta implementación establecerá patterns para microservices que se replicarán en el resto del sistema.

- **[Card] HU-03: Registrar empleado** (IS)
  - **Asignado**: Juan Camilo Avila Sanchez
  - **Fecha límite**: 10 nov 2025
  - **Checklist**:
    - [ ] POST /employees endpoint
    - [ ] Validar unicidad email
    - [ ] Emitir evento empleado creado
    - [ ] Tests unitarios + integración
  - **Etiquetas**: IS
  - **Tiempo estimado**: 8 horas
  
  **Descripción completa:** Esta historia de usuario implementa la funcionalidad core de registro de empleados, estableciendo la base para la gestión de recursos humanos del sistema de turnos. Se desarrollará un endpoint robusto que maneje la creación de empleados con validación exhaustiva y event-driven architecture. El POST /employees endpoint recibirá datos completos del empleado (nombre, apellido, email, teléfono, departamento, rol, fecha inicio) a través de CreateEmployeeDto con validation decorators. La validación de unicidad de email usará database constraints y business logic para prevenir duplicados, proporcionando error messages informativos. El evento 'empleado creado' se emitirá vía RabbitMQ para notificar otros servicios (como notifications-service para welcome emails), demostrando loose coupling y reactive architecture. Los tests unitarios cubrirán service methods con mocked dependencies, mientras integration tests validarán el endpoint completo incluidos casos de error y edge cases. Esta implementación servirá como patrón para otras historias de usuario CRUD.

**🎨 INTERFACES EMPLEADOS**
- **[Card] Lista empleados (HU-16)** (IHC)
  - **Asignado**: [Compañero 1 - Frontend/UX]
  - **Fecha límite**: 12 nov 2025
  - **Checklist**:
    - [ ] DataGrid con filtros y búsqueda
    - [ ] Paginación y ordenamiento
    - [ ] Acciones (editar, desactivar)
    - [ ] Estados visuales (activo/inactivo)
  - **Etiquetas**: IHC
  - **Tiempo estimado**: 10 horas

- **[Card] Formulario empleado** (IHC + IS)
  - **Asignado**: [Compañero 1 - Frontend/UX]
  - **Fecha límite**: 15 nov 2025
  - **Checklist**:
    - [ ] Crear/editar empleado
    - [ ] Validación frontend + backend
    - [ ] Upload de foto/documentos
    - [ ] Feedback de operaciones
  - **Etiquetas**: IHC, IS
  - **Tiempo estimado**: 12 horas

**🔄 COMUNICACIÓN SERVICIOS**
- **[Card] Event-driven básico** (SD)
  - **Asignado**: Jhoan Góngora
  - **Fecha límite**: 16 nov 2025
  - **Checklist**:
    - [ ] RabbitMQ integration
    - [ ] Employee events (created, updated)
    - [ ] Event handlers
    - [ ] Logging distribuido
  - **Etiquetas**: SD, CRÍTICO
  - **Tiempo estimado**: 8 horas
  
  **Descripción completa:** Esta tarea crítica implementa la comunicación asíncrona entre microservicios, estableciendo event-driven architecture que proporcione loose coupling, scalability, y resilience al sistema distribuido. Se desarrollará la infraestructura de messaging que permita reactive programming patterns y eventual consistency. La integración RabbitMQ incluirá connection management, exchange/queue configuration, y mensaje serialization/deserialization con proper error handling. Los employee events (created, updated, deleted) seguirán event sourcing patterns con payloads estructurados que incluyan entity data, timestamp, y metadata contextual. Los event handlers implementarán idempotency, retry logic con exponential backoff, y dead letter queues para error scenarios. El logging distribuido usará correlation IDs para tracing requests across services, structured logging con metadata contextual, y centralized log aggregation. Esta implementación servirá como foundation para reactive microservices architecture y establecerá patterns para future event-driven features.

---

### **📅 Iteraciones 4-8: Desarrollo Incremental (18 nov 2025 - 26 ene 2026)**

#### **Iteración 4: Gestión Eventos (18 nov - 1 dic 2025)**
- Crear events-service
- HU-09, HU-10, HU-11 (CRUD eventos)
- Calendar component React
- Event scheduling UI

#### **Iteración 5: Asignaciones (2-15 dic 2025)**
- HU-12, HU-13 (asignaciones manuales)
- Assignment board interface  
- Drag & drop functionality
- Conflict detection

#### **Iteración 6: Algoritmo Automático (16-29 dic 2025)**
- HU-14 (generador automático horarios)
- Optimization algorithms
- Scheduling preview UI
- Performance testing

#### **Iteración 7: Notificaciones (30 dic 2025 - 12 ene 2026)**
- HU-17, HU-18 (sistema notificaciones)
- Email/SMS integration
- Push notifications
- Notification preferences UI

#### **Iteración 8: Reportes y Analytics (13-26 ene 2026)**
- HU-01, HU-19 (reportes y auditoría)
- Dashboard analytics  
- Export functionality
- Performance metrics

---

### **📅 Iteración 9: Finalización (27 ene - 30 ene 2026)**
**Sprint Goal**: Pulir sistema + documentación final + presentación

#### **Tarjetas Trello:**

**🎓 ENTREGABLES ACADÉMICOS**
- **[Card] Documentación IHC** (IHC)
  - **Asignado**: Luisa Loaiza Pavon
  - **Fecha límite**: 28 ene 2026
  - **Checklist**:
    - [ ] Reporte DCU completo
    - [ ] Testing de usabilidad
    - [ ] Métricas UX finales
    - [ ] Guías de diseño

- **[Card] Documentación IS** (IS)  
  - **Asignado**: Juan Camilo Avila Sanchez
  - **Fecha límite**: 28 ene 2026
  - **Checklist**:
    - [ ] Arquitectura software
    - [ ] Metodología aplicada
    - [ ] Testing strategy
    - [ ] CI/CD pipeline

- **[Card] Documentación SD** (SD)
  - **Asignado**: Jhoan Góngora
  - **Fecha límite**: 28 ene 2026  
  - **Checklist**:
    - [ ] Sistemas distribuidos
    - [ ] Performance metrics
    - [ ] Observabilidad
    - [ ] Deployment guide

**🚀 PRESENTACIÓN FINAL**
- **[Card] Demo funcional** (Equipo)
  - **Asignado**: Todo el equipo
  - **Fecha límite**: 30 ene 2026
  - **Checklist**:
    - [ ] Sistema desplegado
    - [ ] Demo script
    - [ ] Presentación académica
    - [ ] Video demostrativo

---

## 🎯 **Template de Tarjeta Trello**

### **Template SMART para Tarjetas Trello:**

```
📋 [ITER-X][MATERIA] TÍTULO ESPECÍFICO - HU-XX (si aplica)

📊 Descripción SMART:
Como [tipo de usuario] quiero [funcionalidad específica] para [beneficio medible]

🎯 Criterios de Aceptación ESPECÍFICOS:
- [ ] Criterio medible 1 (ej: "API responde en <200ms")
- [ ] Criterio verificable 2 (ej: "Coverage >80%")
- [ ] Criterio funcional 3 (ej: "Login exitoso redirige a dashboard")

📊 SMART Goals:
• Específico (S): [Qué exactamente se va a hacer]
• Medible (M): [Cómo se medirá el éxito - métricas concretas]
• Alcanzable (A): [Por qué es realista con recursos disponibles]
• Relevante (R): [Cómo contribuye al objetivo del sprint]
• Temporal (T): [Cuándo estará completado]

⏱️ Estimación: X horas (basado en story points)
📅 Due Date: DD/MM/YYYY HH:MM
👤 Asignado: [Nombre completo del responsable]
🏷️ Etiquetas: [ITER-X, MATERIA, PRIORIDAD]
🔗 Dependencies: [Tarjetas que deben completarse antes]

💡 Notas Técnicas:
- Consideraciones de arquitectura
- Enlaces a documentación
- Referencias a HU o diagramas
- Riesgos identificados

✅ Definition of Done (DoD):
- [ ] Código desarrollado y funcional
- [ ] Tests unitarios escritos (>80% coverage)
- [ ] Tests de integración pasando
- [ ] Code review aprobado por 1+ miembros
- [ ] Funcionalidad desplegada en staging
- [ ] Documentación actualizada
- [ ] Demo preparado para sprint review
- [ ] Criterios de aceptación validados

🏃‍♂️ Flujo de Trabajo:
1. BACKLOG → SPRINT ACTUAL (al iniciar sprint)
2. SPRINT ACTUAL → EN DESARROLLO (al iniciar trabajo)
3. EN DESARROLLO → EN REVISIÓN (al terminar código)
4. EN REVISIÓN → COMPLETADO (tras code review + tests)
```

---

## 🎯 **METODOLOGÍA SMART EN TRELLO**

### **🎯 Aplicación de SMART Goals:**

#### **S - ESPECÍFICO (Specific):**
- ✅ **Títulos claros**: `[ITER-1][IS] Implementar JWT Authentication - HU-06`
- ✅ **Descripciones detalladas** con contexto completo
- ✅ **Criterios de aceptación** específicos y verificables
- ✅ **Scope bien definido** (qué se incluye y qué no)

#### **M - MEDIBLE (Measurable):**
- 📊 **Checklists cuantificables**: "Coverage >80%", "Respuesta API <200ms"
- 📊 **Labels de progreso**: 0%, 25%, 50%, 75%, 100%
- 📊 **Métricas claras**: "5 endpoints", "3 componentes React"
- 📊 **Time tracking**: Horas estimadas vs. reales

#### **A - ALCANZABLE (Achievable):**
- ✅ **Tareas divididas** en subtareas de 2-8 horas
- ✅ **Asignación realista** según expertise del miembro
- ✅ **Dependencies claras** entre tarjetas
- ✅ **Buffer time** del 20% para imprevistos

#### **R - RELEVANTE (Relevant):**
- 🎯 **Labels de prioridad**: CRÍTICO, High, Medium, Low
- 🎯 **Conexión clara** con objetivos académicos (IHC, IS, SD)
- 🎯 **Business value** explicado en descripción
- 🎯 **Mapeo con HU** correspondientes

#### **T - TEMPORAL (Time-bound):**
- ⏰ **Due dates específicas** con hora exacta
- ⏰ **Sprint boundaries** claros (2 semanas)
- ⏰ **Hitos académicos** marcados
- ⏰ **Daily standup** tracking

---

### **📊 Métricas y Seguimiento SMART:**

#### **📈 Métricas por Sprint:**
- **Velocity**: Story points completados vs. planificados
- **Burndown**: Tareas completadas por día
- **Code coverage**: % testing (meta: >80%)
- **Cycle time**: Tiempo promedio por tarjeta
- **Bugs detected**: Número de errores por iteración
- **Team satisfaction**: Retrospectiva semanal (1-10)

#### **📊 KPIs Académicos:**
- **Entregables IHC**: Wireframes, pruebas usabilidad
- **Entregables IS**: Arquitectura, testing strategy
- **Entregables SD**: Microservicios, observabilidad
- **Cross-cutting**: Documentación, presentaciones

#### **🎛️ Dashboard Trello Sugerido:**
- **Butler automations** para workflow SMART
- **Calendar view** para deadlines temporales
- **Timeline view** para dependencies
- **Board stats** para métricas medibles
- **Time tracking** para estimaciones alcanzables
- **Custom fields** para prioridad relevante

---

## 🚀 **Instrucciones para Configurar en Trello**

### **Paso 1: Crear tablero**
1. Ir a trello.com → Crear nuevo tablero
2. Nombre: "Gestor de Turnos - IHC + IS + SD"  
3. Visibilidad: Equipo
4. Fondo: Elegir tema profesional

### **Paso 2: Invitar miembros**
1. Agregar emails de los 3 compañeros
2. Asignar permisos de administrador
3. Configurar notificaciones

### **Paso 3: Crear listas**
Copiar exactamente las 7 listas mencionadas arriba

### **Paso 4: Configurar etiquetas**
1. IHC (Verde) - #61BD4F
2. IS (Azul) - #0079BF  
3. SD (Naranja) - #FF9F1A
4. DOCS (Amarillo) - #F2D600
5. BUG (Rojo) - #EB5A46
6. CRÍTICO (Morado) - #C377E0

### **Paso 5: Crear tarjetas**
Usar el template arriba para cada tarjeta de las iteraciones

### **Paso 6: Configurar Power-Ups para Visualización Gráfica**

#### **📊 GANTT CHART (Recomendado):**
- **Planyway for Trello** (Gratuito)
  - Instalar desde Power-Ups de Trello
  - Vista Gantt automática con fechas de tarjetas
  - Dependencies entre iteraciones
  - Export a PDF para presentaciones

#### **📅 CALENDARIO:**
- **Calendar** (Nativo de Trello)
  - Vista mensual de todas las fechas límite
  - Color por etiquetas (IHC=Verde, IS=Azul, SD=Naranja)
  - Sincronización con Google Calendar
  - Vista de sprints quincenales

#### **🗓️ TIMELINE/ROADMAP:**
- **Timeline** (Gratuito)
  - Vista horizontal de las 9 iteraciones
  - Hitos académicos marcados
  - Sprint boundaries visuales
  - Progress tracking

#### **📈 ADICIONALES:**
- **Voting**: Priorizar tareas por importancia
- **Time tracking**: Registrar horas trabajadas
- **Burndown**: Gráficos de progreso por sprint

### **Paso 7: Gestionar Iteraciones**

#### **🔄 Al Inicio de Cada Sprint:**
1. **Cambiar título** de la lista "SPRINT ACTUAL":
   - De: `📅 SPRINT ACTUAL: Iteración 0 (3-6 oct)`
   - A: `📅 SPRINT ACTUAL: Iteración 1 (7-20 oct)`

2. **Mover tarjetas** del BACKLOG al SPRINT ACTUAL
3. **Aplicar etiqueta** de iteración correspondiente (ITER-1, ITER-2, etc.)
4. **Activar filtros** por etiqueta para ver solo tareas del sprint

#### **📊 Al Final de Cada Sprint:**
1. **Mover tarjetas completadas** a COMPLETADO
2. **Revisar tarjetas pendientes** (mover a siguiente sprint o backlog)
3. **Crear retrospectiva** en los comentarios del tablero
4. **Actualizar métricas** de velocity

#### **🎯 Ejemplo Práctico - Iteración 1:**
```
📅 SPRINT ACTUAL: Iteración 1 - Backend Foundation (7-20 oct)

Tarjetas en esta lista:
✅ [ITER-1][IS] Crear auth-service
✅ [ITER-1][SD] Configurar base de datos  
🔄 [ITER-1][IS] Implementar JWT Authentication
📋 [ITER-1][IS] CRUD Usuarios básico
```

---

## 🎨 **Template Visual de Tarjeta con Iteración:**

### **Título de la tarjeta:**
```
[ITER-1][IS] Implementar JWT Authentication - HU-06
```

### **Descripción:**
```
🗓️ Sprint: Iteración 1 (7-20 oct 2025)
📋 Historia: Como coordinador, quiero autenticarme para acceder al sistema
⏱️ Estimación: 12 horas
📅 Due date: 14 oct 2025
👤 Asignado: [Compañero 2 - Backend Dev]

🎯 Criterios de Aceptación:
- [ ] POST /auth/login endpoint funcionando
- [ ] JWT strategy implementada  
- [ ] Guards protegiendo rutas
- [ ] Passwords hasheadas con bcrypt
```

---

---

## 📊 **VISUALIZACIÓN GRÁFICA DEL CRONOGRAMA**

### **🎯 Respuesta a: "¿Cómo se aplica gráficamente el cronograma?"**

El cronograma de Trello se puede visualizar de **3 formas principales**:

#### **1️⃣ DIAGRAMA DE GANTT** 
**Power-Up: Planyway for Trello (Gratuito)**

```
📊 Vista Gantt - 18 semanas (6 oct 2025 - 30 ene 2026)

Oct 2025    Nov 2025    Dec 2025    Jan 2026
|---|---|---|---|---|---|---|---|---|
ITER-0 ▓▓▓
    ITER-1 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
           ITER-2 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                   ITER-3 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                           ITER-4 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                                   ITER-5 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                                           ITER-6 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                                                   ITER-7 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                                                           ITER-8 ▓▓▓▓▓▓▓▓▓▓▓▓▓▓
                                                                   ITER-9 ▓▓▓▓
```

**✅ Beneficios:**
- Dependencies automáticas entre tareas
- Critical path identification
- Exportable a PDF para presentaciones académicas
- Reajuste automático de fechas

#### **2️⃣ VISTA CALENDARIO**
**Power-Up: Calendar (Nativo Trello)**

```
📅 Vista Calendario - Octubre 2025

        LUN   MAR   MIE   JUE   VIE
        6     7     8     9     10
    [🔧Setup] [🗄️DB] [⚙️Auth]

        13    14    15    16    17
    [🎨Wire] [🔐JWT] [👤CRUD] [📝Doc]

        20    21    22    23    24
              [🎨React Setup] [🌐UI]

Color coding:
🎨 IHC (Verde) | ⚙️ IS (Azul) | 🌐 SD (Naranja)
```

**✅ Beneficios:**
- Vista mensual/semanal de deadlines
- Integración con Google Calendar personal
- Color-coding por materias
- Recordatorios automáticos

#### **3️⃣ TIMELINE HORIZONTAL**
**Power-Up: Timeline (Gratuito)**

```
🗓️ Roadmap Visual - 9 Iteraciones

[ITER-0]──[ITER-1]──[ITER-2]──[ITER-3]──[ITER-4]──[ITER-5]──[ITER-6]──[ITER-7]──[ITER-8]──[ITER-9]
Setup      Backend    Frontend   Empleados  Eventos    Assign     Algorithm   Notify     Reports    Final
3-6oct     7-20oct    21oct-3nov 4-17nov    18nov-1dic 2-15dic    16-29dic    30dic-12e  13-26ene   27-30e

     🎓 Hitos Académicos:
     📚 Entrega IHC: 15 nov 2025
     📚 Entrega IS: 20 dic 2025  
     📚 Entrega SD: 25 ene 2026
     📚 Presentación Final: 30 ene 2026
```

**✅ Beneficios:**
- Vista de alto nivel del proyecto completo
- Hitos académicos claramente marcados
- Progress tracking por iteración
- Dependencies visualization

---

### **🚀 Configuración Paso a Paso:**

#### **Para Activar Vista Gantt:**
1. En tu tablero Trello → Menú → Power-Ups
2. Buscar "Planyway" → Agregar (gratuito)
3. Click en "Planyway" en la barra superior
4. ¡Automáticamente genera Gantt de tus tarjetas con fechas!

#### **Para Activar Vista Calendario:**
1. En tu tablero → Power-Ups → Calendar → Agregar
2. Click en "Calendar" en barra superior  
3. Vista mensual con todas las fechas límite
4. Cambiar colores según etiquetas de materias

#### **Para Activar Timeline:**
1. Power-Ups → Timeline → Agregar
2. Click "Timeline" → Vista horizontal de iteraciones
3. Marcar hitos académicos manualmente
4. Tracking de progreso por sprint

---

### **📋 Ejemplo Visual Práctico:**

**Cuando tu compañero pregunte por visualización, muéstrale esto:**

```
📊 OPCIÓN 1: "Quiero ver GANTT profesional"
   → Activar Planyway → Vista de project management

📅 OPCIÓN 2: "Quiero ver fechas en calendario"  
   → Activar Calendar → Vista mensual/semanal

🗓️ OPCIÓN 3: "Quiero ver roadmap de iteraciones"
   → Activar Timeline → Vista horizontal completa

📱 OPCIÓN 4: "Quiero ver en móvil"
   → App Trello móvil → Todas las vistas disponibles
```

**💡 Respuesta directa:** "Usamos **Trello + Power-Ups de Gantt** para visualización gráfica profesional, con exportación a PDF para presentaciones académicas y vista calendario para deadlines diarios."

---

## 🎯 **EJEMPLOS COMPLETOS DE TARJETAS SMART**

### **� Ejemplo 1: Tarjeta Backend Completa**

**Título:**
```
[ITER-1][IS] Implementar JWT Authentication - HU-06
```

**Descripción:**
```
🗓️ Sprint: Iteración 1 (7-20 oct 2025)
📋 Historia: Como coordinador, quiero autenticarme de forma segura para acceder al sistema y gestionar turnos

📊 SMART Goals:
• Específico (S): Implementar autenticación JWT completa con endpoints login/logout
• Medible (M): API login responde en <200ms, cobertura tests >80%
• Alcanzable (A): Juan Camilo tiene experiencia en NestJS + JWT
• Relevante (R): Crítico para seguridad del sistema (materia IS)
• Temporal (T): Completar para 14 oct 2025, 12:00 PM

⏱️ Estimación: 12 horas
📅 Due Date: 14 oct 2025, 12:00 PM
👤 Asignado: Juan Camilo Avila Sanchez
🏷️ Etiquetas: ITER-1, IS, CRÍTICO
🔗 Dependencies: "Configurar base de datos" (Jhoan)

🎯 Criterios de Aceptación ESPECÍFICOS:
- [ ] POST /auth/login endpoint funcionando correctamente
- [ ] JWT token generado con expiración 24h
- [ ] Password hash con bcrypt (12 rounds mínimo)
- [ ] Guards implementados para rutas protegidas
- [ ] Validación de datos con class-validator
- [ ] Respuesta API < 200ms (promedio 10 requests)
- [ ] Tests coverage > 80% en auth.service.ts

💡 Notas Técnicas:
- Usar @nestjs/jwt y @nestjs/passport
- Secret key en variables de entorno
- Refresh token opcional para MVP
- Integrar con base de datos users

✅ Definition of Done:
- [ ] Código desarrollado y funcional
- [ ] Tests unitarios > 80% coverage
- [ ] Tests de integración con Supertest
- [ ] Code review aprobado por Jhoan
- [ ] Endpoint documentado con Swagger
- [ ] Demo funcional en localhost
- [ ] Error handling implementado
```

### **📋 Ejemplo 2: Tarjeta Frontend Completa**

**Título:**
```
[ITER-2][IHC] Componente LoginForm - HU-06
```

**Descripción:**
```
🗓️ Sprint: Iteración 2 (21 oct - 3 nov 2025)
📋 Historia: Como usuario, quiero una interfaz intuitiva de login para acceder al sistema fácilmente

📊 SMART Goals:
• Específico (S): Crear componente React LoginForm con validación y feedback
• Medible (M): Formulario responde en <100ms, 0 errores de usabilidad
• Alcanzable (A): Luisa tiene experiencia en React + Material-UI
• Relevante (R): Esencial para UX del sistema (materia IHC)
• Temporal (T): Completar para 30 oct 2025, 6:00 PM

⏱️ Estimación: 10 horas
📅 Due Date: 30 oct 2025, 6:00 PM
👤 Asignado: Luisa Loaiza Pavon
🏷️ Etiquetas: ITER-2, IHC, IS
🔗 Dependencies: "JWT Authentication" (Juan Camilo)

🎯 Criterios de Aceptación ESPECÍFICOS:
- [ ] Formulario con campos email y password
- [ ] Validación en tiempo real (email format, password length)
- [ ] Loading state durante autenticación
- [ ] Mensajes de error user-friendly
- [ ] Integración con Redux store
- [ ] Responsive design (mobile + desktop)
- [ ] Accesibilidad WCAG 2.1 AA

💡 Notas Técnicas:
- Material-UI componentes base
- React Hook Form para validación
- RTK Query para API calls
- Loading spinners y error states

✅ Definition of Done:
- [ ] Componente desarrollado y funcional
- [ ] Tests unitarios con Jest + RTL
- [ ] Integración con backend auth
- [ ] Code review aprobado por equipo
- [ ] Responsive en 3+ dispositivos
- [ ] Accesibilidad validada
- [ ] Storybook story documentado
```

### **📋 Ejemplo 3: Tarjeta DevOps Completa**

**Título:**
```
[ITER-1][SD] Configurar base de datos - Foundation
```

**Descripción:**
```
🗓️ Sprint: Iteración 1 (7-20 oct 2025)
📋 Historia: Como desarrollador, necesito una base de datos configurada para persistir datos del sistema

📊 SMART Goals:
• Específico (S): Configurar PostgreSQL con migraciones y seeders iniciales
• Medible (M): DB responde en <50ms, 100% uptime durante sprint
• Alcanzable (A): Jhoan configuró Docker setup exitosamente
• Relevante (R): Base crítica para microservicios (materia SD)
• Temporal (T): Completar para 9 oct 2025, 5:00 PM

⏱️ Estimación: 4 horas
📅 Due Date: 9 oct 2025, 5:00 PM
👤 Asignado: Jhoan Góngora
🏷️ Etiquetas: ITER-1, SD, IS, CRÍTICO
🔗 Dependencies: Ninguna (tarea inicial)

🎯 Criterios de Aceptación ESPECÍFICOS:
- [ ] PostgreSQL 16 corriendo en Docker
- [ ] Base de datos 'gestor_turnos' creada
- [ ] Migrations iniciales ejecutadas
- [ ] Entidad User con campos completos
- [ ] Seeders con 3+ usuarios de prueba
- [ ] Conexión desde NestJS verificada
- [ ] Backup automático configurado

💡 Notas Técnicas:
- TypeORM como ORM principal
- Migrations en carpeta /migrations
- Seeds para datos de desarrollo
- Variables de entorno para conexión

✅ Definition of Done:
- [ ] DB accesible desde aplicación
- [ ] Scripts de migration funcionando
- [ ] Datos de prueba insertados
- [ ] Documentación de esquema
- [ ] Tests de conexión pasando
- [ ] Backup/restore validado
- [ ] Performance baseline establecido
```

---

## 🚀 **CONFIGURACIÓN AVANZADA TRELLO + SMART**

### **🎨 Configuración de Etiquetas Detallada:**

#### **Por Materia (Colores Hex):**
- 🎨 **IHC** (Verde): #61BD4F - Luisa Loaiza Pavon
- ⚙️ **IS** (Azul): #0079BF - Juan Camilo Avila Sanchez  
- 🌐 **SD** (Naranja): #FF9F1A - Jhoan Góngora
- 📚 **DOCS** (Amarillo): #F2D600 - Compartido
- 🐛 **BUG** (Rojo): #EB5A46 - Todos
- ⭐ **CRÍTICO** (Morado): #C377E0 - Alta prioridad

#### **Por Iteración (Colores Pastel):**
- 🟢 **ITER-0** (#A3E4D7) - Setup completado
- 🔵 **ITER-1** (#A9CCE3) - Backend Foundation
- 🟡 **ITER-2** (#F9E79F) - Frontend Foundation  
- 🟠 **ITER-3** (#F8C471) - Gestión Empleados
- 🟣 **ITER-4** (#D7A3E4) - Gestión Eventos
- 🔴 **ITER-5** (#F1948A) - Asignaciones
- ⚫ **ITER-6** (#85929E) - Algoritmo Automático
- 🟤 **ITER-7** (#D4A574) - Notificaciones
- 🔷 **ITER-8** (#5DADE2) - Reportes & Analytics
- ⚪ **ITER-9** (#F8F9FA) - Finalización

### **⚙️ Butler Automations SMART:**

```javascript
// Automation 1: Mover tarjetas automáticamente
when a card is moved to "EN DESARROLLO" 
  add the yellow "WORKING" label
  and set due date to 3 days from now

// Automation 2: Notificaciones de deadline
every day at 9:00 AM
  for each card in "EN DESARROLLO" due in less than 1 day
  add comment "⚠️ Deadline mañana! Review progreso"

// Automation 3: Completar tarjetas
when all items in a card's checklist are completed
  move the card to "EN REVISIÓN"
  and add comment "✅ Checklist completo - Listo para review"
```

---

**💡 Guía de Implementación:**
1. **Configurar etiquetas** con los colores exactos arriba
2. **Crear templates** usando los ejemplos SMART 
3. **Configurar Butler** para automatizaciones
4. **Activar Power-Ups** (Planyway, Calendar, Timeline)
5. **Invitar al equipo** con emails específicos

**🎯 Resultado:** Sistema de gestión de proyectos profesional con metodología SMART integrada, visualización Gantt automática, y tracking completo del progreso académico.