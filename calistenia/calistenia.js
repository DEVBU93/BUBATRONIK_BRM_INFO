
const stateKey = 'calistenia_bubatronik_progreso_v5';
let programa = [];
let progreso = {};
let currentLevel = 1;
const assets = {"warmup": "/assets/img/0 - FICHA CALENTAMIENTO 5 MIN + VUELTA A LA CALMA.webp", "tracker": "/assets/img/0 - TRACKER 28 NIVELES.webp", "indice": "/assets/img/0 - ÍNDICE VISUAL - TODO LO QUE HAY EN DRIVE -.webp", "fichas": [{"n": 1, "src": "/assets/img/1 - HIP THRUST EN MESA ELEVADA.webp", "title": "Hip Thrust en mesa elevada"}, {"n": 2, "src": "/assets/img/2 - FONDOS EN SILLA CORREGIDO.webp", "title": "Fondos en silla corregido"}, {"n": 3, "src": "/assets/img/3 - FLEXIONES DECLINADAS PIES EN MESA.webp", "title": "Flexiones declinadas pies en mesa"}, {"n": 4, "src": "/assets/img/4 - FICHA SENTADILLA A SILLA  TÉCNICA 5s PAUSA.webp", "title": "Sentadilla a silla · técnica 5s pausa"}, {"n": 5, "src": "/assets/img/5 - FICHA FLEXIONES INCLINADAS ALTAS  MEDIAS  BAJAS.webp", "title": "Flexiones inclinadas altas, medias y bajas"}, {"n": 6, "src": "/assets/img/6 - FICHA PUENTE GLÚTEOS SUELO.webp", "title": "Puente glúteos suelo"}, {"n": 7, "src": "/assets/img/7 - FICHA ZANCADAS ATRÁS  BÚLGARA SILLA.webp", "title": "Zancadas atrás · búlgara silla"}, {"n": 8, "src": "/assets/img/8 - FICHA PLANCHA RODILLAS.webp", "title": "Plancha rodillas"}, {"n": 9, "src": "/assets/img/9 - FICHA BIRD DOG - pareja de plancha.webp", "title": "Bird Dog · pareja de plancha"}, {"n": 10, "src": "/assets/img/10 - FICHA DEAD BUG.webp", "title": "Dead Bug"}, {"n": 11, "src": "/assets/img/11  - FICHA DIAMANTE  PIES ELEVADOS.webp", "title": "Diamante · pies elevados"}, {"n": 12, "src": "/assets/img/12 - FICHA TÉCNICA - ENTRENAMIENTO EN MANADA  PACK BUBATRONIK.webp", "title": "Entrenamiento en manada · Pack Bubatronik"}], "certificado": "/assets/img/CERTIFICADO BUBATRONIK.webp", "cartel": "/assets/img/CARTEL OFICIAL TORNEO BUBATRONIK VOL.01.webp", "comodin_normas": "/assets/img/NORMAS COMODIN.webp", "comodin1": "/assets/img/COMODIN1.webp", "comodin6": "/assets/img/COMODIN6.webp", "leaderboard": "/assets/img/LEADERBOARD  RANKING OFICIAL - imprimible.webp", "logo": "/assets/img/Logo de Bubatronik Radio __subject_1__ en un estilo minimalista_ con un dise_o simple y elegante_ co.jpg", "wod1": "/assets/img/WOD 1 - EMPUJE BRM - For Time 12 min cap.webp", "wod2": "/assets/img/WOD 2 - GLÚTEO 432 .webp", "wod3": "/assets/img/WOD 3 - CORE RISAS - For Time 10 min cap.webp"};
try { progreso = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch (e) { progreso = {}; }

function setupTheme() {
  const root = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => { root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); });
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
    if (!modal.open) modal.showModal();
  });
  close.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => { const wrap = modal.querySelector('.zoom-modal__wrap'); if (!wrap.contains(e.target)) modal.close(); });
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
    <button class="zoomable" type="button" data-zoom-src="${src}" data-zoom-alt="${alt}">
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
      <div class="level-image-wrap">${zoomImageButton(nivel.assetEntrenamiento, nivel.titulo, 1200, 1200, 'Pulsa la imagen del día para ampliar')}</div>
      <div class="level-meta">
        <div class="panel-card"><p class="kicker">Sesión activa</p><h2>${nivel.titulo}</h2><p class="mini-note">Semana ${nivel.semana} del programa real de 28 niveles, con acceso directo al día visual exacto y sin dependencia de Drive.</p></div>
        <div class="panel-card">
          <div class="select-row"><label for="nivel-select">Cambiar nivel</label><select id="nivel-select">${selectOptions}</select></div>
          <p class="mini-note">Estado: <strong>${completed ? 'Completado' : 'Pendiente'}</strong></p>
          <div class="select-row"><button class="action-button" id="btn-complete">${completed ? 'Volver a dejar pendiente' : 'Marcar nivel completado'}</button></div>
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
    <div class="panel-card"><p class="kicker">Tracker</p><h2>${doneCount()} de 28 niveles completados</h2><p class="mini-note">El tablero visual mantiene el espíritu del tracker original para ver el avance de un vistazo.</p><div class="segment-grid">${programa.map(item => `<div class="segment ${progreso[item.nivel] === 'done' ? 'done' : ''}">${item.nivel}</div>`).join('')}</div></div>
    <div class="panel-card" style="margin-top:1rem;"><p class="kicker">Referencia original</p>${zoomImageButton(assets.tracker, 'Tracker 28 niveles', 1200, 1200, 'Pulsa el tracker para ampliarlo')}</div>
    <div class="panel-card" style="margin-top:1rem;"><p class="kicker">Norma del comodín</p>${zoomImageButton(assets.comodin_normas, 'Normas Comodín', 1200, 1200)}</div>
  `;
}

function renderTecnica() {
  const fichas = assets.fichas.map(item => `
    <figure class="gallery-card">
      ${zoomImageButton(item.src, item.title, 900, 900, 'Pulsa la ficha para ampliar')}
      <figcaption><strong>Ficha ${item.n}</strong><br>${item.title}</figcaption>
    </figure>
  `).join('');
  document.getElementById('tab-tecnica').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Biblioteca técnica</p>
      <h2>Fichas técnicas con su nombre real</h2>
      <p class="mini-note">Cada ficha muestra ahora el nombre técnico que ya viene reflejado en el archivo y puede ampliarse para revisar postura, pausa o ejecución con calma.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">${fichas}</div>
  `;
}

function renderTorneo() {
  document.getElementById('tab-torneo').innerHTML = `
    <div class="panel-card"><p class="kicker">Cierre del programa</p><h2>Torneo, certificado y mapa visual</h2><p class="mini-note">Esta zona reúne la parte celebrable y final del recorrido, manteniendo acceso ampliado a cada pieza.</p></div>
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
