// =============================================================
// ETAMA — Sistema de Recordatorio Automático de Reservas
// =============================================================
//
// CÓMO INSTALAR:
// 1. Abre tu Google Sheet (el mismo donde se guardan las reservas)
// 2. Ve a Extensiones → Apps Script
// 3. Pega todo este código en el editor y guarda (Ctrl+S)
// 4. Ejecuta la función "instalarTrigger" UNA sola vez → esto crea el
//    trigger diario automático
// 5. Asegúrate de que tu hoja tiene la columna "recordatorio_enviado"
//    (se crea automáticamente con "inicializarColumnaRecordatorio")
//
// COLUMNAS ESPERADAS EN LA HOJA (las crea el script receptor existente):
//   ref | date | dateStr | time | guests | zone | fname | lname |
//   name | email | phone | alergenos | occasion | comments | timestamp
//   + columna nueva: recordatorio_enviado
// =============================================================

// ── Configuración ─────────────────────────────────────────
const CONFIG = {
  HORAS_ANTES: 24,          // Enviar recordatorio N horas antes de la reserva
  NOMBRE_HOJA: 'Reservas',  // Nombre de la pestaña en el Google Sheet
                            // (cámbialo si tu hoja tiene otro nombre, ej: 'Sheet1')
  REMITENTE_NOMBRE: 'Etama Restaurante',
  EMAIL_COPIA: 'gaetanomans92@gmail.com', // Recibe copia de cada recordatorio enviado
};

// ── Punto de entrada: ejecutado por el trigger diario ────
function enviarRecordatorios() {
  const ss   = SpreadsheetApp.getActiveSpreadsheet();
  const hoja = ss.getSheetByName(CONFIG.NOMBRE_HOJA)
             || ss.getSheets()[0]; // fallback a la primera pestaña

  const datos = hoja.getDataRange().getValues();
  if (datos.length < 2) {
    console.log('Hoja vacía, sin reservas que procesar.');
    return;
  }

  // Detectar índices de columna dinámicamente por cabecera
  const cabeceras = datos[0].map(c => String(c).trim().toLowerCase());
  const col = {
    ref:         cabeceras.indexOf('ref'),
    date:        cabeceras.indexOf('date'),
    dateStr:     cabeceras.indexOf('datestr'),
    time:        cabeceras.indexOf('time'),
    guests:      cabeceras.indexOf('guests'),
    zone:        cabeceras.indexOf('zone'),
    fname:       cabeceras.indexOf('fname'),
    lname:       cabeceras.indexOf('lname'),
    email:       cabeceras.indexOf('email'),
    phone:       cabeceras.indexOf('phone'),
    alergenos:   cabeceras.indexOf('alergenos'),
    occasion:    cabeceras.indexOf('occasion'),
    comments:    cabeceras.indexOf('comments'),
    recordatorio: cabeceras.indexOf('recordatorio_enviado'),
  };

  // Si no existe la columna recordatorio, crearla
  if (col.recordatorio === -1) {
    hoja.getRange(1, datos[0].length + 1).setValue('recordatorio_enviado');
    col.recordatorio = datos[0].length; // índice base-0
    console.log('Columna recordatorio_enviado creada.');
  }

  const ahora     = new Date();
  const limiteMs  = CONFIG.HORAS_ANTES * 60 * 60 * 1000;
  let   enviados  = 0;
  let   omitidos  = 0;

  for (let i = 1; i < datos.length; i++) {
    const fila = datos[i];

    // Saltar si ya se envió recordatorio
    if (fila[col.recordatorio] === true || String(fila[col.recordatorio]).toLowerCase() === 'true') {
      omitidos++;
      continue;
    }

    // Parsear fecha de la reserva (formato YYYY-MM-DD guardado en columna 'date')
    const fechaStr = String(fila[col.date] || '').trim();
    if (!fechaStr) continue;

    const horaStr     = String(fila[col.time] || '13:00').trim();
    const [hh, mm]    = horaStr.split(':').map(Number);
    const fechaReserva = new Date(fechaStr + 'T' + String(hh).padStart(2,'0') + ':' + String(mm).padStart(2,'0') + ':00');

    const diffMs = fechaReserva.getTime() - ahora.getTime();

    // Enviar si la reserva está entre HORAS_ANTES y HORAS_ANTES+2 horas desde ahora
    // (ventana de 2h para no re-enviar en cada ejecución si el trigger falla y reinicia)
    const ventanaMs = 2 * 60 * 60 * 1000;
    if (diffMs < 0 || diffMs > limiteMs + ventanaMs || diffMs < limiteMs - ventanaMs) {
      continue;
    }

    const reserva = {
      ref:       String(fila[col.ref]       || ''),
      dateStr:   String(fila[col.dateStr]   || fechaStr),
      time:      horaStr,
      guests:    String(fila[col.guests]    || ''),
      zone:      formatearZona(String(fila[col.zone] || '')),
      fname:     String(fila[col.fname]     || ''),
      lname:     String(fila[col.lname]     || ''),
      email:     String(fila[col.email]     || '').trim(),
      phone:     String(fila[col.phone]     || ''),
      alergenos: String(fila[col.alergenos] || '—'),
      occasion:  String(fila[col.occasion]  || '—'),
      comments:  String(fila[col.comments]  || '—'),
    };

    if (!reserva.email) {
      console.warn(`Fila ${i + 1}: sin email, omitida.`);
      continue;
    }

    try {
      enviarEmailRecordatorio(reserva);

      // Marcar como enviado en la hoja
      hoja.getRange(i + 1, col.recordatorio + 1).setValue(true);
      enviados++;
      console.log(`Recordatorio enviado → ${reserva.email} (${reserva.ref})`);

    } catch (err) {
      console.error(`Error enviando a ${reserva.email}: ${err.message}`);
    }
  }

  console.log(`Resumen: ${enviados} enviados, ${omitidos} omitidos (ya enviados).`);
}

// ── Formatea el nombre de la zona ────────────────────────
function formatearZona(zona) {
  const nombres = {
    interior: 'Interior',
    terraza:  'Terraza',
    barra:    'Sin preferencia',
  };
  return nombres[zona.toLowerCase()] || zona;
}

// ── Construye y envía el email HTML de recordatorio ──────
function enviarEmailRecordatorio(reserva) {
  const asunto = `⏰ Recordatorio: tu reserva en Etama mañana — ${reserva.ref}`;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#F0E9D9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0E9D9;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Cabecera -->
          <tr>
            <td style="background:#145957;border-radius:12px 12px 0 0;padding:36px 40px;text-align:center;">
              <p style="margin:0 0 8px 0;color:#A9CBBB;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Restaurante</p>
              <h1 style="margin:0;color:#F0E9D9;font-size:34px;font-weight:900;letter-spacing:-1px;">ETAMA</h1>
            </td>
          </tr>

          <!-- Cuerpo -->
          <tr>
            <td style="background:#ffffff;padding:40px;">
              <p style="margin:0 0 24px 0;color:#145957;font-size:20px;font-weight:700;">
                ¡Hola, ${reserva.fname}! Te esperamos mañana 🙌
              </p>
              <p style="margin:0 0 28px 0;color:#555;font-size:15px;line-height:1.6;">
                Te recordamos que tienes una reserva en <strong>Etama</strong> mañana.
                Aquí tienes todos los detalles:
              </p>

              <!-- Tarjeta de detalles -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#F0E9D9;border-radius:10px;padding:24px;margin-bottom:28px;">
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #d4ede0;">
                    <span style="color:#888;font-size:13px;">Referencia</span><br>
                    <strong style="color:#145957;font-family:monospace;font-size:15px;">${reserva.ref}</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #d4ede0;">
                    <span style="color:#888;font-size:13px;">Fecha y hora</span><br>
                    <strong style="color:#1a1a1a;font-size:15px;">${reserva.dateStr} · ${reserva.time}h</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #d4ede0;">
                    <span style="color:#888;font-size:13px;">Comensales</span><br>
                    <strong style="color:#1a1a1a;font-size:15px;">${reserva.guests} personas</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 0;">
                    <span style="color:#888;font-size:13px;">Zona</span><br>
                    <strong style="color:#1a1a1a;font-size:15px;">${reserva.zone}</strong>
                  </td>
                </tr>
              </table>

              <!-- Botones de acción -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center" style="padding:4px;">
                    <a href="https://gaetanomans92.github.io/Reserva/etama-confirmar.html?ref=${encodeURIComponent(reserva.ref)}&email=${encodeURIComponent(reserva.email)}"
                       style="display:inline-block;background:#145957;color:#F0E9D9;text-decoration:none;
                              padding:14px 32px;border-radius:8px;font-size:15px;font-weight:700;
                              letter-spacing:0.5px;">
                      ✅ Confirmar asistencia
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:8px;">
                    <a href="https://gaetanomans92.github.io/Reserva/etama-gestionar.html"
                       style="color:#145957;font-size:13px;text-decoration:underline;">
                      ¿Necesitas cancelar o modificar?
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;color:#888;font-size:13px;line-height:1.6;">
                Si tienes alguna pregunta, responde a este email o llámanos directamente.
                ¡Tenemos muchas ganas de verte!
              </p>
            </td>
          </tr>

          <!-- Pie -->
          <tr>
            <td style="background:#145957;border-radius:0 0 12px 12px;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#A9CBBB;font-size:12px;">
                © Etama · Este email fue enviado a <strong style="color:#F0E9D9;">${reserva.email}</strong>
                porque tienes una reserva confirmada.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const opciones = {
    name:    CONFIG.REMITENTE_NOMBRE,
    htmlBody: html,
    bcc:     CONFIG.EMAIL_COPIA,
    replyTo: CONFIG.EMAIL_COPIA,
  };

  MailApp.sendEmail(reserva.email, asunto, '', opciones);
}

// ── Instala el trigger diario (ejecutar UNA sola vez) ────
function instalarTrigger() {
  // Eliminar triggers previos de esta función para evitar duplicados
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'enviarRecordatorios')
    .forEach(t => ScriptApp.deleteTrigger(t));

  // Crear nuevo trigger: cada día a las 10:00 AM
  ScriptApp.newTrigger('enviarRecordatorios')
    .timeBased()
    .everyDays(1)
    .atHour(10)
    .create();

  console.log('✅ Trigger instalado: "enviarRecordatorios" se ejecutará cada día a las 10:00 AM.');
}

// ── Elimina el trigger (para pausar el sistema) ──────────
function eliminarTrigger() {
  const eliminados = ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'enviarRecordatorios');

  eliminados.forEach(t => ScriptApp.deleteTrigger(t));
  console.log(`Trigger eliminado. (${eliminados.length} trigger(s) borrado(s))`);
}

// ── Prueba: envía un email de prueba a la cuenta del restaurante ──
function probarEmail() {
  const reservaEjemplo = {
    ref:       'ETM-TEST1',
    dateStr:   'Mañana · Prueba',
    time:      '13:30',
    guests:    '2',
    zone:      'Interior',
    fname:     'Cliente',
    lname:     'Prueba',
    email:     CONFIG.EMAIL_COPIA,   // se envía al restaurante, no a un cliente real
    phone:     '+34 600 000 000',
    alergenos: '—',
    occasion:  '—',
    comments:  'Email de prueba generado desde Apps Script',
  };

  enviarEmailRecordatorio(reservaEjemplo);
  console.log(`✅ Email de prueba enviado a ${CONFIG.EMAIL_COPIA}`);
}
