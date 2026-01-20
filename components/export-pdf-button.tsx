import { Pressable, Text, StyleSheet, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { AppState } from '@/lib/types';

interface ExportPDFButtonProps {
  state: AppState;
  currentDate: string;
  historial: Array<{
    timestamp: number;
    mobileId: string;
    tipo: string;
    monto: number;
  }>;
}

export function ExportPDFButton({ state, currentDate, historial }: ExportPDFButtonProps) {
  const colors = useColors();

  const handleExport = () => {
    // Generar contenido del reporte
    const moviles = Object.values(state.moviles) as Array<{
      id: string;
      blancas: number;
      azules: number;
      rojas: number;
      totalMonto: number;
    }>;
    const totalCarreras = moviles.reduce(
      (acc, m) => acc + m.blancas + m.azules + m.rojas,
      0
    );

    // Crear contenido HTML para el reporte
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reporte Full Express - ${currentDate}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      color: #333;
    }
    h1 {
      color: #0a7ea4;
      border-bottom: 2px solid #0a7ea4;
      padding-bottom: 10px;
    }
    h2 {
      color: #0a7ea4;
      margin-top: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #0a7ea4;
      color: white;
    }
    tr:nth-child(even) {
      background-color: #f5f5f5;
    }
    .summary {
      background-color: #e6f4fe;
      padding: 15px;
      border-radius: 8px;
      margin-top: 20px;
    }
    .summary-item {
      font-size: 18px;
      margin: 10px 0;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #687076;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <h1>🚕 Full Express - Reporte Diario</h1>
  <p><strong>Fecha:</strong> ${currentDate}</p>
  
  <div class="summary">
    <h2>Resumen del Día</h2>
    <div class="summary-item"><strong>Caja Total:</strong> $${state.totalCaja.toFixed(2)}</div>
    <div class="summary-item"><strong>Total Carreras:</strong> ${totalCarreras}</div>
    <div class="summary-item"><strong>Móviles Activos:</strong> ${moviles.length}</div>
  </div>

  <h2>Detalle por Móvil</h2>
  <table>
    <thead>
      <tr>
        <th>Móvil</th>
        <th>Blancas</th>
        <th>Azules</th>
        <th>Rojas</th>
        <th>Total</th>
        <th>Monto</th>
      </tr>
    </thead>
    <tbody>
      ${moviles
        .map(
          (m) => `
        <tr>
          <td>${m.id}</td>
          <td>${m.blancas}</td>
          <td>${m.azules}</td>
          <td>${m.rojas}</td>
          <td>${m.blancas + m.azules + m.rojas}</td>
          <td>$${m.totalMonto.toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>Historial de Carreras</h2>
  <table>
    <thead>
      <tr>
        <th>Hora</th>
        <th>Móvil</th>
        <th>Tipo</th>
        <th>Monto</th>
      </tr>
    </thead>
    <tbody>
      ${historial
        .map(
          (h: any) => `
        <tr>
          <td>${new Date(h.timestamp).toLocaleTimeString('es-CL')}</td>
          <td>${h.mobileId}</td>
          <td>${h.tipo === 'blanca' ? 'Blanca' : h.tipo === 'azul' ? 'Azul' : 'Roja'}</td>
          <td>$${h.monto.toFixed(2)}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <div class="footer">
    <p>Generado por Full Express - Sistema de Gestión de Taxis</p>
    <p>${new Date().toLocaleString('es-CL')}</p>
  </div>
</body>
</html>
    `;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-full-express-${currentDate}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    Alert.alert('Éxito', 'Reporte exportado correctamente');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.success, opacity: pressed ? 0.8 : 1 },
      ]}
      onPress={handleExport}
    >
      <Text style={[styles.buttonText, { color: '#fff' }]}>📄 Exportar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
