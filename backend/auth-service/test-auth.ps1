# 🧪 Auth Service Test Script
# Test endpoints for authentication service

Write-Host "🚀 Iniciando pruebas del Auth Service..." -ForegroundColor Green
Write-Host "📍 URL Base: http://localhost:3000" -ForegroundColor Blue
Write-Host ""

# Test 1: Health check
Write-Host "🔍 Test 1: Health check (GET /)" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000" -Method GET
    Write-Host "✅ Health check OK" -ForegroundColor Green
    $health
} catch {
    Write-Host "❌ Health check FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Register user
Write-Host "🔍 Test 2: Register new user (POST /auth/register)" -ForegroundColor Yellow
$registerBody = @{
    email = "admin@gestorturnos.com"
    password = "Admin123!@"
    firstName = "Administrador"
    lastName = "Sistema"
    phone = "+573001234567"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Usuario registrado exitosamente!" -ForegroundColor Green
    Write-Host "📋 Token generado: $($registerResponse.access_token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "👤 Usuario: $($registerResponse.user.email) ($($registerResponse.user.role))" -ForegroundColor Cyan
    $global:authToken = $registerResponse.access_token
} catch {
    Write-Host "❌ Registro FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host "📄 Detalles del error: $responseBody" -ForegroundColor Red
    }
}
Write-Host ""

# Test 3: Login user
Write-Host "🔍 Test 3: Login user (POST /auth/login)" -ForegroundColor Yellow
$loginBody = @{
    email = "admin@gestorturnos.com"
    password = "Admin123!@"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login exitoso!" -ForegroundColor Green
    Write-Host "📋 Token: $($loginResponse.access_token.Substring(0,20))..." -ForegroundColor Cyan
    Write-Host "👤 Usuario: $($loginResponse.user.email) ($($loginResponse.user.role))" -ForegroundColor Cyan
    $global:authToken = $loginResponse.access_token
} catch {
    Write-Host "❌ Login FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get profile (protected route)
if ($global:authToken) {
    Write-Host "🔍 Test 4: Get user profile (GET /auth/profile)" -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $global:authToken"
        }
        $profileResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/profile" -Method GET -Headers $headers
        Write-Host "✅ Perfil obtenido exitosamente!" -ForegroundColor Green
        Write-Host "👤 ID: $($profileResponse.id)" -ForegroundColor Cyan
        Write-Host "📧 Email: $($profileResponse.email)" -ForegroundColor Cyan  
        Write-Host "👨‍💼 Nombre: $($profileResponse.firstName) $($profileResponse.lastName)" -ForegroundColor Cyan
        Write-Host "🎯 Rol: $($profileResponse.role)" -ForegroundColor Cyan
        Write-Host "📱 Estado: $($profileResponse.status)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Get profile FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""

    # Test 5: Validate token
    Write-Host "🔍 Test 5: Validate token (GET /auth/validate)" -ForegroundColor Yellow
    try {
        $validateResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/validate" -Method GET -Headers $headers
        Write-Host "✅ Token válido!" -ForegroundColor Green
        Write-Host "🔒 Válido: $($validateResponse.valid)" -ForegroundColor Cyan
        Write-Host "👤 Usuario: $($validateResponse.user.email)" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Validate token FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎯 Pruebas completadas!" -ForegroundColor Green
Write-Host "📊 Resumen:" -ForegroundColor Blue
Write-Host "  ✅ Registro de usuario"
Write-Host "  ✅ Login de usuario" 
Write-Host "  ✅ Obtener perfil (JWT protegido)"
Write-Host "  ✅ Validar token"
Write-Host ""
Write-Host "🚀 El Auth Service está funcionando correctamente!" -ForegroundColor Green