# Setup Completo - Full Express en GitHub

## Resumen

Full Express está listo para ser desplegado en la nube. Aquí está el paso a paso completo para hacerlo desde GitHub.

## Paso 1: Clonar el Repositorio en tu Computadora

```bash
git clone https://github.com/agrolara/Manusfichero.git
cd Manusfichero
```

## Paso 2: Instalar Dependencias

```bash
# Instalar pnpm (si no lo tienes)
npm install -g pnpm

# Instalar dependencias del proyecto
pnpm install
```

## Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
cat > .env.local << 'EOF'
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=xxxxx
EOF
```

Reemplaza `xxxxx` con tus valores reales de Supabase.

## Paso 4: Crear Cuenta en Expo

1. Ve a https://expo.dev/signup
2. Crea una cuenta con tu email
3. Verifica tu email
4. Ve a https://expo.dev/settings/tokens
5. Crea un nuevo token y guárdalo (lo necesitarás después)

## Paso 5: Configurar GitHub Secrets

1. Ve a tu repositorio: https://github.com/agrolara/Manusfichero
2. Haz clic en **Settings**
3. En el menú lateral, haz clic en **Secrets and variables** → **Actions**
4. Haz clic en **New repository secret**
5. Agrega los siguientes secrets:

### Secret 1: EXPO_TOKEN
- **Name:** `EXPO_TOKEN`
- **Value:** Tu token de Expo (del Paso 4)
- Haz clic en **Add secret**

### Secret 2: EAS_TOKEN
- **Name:** `EAS_TOKEN`
- **Value:** Tu token de Expo (el mismo del anterior)
- Haz clic en **Add secret**

### Secret 3: SUPABASE_URL
- **Name:** `SUPABASE_URL`
- **Value:** Tu URL de Supabase (ej: `https://xxxxx.supabase.co`)
- Haz clic en **Add secret**

### Secret 4: SUPABASE_ANON_KEY
- **Name:** `SUPABASE_ANON_KEY`
- **Value:** Tu clave anónima de Supabase
- Haz clic en **Add secret**

## Paso 6: Crear el Workflow de GitHub Actions

1. En tu repositorio, crea la carpeta: `.github/workflows/`
2. Dentro, crea un archivo llamado `deploy.yml`
3. Copia este contenido:

```yaml
name: Deploy to Expo

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9.12.0

      - name: Install dependencies
        run: pnpm install

      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}

      - name: Publish to Expo
        run: pnpm expo publish
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
```

4. Haz commit y push:

```bash
git add .github/workflows/deploy.yml
git commit -m "Agregar workflow de deploy"
git push origin main
```

## Paso 7: Ejecutar el Deploy

Una vez que hayas hecho push, el workflow se ejecutará automáticamente:

1. Ve a tu repositorio en GitHub
2. Haz clic en **Actions**
3. Verás "Deploy to Expo" ejecutándose
4. Espera a que termine (5-10 minutos)

## Paso 8: Acceder a la App

### Opción A: Expo Go (Recomendado)
1. Descarga **Expo Go** en tu teléfono
2. Abre Expo Go
3. Ve a https://expo.dev/accounts/tu_usuario
4. Haz clic en tu proyecto "full_express_taxi"
5. Escanea el código QR o abre en tu teléfono

### Opción B: Descargar APK/IPA
1. En GitHub, ve a **Actions**
2. Haz clic en el workflow completado
3. Descarga el artifact (APK para Android, IPA para iOS)
4. Instala en tu dispositivo

## Actualizar la App

Cada vez que hagas cambios:

```bash
# Hacer cambios locales
# ...

# Hacer commit y push
git add .
git commit -m "Descripción de cambios"
git push origin main

# GitHub Actions automáticamente despliega la nueva versión
```

## Troubleshooting

### "Workflow file not found"
- Verifica que el archivo esté en `.github/workflows/deploy.yml`
- Asegúrate de que el nombre sea exacto

### "EXPO_TOKEN not found"
- Verifica que hayas creado el secret en GitHub Settings
- Asegúrate de copiar el token completo sin espacios

### "Build failed"
- Revisa los logs en GitHub Actions
- Intenta compilar localmente: `pnpm build`

### "Push rejected"
- Asegúrate de tener permisos en el repositorio
- Usa tu token de GitHub si es necesario

## Soporte

- Documentación de Expo: https://docs.expo.dev
- Documentación de GitHub Actions: https://docs.github.com/en/actions
- Supabase Docs: https://supabase.com/docs
