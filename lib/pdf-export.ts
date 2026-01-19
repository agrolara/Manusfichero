import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface DailyReport {
  date: string;
  moviles: Array<{
    id: string;
    blancas: number;
    azules: number;
    rojas: number;
    totalMonto: number;
  }>;
  totalCaja: number;
  totalCarreras: number;
}

export function generateDailyReportPDF(report: DailyReport): void {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Full Express - Reporte Diario', 20, 20);
  
  // Fecha
  doc.setFontSize(12);
  doc.text(`Fecha: ${report.date}`, 20, 35);
  
  // Tabla de móviles
  const tableData = report.moviles.map(mobile => [
    mobile.id,
    mobile.blancas.toString(),
    mobile.azules.toString(),
    mobile.rojas.toString(),
    `$${mobile.totalMonto.toFixed(2)}`,
  ]);
  
  // Agregar fila de totales
  const totalMonto = report.moviles.reduce((sum, m) => sum + m.totalMonto, 0);
  const totalBlancas = report.moviles.reduce((sum, m) => sum + m.blancas, 0);
  const totalAzules = report.moviles.reduce((sum, m) => sum + m.azules, 0);
  const totalRojas = report.moviles.reduce((sum, m) => sum + m.rojas, 0);
  
  tableData.push([
    'TOTAL',
    totalBlancas.toString(),
    totalAzules.toString(),
    totalRojas.toString(),
    `$${totalMonto.toFixed(2)}`,
  ]);
  
  // Usar autoTable
  (doc as any).autoTable({
    head: [['Móvil', 'Blancas', 'Azules', 'Rojas', 'Monto Total']],
    body: tableData,
    startY: 50,
    theme: 'grid',
    headStyles: {
      fillColor: [0, 102, 153],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: [0, 0, 0],
    },
    footStyles: {
      fillColor: [230, 230, 230],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
    },
  });
  
  // Resumen
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(12);
  doc.text(`Total de Carreras: ${report.totalCarreras}`, 20, finalY);
  doc.text(`Caja Total: $${report.totalCaja.toFixed(2)}`, 20, finalY + 10);
  
  // Pie de página
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 20, doc.internal.pageSize.height - 10);
  
  // Descargar
  doc.save(`reporte-${report.date}.pdf`);
}

export function generateMonthlyReportPDF(
  month: string,
  reports: DailyReport[]
): void {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(20);
  doc.text('Full Express - Reporte Mensual', 20, 20);
  
  // Mes
  doc.setFontSize(12);
  doc.text(`Mes: ${month}`, 20, 35);
  
  // Agregar tabla por cada día
  let currentY = 50;
  
  reports.forEach((report, index) => {
    // Verificar si necesitamos nueva página
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    // Fecha del reporte
    doc.setFontSize(11);
    doc.text(`${report.date}`, 20, currentY);
    currentY += 8;
    
    // Tabla mini
    const tableData = report.moviles.map(mobile => [
      mobile.id,
      mobile.blancas.toString(),
      mobile.azules.toString(),
      mobile.rojas.toString(),
      `$${mobile.totalMonto.toFixed(2)}`,
    ]);
    
    (doc as any).autoTable({
      head: [['Móvil', 'B', 'A', 'R', 'Monto']],
      body: tableData,
      startY: currentY,
      theme: 'grid',
      headStyles: {
        fillColor: [100, 150, 200],
        textColor: [255, 255, 255],
        fontSize: 9,
      },
      bodyStyles: {
        fontSize: 8,
      },
      margin: { left: 20, right: 20 },
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 5;
  });
  
  // Pie de página
  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleString()}`, 20, doc.internal.pageSize.height - 10);
  
  // Descargar
  doc.save(`reporte-mensual-${month}.pdf`);
}
