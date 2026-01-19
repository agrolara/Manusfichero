#!/bin/bash

# Script para desplegar Full Express en Railway
# Uso: bash scripts/deploy-railway.sh

set -e

echo "🚀 Full Express - Deploy en Railway"
echo "===================================="
echo ""

# Verificar si Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "📦 Instalando Railway CLI..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI encontrado"
echo ""

# Login en Railway
echo "🔐 Iniciando sesión en Railway..."
railway login

echo ""
echo "📁 Creando nuevo proyecto en Railway..."
railway init

echo ""
echo "🔧 Configurando variables de entorno..."
echo "Agrega las siguientes variables:"
echo "  - SUPABASE_URL: Tu URL de Supabase"
echo "  - SUPABASE_ANON_KEY: Tu clave anónima de Supabase"
echo "  - NODE_ENV: production"
echo "  - PORT: 3000"
echo ""

read -p "¿Presiona Enter cuando hayas configurado las variables..."

echo ""
echo "🚀 Desplegando en Railway..."
railway up

echo ""
echo "✅ ¡Deploy completado!"
echo ""
echo "Para obtener la URL pública:"
echo "  railway status"
echo ""
echo "Para ver los logs:"
echo "  railway logs"
echo ""
