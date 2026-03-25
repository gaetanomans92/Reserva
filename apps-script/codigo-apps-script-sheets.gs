// =============================================================
// ETAMA — Script Receptor de Reservas (Google Apps Script)
// =============================================================
//
// DESCRIPCIÓN:
// Este script recibe los datos de cada reserva nueva desde el
// formulario web (etama-reservas.html) via POST y los guarda en
// la hoja de cálculo "Reservas".
//
// CÓMO INSTALAR / ACTUALIZAR:
// 1. Abre tu Google Sheet
// 2. Extensiones → Apps Script
// 3. Pega este código (o comprueba que ya lo tienes)
// 4. Guardar → Implementar → Nueva implementación
//    - Tipo: Aplicación web
//    - Ejecutar como: Yo
//    - Acceso: Cualquiera
// 5. Copia la URL generada y ponla en etama-reservas.html
//    dentro de la constante SHEETS_URL
//
// NOTA: Este script y recordatorio-reservas.gs deben estar en el
// MISMO proyecto de Apps Script para compartir la misma hoja.
// =============================================================

const NOMBRE_HOJA_RECEPTOR = 'Reservas'; // Debe coincidir con CONFIG.NOMBRE_HOJA en recordatorio-reservas.gs

function doPost(e) {
  try {
    const datos = JSON.parse(e.parameter.data);
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let   hoja  = ss.getSheetByName(NOMBRE_HOJA_RECEPTOR);

    // Crear hoja si no existe
    if (!hoja) {
      hoja = ss.insertSheet(NOMBRE_HOJA_RECEPTOR);
    }

    // Crear cabeceras si la hoja está vacía
    if (hoja.getLastRow() === 0) {
      hoja.appendRow([
        'ref', 'date', 'dateStr', 'time', 'guests', 'zone',
        'fname', 'lname', 'name', 'email', 'phone',
        'alergenos', 'occasion', 'comments', 'timestamp',
        'recordatorio_enviado',  // columna para el sistema de recordatorios
      ]);
      // Formato de cabecera
      hoja.getRange(1, 1, 1, 16)
          .setFontWeight('bold')
          .setBackground('#145957')
          .setFontColor('#F0E9D9');
    }

    // Insertar fila con los datos de la reserva
    hoja.appendRow([
      datos.ref       || '',
      datos.date      || '',
      datos.dateStr   || '',
      datos.time      || '',
      datos.guests    || '',
      datos.zone      || '',
      datos.fname     || '',
      datos.lname     || '',
      datos.name      || '',
      datos.email     || '',
      datos.phone     || '',
      datos.alergenos || '—',
      datos.occasion  || '—',
      datos.comments  || '—',
      datos.timestamp || new Date().toISOString(),
      false,  // recordatorio_enviado: false por defecto
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', ref: datos.ref }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error('Error en doPost:', err);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// GET para verificar que el script está activo
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'activo', sistema: 'Etama Reservas' }))
    .setMimeType(ContentService.MimeType.JSON);
}
