const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
// v3 - Fix path

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores 404
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[web] Full Express server listening on port ${PORT}`);
});
