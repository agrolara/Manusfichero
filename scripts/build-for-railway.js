#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Leer el archivo dist/index.js generado por esbuild
const distPath = path.join(__dirname, '../dist/index.js');
const content = fs.readFileSync(distPath, 'utf-8');

// Crear un wrapper que cargue el módulo ESM
const wrapper = `require('dotenv').config();

(async () => {
  try {
    // Cargar el módulo ESM
    const module = await import('./index-esm.mjs');
  } catch (error) {
    console.error('Error loading module:', error);
    process.exit(1);
  }
})();
`;

// Renombrar el archivo original a .mjs
fs.renameSync(distPath, path.join(__dirname, '../dist/index-esm.mjs'));

// Crear el nuevo index.js con el wrapper
fs.writeFileSync(distPath, wrapper);

console.log('✅ Build completado para Railway');
