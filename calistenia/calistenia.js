
const stateKey = 'calistenia_bubatronik_progreso_v2';
let programa = [];
let progreso = {};
let currentLevel = 1;

try {
  progreso = JSON.parse(localStorage.getItem(stateKey) || '{}');
} catch (e) {
  progreso = {};
}

const specialImages = {
  tracker: '/assets/img/0-TRACKER-28-NIVELES.jpg',
  indice: '/assets/img/0-INDICE-VISUAL-TODO-LO-QUE-HAY-EN-DRIVE.jpg',
  certificado: '/assets/img/CERTIFICADO.webp',
  calentamiento: '/assets/img/CALENTAMIENTO.webp',
  normas: '/assets/img/COMODIN.webp',
  wod1: '/assets/img/WOD1.webp',
  wod2: '/assets/img/WOD2.webp',
  wod3: '/assets/img/WOD3.webp'
};

function setThemeToggle() {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
  });
}

async function init() {
  try {
    const res = await fetch('./data/programa-28-niveles.json');
    programa = await res.json();
  } catch (err) {
    console.error(err);
  }
  bindTabs();
  setThemeToggle();
  currentLevel = getCurrentLevel();
  renderAll();
}

function bindTabs() {
  const buttons = document.querySelectorAll('.tabs__button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('.panel').forEach(panel => {
        panel.hidden = !panel.id.endsWith(tab);
        panel.classList.toggle('panel--active', panel.id.endsWith(tab));
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

function doneCount() {
  return Object.values(progreso).filter(v => v === 'done').length;
}

function saveProgress() {
  localStorage.setItem(stateKey, JSON.stringify(progreso));
}

function imageWithFallback(primary, alternatives, alt) {
  const arr = [primary, ...(alternatives || [])].filter(Boolean);
  const attr = arr.map((item, index) => index === 0 ? `src="${item}"` : `data-alt-${index}="${item}"`).join(' ');
  return `<img class="responsive-fallback" ${attr} alt="${alt}" onerror="(function(img){const keys=Object.keys(img.dataset).filter(k=>k.startsWith('alt')); if(keys.length){const next=img.dataset[keys.sort()[0]]; delete img.dataset[keys.sort()[0]]; img.src=next;} else {img.closest('.level-image-wrap,.gallery-card,.panel-card')?.classList.add('is-missing'); img.style.display='none';}})(this)">`;
}

function renderAll() {
  renderEntrenar(currentLevel);
  renderProgreso();
  renderTecnica();
  renderTorneo();
  renderSidebar();
}

function renderSidebar() {
  const nivel = programa.find(n => n.nivel === currentLevel) || programa[0];
  document.getElementById('resumen-nivel').textContent = `Nivel ${nivel.nivel} · Semana ${nivel.semana}`;
  document.getElementById('resumen-estado').textContent = progreso[nivel.nivel] === 'done' ? 'Completado y guardado' : 'Pendiente de completar';
  document.getElementById('progreso-hecho').textContent = doneCount();
}

function renderEntrenar(nivelNum) {
  const nivel = programa.find(n => n.nivel === nivelNum) || programa[0];
  const panel = document.getElementById('tab-entrenar');
  const completed = progreso[nivel.nivel] === 'done';
  const levelOptions = programa.map(n => `<option value="${n.nivel}" ${n.nivel === nivel.nivel ? 'selected' : ''}>Día ${n.nivel}</option>`).join('');
  panel.innerHTML = `
    <div class="panel__top">
      <div class="level-image-wrap">
        ${imageWithFallback(nivel.assetEntrenamiento, nivel.alternatives, nivel.titulo)}
      </div>
      <div class="level-meta">
        <div class="panel-card">
          <p class="kicker">Sesión activa</p>
          <h2>${nivel.titulo}</h2>
          <p class="mini-note">Semana ${nivel.semana}. Aquí cargas el día real del programa y lo mantienes dentro del pulso BRM, sin abrir Drive ni salir de la web.</p>
        </div>
        <div class="panel-card">
          <div class="select-row">
            <label for="nivel-select">Cambiar nivel</label>
            <select id="nivel-select">${levelOptions}</select>
          </div>
          <p class="mini-note">Estado: <strong>${completed ? 'Completado' : 'Pendiente'}</strong></p>
          <div class="select-row">
            <button class="action-button" id="btn-complete">${completed ? 'Volver a dejar pendiente' : 'Marcar nivel completado'}</button>
          </div>
        </div>
        <div class="helper-banner">
          <p class="kicker">Base del día</p>
          <p class="mini-note">Calentamiento, técnica limpia, progreso con cabeza y cierre con calma. La lógica sigue siendo la del programa real: avanzar sin romper el cuerpo ni forzar el ego.</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('nivel-select').addEventListener('change', (e) => {
    currentLevel = Number(e.target.value);
    renderAll();
  });

  document.getElementById('btn-complete').addEventListener('click', () => {
    progreso[nivel.nivel] = completed ? 'pending' : 'done';
    if (progreso[nivel.nivel] === 'pending') delete progreso[nivel.nivel];
    saveProgress();
    currentLevel = getCurrentLevel();
    renderAll();
  });
}

function renderProgreso() {
  const panel = document.getElementById('tab-progreso');
  panel.innerHTML = `
    <div class="panel-card">
      <p class="kicker">Tracker</p>
      <h2>${doneCount()} de 28 niveles completados</h2>
      <p class="mini-note">La barra visual mantiene la lógica del tracker original y te deja ver rápido dónde estás en la travesía.</p>
      <div class="segment-grid">
        ${programa.map(item => `<div class="segment ${progreso[item.nivel] === 'done' ? 'done' : ''}">${item.nivel}</div>`).join('')}
      </div>
    </div>
    <div class="panel-card" style="margin-top:1rem;">
      <p class="kicker">Referencia visual</p>
      ${imageWithFallback(specialImages.tracker, ['/assets/img/TRACKER-28-NIVELES.jpg'], 'Tracker 28 niveles')}
    </div>
  `;
}

function renderTecnica() {
  const panel = document.getElementById('tab-tecnica');
  const cards = Array.from({ length: 12 }, (_, index) => {
    const n = index + 1;
    const base = `/assets/img/FICHA${String(n).padStart(2, '0')}.webp`;
    const alt1 = `/assets/img/${n}.webp`;
    const alt2 = `/assets/img/FICHA${n}.webp`;
    return `
      <figure class="gallery-card">
        ${imageWithFallback(base, [alt1, alt2], `Ficha técnica ${n}`)}
        <figcaption>Ficha técnica ${n}</figcaption>
      </figure>
    `;
  }).join('');

  panel.innerHTML = `
    <div class="panel-card">
      <p class="kicker">Biblioteca técnica</p>
      <h2>Fichas para repasar forma y apoyo</h2>
      <p class="mini-note">Aquí se reúnen las 12 fichas para consultar postura, apoyo y progresión sin salir del módulo.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">${cards}</div>
  `;
}

function renderTorneo() {
  const panel = document.getElementById('tab-torneo');
  panel.innerHTML = `
    <div class="panel-card">
      <p class="kicker">Programa completo</p>
      <h2>Cierre, WOD y espíritu de torneo</h2>
      <p class="mini-note">El área final conserva certificado, mapa visual y tres propuestas WOD como cierre opcional del recorrido.</p>
    </div>
    <div class="gallery-grid" style="margin-top:1rem;">
      <figure class="gallery-card">${imageWithFallback(specialImages.indice, [], 'Índice visual')}<figcaption>Índice visual del programa</figcaption></figure>
      <figure class="gallery-card">${imageWithFallback(specialImages.certificado, ['/assets/img/CERTIFICADO-NIVEL-28.webp'], 'Certificado')}<figcaption>Certificado nivel 28</figcaption></figure>
      <figure class="gallery-card">${imageWithFallback(specialImages.calentamiento, ['/assets/img/43-calentamiento-5-min-vuelta-calma-5-min.webp'], 'Calentamiento')}<figcaption>Calentamiento y vuelta a la calma</figcaption></figure>
      <figure class="gallery-card">${imageWithFallback(specialImages.normas, ['/assets/img/31-normas-comodin-buba.webp'], 'Normas comodín')}<figcaption>Normas del Comodín Buba</figcaption></figure>
      <figure class="gallery-card">${imageWithFallback(specialImages.wod1, ['/assets/img/WOD-1.webp'], 'WOD 1')}<figcaption>WOD 1</figcaption></figure>
      <figure class="gallery-card">${imageWithFallback(specialImages.wod2, ['/assets/img/WOD-2.webp'], 'WOD 2')}<figcaption>WOD 2</figcaption></figure>
      <figure class="gallery-card">${imageWithFallback(specialImages.wod3, ['/assets/img/WOD-3.webp'], 'WOD 3')}<figcaption>WOD 3</figcaption></figure>
    </div>
  `;
}

init();
