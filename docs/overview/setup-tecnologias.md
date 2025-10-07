# Preparación del entorno y tecnologías

> Guía pensada para Windows 10/11 con PowerShell. Ajusta los comandos según tu plataforma si trabajas en otro sistema operativo.

## 1. Herramientas base
1. **Git**
   - Descarga: https://git-scm.com/download/win
   - Verifica: `git --version`
2. **Node.js 20 LTS** (incluye npm)
   - Descarga: https://nodejs.org/en/download
   - Verifica: `node --version` y `npm --version`
3. **pnpm (opcional, recomendado)**
   - Instalación: `npm install -g pnpm`
   - Verifica: `pnpm --version`
4. **NestJS CLI**
   - Instalación: `npm install -g @nestjs/cli`
   - Verifica: `nest --version`
5. **Docker Desktop**
   - Descarga: https://www.docker.com/products/docker-desktop
   - Asegúrate de habilitar la integración con WSL2.
6. **Visual Studio Code** + extensiones sugeridas
   - Markdown All in One
   - Draw.io Integration (para abrir archivos `.drawio`)
   - ESLint, Prettier, GitLens

## 2. Bases de datos y mensajería
Usaremos contenedores para simplificar la instalación local.

1. Crea un archivo `.env` (o usa variables de entorno en tu terminal) si deseas parametrizar las credenciales.
2. Ejecuta el `docker-compose.yml` ubicado en `infrastructure/`:

```powershell
cd C:\Users\Jhoan Gongora\Desktop\Gestor-Turnos\infrastructure
docker compose up -d
```

Servicios levantados:
- **PostgreSQL** (`localhost:5432`, usuario `gestor_admin`, contraseña `gestor_pass`, base `gestor_turnos`).
- **RabbitMQ** (`localhost:5672`), panel de administración en `http://localhost:15672` (credenciales `gestor_admin` / `gestor_pass`).
- **pgAdmin** (`http://localhost:8081`) para administrar la base de datos desde el navegador.

Para apagar los contenedores:

```powershell
docker compose down
```

## 3. Herramientas de modelado y diseño
1. **diagrams.net / Draw.io**
   - Online: https://app.diagrams.net/
   - Desktop (opcional): https://github.com/jgraph/drawio-desktop/releases
   - Archivos editables: `docs/overview/modelo-datos.drawio`, `docs/overview/casos-de-uso.drawio`.
2. **Figma** (opcional) para prototipos de interfaz.
3. **DB visualization** (opcional): DBeaver o TablePlus para explorar PostgreSQL.

## 4. Dependencias de desarrollo (cuando empecemos código)
- **TypeScript** y configuraciones por microservicio (NestJS las gestiona automáticamente).
- **Jest** para pruebas unitarias (viene preconfigurado con Nest).
- **ESLint + Prettier** para estilo de código.
- **Playwright/Cypress** para pruebas end-to-end (se instalará en la fase correspondiente).
- **k6** para pruebas de carga (`choco install k6` si usas Chocolatey).

## 5. Gestión de variables de entorno
Durante el desarrollo crearemos archivos `.env` por servicio con la siguiente estructura mínima:

```
DATABASE_URL=postgresql://gestor_admin:gestor_pass@localhost:5432/gestor_turnos
RABBITMQ_URL=amqp://gestor_admin:gestor_pass@localhost:5672
JWT_SECRET=super-secret-key
PORT=3000
```

> Nunca subas archivos `.env` reales al repositorio. Mantén un `.env.example` para documentar las variables necesarias.

## 6. Checklist previo al desarrollo
- [ ] Git, Node.js y Nest CLI instalados y verificados.
- [ ] Docker Desktop operativo con WSL2.
- [ ] `docker compose up -d` funciona y puedes ingresar a `pgAdmin` y al panel de RabbitMQ.
- [ ] Diagramas abiertos correctamente en la herramienta de tu preferencia.
- [ ] Documentación revisada (acta, plan de calidad, arquitectura, cronograma, backlog).

Con estos pasos finalizamos la etapa de preparación técnica antes de escribir código.
