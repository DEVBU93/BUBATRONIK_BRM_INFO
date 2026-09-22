
const stateKey = 'calistenia_bubatronik_progreso_v4';
let programa = [];
let progreso = {};
let currentLevel = 1;
const assets = {"warmup": "/assets/img/0 - FICHA CALENTAMIENTO 5 MIN + VUELTA A LA CALMA.webp", "tracker": "/assets/img/0 - TRACKER 28 NIVELES.webp", "indice": "/assets/img/0 - ÍNDICE VISUAL - TODO LO QUE HAY EN DRIVE -.webp", "fichas": {"1": "/assets/img/1 - HIP THRUST EN MESA ELEVADA.webp", "2": "/assets/img/2 - FONDOS EN SILLA CORREGIDO.webp", "3": "/assets/img/3 - FLEXIONES DECLINADAS PIES EN MESA.webp", "4": "/assets/img/4 - FICHA SENTADILLA A SILLA  TÉCNICA 5s PAUSA.webp", "5": "/assets/img/5 - FICHA FLEXIONES INCLINADAS ALTAS  MEDIAS  BAJAS.webp", "6": "/assets/img/6 - FICHA PUENTE GLÚTEOS SUELO.webp", "7": "/assets/img/7 - FICHA ZANCADAS ATRÁS  BÚLGARA SILLA.webp", "8": "/assets/img/8 - FICHA PLANCHA RODILLAS.webp", "9": "/assets/img/9 - FICHA BIRD DOG - pareja de plancha.webp", "10": "/assets/img/10 - FICHA DEAD BUG.webp", "11": "/assets/img/11  - FICHA DIAMANTE  PIES ELEVADOS.webp", "12": "/assets/img/12 - FICHA TÉCNICA - ENTRENAMIENTO EN MANADA  PACK BUBATRONIK.webp"}, "certificado": "/assets/img/CERTIFICADO BUBATRONIK.webp", "cartel": "/assets/img/CARTEL OFICIAL TORNEO BUBATRONIK VOL.01.webp", "comodin_normas": "/assets/img/NORMAS COMODIN.webp", "comodin1": "/assets/img/COMODIN1.webp", "comodin6": "/assets/img/COMODIN6.webp", "leaderboard": "/assets/img/LEADERBOARD  RANKING OFICIAL - imprimible.webp", "logo": "/assets/img/Logo de Bubatronik Radio __subject_1__ en un estilo minimalista_ con un dise_o simple y elegante_ co.jpg", "wod1": "/assets/img/WOD 1 - EMPUJE BRM - For Time 12 min cap.webp", "wod2": "/assets/img/WOD 2 - GLÚTEO 432 .webp", "wod3": "/assets/img/WOD 3 - CORE RISAS - For Time 10 min cap.webp"};
try { progreso = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch (e) { progreso = {}; }

function setupTheme() {
  const root = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

function setupZoom() {
  const modal = document.getElementById('zoom-modal');
  const image = document.getElementById('zoom-image');
  const close = document.getElementById('zoom-close');
  document.body.addEventListener('click', (e) => {
    const trigger = e.target.closest('.zoomable');
    if (!trigger) return;
    image.src = trigger.dataset.zoomSrc;
    image.alt = trigger.dataset.zoomAlt || 'Imagen ampliada';
    modal.showModal();
  });
  close.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.open) modal.close(); });
}

async function init() {
  const res = await fetch('./data/programa-28-niveles.json');
  programa = await res.json();
  bindTabs();
  setupTheme();
  setupZoom();
  currentLevel = getCurrentLevel();
  renderAll();
}

function bindTabs() {
  document.querySelectorAll('.tabs__button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs__button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.panel').forEach(panel => { panel.hidden = !panel.id.endsWith(tab); });
    });
  });
}

function getCurrentLevel() { for (const item of programa) { if (progreso[item.nivel] !== 'done') return item.nivel; } return 28; }
function doneCount() { return Object.values(progreso).filter(v => v === 'done').length; }
function saveProgress() { localStorage.setItem(stateKey, JSON.stringify(progreso)); }

function renderSidebar() {
  const nivel = programa.find(n => n.nivel === currentLevel) || programa[0];
  document.getElementById('resumen-nivel').textContent = `Nivel ${nivel.nivel} · Semana ${nivel.semana}`;
  document.getElementById('resumen-estado').textContent = progreso[nivel.nivel] === 'done' ? 'Completado y guardado' : 'Pendiente de completar';
  document.getElementById('progreso-hecho').textContent = doneCount();
}

function zoomImageButton(src, alt, width=1200, height=1200, caption='Pulsa para ampliar') {
  return `
    <button class="zoomable" data-zoom-src="${src}" data-zoom-alt="${alt}">
      <img src="${src}" alt="${alt}" width="${width}" height="${height}" loading="lazy">
    </button>
    <span class="zoom-hint">${caption}</span>
  `;
}

function renderEntrenar(levelNum) {
  const nivel = programa.find(n => n.nivel === levelNum) || programa[0];
  const completed = progreso[nivel.nivel] === 'done';
  const selectOptions = programa.map(n => `<option value="${n.nivel}" ${n.nivel === nivel.nivel ? 'selected' : ''}>Día ${n.nivel}</option>`).join('');
  document.getElementById('tab-entrenar').innerHTML = `
    <div class="panel__top">
      <div class="level-image-wrap">
        ${zoomImageButton(nivel.assetEntrenamiento, nivel.titulo, 1200, 1200, 'Pulsa la imagen del día para hacer zoom')}
      </div>
      <div class="level-meta">
        <div class="panel-card">
          <p class="kicker">Sesión activa</p>
          <h2>${nivel.titulo}</h2>
          <p class="mini-note">Semana ${nivel.semana} del programa real de 28 niveles, con acceso directo al día visual exacto y sin dependencia de Drive.</p>
        </div>
        <div class="panel-card">
          <div class="select-row">
            <label for="nivel-select">Cambiar nivel</label>
            <select id="nivel-select">${selectOptions}</select>
          </div>
          <p class="mini-note">Estado: <strong>${completed ? 'Completado' : 'Pendiente'}</strong></p>
          <div class="select-row">
            <button class="action-button" id="btn-complete">${completed ? 'Volver a dejar pendiente' : 'Marcar nivel completado'}</button>
          </div>
        </div>
        <div class="helper-banner">
          <p class="kicker">Comodines</p>
          <p class="mini-note">Si necesitas recuperar semana, aquí sigue viva la norma del Comodín Buba: descanso, técnica y vuelta al inicio de la semana que toque.</p>
          <div class="gallery-grid" style="margin-top:.85rem;">
            <figure class="gallery-card">${zoomImageButton(assets.comodin1, 'Comodín 1', 900, 900)}<figcaption>Comodín 1</figcaption></figure>
            <figure class="gallery-card">${zoomImageButton(assets.comodin6, 'Comodín 6', 900, 900)}<figcaption>Comodín 6</figcaption></figure>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('nivel-select').addEventListener('change', e => { currentLevel = Number(e.target.value); renderAll(); });
  document.getElementById('btn-complete').addEventListener('click', () => { if (completed) delete progreso[nivel.nivel]; else progreso[nivel.nivel] = 'done'; saveProgress(); currentLevel = getCurrentLevel(); renderAll(); });
}

function renderProgreso() {
  document.getElementById('tab-progreso').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Tracker</p>
      <h2>${doneCount()} de 28 niveles completados</h2>
      <p class="mini-note">El tablero visual mantiene el espíritu del tracker original y ahora cada casilla completada queda señalada con check, además del contador superior.</p>
      <div class="segment-grid">
        ${programa.map(item => `<div class="segment ${progreso[item.nivel] === 'done' ? 'done' : ''}">${item.nivel}</div>`).join('')}
      </div>
    </div>
    <div class="panel-card" style="margin-top:1rem;">
      <p class="kicker">Referencia original</p>
      ${zoomImageButton(assets.tracker, 'Tracker 28 niveles', 1200, 1200, 'Pulsa el tracker para ampliarlo')}
    </div>
    <div class="panel-card" style="margin-top:1rem;">
      <p class="kicker">Norma del comodín</p>
      ${zoomImageButton(assets.comodin_normas, 'Normas Comodín', 1200, 1200)}
    </div>
  `;
}

function renderTecnica() {
  const fichas = Object.entries(assets.fichas).map(([n, src]) => `
    <figure class="gallery-card">
      ${zoomImageButton(src, `Ficha técnica ${n}`, 900, 900)}
      <figcaption>Ficha técnica ${n}</figcaption>
    </figure>
  `).join('');
  document.getElementById('tab-tecnica').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Biblioteca técnica</p>
      <h2>Fichas 1 a 12 del programa</h2>
      <p class="mini-note">Aquí ya se cargan las fichas reales con sus nombres correctos y cada una puede ampliarse para revisar técnica sin forzar el zoom del navegador.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">${fichas}</div>
  `;
}

function renderTorneo() {
  document.getElementById('tab-torneo').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Cierre del programa</p>
      <h2>Torneo, certificado y mapa visual</h2>
      <p class="mini-note">Esta zona reúne la parte celebrable y final del recorrido, manteniendo acceso ampliado a cada pieza.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">
      <figure class="gallery-card">${zoomImageButton(assets.indice, 'Índice visual', 1200, 1200)}<figcaption>Índice visual</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.certificado, 'Certificado Bubatronik', 1200, 1200)}<figcaption>Certificado</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.cartel, 'Cartel oficial del torneo', 1200, 1200)}<figcaption>Cartel oficial Torneo Vol.01</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.leaderboard, 'Leaderboard oficial', 1200, 1200)}<figcaption>Leaderboard imprimible</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.warmup, 'Calentamiento y vuelta a la calma', 1200, 1200)}<figcaption>Calentamiento y vuelta a la calma</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.wod1, 'WOD 1', 1200, 1200)}<figcaption>WOD 1</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.wod2, 'WOD 2', 1200, 1200)}<figcaption>WOD 2</figcaption></figure>
      <figure class="gallery-card">${zoomImageButton(assets.wod3, 'WOD 3', 1200, 1200)}<figcaption>WOD 3</figcaption></figure>
    </div>
  `;
}

function renderAll() { renderSidebar(); renderEntrenar(currentLevel); renderProgreso(); renderTecnica(); renderTorneo(); }
init();
