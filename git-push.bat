@echo off
REM Script para subir cambios a GitHub (Windows)

echo.
echo ========================================
echo   SUBIR CAMBIOS A GITHUB
echo ========================================
echo.

REM Verificar que no se suban archivos sensibles
echo Verificando archivos sensibles...
git status | findstr /C:"client_secret" >nul
if %errorlevel% == 0 (
    echo.
    echo [ERROR] Intentando subir archivo client_secret_*.json
    echo Este archivo NO debe subirse a GitHub
    pause
    exit /b 1
)

git status | findstr /C:"CREDENCIALES-PRIVADAS" >nul
if %errorlevel% == 0 (
    echo.
    echo [ERROR] Intentando subir CREDENCIALES-PRIVADAS.txt
    echo Este archivo NO debe subirse a GitHub
    pause
    exit /b 1
)

echo [OK] Verificacion completa
echo.

REM Mostrar cambios
echo Archivos modificados:
git status -s
echo.

REM Pedir mensaje de commit
set /p mensaje="Mensaje del commit: "

if "%mensaje%"=="" (
    echo.
    echo [ERROR] Mensaje de commit vacio. Cancelando...
    pause
    exit /b 1
)

REM Agregar todos los cambios
git add .

REM Hacer commit
git commit -m "%mensaje%"

REM Subir a GitHub
echo.
echo Subiendo a GitHub...
git push origin master

if %errorlevel% == 0 (
    echo.
    echo ========================================
    echo   CAMBIOS SUBIDOS EXITOSAMENTE
    echo ========================================
    echo.
    echo Repositorio: https://github.com/Gongora-G/Gestor_Turnos
    echo.
) else (
    echo.
    echo [ERROR] Error al subir cambios.
    echo Verifica tu conexion y credenciales.
    echo.
)

pause
