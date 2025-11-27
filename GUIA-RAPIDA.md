# ⚡ GUÍA RÁPIDA - Migrar Proyecto a Otro Computador

## 📦 ¿Qué necesitas instalar en el computador nuevo?

1. **Node.js v18+** → https://nodejs.org/
2. **Docker Desktop** → https://www.docker.com/products/docker-desktop/
3. **Git** → https://git-scm.com/
4. **VS Code** (recomendado) → https://code.visualstudio.com/

---

## 🚀 Pasos Rápidos

### 1️⃣ En tu laptop actual (ANTES de cambiar de PC):

```bash
# Subir cambios a GitHub
.\git-push.bat

# O manualmente:
git add .
git commit -m "Última actualización desde laptop"
git push origin master
```

**⚠️ GUARDA ESTOS ARCHIVOS EN USB:**
- `CREDENCIALES-PRIVADAS.txt` (contraseñas y secrets)
- `client_secret_*.json` (Google OAuth)
- Copia de archivos `.env` (si quieres)

---

### 2️⃣ En tu computador de escritorio (NUEVO):

```bash
# 1. Clonar repositorio
git clone https://github.com/Gongora-G/Gestor_Turnos.git
cd Gestor_Turnos

# 2. Configurar variables de entorno
copy .env.example .env
copy backend\auth-service\.env.example backend\auth-service\.env

# Editar .env con valores de CREDENCIALES-PRIVADAS.txt
notepad .env
notepad backend\auth-service\.env

# 3. Copiar credenciales de Google desde USB
copy D:\client_secret_*.json .

# 4. Instalar dependencias
cd backend\auth-service
npm install

cd ..\..\frontend
npm install

# 5. Levantar Docker
cd ..
docker-compose up -d

# 6. Iniciar aplicación
.\start-backend.bat   # Terminal 1
.\start-frontend.bat  # Terminal 2
```

---

## ✅ Verificación Rápida

Verifica que todo funcione:
- [ ] Docker corriendo: `docker ps`
- [ ] Backend: http://localhost:3002/api
- [ ] Frontend: http://localhost:5174
- [ ] Puedes hacer login

---

## 📝 Archivos Importantes

### ✅ Archivos que SÍ se suben a GitHub:
- Código fuente (`.ts`, `.tsx`, `.js`, etc.)
- `package.json` y `package-lock.json`
- `.env.example` (plantillas sin credenciales)
- `docker-compose.yml`
- `README.md`, `SETUP.md`
- Toda la carpeta `/docs`

### ❌ Archivos que NO se suben (están en .gitignore):
- `.env` (contiene contraseñas reales)
- `client_secret_*.json` (OAuth de Google)
- `CREDENCIALES-PRIVADAS.txt`
- `node_modules/` (se instalan con npm)
- `dist/`, `build/`
- Datos de Docker (`postgres_data/`, etc.)

---

## 🔄 Sincronizar cambios entre PCs

### Subir cambios:
```bash
.\git-push.bat
# O manualmente:
git add .
git commit -m "Descripción cambios"
git push origin master
```

### Traer cambios:
```bash
git pull origin master
npm install  # Si hay nuevas dependencias
```

---

## 🆘 Problemas Comunes

**Puerto ocupado:**
```bash
# Cambiar puerto en .env
DATABASE_PORT=5434
```

**Docker no inicia:**
```bash
# Reiniciar Docker Desktop
# Luego: docker-compose up -d
```

**Módulos no encontrados:**
```bash
rm -rf node_modules
npm install
```

**Frontend no compila:**
```bash
cd frontend
rm -rf node_modules/.vite
npm run dev
```

---

## 📞 Recursos

- **Guía completa:** Ver `SETUP.md`
- **Documentación:** Carpeta `/docs`
- **GitHub:** https://github.com/Gongora-G/Gestor_Turnos

---

💡 **TIP:** Guarda `CREDENCIALES-PRIVADAS.txt` en un password manager (Bitwarden, 1Password, etc.) para no perderlo.
