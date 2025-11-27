# 🚀 Guía de Configuración - Gestor de Turnos

## 📋 Requisitos del Sistema

### Software Necesario:
1. **Node.js** (v18 o superior) - [Descargar](https://nodejs.org/)
2. **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop/)
3. **Git** - [Descargar](https://git-scm.com/)
4. **PostgreSQL** (opcional si usas Docker)
5. **Editor de código** (VS Code recomendado)

---

## 🔧 Configuración Inicial en Computador Nuevo

### 1️⃣ Clonar el Repositorio

```bash
# Clonar desde GitHub
git clone https://github.com/Gongora-G/Gestor_Turnos.git
cd Gestor_Turnos
```

### 2️⃣ Configurar Variables de Entorno

**Backend:**
```bash
# Copiar archivo de ejemplo
cd backend/auth-service
copy .env.example .env

# Editar .env con tus valores reales
notepad .env
```

**Raíz del proyecto:**
```bash
cd ../..
copy .env.example .env
notepad .env
```

**⚠️ IMPORTANTE:** Configura estos valores:
- `DATABASE_PASSWORD`: La contraseña de PostgreSQL
- `REDIS_PASSWORD`: La contraseña de Redis
- `JWT_SECRET`: Genera un token seguro (ver sección abajo)
- `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`: Tus credenciales de Google OAuth

### 3️⃣ Generar JWT Secret Seguro

**Opción 1 - PowerShell:**
```powershell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

**Opción 2 - Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4️⃣ Configurar Google OAuth (Si aún no lo tienes)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita "Google+ API"
4. Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth"
5. Configura las URLs autorizadas:
   - **Orígenes autorizados:** `http://localhost:5173`, `http://localhost:3002`
   - **URIs de redirección:** 
     - `http://localhost:3002/auth/google/callback`
     - `http://localhost:3002/auth/google/register/callback`
6. Copia el `Client ID` y `Client Secret` a tu archivo `.env`

### 5️⃣ Archivo de Credenciales de Google

Si tienes el archivo `client_secret_*.json`:
```bash
# Cópialo a la raíz del proyecto (NO lo subas a Git)
copy path\to\client_secret_*.json .
```

---

## 🐳 Iniciar con Docker (Recomendado)

### Levantar servicios (PostgreSQL, Redis, RabbitMQ):
```bash
docker-compose up -d
```

### Verificar que están corriendo:
```bash
docker ps
```

Deberías ver:
- `postgres` en puerto 5433
- `redis` en puerto 6379
- `rabbitmq` en puerto 5672

---

## 📦 Instalación de Dependencias

### Backend:
```bash
cd backend/auth-service
npm install
```

### Frontend:
```bash
cd ../../frontend
npm install
```

---

## 🗄️ Base de Datos

### Crear la base de datos:
```bash
# Si usas Docker, ya está creada automáticamente
# Si usas PostgreSQL local:
createdb -U postgres gestor_turnos
```

### Ejecutar migraciones/scripts:
```bash
cd backend/auth-service
# Si hay migraciones pendientes, ejecutar:
npm run migration:run
```

---

## ▶️ Iniciar la Aplicación

### Opción 1 - Usando scripts del proyecto:

**Backend:**
```bash
# Desde la raíz del proyecto
.\start-backend.bat
```

**Frontend:**
```bash
.\start-frontend.bat
```

### Opción 2 - Manualmente:

**Terminal 1 - Backend:**
```bash
cd backend/auth-service
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Acceder a la Aplicación

- **Frontend:** http://localhost:5174
- **Backend API:** http://localhost:3002
- **Swagger Docs:** http://localhost:3002/api

---

## 📝 Archivos que NO se suben a GitHub

Estos archivos están en `.gitignore` y debes configurarlos manualmente:

- ✅ `.env` (raíz y backend/auth-service)
- ✅ `client_secret_*.json` (credenciales de Google)
- ✅ `node_modules/` (se instalan con npm install)
- ✅ `dist/` y `build/` (se generan al compilar)
- ✅ Carpetas de datos de Docker (`postgres_data/`, etc.)

---

## 🔄 Sincronizar Cambios

### Subir cambios a GitHub:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin master
```

### Traer cambios en otro computador:
```bash
git pull origin master
npm install  # Si hay nuevas dependencias
```

---

## 🛠️ Comandos Útiles

### Docker:
```bash
# Ver logs de servicios
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra datos)
docker-compose down -v
```

### Base de datos:
```bash
# Conectarse a PostgreSQL
docker exec -it gestor-turnos-postgres psql -U postgres -d gestor_turnos

# Backup de base de datos
docker exec gestor-turnos-postgres pg_dump -U postgres gestor_turnos > backup.sql

# Restaurar backup
docker exec -i gestor-turnos-postgres psql -U postgres gestor_turnos < backup.sql
```

---

## ❓ Solución de Problemas

### Puerto 5433 ocupado:
```bash
# Cambiar puerto en .env y docker-compose.yml
DATABASE_PORT=5434
```

### Error de conexión a PostgreSQL:
```bash
# Verificar que Docker está corriendo
docker ps

# Reiniciar contenedor
docker restart gestor-turnos-postgres
```

### Módulos no encontrados:
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Frontend no compila:
```bash
# Limpiar caché de Vite
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

## 📞 Contacto y Soporte

- **GitHub Issues:** https://github.com/Gongora-G/Gestor_Turnos/issues
- **Documentación:** Ver carpeta `/docs`

---

## ✅ Checklist de Configuración

Antes de empezar a trabajar, verifica:

- [ ] Node.js instalado (`node --version`)
- [ ] Docker Desktop instalado y corriendo
- [ ] Git instalado (`git --version`)
- [ ] Repositorio clonado
- [ ] Archivos `.env` configurados (backend y raíz)
- [ ] Credenciales de Google OAuth configuradas
- [ ] Docker Compose levantado (`docker-compose up -d`)
- [ ] Dependencias instaladas (backend y frontend)
- [ ] Base de datos creada y migraciones ejecutadas
- [ ] Backend corriendo en http://localhost:3002
- [ ] Frontend corriendo en http://localhost:5174
- [ ] Puedes hacer login en la aplicación

¡Listo para desarrollar! 🎉
