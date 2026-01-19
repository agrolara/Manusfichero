#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Crear directorio de salida
const outDir = path.join(__dirname, '../dist/web');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Crear un archivo index.html simple
const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Full Express</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      max-width: 500px;
      width: 100%;
      text-align: center;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 32px;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 16px;
    }
    
    .info {
      background: #f5f5f5;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      text-align: left;
      border-radius: 4px;
    }
    
    .info h3 {
      color: #333;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .info p {
      color: #666;
      font-size: 13px;
      margin: 5px 0;
      font-family: 'Courier New', monospace;
      word-break: break-all;
    }
    
    .status {
      display: inline-block;
      background: #4CAF50;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 12px 30px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      margin: 10px 5px;
      transition: background 0.3s;
    }
    
    .button:hover {
      background: #764ba2;
    }
    
    .button.secondary {
      background: #f5f5f5;
      color: #333;
      border: 2px solid #ddd;
    }
    
    .button.secondary:hover {
      background: #e8e8e8;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🚕 Full Express</h1>
    <p class="subtitle">Sistema de Gestión de Taxis</p>
    
    <div class="status">✓ API Activa</div>
    
    <div class="info">
      <h3>📍 API Endpoint</h3>
      <p>https://manusfichero-production.up.railway.app</p>
    </div>
    
    <div class="info">
      <h3>✨ Características</h3>
      <p>✓ Sistema de 3 colas (Blanca, Azul, Roja)</p>
      <p>✓ Registro de carreras</p>
      <p>✓ Reportes y estadísticas</p>
      <p>✓ Autenticación OAuth</p>
      <p>✓ Base de datos Supabase</p>
    </div>
    
    <div style="margin-top: 30px;">
      <p style="color: #666; margin-bottom: 20px;">La aplicación está en desarrollo.</p>
      <a href="https://manusfichero-production.up.railway.app/api/health" class="button">Ver API</a>
      <a href="/" class="button secondary">Recargar</a>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, 'index.html'), htmlContent);

console.log('✅ Build completado para Vercel');
