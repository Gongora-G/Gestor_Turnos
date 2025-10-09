# 🔐 Credenciales del Sistema Gestor de Turnos

## 📊 Base de Datos PostgreSQL

### Conexión Docker (Recomendada)
- **Host**: `localhost`
- **Puerto**: `5433`
- **Base de datos**: `gestor_turnos`
- **Usuario**: `postgres`
- **Contraseña**: `postgres123`
- **Schema**: `auth`

### Conexión Interna (Contenedores)
- **Host**: `postgres`
- **Puerto**: `5432`
- **Base de datos**: `gestor_turnos`
- **Usuario**: `postgres`
- **Contraseña**: `postgres123`

## 🔧 pgAdmin (Web Interface)

### Acceso Web
- **URL**: `http://localhost:5051`
- **Email**: `admin@gestorturnos.com`
- **Contraseña**: `admin123`

### Configuración de Servidor en pgAdmin
- **Nombre**: `Gestor Turnos DB`
- **Host**: `localhost` (IMPORTANTE: NO uses "postgres" desde pgAdmin web)
- **Puerto**: `5433` (IMPORTANTE: Puerto externo de Docker)
- **Base de datos**: `gestor_turnos`
- **Usuario**: `postgres`
- **Contraseña**: `postgres123`

### ⚠️ IMPORTANTE - Configuración correcta:
**Desde pgAdmin web (navegador):**
- Host: `localhost`
- Puerto: `5433`

**Desde aplicaciones dentro de contenedores:**
- Host: `postgres` 
- Puerto: `5432`

## 🚀 Aplicación Web

### Frontend (React + Vite)
- **URL**: `http://localhost:5173`
- **Registro**: `http://localhost:5173/register`
- **Login**: `http://localhost:5173/login`

### Backend (NestJS)
- **URL**: `http://localhost:3000`
- **API Auth**: `http://localhost:3000/auth`
- **Endpoints**:
  - POST `/auth/register` - Registro
  - POST `/auth/login` - Login
  - GET `/auth/profile` - Perfil (requiere JWT)
  - GET `/auth/validate` - Validar token

## 👤 Usuarios de Prueba

### Usuario Demo
- **Email**: `demo@gestor.com`
- **Contraseña**: `password123`
- **Rol**: `client`

### Usuarios Registrados (Ejemplo de contraseñas válidas)
- **Formato**: `MiPassword123!`
- **Requisitos**: 8+ caracteres, mayúscula, minúscula, número, carácter especial (@$!%*?&)

## 🐳 Docker

### Contenedores Activos
- **PostgreSQL**: `gestor-turnos-db`
- **pgAdmin**: `gestor-turnos-pgadmin`
- **Redis**: `gestor-turnos-redis`
- **RabbitMQ**: `gestor-turnos-rabbitmq`

### Comandos Docker Útiles
```bash
# Ver contenedores corriendo
docker ps

# Iniciar servicios
docker-compose up -d

# Parar servicios
docker-compose down

# Ver logs de base de datos
docker logs gestor-turnos-db

# Conectar directamente a PostgreSQL
docker exec -it gestor-turnos-db psql -U postgres -d gestor_turnos
```

## 🔍 Extensiones VS Code Recomendadas

### Base de Datos
- **SQLTools**: `mtxr.sqltools`
- **SQLTools PostgreSQL Driver**: `mtxr.sqltools-driver-pg`
- **PostgreSQL**: `ckolkman.vscode-postgres`

### Desarrollo Web
- **ES7+ React/Redux/React-Native snippets**: `dsznajder.es7-react-js-snippets`
- **Auto Rename Tag**: `formulahendry.auto-rename-tag`
- **Bracket Pair Colorizer**: `coenraads.bracket-pair-colorizer`
- **GitLens**: `eamodio.gitlens`
- **Thunder Client**: `rangav.vscode-thunder-client` (para probar APIs)

## 📁 Estructura de Archivos Importantes

### Configuración
- **Docker**: `docker-compose.yml`
- **Backend Config**: `backend/auth-service/.env`
- **Frontend Config**: `frontend/.env`

### Base de Datos
- **Inicialización**: `infrastructure/init-db/01-init.sql`
- **Entidades**: `backend/auth-service/src/users/entities/user.entity.ts`

## 🔐 Seguridad

### JWT Secret
- **Variable**: `JWT_SECRET` (definida en backend/.env)
- **Expiración**: Configurable en auth service

### Encriptación
- **Contraseñas**: bcrypt con salt rounds
- **Algoritmo JWT**: HS256

---

**Fecha de creación**: 9 de octubre de 2025
**Última actualización**: 9 de octubre de 2025
**Proyecto**: Gestor de Turnos Inteligente