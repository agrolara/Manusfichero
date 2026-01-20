const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;

// Leer el archivo index.html una sola vez
const indexPath = path.join(__dirname, 'public', 'index.html');
let indexContent = '';

try {
  indexContent = fs.readFileSync(indexPath, 'utf-8');
} catch (err) {
  console.error('[web] Error reading index.html:', err.message);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Servir index.html para todas las rutas
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(indexContent);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[web] Full Express web server listening on port ${PORT}`);
});

server.on('error', (err) => {
  console.error('[web] Server error:', err);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('[web] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[web] Server closed');
    process.exit(0);
  });
});
