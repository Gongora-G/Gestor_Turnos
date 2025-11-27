#!/bin/bash
# Script para subir cambios a GitHub

echo "🚀 Preparando para subir cambios a GitHub..."
echo ""

# Verificar que no se suban archivos sensibles
echo "🔍 Verificando archivos sensibles..."
if git status | grep -q "client_secret"; then
    echo "❌ ERROR: Intentando subir archivo client_secret_*.json"
    echo "Este archivo NO debe subirse a GitHub"
    exit 1
fi

if git status | grep -q "CREDENCIALES-PRIVADAS"; then
    echo "❌ ERROR: Intentando subir CREDENCIALES-PRIVADAS.txt"
    echo "Este archivo NO debe subirse a GitHub"
    exit 1
fi

if git status | grep -q ".env" | grep -v ".env.example"; then
    echo "⚠️  ADVERTENCIA: Archivos .env detectados"
    echo "Verifica que estén en .gitignore"
fi

echo "✅ Verificación completa"
echo ""

# Mostrar cambios
echo "📝 Archivos modificados:"
git status -s
echo ""

# Pedir mensaje de commit
read -p "💬 Mensaje del commit: " mensaje

if [ -z "$mensaje" ]; then
    echo "❌ Mensaje de commit vacío. Cancelando..."
    exit 1
fi

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "$mensaje"

# Subir a GitHub
echo ""
echo "⬆️  Subiendo a GitHub..."
git push origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Cambios subidos exitosamente a GitHub!"
    echo "🌐 https://github.com/Gongora-G/Gestor_Turnos"
else
    echo ""
    echo "❌ Error al subir cambios. Verifica tu conexión y credenciales."
fi
