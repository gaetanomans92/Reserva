<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Etama · Reservar Mesa</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<style>
  :root {
    --green-deep: #1a3a2a;
    --green-mid: #2d6a4f;
    --green-light: #52b788;
    --green-pale: #b7e4c7;
    --cream: #f8f4ed;
    --cream-dark: #ede8df;
    --sand: #d4a84b;
    --text-dark: #1a1a1a;
    --text-mid: #4a4a4a;
    --text-light: #888;
    --shadow-soft: 0 4px 24px rgba(26,58,42,0.10);
    --radius: 16px;
    --radius-sm: 10px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'DM Sans', sans-serif; background: var(--cream); color: var(--text-dark); min-height: 100vh; }

  /* ─── HERO ─── */
  .hero {
    background: linear-gradient(160deg, var(--green-deep) 0%, var(--green-mid) 60%, #3a7d5a 100%);
    padding: 48px 24px 64px;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute;
    top: -60px; right: -80px; width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(82,183,136,0.18) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero::after {
    content: ''; position: absolute;
    bottom: -40px; left: -60px; width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(212,168,75,0.12) 0%, transparent 70%);
    border-radius: 50%;
  }
  .hero-inner { max-width: 540px; margin: 0 auto; text-align: center; position: relative; z-index: 1; }
  .hero-logo { height: 52px; width: auto; margin: 0 auto 18px; display: block; filter: brightness(0) invert(1); }
  .hero-subtitle { color: var(--green-pale); font-size: 14px; margin-bottom: 4px; }
  .stars { color: var(--sand); font-size: 13px; margin-bottom: 4px; }
  .reviews { color: rgba(255,255,255,0.5); font-size: 12px; }

  /* ─── STEPS BAR ─── */
  .steps-container {
    background: white; border-bottom: 1px solid var(--cream-dark);
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .steps-brand {
    display: flex; justify-content: center; align-items: center;
    padding: 8px 0 0; max-width: 540px; margin: 0 auto;
  }
  .steps-isotipo { height: 28px; width: auto; }
  .steps { max-width: 540px; margin: 0 auto; display: flex; align-items: center; padding: 0 16px; }
  .step {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    padding: 12px 8px; cursor: pointer; position: relative; transition: opacity 0.2s;
  }
  .step:not(:last-child)::after {
    content: ''; position: absolute; right: 0; top: 50%;
    width: 1px; height: 24px; background: var(--cream-dark); transform: translateY(-50%);
  }
  .step-num {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 600; margin-bottom: 4px; transition: all 0.3s;
  }
  .step.active .step-num { background: var(--green-mid); color: white; }
  .step.done .step-num { background: var(--green-light); color: white; }
  .step.inactive .step-num { background: var(--cream-dark); color: var(--text-light); }
  .step-label { font-size: 10px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; color: var(--text-light); }
  .step.active .step-label { color: var(--green-mid); }
  .step.done .step-label { color: var(--green-light); }

  /* ─── MAIN ─── */
  .main { max-width: 540px; margin: 0 auto; padding: 28px 20px 100px; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 600; color: var(--green-deep); margin-bottom: 6px; }
  .section-sub { font-size: 13px; color: var(--text-light); margin-bottom: 24px; }

  /* ─── INPUTS ─── */
  .input-group { display: flex; flex-direction: column; gap: 6px; }
  .input-group label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-mid); }
  .field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-mid); margin-bottom: 6px; display: block; }
  .input-field, .input-group input, .input-group select {
    background: white; border: 1.5px solid var(--cream-dark); border-radius: var(--radius-sm);
    padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 15px; color: var(--text-dark);
    transition: border-color 0.2s, box-shadow 0.2s; outline: none;
    -webkit-appearance: none; appearance: none; cursor: pointer; width: 100%;
  }
  .input-field::placeholder { color: var(--text-light); }
  .input-field:focus, .input-group input:focus, .input-group select:focus {
    border-color: var(--green-light); box-shadow: 0 0 0 3px rgba(82,183,136,0.15);
  }
  .textarea-field {
    width: 100%; background: white; border: 1.5px solid var(--cream-dark);
    border-radius: var(--radius-sm); padding: 13px 14px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--text-dark);
    resize: none; height: 90px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 16px;
  }
  .textarea-field:focus { border-color: var(--green-light); box-shadow: 0 0 0 3px rgba(82,183,136,0.15); }
  .textarea-field::placeholder { color: var(--text-light); }
  .date-hint { font-size: 11px; color: var(--text-light); margin-top: 4px; padding-left: 2px; }

  /* ─── GUESTS ─── */
  .guests-row {
    display: flex; align-items: center; justify-content: space-between;
    background: white; border: 1.5px solid var(--cream-dark);
    border-radius: var(--radius-sm); padding: 10px 14px; margin-bottom: 20px;
  }
  .guests-label { font-size: 14px; color: var(--text-mid); }
  .guests-controls { display: flex; align-items: center; gap: 16px; }
  .guests-num { font-size: 20px; font-weight: 600; color: var(--green-deep); min-width: 28px; text-align: center; }
  .guests-btn {
    width: 36px; height: 36px; border-radius: 50%; border: 2px solid var(--green-light);
    background: white; color: var(--green-mid); font-size: 20px; font-weight: 300;
    cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; line-height: 1;
  }
  .guests-btn:hover { background: var(--green-light); color: white; }
  .guests-btn:disabled { border-color: var(--cream-dark); color: var(--text-light); cursor: not-allowed; }
  .guests-btn:disabled:hover { background: white; color: var(--text-light); }

  /* ─── SLOTS ─── */
  .slots-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-mid); margin-bottom: 10px; }
  .slots-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 28px; }
  .slot-btn {
    border: 1.5px solid var(--cream-dark); border-radius: var(--radius-sm);
    padding: 10px 4px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: var(--text-mid); background: white; cursor: pointer; transition: all 0.15s; text-align: center;
  }
  .slot-btn:hover { border-color: var(--green-light); color: var(--green-mid); }
  .slot-btn.selected { background: var(--green-mid); border-color: var(--green-mid); color: white; font-weight: 600; }
  .slot-btn.full { background: var(--cream-dark); color: var(--text-light); cursor: not-allowed; text-decoration: line-through; }

  /* ─── ZONES ─── */
  .zone-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px; }
  .zone-card {
    border: 2px solid var(--cream-dark); border-radius: var(--radius);
    padding: 18px 14px; cursor: pointer; transition: all 0.2s; background: white; text-align: center;
  }
  .zone-card:hover { border-color: var(--green-light); transform: translateY(-2px); }
  .zone-card.selected { border-color: var(--green-mid); box-shadow: 0 0 0 3px rgba(45,106,79,0.1); }
  .zone-icon { font-size: 32px; margin-bottom: 8px; }
  .zone-name { font-size: 14px; font-weight: 600; color: var(--text-dark); margin-bottom: 4px; }
  .zone-desc { font-size: 11px; color: var(--text-light); }
  .zone-badge { display: inline-block; background: var(--green-pale); color: var(--green-mid); border-radius: 20px; padding: 2px 8px; font-size: 10px; font-weight: 600; margin-top: 6px; }

  /* ─── OCCASION ─── */
  .occasion-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: var(--text-mid); margin-bottom: 10px; }
  .occasion-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .occasion-chip {
    border: 1.5px solid var(--cream-dark); border-radius: 24px; padding: 8px 16px;
    font-size: 13px; font-weight: 500; color: var(--text-mid); background: white;
    cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 6px;
    user-select: none;
  }
  .occasion-chip:hover { border-color: var(--green-light); }
  .occasion-chip.selected { background: var(--green-deep); border-color: var(--green-deep); color: white; }

  /* ─── FORM ─── */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
  .phone-row { display: flex; gap: 10px; margin-bottom: 12px; }
  .phone-prefix {
    background: white; border: 1.5px solid var(--cream-dark); border-radius: var(--radius-sm);
    padding: 13px 12px; font-size: 14px; font-family: 'DM Sans', sans-serif;
    color: var(--text-dark); outline: none; width: 90px; -webkit-appearance: none; cursor: pointer;
    flex-shrink: 0;
  }
  .phone-prefix:focus { border-color: var(--green-light); }

  /* ─── ALERGENOS ─── */
  .alergenos { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
  .alergeno-chip {
    border: 1.5px solid var(--cream-dark); border-radius: 20px; padding: 5px 12px;
    font-size: 12px; color: var(--text-mid); background: white; cursor: pointer; transition: all 0.15s;
    display: flex; align-items: center; gap: 4px; user-select: none;
  }
  .alergeno-chip.selected { border-color: var(--sand); background: #fff8e8; color: #8a6400; }

  /* ─── POLICY ─── */
  .policy-check { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 8px; }
  .policy-check input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--green-mid); cursor: pointer; margin-top: 1px; flex-shrink: 0; }
  .policy-check label { font-size: 12px; color: var(--text-light); line-height: 1.5; cursor: pointer; }
  .policy-check a { color: var(--green-mid); text-decoration: underline; }

  /* ─── CONFIRM ─── */
  .confirm-card { background: white; border-radius: var(--radius); padding: 24px; margin-bottom: 20px; box-shadow: var(--shadow-soft); }
  .confirm-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--cream-dark); }
  .confirm-row:last-child { border-bottom: none; padding-bottom: 0; }
  .confirm-row:first-child { padding-top: 0; }
  .confirm-key { font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; }
  .confirm-val { font-size: 15px; font-weight: 600; color: var(--text-dark); text-align: right; max-width: 60%; word-break: break-word; }

  /* ─── SUCCESS ─── */
  .success-anim { text-align: center; padding: 40px 20px; }
  .success-circle {
    width: 80px; height: 80px;
    background: linear-gradient(135deg, var(--green-light), var(--green-mid));
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px; font-size: 36px;
    box-shadow: 0 8px 32px rgba(82,183,136,0.35);
    animation: popIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) both;
  }
  @keyframes popIn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .success-title { font-family: 'Playfair Display', serif; font-size: 26px; color: var(--green-deep); margin-bottom: 8px; }
  .success-sub { font-size: 14px; color: var(--text-light); margin-bottom: 28px; line-height: 1.6; }
  .ref-badge { background: var(--cream-dark); border-radius: 8px; padding: 10px 20px; display: inline-block; font-size: 13px; color: var(--text-mid); margin-bottom: 28px; }
  .ref-badge strong { color: var(--green-deep); font-size: 16px; display: block; margin-top: 2px; }

  /* ─── INFO BANNER ─── */
  .info-banner {
    background: linear-gradient(135deg, #e8f5ee, #f0faf4);
    border: 1px solid var(--green-pale); border-radius: var(--radius-sm);
    padding: 12px 14px; font-size: 13px; color: var(--green-deep); margin-bottom: 20px;
    display: flex; gap: 8px; align-items: flex-start; line-height: 1.5;
  }

  /* ─── BACK BTN ─── */
  .back-btn {
    background: none; border: none; color: var(--green-mid); font-family: 'DM Sans', sans-serif;
    font-size: 14px; font-weight: 500; cursor: pointer; padding: 4px;
    display: flex; align-items: center; gap: 6px; margin-bottom: 20px;
  }
  .back-btn:hover { color: var(--green-deep); }

  /* ─── SUMMARY BAR ─── */
  .summary-bar {
    position: fixed; bottom: 0; left: 0; right: 0;
    background: white; border-top: 1px solid var(--cream-dark);
    padding: 14px 20px; z-index: 200; box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
  }
  .summary-inner { max-width: 540px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .summary-info { flex: 1; min-width: 0; }
  .summary-date { font-size: 13px; font-weight: 600; color: var(--green-deep); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .summary-guests { font-size: 11px; color: var(--text-light); margin-top: 1px; }

  /* ─── CTA BTN ─── */
  .cta-btn {
    background: linear-gradient(135deg, var(--green-mid), var(--green-deep));
    color: white; border: none; border-radius: 50px; padding: 14px 28px;
    font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600;
    cursor: pointer; transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
    white-space: nowrap; box-shadow: 0 4px 16px rgba(45,106,79,0.35);
  }
  .cta-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(45,106,79,0.45); }
  .cta-btn:active:not(:disabled) { transform: translateY(0); }
  .cta-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; transform: none; }

  /* ─── STEPS HIDE/SHOW ─── */
  .tag { display: none; }
  .tag.active { display: block; animation: fadeSlide 0.3s ease both; }
  @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ─── RESPONSIVE ─── */
  @media (max-width: 400px) {
    .slots-grid { grid-template-columns: repeat(3, 1fr); }
    .zone-grid { grid-template-columns: 1fr; }
    .form-grid { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>

<!-- Hero -->
<div class="hero" id="top">
  <div class="hero-inner">
    <img src="data:image/png;base64,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E8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAAACkTxAIAAAAAAACkTBALAAAAAAAAkDJBLAAAAAAAAEDKBLEAAAAAAAAAKRPEAgAAAAAAAKRMEAsAAAAAAACQMkEsAAAAAAAAQMoEsQAAAAAAAAApE8QCAAAAAAAApEwQCwAAAAAAAJAyQSwAAAAAAABAygSxAAAAAAAA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" alt="Etama" class="hero-logo" />
    <div class="hero-subtitle">Restaurante de comida saludable · El Clot, Barcelona</div>
    <div class="stars">★★★★★</div>
    <div class="reviews">5.0 · 83 reseñas en Google</div>
  </div>
</div>

<!-- Steps -->
<div class="steps-container">
  <div class="steps-brand">
    <img src="data:image/png;base64,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" alt="Etama isotipo" class="steps-isotipo" />
  </div>
  <div class="steps">
    <div class="step active" id="step-ind-1">
      <div class="step-num">1</div>
      <div class="step-label">Fecha</div>
    </div>
    <div class="step inactive" id="step-ind-2">
      <div class="step-num">2</div>
      <div class="step-label">Zona</div>
    </div>
    <div class="step inactive" id="step-ind-3">
      <div class="step-num">3</div>
      <div class="step-label">Datos</div>
    </div>
    <div class="step inactive" id="step-ind-4">
      <div class="step-num">4</div>
      <div class="step-label">Confirmar</div>
    </div>
  </div>
</div>

<!-- Main -->
<div class="main">

  <!-- STEP 1: FECHA -->
  <div class="tag active" id="step1">
    <p class="section-title">¿Cuándo venís?</p>
    <p class="section-sub">Selecciona fecha, hora y número de comensales</p>

    <div style="margin-bottom:20px;">
      <label class="field-label">Fecha</label>
      <input type="date" id="date-input" class="input-field" style="cursor:pointer;" />
      <div class="date-hint" id="day-name"></div>
    </div>

    <div class="guests-row">
      <div class="guests-label">👥 Comensales</div>
      <div class="guests-controls">
        <button class="guests-btn" id="minus-btn" onclick="changeGuests(-1)" disabled>−</button>
        <span class="guests-num" id="guests-num">2</span>
        <button class="guests-btn" id="plus-btn" onclick="changeGuests(1)">+</button>
      </div>
    </div>

    <div class="slots-title">Hora disponible</div>
    <div class="info-banner" id="horario-banner" style="display:none;"></div>
    <div class="slots-grid" id="slots-grid"></div>

    <div class="info-banner">
      ℹ️ Recibirás confirmación por email. Disponemos de carta para celíacos, veganos y alérgenos.
    </div>
  </div>

  <!-- STEP 2: ZONA -->
  <div class="tag" id="step2">
    <button class="back-btn" onclick="goBack()">← Volver</button>
    <p class="section-title">Elige tu zona</p>
    <p class="section-sub">Cada espacio tiene su propia atmósfera</p>

    <div class="zone-grid">
      <div class="zone-card" id="zone-interior" onclick="selectZone('interior', this)">
        <div class="zone-icon">🪴</div>
        <div class="zone-name">Interior</div>
        <div class="zone-desc">Ambiente íntimo y tranquilo</div>
        <span class="zone-badge">Disponible</span>
      </div>
      <div class="zone-card" id="zone-terraza" onclick="selectZone('terraza', this)">
        <div class="zone-icon">☀️</div>
        <div class="zone-name">Terraza</div>
        <div class="zone-desc">Al aire libre, luminosa</div>
        <span class="zone-badge">Disponible</span>
      </div>
      <div class="zone-card" id="zone-barra" onclick="selectZone('barra', this)" style="grid-column: 1 / -1;">
        <div class="zone-icon">🥗</div>
        <div class="zone-name">Sin preferencia</div>
        <div class="zone-desc">Lo que mejor convenga</div>
        <span class="zone-badge">Siempre disponible</span>
      </div>
    </div>

    <div class="occasion-title">Ocasión especial (opcional)</div>
    <div class="occasion-grid" id="occasion-grid">
      <div class="occasion-chip" onclick="toggleChip(this)">🎂 Cumpleaños</div>
      <div class="occasion-chip" onclick="toggleChip(this)">💍 Aniversario</div>
      <div class="occasion-chip" onclick="toggleChip(this)">🎉 Celebración</div>
      <div class="occasion-chip" onclick="toggleChip(this)">💼 Comida de trabajo</div>
      <div class="occasion-chip" onclick="toggleChip(this)">👨‍👩‍👧 Familiar</div>
      <div class="occasion-chip" onclick="toggleChip(this)">🌱 Evento vegano</div>
    </div>
  </div>

  <!-- STEP 3: DATOS -->
  <div class="tag" id="step3">
    <button class="back-btn" onclick="goBack()">← Volver</button>
    <p class="section-title">Tus datos</p>
    <p class="section-sub">Para enviarte la confirmación</p>

    <div class="form-grid">
      <div>
        <label class="field-label">Nombre *</label>
        <input class="input-field" type="text" id="fname" placeholder="Nombre" autocomplete="given-name" />
      </div>
      <div>
        <label class="field-label">Apellidos *</label>
        <input class="input-field" type="text" id="lname" placeholder="Apellidos" autocomplete="family-name" />
      </div>
    </div>

    <div style="margin-bottom:12px;">
      <label class="field-label">Email *</label>
      <input class="input-field" type="email" id="email" placeholder="correo@ejemplo.com" autocomplete="email" />
    </div>

    <div style="margin-bottom:16px;">
      <label class="field-label">Teléfono *</label>
      <div class="phone-row">
        <select class="phone-prefix" id="phone-prefix">
          <option value="+34">🇪🇸 +34</option>
          <option value="+33">🇫🇷 +33</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+49">🇩🇪 +49</option>
          <option value="+39">🇮🇹 +39</option>
          <option value="+351">🇵🇹 +351</option>
          <option value="+52">🇲🇽 +52</option>
          <option value="+54">🇦🇷 +54</option>
        </select>
        <input class="input-field" type="tel" id="phone" placeholder="600 000 000" autocomplete="tel" />
      </div>
    </div>

    <label class="field-label">Alergias o intolerancias (opcional)</label>
    <div class="alergenos" id="alergenos-grid">
      <div class="alergeno-chip" onclick="toggleChip(this)">🌾 Gluten</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🥛 Lácteos</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🥚 Huevo</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🥜 Frutos secos</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🐟 Pescado</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🦐 Marisco</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🌱 Vegano</div>
      <div class="alergeno-chip" onclick="toggleChip(this)">🥗 Vegetariano</div>
    </div>

    <label class="field-label">Comentarios (opcional)</label>
    <textarea class="textarea-field" id="comments" placeholder="Silla de bebé, mesa junto a la ventana..."></textarea>

    <div class="policy-check">
      <input type="checkbox" id="policy1" />
      <label for="policy1">Acepto la <a href="#">Política de privacidad</a> y el tratamiento de mis datos para gestionar la reserva.</label>
    </div>
    <div class="policy-check" style="margin-bottom:16px;">
      <input type="checkbox" id="policy2" />
      <label for="policy2">Acepto recibir comunicaciones de Etama (newsletter, promociones).</label>
    </div>
  </div>

  <!-- STEP 4: CONFIRMACIÓN -->
  <div class="tag" id="step4">
    <button class="back-btn" onclick="goBack()">← Volver</button>
    <p class="section-title">Confirma tu reserva</p>
    <p class="section-sub">Revisa los detalles antes de confirmar</p>

    <div class="confirm-card">
      <div class="confirm-row"><span class="confirm-key">Restaurante</span><span class="confirm-val">Etama</span></div>
      <div class="confirm-row"><span class="confirm-key">Fecha</span><span class="confirm-val" id="c-date">—</span></div>
      <div class="confirm-row"><span class="confirm-key">Hora</span><span class="confirm-val" id="c-time">—</span></div>
      <div class="confirm-row"><span class="confirm-key">Comensales</span><span class="confirm-val" id="c-guests">—</span></div>
      <div class="confirm-row"><span class="confirm-key">Zona</span><span class="confirm-val" id="c-zone">—</span></div>
      <div class="confirm-row"><span class="confirm-key">Nombre</span><span class="confirm-val" id="c-name">—</span></div>
      <div class="confirm-row"><span class="confirm-key">Email</span><span class="confirm-val" id="c-email">—</span></div>
      <div class="confirm-row"><span class="confirm-key">Teléfono</span><span class="confirm-val" id="c-phone">—</span></div>
    </div>

    <div class="info-banner">
      📩 Recibirás confirmación por email en tu bandeja de entrada. Puedes cancelar hasta 2 horas antes llamando al restaurante.
    </div>
  </div>

  <!-- STEP 5: SUCCESS -->
  <div class="tag" id="step5">
    <div class="success-anim">
      <div class="success-circle">✓</div>
      <h2 class="success-title">¡Reserva confirmada!</h2>
      <p class="success-sub">Te esperamos en Etama. Hemos enviado la confirmación a <strong id="success-email"></strong></p>
      <div class="ref-badge">
        Referencia de reserva
        <strong id="ref-num">ETM-000000</strong>
      </div>
      <div id="confirm-summary-final" style="text-align:left; background:white; border-radius:16px; padding:20px; box-shadow:var(--shadow-soft); margin-bottom:28px;"></div>
      <button class="cta-btn" onclick="newReservation()" style="width:100%;">Hacer otra reserva</button>
    </div>
  </div>

</div><!-- /main -->

<!-- Summary bar -->
<div class="summary-bar" id="summary-bar">
  <div class="summary-inner">
    <div class="summary-info">
      <div class="summary-date" id="bar-date">Selecciona fecha y hora</div>
      <div class="summary-guests" id="bar-guests"></div>
    </div>
    <button class="cta-btn" id="cta-btn" onclick="nextStep()">Continuar →</button>
  </div>
</div>

<script>
// ─────────────────────────────────────────────────────────
// EMAIL CONFIG — rellena estos valores tras crear cuenta en emailjs.com
// ─────────────────────────────────────────────────────────
const EMAIL_CONFIG = {
  serviceId:            'service_5yy5g3c',
  templateIdRestaurant: 'template_9qp11oi',
  templateIdClient:     'template_2d1mmh5',
  publicKey:            'ZvrcbYXijlj1r-iGp',
  restaurantEmail:      'gaetanomans92@gmail.com',
};

// Init EmailJS
if (typeof emailjs !== 'undefined') {
  try { emailjs.init({ publicKey: EMAIL_CONFIG.publicKey }); } catch(e) {}
}

// ─────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────
let state = {
  step: 1,
  date: '', time: '', guests: 2, zone: '',
  fname: '', lname: '', email: '', phone: '', phonePrefix: '+34',
  comments: '', policy1: false,
  submitting: false,  // prevents double-submit
};

const DAYS   = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const FULL   = []; // rellenar con slots completos si hace falta

// ─────────────────────────────────────────────────────────
// HORARIOS
// ─────────────────────────────────────────────────────────
function getSlotsForDate(dateStr) {
  if (!dateStr) return { slots: [], closed: false, label: '' };
  const dow = new Date(dateStr + 'T12:00:00').getDay();
  if (dow === 0) return { slots: [], closed: true, label: '' };
  const slots = [];
  const [hStart, hEnd, lastM] = dow === 6 ? [9, 16, 0] : [11, 16, 30];
  for (let h = hStart; h <= hEnd; h++) {
    for (let m = 0; m < 60; m += 15) {
      if (h === hEnd && m > lastM) break;
      slots.push(String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0'));
    }
  }
  const label = dow === 6
    ? '🌿 Sábado · 09:00–16:30 · Última reserva 16:00'
    : '🌿 Lunes–Viernes · 11:00–17:00 · Última reserva 16:30';
  return { slots, closed: false, label };
}

function nextValidDate() {
  const d = new Date();
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}

// ─────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────
(function init() {
  const val = nextValidDate();
  const inp = document.getElementById('date-input');
  inp.value = val;
  inp.min   = val;
  inp.addEventListener('change', function() {
    const d = new Date(this.value + 'T12:00:00');
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
      const pad = n => String(n).padStart(2,'0');
      this.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    state.date = this.value;
    state.time = '';
    updateDayName();
    renderSlots();
    updateSummaryBar();
  });
  state.date = val;
  updateDayName();
  renderSlots();
  renderStep();
})();

// ─────────────────────────────────────────────────────────
// RENDER SLOTS
// ─────────────────────────────────────────────────────────
function renderSlots() {
  const grid   = document.getElementById('slots-grid');
  const banner = document.getElementById('horario-banner');
  grid.innerHTML = '';
  const { slots, closed, label } = getSlotsForDate(state.date);
  if (label) { banner.textContent = label; banner.style.display = ''; }
  else        { banner.style.display = 'none'; }
  if (closed) {
    grid.innerHTML = '<p style="color:var(--text-light);font-size:14px;grid-column:1/-1;padding:8px 0;">Estamos cerrados los domingos. Por favor elige otro día 🌿</p>';
    return;
  }
  if (!slots.length) return;
  slots.forEach(t => {
    const btn = document.createElement('button');
    const isFull = FULL.includes(t);
    btn.className = 'slot-btn' + (isFull ? ' full' : '') + (state.time === t ? ' selected' : '');
    btn.textContent = t;
    btn.type = 'button';
    if (!isFull) btn.addEventListener('click', function() { selectTime(t, this); });
    grid.appendChild(btn);
  });
}

// ─────────────────────────────────────────────────────────
// INTERACTIONS
// ─────────────────────────────────────────────────────────
function selectTime(t, el) {
  state.time = t;
  document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  updateSummaryBar();
}

function changeGuests(delta) {
  state.guests = Math.max(1, Math.min(20, state.guests + delta));
  document.getElementById('guests-num').textContent = state.guests;
  document.getElementById('minus-btn').disabled = state.guests <= 1;
  document.getElementById('plus-btn').disabled  = state.guests >= 20;
  updateSummaryBar();
}

function selectZone(z, el) {
  state.zone = z;
  document.querySelectorAll('.zone-card').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function toggleChip(el) {
  el.classList.toggle('selected');
}

// ─────────────────────────────────────────────────────────
// NAVIGATION — only allow going back, never skip forward
// ─────────────────────────────────────────────────────────
function goBack() {
  if (state.step > 1) {
    state.step--;
    renderStep();
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}

function nextStep() {
  if (state.submitting) return;

  if (state.step === 1) {
    if (!state.date) { showAlert('Por favor selecciona una fecha'); return; }
    if (!state.time) { showAlert('Por favor selecciona una hora'); return; }
    const dow = new Date(state.date + 'T12:00:00').getDay();
    if (dow === 0) { showAlert('Estamos cerrados los domingos. Por favor elige otro día.'); return; }
    state.step = 2;

  } else if (state.step === 2) {
    if (!state.zone) { showAlert('Por favor selecciona una zona'); return; }
    state.step = 3;

  } else if (state.step === 3) {
    const fname = document.getElementById('fname').value.trim();
    const lname = document.getElementById('lname').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const policy = document.getElementById('policy1').checked;
    if (!fname || !lname) { showAlert('Por favor introduce tu nombre y apellidos'); return; }
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { showAlert('Por favor introduce un email válido'); return; }
    if (!phone || phone.length < 6) { showAlert('Por favor introduce un teléfono válido'); return; }
    if (!policy) { showAlert('Debes aceptar la política de privacidad'); return; }
    state.fname       = fname;
    state.lname       = lname;
    state.email       = email;
    state.phone       = phone;
    state.phonePrefix = document.getElementById('phone-prefix').value;
    state.comments    = document.getElementById('comments').value.trim();
    fillConfirm();
    state.step = 4;

  } else if (state.step === 4) {
    doSubmit();
    return;
  }

  renderStep();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ─────────────────────────────────────────────────────────
// FILL CONFIRM SCREEN
// ─────────────────────────────────────────────────────────
function fillConfirm() {
  const d = new Date(state.date + 'T12:00:00');
  const dateStr = `${DAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  const zoneNames = {interior:'Interior 🪴', terraza:'Terraza ☀️', barra:'Sin preferencia 🥗'};
  document.getElementById('c-date').textContent   = dateStr;
  document.getElementById('c-time').textContent   = state.time + ' h';
  document.getElementById('c-guests').textContent = state.guests + ' comensal' + (state.guests !== 1 ? 'es' : '');
  document.getElementById('c-zone').textContent   = zoneNames[state.zone] || state.zone;
  document.getElementById('c-name').textContent   = state.fname + ' ' + state.lname;
  document.getElementById('c-email').textContent  = state.email;
  document.getElementById('c-phone').textContent  = state.phonePrefix + ' ' + state.phone;
}

// ─────────────────────────────────────────────────────────
// SUBMIT — single execution, double-click protected
// ─────────────────────────────────────────────────────────
async function doSubmit() {
  if (state.submitting) return;
  state.submitting = true;
  const btn = document.getElementById('cta-btn');
  btn.disabled = true;
  btn.textContent = 'Enviando...';

  const refNum = 'ETM-' + Math.random().toString(36).substr(2,6).toUpperCase();

  // Build confirm summary
  const d = new Date(state.date + 'T12:00:00');
  const zoneNames = {interior:'Interior', terraza:'Terraza', barra:'Sin preferencia'};
  document.getElementById('confirm-summary-final').innerHTML = `
    <div style="display:grid;gap:10px;">
      <div style="display:flex;justify-content:space-between;align-items:center;"><span style="color:#888;font-size:13px;">Fecha</span><span style="font-weight:600;font-size:14px;">${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${state.time}h</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;"><span style="color:#888;font-size:13px;">Comensales</span><span style="font-weight:600;font-size:14px;">${state.guests}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;"><span style="color:#888;font-size:13px;">Zona</span><span style="font-weight:600;font-size:14px;">${zoneNames[state.zone]||state.zone}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;"><span style="color:#888;font-size:13px;">Nombre</span><span style="font-weight:600;font-size:14px;">${state.fname} ${state.lname}</span></div>
      <div style="display:flex;justify-content:space-between;align-items:center;"><span style="color:#888;font-size:13px;">Email</span><span style="font-weight:600;font-size:14px;">${state.email}</span></div>
    </div>`;

  document.getElementById('ref-num').textContent     = refNum;
  document.getElementById('success-email').textContent = state.email;

  await sendEmails(refNum);

  state.step = 5;
  state.submitting = false;
  renderStep();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ─────────────────────────────────────────────────────────
// EMAILS via EmailJS
// ─────────────────────────────────────────────────────────
async function sendEmails(refNum) {
  if (EMAIL_CONFIG.serviceId === 'YOUR_SERVICE_ID') {
    console.warn('EmailJS no configurado — omitiendo envío de email');
    return;
  }
  const d = new Date(state.date + 'T12:00:00');
  const zoneNames = {interior:'Interior', terraza:'Terraza', barra:'Sin preferencia'};
  const dateStr = `${DAYS[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  const payload = {
    ref:      refNum,
    date:     dateStr,
    time:     state.time,
    guests:   String(state.guests),
    zone:     zoneNames[state.zone] || state.zone,
    name:     state.fname + ' ' + state.lname,
    fname:    state.fname,
    lname:    state.lname,
    email:    state.email,
    phone:    state.phonePrefix + ' ' + state.phone,
    comments: state.comments || '—',
  };
  try {
    await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateIdRestaurant, {
      ...payload, to_email: EMAIL_CONFIG.restaurantEmail,
    });
    await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templateIdClient, {
      ...payload, to_email: state.email, to_name: state.fname,
    });
  } catch(err) {
    console.error('Error EmailJS:', err);
    // No bloqueamos al usuario aunque falle el email
  }
}

// ─────────────────────────────────────────────────────────
// NEW RESERVATION — full reset
// ─────────────────────────────────────────────────────────
function newReservation() {
  // Reset state
  state = { step:1, date:'', time:'', guests:2, zone:'', fname:'', lname:'', email:'', phone:'', phonePrefix:'+34', comments:'', policy1:false, submitting:false };

  // Reset form fields
  ['fname','lname','email','phone','comments'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('policy1').checked = false;
  document.getElementById('policy2').checked = false;
  document.getElementById('phone-prefix').value = '+34';

  // Reset chips
  document.querySelectorAll('.occasion-chip, .alergeno-chip').forEach(c => c.classList.remove('selected'));

  // Reset zone cards
  document.querySelectorAll('.zone-card').forEach(c => c.classList.remove('selected'));

  // Reset guests
  document.getElementById('guests-num').textContent = '2';
  document.getElementById('minus-btn').disabled = true;
  document.getElementById('plus-btn').disabled  = false;

  // Reset date
  const val = nextValidDate();
  const inp = document.getElementById('date-input');
  inp.value = val;
  inp.min   = val;
  state.date = val;

  updateDayName();
  renderSlots();
  renderStep();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// ─────────────────────────────────────────────────────────
// RENDER STEP — UI sync
// ─────────────────────────────────────────────────────────
function renderStep() {
  // Show/hide panels
  [1,2,3,4,5].forEach(n => {
    const el = document.getElementById('step' + n);
    if (el) el.className = state.step === n ? 'tag active' : 'tag';
  });
  // Step indicators (no click to jump forward)
  [1,2,3,4].forEach(n => {
    const ind = document.getElementById('step-ind-' + n);
    if (!ind) return;
    if (n < state.step)       ind.className = 'step done';
    else if (n === state.step) ind.className = 'step active';
    else                       ind.className = 'step inactive';
  });
  // Summary bar
  const bar = document.getElementById('summary-bar');
  if (state.step === 5) { bar.style.display = 'none'; return; }
  bar.style.display = '';
  const btn = document.getElementById('cta-btn');
  btn.disabled = false;
  btn.textContent = state.step === 4 ? '✓ Confirmar reserva' : 'Continuar →';
  updateSummaryBar();
}

function updateSummaryBar() {
  const barDate   = document.getElementById('bar-date');
  const barGuests = document.getElementById('bar-guests');
  if (state.date && state.time) {
    const d = new Date(state.date + 'T12:00:00');
    barDate.textContent   = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} · ${state.time}`;
    barGuests.textContent = `${state.guests} comensal${state.guests !== 1 ? 'es' : ''}`;
  } else if (state.date) {
    const d = new Date(state.date + 'T12:00:00');
    barDate.textContent   = `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    barGuests.textContent = 'Selecciona una hora';
  } else {
    barDate.textContent   = 'Selecciona fecha y hora';
    barGuests.textContent = '';
  }
}

function updateDayName() {
  const el = document.getElementById('day-name');
  if (!state.date) { el.textContent = ''; return; }
  const d = new Date(state.date + 'T12:00:00');
  el.textContent = DAYS[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTHS[d.getMonth()];
}

function showAlert(msg) {
  // Native alert works everywhere; can be replaced with a custom toast
  alert(msg);
}

// ─────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────
renderStep();
</script>
</body>
</html>
