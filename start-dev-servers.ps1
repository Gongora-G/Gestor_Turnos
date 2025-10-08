# Script para iniciar ambos servidores de desarrollo
# Frontend (Vite) y Backend (NestJS)

Write-Host "🚀 Iniciando servidores de desarrollo..." -ForegroundColor Green

# Iniciar backend
Write-Host "📡 Iniciando Backend (NestJS)..." -ForegroundColor Yellow
Set-Location "C:\Users\Jhoan Gongora\Desktop\Gestor-Turnos\backend\auth-service"
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "npm run start:dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# Iniciar frontend  
Write-Host "🌐 Iniciando Frontend (Vite)..." -ForegroundColor Cyan
Set-Location "C:\Users\Jhoan Gongora\Desktop\Gestor-Turnos\frontend"
Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 5

# Abrir navegador
Write-Host "🌍 Abriendo navegador..." -ForegroundColor Magenta
Start-Process "http://localhost:5173"

Write-Host "✅ Servidores iniciados correctamente!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "📡 Backend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "" 
Write-Host "🔐 Credenciales de prueba:" -ForegroundColor White
Write-Host "Email: demo@gestor.com" -ForegroundColor Gray
Write-Host "Password: Demo123!" -ForegroundColor Gray
Write-Host ""
Write-Host "Email: admin@gestor.com" -ForegroundColor Gray  
Write-Host "Password: Admin123!" -ForegroundColor Gray

Read-Host -Prompt "Presiona Enter para cerrar este script"