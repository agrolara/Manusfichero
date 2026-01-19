# Guía de Deploy - Full Express

Esta guía explica cómo desplegar Full Express en la nube usando GitHub Actions y Expo Hosting.

## Paso 1: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub: `https://github.com/agrolara/Manusfichero`
2. Haz clic en **Settings** → **Secrets and variables** → **Actions**
3. Crea los siguientes secrets:

### Secrets Requeridos:

| Nombre | Valor | Descripción |
|--------|-------|-------------|
| `EXPO_TOKEN` | Tu token de Expo | Obtén en: https://expo.dev/settings/tokens |
| `EAS_TOKEN` | Tu token de EAS | Obtén en: https://expo.dev/settings/tokens |
| `SUPABASE_URL` | URL de Supabase | Ej: `https://xxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Clave anón de Supabase | Obtén en Supabase Dashboard |

## Paso 2: Obtener Tokens de Expo

1. Ve a https://expo.dev/login
2. Inicia sesión con tu cuenta (o crea una nueva)
3. Ve a **Settings** → **Tokens**
4. Crea un nuevo token y cópialo
5. Usa este token para `EXPO_TOKEN` y `EAS_TOKEN`

## Paso 3: Hacer Push a GitHub

Una vez configurados los secrets, simplemente haz push a la rama `main`:

```bash
git add .
git commit -m "Deploy Full Express"
git push origin main
```

## Paso 4: Monitorear el Deploy

1. Ve a tu repositorio en GitHub
2. Haz clic en **Actions**
3. Verás el workflow "Deploy to Expo" ejecutándose
4. Espera a que termine (toma 5-10 minutos)

## Resultado Final

Después del deploy exitoso:

- ✅ **Web:** Disponible en Expo Hosting
- ✅ **Android:** APK generado y listo para descargar
- ✅ **iOS:** IPA generado y listo para descargar

## Acceder a la App

### Opción 1: Expo Go (Recomendado para pruebas)
1. Descarga **Expo Go** en tu teléfono
2. Abre Expo Go
3. Escanea el código QR de tu proyecto en Expo

### Opción 2: Descargar APK/IPA
1. Ve a los artifacts del workflow en GitHub Actions
2. Descarga el APK (Android) o IPA (iOS)
3. Instala en tu dispositivo

## Troubleshooting

### Error: "EXPO_TOKEN not found"
- Asegúrate de haber creado el secret en GitHub Settings

### Error: "Build failed"
- Revisa los logs en GitHub Actions
- Verifica que `pnpm install` funcione localmente

### Error: "Supabase connection failed"
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctos
- Prueba localmente: `SUPABASE_URL=xxx SUPABASE_ANON_KEY=yyy pnpm dev`

## Actualizar la App

Cada vez que hagas push a `main`, el workflow se ejecuta automáticamente:

```bash
# Hacer cambios
git add .
git commit -m "Descripción de cambios"
git push origin main

# GitHub Actions automáticamente:
# 1. Instala dependencias
# 2. Publica en Expo
# 3. Construye APK/IPA
# 4. Los usuarios ven la actualización
```

## Más Información

- [Documentación de Expo](https://docs.expo.dev)
- [GitHub Actions](https://github.com/features/actions)
- [EAS Build](https://docs.expo.dev/build/introduction)
