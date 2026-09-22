
const stateKey = 'calistenia_bubatronik_progreso_v3';
let programa = [];
let progreso = {};
let currentLevel = 1;
const assets = {"warmup": "/assets/img/0 - FICHA CALENTAMIENTO 5 MIN + VUELTA A LA CALMA.webp", "tracker": "/assets/img/0 - TRACKER 28 NIVELES.webp", "indice": "/assets/img/0 - ÍNDICE VISUAL - TODO LO QUE HAY EN DRIVE -.webp", "fichas": {"1": "/assets/img/1 - HIP THRUST EN MESA ELEVADA.webp", "2": "/assets/img/2 - FONDOS EN SILLA CORREGIDO.webp", "3": "/assets/img/3 - FLEXIONES DECLINADAS PIES EN MESA.webp", "4": "/assets/img/4 - FICHA SENTADILLA A SILLA TÉCNICA 5s PAUSA.webp", "5": "/assets/img/5 - FICHA FLEXIONES INCLINADAS ALTAS  MEDIAS  BAJAS.webp", "6": "/assets/img/6 - FICHA PUENTE GLÚTEOS SUELO.webp", "7": "/assets/img/7 - FICHA ZANCADAS ATRÁS  BÚLGARA SILLA.webp", "8": "/assets/img/8 - FICHA PLANCHA RODILLAS.webp", "9": "/assets/img/9 - FICHA BIRD DOG - pareja de plancha.webp", "10": "/assets/img/10 - FICHA DEAD BUG.webp", "11": "/assets/img/11  - FICHA DIAMANTE  PIES ELEVADOS.webp", "12": "/assets/img/12 - FICHA TÉCNICA - ENTRENAMIENTO EN MANADA  PACK BUBATRONIK.webp"}, "certificado": "/assets/img/CERTIFICADO BUBATRONIK.webp", "cartel": "/assets/img/CARTEL OFICIAL TORNEO BUBATRONIK VOL.01.webp", "comodin_normas": "/assets/img/NORMAS COMODIN.webp", "comodin1": "/assets/img/COMODIN1.webp", "comodin6": "/assets/img/COMODIN6.webp", "leaderboard": "/assets/img/LEADERBOARD  RANKING OFICIAL - imprimible.webp", "logo": "/assets/img/Logo de Bubatronik Radio __subject_1__ en un estilo minimalista_ con un dise_o simple y elegante_ co.jpg", "portada": "/assets/img/portada.jpg", "wod1": "/assets/img/WOD 1 - EMPUJE BRM - For Time 12 min cap.webp", "wod2": "/assets/img/WOD 2 - GLÚTEO 432 .webp", "wod3": "/assets/img/WOD 3 - CORE RISAS - For Time 10 min cap.webp"};
try { progreso = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch (e) { progreso = {}; }

function setupTheme() {
  const root = document.documentElement;
  const btn = document.querySelector('[data-theme-toggle]');
  if (!btn) return;
  btn.addEventListener('click', () => {
    root.setAttribute('data-theme', root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
}

async function init() {
  const res = await fetch('./data/programa-28-niveles.json');
  programa = await res.json();
  bindTabs();
  setupTheme();
  currentLevel = getCurrentLevel();
  renderAll();
}

function bindTabs() {
  document.querySelectorAll('.tabs__button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tabs__button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.panel').forEach(panel => {
        panel.hidden = !panel.id.endsWith(tab);
      });
    });
  });
}

function getCurrentLevel() {
  for (const item of programa) {
    if (progreso[item.nivel] !== 'done') return item.nivel;
  }
  return 28;
}
function doneCount() { return Object.values(progreso).filter(v => v === 'done').length; }
function saveProgress() { localStorage.setItem(stateKey, JSON.stringify(progreso)); }

function renderSidebar() {
  const nivel = programa.find(n => n.nivel === currentLevel) || programa[0];
  document.getElementById('resumen-nivel').textContent = `Nivel ${nivel.nivel} · Semana ${nivel.semana}`;
  document.getElementById('resumen-estado').textContent = progreso[nivel.nivel] === 'done' ? 'Completado y guardado' : 'Pendiente de completar';
  document.getElementById('progreso-hecho').textContent = doneCount();
}

function renderEntrenar(levelNum) {
  const nivel = programa.find(n => n.nivel === levelNum) || programa[0];
  const completed = progreso[nivel.nivel] === 'done';
  const selectOptions = programa.map(n => `<option value="${n.nivel}" ${n.nivel === nivel.nivel ? 'selected' : ''}>Día ${n.nivel}</option>`).join('');
  document.getElementById('tab-entrenar').innerHTML = `
    <div class="panel__top">
      <div class="level-image-wrap">
        <img src="${nivel.assetEntrenamiento}" alt="${nivel.titulo}" width="1200" height="1200" loading="eager">
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
            <figure class="gallery-card"><img src="${assets.comodin1}" alt="Comodín 1" width="900" height="900" loading="lazy"><figcaption>Comodín 1</figcaption></figure>
            <figure class="gallery-card"><img src="${assets.comodin6}" alt="Comodín 6" width="900" height="900" loading="lazy"><figcaption>Comodín 6</figcaption></figure>
          </div>
        </div>
      </div>
    </div>
  `;
  document.getElementById('nivel-select').addEventListener('change', e => { currentLevel = Number(e.target.value); renderAll(); });
  document.getElementById('btn-complete').addEventListener('click', () => {
    if (completed) delete progreso[nivel.nivel]; else progreso[nivel.nivel] = 'done';
    saveProgress();
    currentLevel = getCurrentLevel();
    renderAll();
  });
}

function renderProgreso() {
  document.getElementById('tab-progreso').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Tracker</p>
      <h2>${doneCount()} de 28 niveles completados</h2>
      <p class="mini-note">El tablero visual mantiene el mismo espíritu del tracker original del programa para ver el avance de un vistazo.</p>
      <div class="segment-grid">
        ${programa.map(item => `<div class="segment ${progreso[item.nivel] === 'done' ? 'done' : ''}">${item.nivel}</div>`).join('')}
      </div>
    </div>
    <div class="panel-card" style="margin-top:1rem;">
      <p class="kicker">Referencia original</p>
      <img src="${assets.tracker}" alt="Tracker 28 niveles" width="1200" height="1200" loading="lazy">
    </div>
    <div class="panel-card" style="margin-top:1rem;">
      <p class="kicker">Norma del comodín</p>
      <img src="${assets.comodin_normas}" alt="Normas Comodín" width="1200" height="1200" loading="lazy">
    </div>
  `;
}

function renderTecnica() {
  const fichas = Object.entries(assets.fichas).map(([n, src]) => `
    <figure class="gallery-card">
      <img src="${src}" alt="Ficha técnica ${n}" width="900" height="900" loading="lazy">
      <figcaption>Ficha técnica ${n}</figcaption>
    </figure>
  `).join('');
  document.getElementById('tab-tecnica').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Biblioteca técnica</p>
      <h2>Fichas 1 a 12 del programa</h2>
      <p class="mini-note">Aquí ya se cargan las fichas reales con los nombres exactos del repositorio, así que no deberían romperse mientras mantengas estas rutas.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">${fichas}</div>
  `;
}

function renderTorneo() {
  document.getElementById('tab-torneo').innerHTML = `
    <div class="panel-card">
      <p class="kicker">Cierre del programa</p>
      <h2>Torneo, certificado y mapa visual</h2>
      <p class="mini-note">Esta zona reúne la parte celebrable y final del recorrido, sin perder el tono Bubatronik de barrio y constancia.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">
      <figure class="gallery-card"><img src="${assets.indice}" alt="Índice visual" width="1200" height="1200" loading="lazy"><figcaption>Índice visual</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.certificado}" alt="Certificado Bubatronik" width="1200" height="1200" loading="lazy"><figcaption>Certificado</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.cartel}" alt="Cartel oficial del torneo" width="1200" height="1200" loading="lazy"><figcaption>Cartel oficial Torneo Vol.01</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.leaderboard}" alt="Leaderboard oficial" width="1200" height="1200" loading="lazy"><figcaption>Leaderboard imprimible</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.warmup}" alt="Calentamiento y vuelta a la calma" width="1200" height="1200" loading="lazy"><figcaption>Calentamiento y vuelta a la calma</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.wod1}" alt="WOD 1" width="1200" height="1200" loading="lazy"><figcaption>WOD 1</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.wod2}" alt="WOD 2" width="1200" height="1200" loading="lazy"><figcaption>WOD 2</figcaption></figure>
      <figure class="gallery-card"><img src="${assets.wod3}" alt="WOD 3" width="1200" height="1200" loading="lazy"><figcaption>WOD 3</figcaption></figure>
    </div>
  `;
}

function renderAll() {
  renderSidebar();
  renderEntrenar(currentLevel);
  renderProgreso();
  renderTecnica();
  renderTorneo();
}

init();
