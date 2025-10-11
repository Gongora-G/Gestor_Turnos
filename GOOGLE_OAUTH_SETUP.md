# 🔐 Configuración de Google OAuth

## ✅ Backend ya configurado

El backend ya tiene toda la configuración necesaria para Google OAuth:

- ✅ Dependencias instaladas: `passport-google-oauth20`
- ✅ Estrategia de Google OAuth: `src/auth/strategies/google.strategy.ts`
- ✅ Guard de Google OAuth: `src/auth/guards/google-oauth.guard.ts`
- ✅ Endpoints configurados:
  - `GET /auth/google` - Inicia el flujo OAuth
  - `GET /auth/google/callback` - Maneja el callback de Google
- ✅ Método de validación: `validateGoogleUser` en AuthService
- ✅ Frontend actualizado con botones funcionales en Login y Register

## 🔧 Configuración pendiente

### 1. Google Cloud Console

Necesitas configurar una aplicación en Google Cloud Console:

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la Google+ API:
   - Ve a "APIs & Services" > "Library"
   - Busca "Google+ API" y habilítala
4. Crear credenciales OAuth 2.0:
   - Ve a "APIs & Services" > "Credentials"
   - Clic en "Create Credentials" > "OAuth 2.0 Client IDs"
   - Tipo de aplicación: "Web application"
   - Nombre: "Gestor de Turnos"
   - URIs de redireccionamiento autorizados:
     - `http://localhost:3000/auth/google/callback`
     - `https://tu-dominio.com/auth/google/callback` (para producción)

### 2. Variables de entorno

Actualiza el archivo `.env` en `backend/auth-service/` con tus credenciales reales:

```env
# 🔗 Google OAuth Configuration
GOOGLE_CLIENT_ID=tu_google_client_id_real
GOOGLE_CLIENT_SECRET=tu_google_client_secret_real
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# 🌐 Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Proceso de autenticación

Una vez configurado, el flujo será:

1. Usuario hace clic en "Registrarse/Iniciar sesión con Google"
2. Redirige a: `http://localhost:3000/auth/google`
3. Google maneja la autenticación
4. Google redirige a: `http://localhost:3000/auth/google/callback`
5. Backend valida y crea/encuentra el usuario
6. Redirige al frontend: `http://localhost:5173/dashboard?token=JWT_TOKEN`
7. Frontend extrae el token y autentica automáticamente al usuario

## 🚀 Para probar

1. Configura las credenciales de Google OAuth
2. Actualiza el archivo `.env`
3. Inicia el backend: `npm run start:dev`
4. Inicia el frontend: `npm run dev`
5. Ve a `http://localhost:5173/login` o `http://localhost:5173/register`
6. Haz clic en "Iniciar sesión con Google" o "Registrarse con Google"

## 🔍 Troubleshooting

Si tienes problemas:

1. Verifica que las URLs de callback coincidan exactamente
2. Asegúrate de que Google+ API esté habilitada
3. Revisa los logs del backend para errores
4. Verifica que las variables de entorno estén correctas
5. Comprueba que el token JWT se esté generando correctamente

El botón de Google OAuth ahora es completamente funcional y listo para usarse una vez que configures las credenciales en Google Cloud Console.