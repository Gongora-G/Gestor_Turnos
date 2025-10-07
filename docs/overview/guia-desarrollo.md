# Guía Práctica de Desarrollo - Gestor de Turnos

## 🎯 Objetivos de esta Guía
Esta guía conecta los conceptos teóricos de las 3 materias académicas con la implementación práctica del sistema, proporcionando un roadmap detallado para el desarrollo.

---

## 1. FASE DE INICIALIZACIÓN

### ✅ **Setup Completado** 
- [x] Entorno de desarrollo configurado
- [x] Servicios Docker funcionando (PostgreSQL, RabbitMQ, pgAdmin)
- [x] Herramientas instaladas (Node.js, NestJS CLI, TypeScript)
- [x] Documentación base creada

### 🔄 **Próximos Pasos Inmediatos**
1. **Crear estructura de microservicios**
2. **Implementar auth-service (primera funcionalidad)**
3. **Setup básico del frontend React**

---

## 2. DEVELOPMENT ROADMAP

### **🏗️ ITERACIÓN 1-2: Fundaciones Backend**

#### **Objetivo**: Servicio de autenticación funcional + estructura base

#### **Tareas IHC (Interacción Humano-Computador)**
- [ ] **Wireframes de autenticación**
  - Pantalla login con validación
  - Formulario recuperar contraseña  
  - Dashboard básico post-login
- [ ] **Análisis de flujos de usuario**
  - Journey map: Proceso de login actual vs optimizado
  - Identificación de pain points en autenticación manual

#### **Tareas IS (Ingeniería de Software)**  
- [ ] **Crear auth-service**
  ```bash
  # Comando para generar servicio
  cd services/
  nest new auth-service
  cd auth-service
  npm install @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator class-transformer
  ```
  
- [ ] **Estructura del proyecto**
  ```
  auth-service/
  ├── src/
  │   ├── auth/
  │   │   ├── auth.controller.ts    # POST /login, /register
  │   │   ├── auth.service.ts       # Lógica JWT
  │   │   ├── auth.module.ts        # Módulo configuración
  │   │   └── strategies/
  │   │       └── jwt.strategy.ts   # Estrategia JWT
  │   ├── users/
  │   │   ├── users.controller.ts   # CRUD usuarios
  │   │   ├── users.service.ts      # Lógica negocio
  │   │   ├── entities/user.entity.ts
  │   │   └── dto/
  │   │       ├── create-user.dto.ts
  │   │       └── update-user.dto.ts
  │   ├── database/
  │   │   ├── database.module.ts    # Conexión PostgreSQL
  │   │   └── migrations/           # Scripts DB
  │   └── shared/
  │       ├── guards/
  │       ├── decorators/
  │       └── filters/
  ```

- [ ] **Testing inicial**
  ```typescript
  // auth.service.spec.ts - Ejemplo test unitario
  describe('AuthService', () => {
    it('should generate JWT token on valid login', async () => {
      const user = { email: 'test@test.com', password: 'hashedPassword' };
      const result = await authService.login(user);
      expect(result.access_token).toBeDefined();
    });
  });
  ```

#### **Tareas SD (Sistemas Distribuidos)**
- [ ] **Configurar base de datos distribuida**
  ```typescript
  // database.config.ts
  export const databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'gestor_admin',
    password: process.env.DB_PASS || 'gestor_pass',
    database: process.env.DB_NAME || 'gestor_turnos',
    synchronize: process.env.NODE_ENV === 'development',
    logging: true,
  };
  ```

- [ ] **Setup inicial de logging distribuido**
  ```typescript
  // logger.config.ts
  import { WinstonModule } from 'nest-winston';
  import * as winston from 'winston';
  
  export const loggerConfig = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        )
      })
    ]
  });
  ```

#### **Entregables Iteración 1-2**
- [ ] auth-service funcionando con JWT
- [ ] Endpoints: POST /auth/login, POST /auth/register, GET /users/profile  
- [ ] Base de datos con tabla users
- [ ] Tests unitarios básicos (>70% coverage)
- [ ] Wireframes de pantallas de autenticación

---

### **🎨 ITERACIÓN 3-4: Frontend Base + UX**

#### **Objetivo**: Aplicación React con autenticación + primeros componentes UX

#### **Tareas IHC**
- [ ] **Crear proyecto React**
  ```bash
  cd frontend/
  npm create vite@latest . -- --template react-ts
  npm install @mui/material @emotion/react @emotion/styled
  npm install react-router-dom @reduxjs/toolkit react-redux
  ```

- [ ] **Implementar design system básico**
  ```typescript
  // src/theme/theme.ts
  import { createTheme } from '@mui/material/styles';
  
  export const theme = createTheme({
    palette: {
      primary: { main: '#1976d2' },      // Azul corporativo
      secondary: { main: '#dc004e' },     // Rojo acentos
      background: { default: '#f5f5f5' }  // Gris claro
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif'
    }
  });
  ```

- [ ] **Componentes de autenticación**
  ```typescript
  // src/components/auth/LoginForm.tsx
  interface LoginFormProps {
    onSubmit: (credentials: LoginCredentials) => void;
    loading?: boolean;
    error?: string;
  }
  
  export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading, error }) => {
    // Implementación del formulario con validación
    // Aplicar principios de usabilidad: mensajes claros, feedback visual
  };
  ```

- [ ] **Testing de usabilidad inicial**
  - Tiempo promedio para completar login
  - Facilidad de recuperación de contraseña
  - Claridad de mensajes de error

#### **Tareas IS**  
- [ ] **Arquitectura frontend**
  ```
  frontend/
  ├── src/
  │   ├── components/           # Componentes reutilizables
  │   │   ├── auth/
  │   │   ├── shared/
  │   │   └── layout/
  │   ├── pages/               # Páginas principales
  │   │   ├── LoginPage.tsx
  │   │   ├── DashboardPage.tsx
  │   │   └── NotFoundPage.tsx
  │   ├── store/               # Redux store
  │   │   ├── authSlice.ts
  │   │   └── apiSlice.ts
  │   ├── services/            # API calls
  │   │   └── authApi.ts
  │   ├── hooks/               # Custom hooks
  │   ├── utils/               # Utilidades
  │   └── types/               # TypeScript types
  ```

- [ ] **Integración con backend**
  ```typescript
  // src/services/authApi.ts
  import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
  
  export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
      baseUrl: process.env.VITE_API_URL || 'http://localhost:3000',
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) headers.set('authorization', `Bearer ${token}`);
        return headers;
      },
    }),
    endpoints: (builder) => ({
      login: builder.mutation<LoginResponse, LoginRequest>({
        query: (credentials) => ({
          url: '/auth/login',
          method: 'POST',
          body: credentials,
        }),
      }),
    }),
  });
  ```

#### **Tareas SD**
- [ ] **Configurar CORS y comunicación entre servicios**
  ```typescript
  // auth-service main.ts
  import { NestFactory } from '@nestjs/core';
  
  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      credentials: true,
    });
    await app.listen(3001); // Puerto específico para auth-service
  }
  ```

#### **Entregables Iteración 3-4**
- [ ] Aplicación React con routing básico
- [ ] Login/logout funcional end-to-end  
- [ ] Dashboard básico con información del usuario
- [ ] Componentes base del design system
- [ ] Tests E2E con Playwright/Cypress

---

### **⚙️ ITERACIÓN 5-6: Scheduling Service + Gestión Empleados**

#### **Objetivo**: CRUD empleados + creación de eventos básicos

#### **Tareas IS**
- [ ] **Crear scheduling-service**
  ```bash
  cd services/
  nest new scheduling-service
  # Instalar dependencias para TypeORM, validación, etc.
  ```

- [ ] **Entidades y DTOs**
  ```typescript
  // src/employees/entities/employee.entity.ts
  @Entity('employees')
  export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column()
    firstName: string;
    
    @Column()
    lastName: string;
    
    @Column({ unique: true })
    email: string;
    
    @Column()
    phone: string;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @UpdateDateColumn()
    updatedAt: Date;
  }
  ```

- [ ] **Implementar HU-03: Registrar empleado**
  ```typescript
  // employees.service.ts
  async createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // 1. Validar unicidad de email
    // 2. Crear empleado en base datos  
    // 3. Emitir evento empleado creado
    // 4. Enviar notificación de bienvenida
  }
  ```

#### **Tareas IHC**
- [ ] **Pantallas de gestión de empleados**
  - Lista de empleados con filtros y búsqueda
  - Formulario crear/editar empleado
  - Vista detalle empleado con historial

- [ ] **Componentes React**
  ```typescript
  // EmployeeList.tsx - implementa HU-16
  export const EmployeeList = () => {
    const [filters, setFilters] = useState({ status: 'active', search: '' });
    const { data: employees, isLoading } = useGetEmployeesQuery(filters);
    
    return (
      <DataGrid
        rows={employees}
        columns={employeeColumns}
        loading={isLoading}
        filterModel={filters}
        onFilterModelChange={setFilters}
      />
    );
  };
  ```

#### **Tareas SD**  
- [ ] **Comunicación entre auth-service y scheduling-service**
  ```typescript
  // Implementar patrón API Gateway
  // auth-service valida JWT
  // scheduling-service consume datos de usuario validados
  ```

- [ ] **Event-driven architecture básica**
  ```typescript
  // Events para comunicación asíncrona
  export enum EmployeeEvents {
    EMPLOYEE_CREATED = 'employee.created',
    EMPLOYEE_UPDATED = 'employee.updated', 
    EMPLOYEE_DEACTIVATED = 'employee.deactivated'
  }
  ```

#### **Entregables Iteración 5-6**
- [ ] CRUD completo de empleados (HU-03, HU-04, HU-05)
- [ ] Integración frontend-backend para gestión empleados
- [ ] Validaciones y manejo de errores
- [ ] Eventos básicos entre servicios

---

### **📅 ITERACIÓN 7-8: Eventos y Asignaciones**

#### **Objetivo**: Gestión completa de eventos deportivos + asignaciones manuales

#### **Tareas principales**
- [ ] Implementar HU-09, HU-10, HU-11 (gestión eventos)
- [ ] Implementar HU-12, HU-13 (asignaciones)  
- [ ] Implementar HU-15, HU-16 (visualización calendarios)
- [ ] Sistema básico de notificaciones

---

### **🚀 ITERACIÓN 9: Optimización y Entrega**

#### **Objetivo**: Pulir sistema + documentación final + métricas

#### **Tareas finales**
- [ ] Implementar algoritmo asignación automática (HU-14)
- [ ] Sistema completo de reportes (HU-01, HU-19)
- [ ] Optimizaciones de performance
- [ ] Testing completo y documentación

---

## 3. COMANDOS Y SCRIPTS ÚTILES

### **Desarrollo Backend**
```bash
# Crear nuevo microservicio
cd services/
nest new [service-name]

# Generar módulo, controller, service
nest g module [name]
nest g controller [name]  
nest g service [name]

# Ejecutar tests
npm run test              # Unit tests
npm run test:e2e          # Integration tests
npm run test:cov          # Coverage report

# Generar migración DB
npm run migration:generate
npm run migration:run
```

### **Desarrollo Frontend**  
```bash
# Crear componente
cd frontend/src/components/
mkdir [component-name] && cd [component-name]
touch index.tsx [ComponentName].tsx [ComponentName].test.tsx

# Ejecutar desarrollo
npm run dev               # Servidor desarrollo
npm run build            # Build producción  
npm run preview          # Preview build

# Testing
npm run test             # Unit tests
npm run test:e2e         # E2E with Playwright
```

### **Infraestructura**
```bash  
# Gestión Docker
docker compose -f infrastructure/docker-compose.yml up -d
docker compose logs [service-name]
docker compose down

# Backup base datos
docker exec gestor-postgres pg_dump -U gestor_admin gestor_turnos > backup.sql

# Monitoring
docker stats                    # Recursos containers
docker exec gestor-postgres pg_isready    # Health check DB
```

---

## 4. CHECKLIST DE CALIDAD

### **Por cada funcionalidad implementada:**
- [ ] ✅ **Tests unitarios** (coverage > 80%)
- [ ] ✅ **Tests E2E** para happy path  
- [ ] ✅ **Validación de inputs** (DTO + class-validator)
- [ ] ✅ **Manejo de errores** con mensajes claros
- [ ] ✅ **Logging** para debugging y auditoría
- [ ] ✅ **Documentación** actualizada (README + Swagger)
- [ ] ✅ **Review de código** por otro desarrollador
- [ ] ✅ **Testing de usabilidad** (IHC)

### **Por cada iteración:**
- [ ] 📊 **Métricas de performance** medidas
- [ ] 🔒 **Security review** (OWASP top 10)
- [ ] ♿ **Accesibilidad** validada (WCAG 2.1)  
- [ ] 📱 **Responsive design** probado
- [ ] 🚀 **Deploy en staging** exitoso
- [ ] 📚 **Documentación** por materia actualizada

---

## 5. RECURSOS Y REFERENCIAS

### **IHC - Interacción Humano-Computador**
- [Material Design Guidelines](https://material.io/design)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [System Usability Scale (SUS)](https://www.usability.gov/how-to-and-tools/methods/system-usability-scale.html)

### **IS - Ingeniería de Software**
- [NestJS Documentation](https://docs.nestjs.com/)
- [Clean Architecture Principles](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Test Pyramid Strategy](https://martinfowler.com/articles/practical-test-pyramid.html)

### **SD - Sistemas Distribuidos**  
- [Microservices Patterns](https://microservices.io/patterns/index.html)
- [12-Factor App Methodology](https://12factor.net/)
- [Observability Engineering](https://www.oreilly.com/library/view/observability-engineering/9781492076438/)

---

**📅 Próxima revisión**: Al completar cada iteración  
**🎯 Meta**: Sistema funcional que demuestre integración exitosa de las 3 materias académicas  
**📊 Estado actual**: Entorno configurado → Iniciando desarrollo backend