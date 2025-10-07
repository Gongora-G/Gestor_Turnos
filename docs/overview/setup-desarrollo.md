# Guía de Setup del Entorno de Desarrollo

## Información del Proyecto
- **Proyecto**: Gestor de Turnos para Corporación de Caddies
- **Fecha de Setup**: 3 de octubre de 2025
- **Stack Tecnológico**: NestJS + React + PostgreSQL + RabbitMQ + Docker

## 1. Herramientas Base Instaladas

### ✅ Runtime y Gestores de Paquetes
```bash
# Node.js y npm
Node.js: v22.18.0
npm: 10.9.3

# Python (para herramientas adicionales)
Python: 3.13.7 (con virtual environment configurado)
```

### ✅ Frameworks y CLIs
```bash
# NestJS CLI para microservicios backend
NestJS CLI: 11.0.10
nest --version

# TypeScript para desarrollo tipado
TypeScript: 5.9.3
tsc --version

# Vite para proyectos React
create-vite (instalado globalmente)
```

### ✅ Infraestructura y DevOps
```bash
# Docker para containerización
Docker: 28.3.2
Docker Compose: v2.39.1

# Control de versiones
Git: 2.51.0
```

## 2. Servicios de Infraestructura

### Configuración Docker Compose
**Archivo**: `infrastructure/docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: gestor-postgres
    environment:
      POSTGRES_DB: gestor_turnos
      POSTGRES_USER: gestor_admin
      POSTGRES_PASSWORD: gestor_pass
    ports:
      - "5432:5432"

  rabbitmq:
    image: rabbitmq:3.13-management-alpine
    container_name: gestor-rabbitmq
    ports:
      - "5672:5672"     # AMQP port
      - "15672:15672"   # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: gestor_admin
      RABBITMQ_DEFAULT_PASS: gestor_pass

  pgadmin:
    image: dpage/pgadmin4:8.9
    container_name: gestor-pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@gestor.local
      PGADMIN_DEFAULT_PASSWORD: gestor_pass
    ports:
      - "8081:80"
```

### Estados de Servicios Verificados
```bash
# Comando para verificar servicios corriendo
docker ps

# Verificación de conectividad PostgreSQL
docker exec gestor-postgres pg_isready -U gestor_admin -d gestor_turnos
# Output: /var/run/postgresql:5432 - accepting connections

# Verificación de estado RabbitMQ  
docker exec gestor-rabbitmq rabbitmq-diagnostics status
# Output: Status of node rabbit@93361628df5c ... ✅ Running
```

### URLs de Acceso
- **PostgreSQL**: `localhost:5432`
- **RabbitMQ Management**: http://localhost:15672
- **pgAdmin**: http://localhost:8081

### Credenciales de Servicios
```bash
# PostgreSQL & RabbitMQ
Usuario: gestor_admin
Contraseña: gestor_pass
Base de datos: gestor_turnos

# pgAdmin
Email: admin@gestor.local
Contraseña: gestor_pass
```

## 3. Comandos de Gestión del Entorno

### Iniciar Servicios
```bash
# Levantar todos los servicios
docker compose -f infrastructure/docker-compose.yml up -d

# Verificar estado
docker ps
```

### Detener Servicios
```bash
# Detener servicios manteniendo volúmenes
docker compose -f infrastructure/docker-compose.yml down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker compose -f infrastructure/docker-compose.yml down -v
```

### Logs de Servicios
```bash
# Ver logs de PostgreSQL
docker logs gestor-postgres

# Ver logs de RabbitMQ
docker logs gestor-rabbitmq

# Seguir logs en tiempo real
docker logs -f gestor-postgres
```

## 4. Verificación del Setup Completo

### Script de Verificación
```bash
# Verificar todas las herramientas
echo "=== VERIFICACIÓN DE ENTORNO ==="
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "NestJS CLI: $(nest --version)"
echo "TypeScript: $(tsc --version)"
echo "Docker: $(docker --version)"
echo "Git: $(git --version)"

# Verificar servicios
echo "=== SERVICIOS DOCKER ==="
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Test de conectividad
echo "=== CONECTIVIDAD ==="
docker exec gestor-postgres pg_isready -U gestor_admin -d gestor_turnos
docker exec gestor-rabbitmq rabbitmq-diagnostics check_port_connectivity
```

## 5. Próximos Pasos

### Estructura de Desarrollo Planificada
```
Gestor-Turnos/
├── services/                 # Microservicios NestJS
│   ├── auth-service/        # Autenticación y autorización
│   ├── scheduling-service/  # Gestión de turnos
│   ├── events-service/      # Gestión de eventos
│   ├── notifications-service/ # Notificaciones
│   └── reporting-service/   # Reportes y analíticas
├── frontend/               # Aplicación React
├── shared/                # Librerías compartidas
└── infrastructure/        # Docker, configs, deploy
```

### Microservicios a Desarrollar
1. **auth-service**: JWT, roles, permisos (Primer desarrollo)
2. **scheduling-service**: CRUD turnos, algoritmos asignación
3. **events-service**: Gestión eventos deportivos
4. **notifications-service**: Email, SMS, push notifications  
5. **reporting-service**: Dashboards, métricas, exportación

### Frontend React
- **Tecnologías**: React 18 + TypeScript + Vite
- **UI Framework**: Material-UI o Ant Design
- **Estado**: Redux Toolkit + RTK Query
- **Routing**: React Router v6

## 6. Resolución de Problemas Comunes

### Docker Desktop no arranca
```bash
# Verificar si Docker está corriendo
docker ps

# Si falla, iniciar Docker Desktop manualmente
start "C:\Program Files\Docker\Docker\Docker Desktop.exe"
```

### Puertos ocupados
```bash
# Verificar qué usa el puerto 5432
netstat -ano | findstr :5432

# Cambiar puertos en docker-compose.yml si es necesario
```

### Problemas de permisos PostgreSQL
```bash
# Reiniciar container de PostgreSQL
docker restart gestor-postgres

# Verificar logs para errores
docker logs gestor-postgres
```

---

**Fecha de última actualización**: 3 de octubre de 2025  
**Responsable**: Equipo de desarrollo  
**Estado**: ✅ Entorno completamente funcional