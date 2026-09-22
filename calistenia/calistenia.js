
const stateKey = 'calistenia_bubatronik_progreso';

let programa = [];
let progreso = {};

try {
  progreso = JSON.parse(localStorage.getItem(stateKey) || '{}');
} catch (e) {
  progreso = {};
}

async function init() {
  try {
    const res = await fetch('data/programa-28-niveles.json');
    programa = await res.json();
  } catch (e) {
    console.error('No se pudo cargar el programa de 28 niveles', e);
    programa = [];
  }
  initTabs();
  renderEntrenar();
  renderProgreso();
  renderTecnica();
  renderTorneo();
}

function initTabs() {
  const buttons = document.querySelectorAll('.tabs button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.tab;
      document.querySelectorAll('main section').forEach(sec => {
        sec.hidden = !sec.id.endsWith(tab);
      });
    });
  });
  if (buttons.length) buttons[0].classList.add('active');
}

function renderEntrenar(nivelActual) {
  const cont = document.getElementById('tab-entrenar');
  if (!programa.length) {
    cont.innerHTML = '<p>No se ha cargado aún el programa de 28 niveles.</p>';
    return;
  }

  const nivel = nivelActual
    ? programa.find(n => n.nivel === nivelActual)
    : programa[0];

  const completado = progreso[nivel.nivel] === 'done';

  cont.innerHTML = `
    <h2>${nivel.titulo} · Nivel ${nivel.nivel}</h2>
    ${nivel.assetEntrenamiento ? `<img class="responsive" src="${nivel.assetEntrenamiento}" alt="${nivel.titulo}">` : ''}
    <p>Estado: ${completado ? 'Completado' : 'Pendiente'}</p>
    <button id="btn-completa">Marcar nivel completado</button>
    <div class="selector-nivel">
      <label>Ir a nivel:</label>
      <select id="nivel-select">
        ${programa.map(n => `<option value="${n.nivel}" ${n.nivel === nivel.nivel ? 'selected' : ''}>${n.nivel}</option>`).join('')}
      </select>
    </div>
  `;

  document.getElementById('btn-completa').onclick = () => {
    progreso[nivel.nivel] = 'done';
    localStorage.setItem(stateKey, JSON.stringify(progreso));
    renderEntrenar(nivel.nivel);
    renderProgreso();
  };

  document.getElementById('nivel-select').onchange = (e) => {
    const n = parseInt(e.target.value, 10);
    renderEntrenar(n);
  };
}

function renderProgreso() {
  const cont = document.getElementById('tab-progreso');
  if (!programa.length) {
    cont.innerHTML = '<p>No se ha cargado aún el programa de 28 niveles.</p>';
    return;
  }

  const total = programa.length;
  const hechos = Object.values(progreso).filter(v => v === 'done').length;

  cont.innerHTML = `
    <h2>Progreso</h2>
    <p>${hechos} de ${total} niveles completados</p>
    <div class="barra">
      ${programa.map(n => {
        const done = progreso[n.nivel] === 'done';
        return `<span class="segmento ${done ? 'done' : ''}">${n.nivel}</span>`;
      }).join('')}
    </div>
    <img class="responsive" src="/assets/img/0-TRACKER-28-NIVELES.jpg" alt="Tracker 28 niveles">
  `;
}

function renderTecnica() {
  const cont = document.getElementById('tab-tecnica');
  cont.innerHTML = `
    <h2>Fichas técnicas</h2>
    <p>Consulta las fichas 1–12 cuando necesites repasar técnica.</p>
    <div class="grid-fichas">
      ${Array.from({length: 12}, (_, i) => i + 1).map(i =>
        `<figure>
          <img src="/assets/img/FICHA${String(i).padStart(2,'0')}.webp" alt="Ficha ${i}">
          <figcaption>Ficha técnica ${i}</figcaption>
        </figure>`
      ).join('')}
    </div>
  `;
}

function renderTorneo() {
  const cont = document.getElementById('tab-torneo');
  cont.innerHTML = `
    <h2>Torneo Vol. 01 (opcional)</h2>
    <img class="responsive" src="/assets/img/0-INDICE-VISUAL-TODO-LO-QUE-HAY-EN-DRIVE.jpg" alt="Índice visual">
    <img class="responsive" src="/assets/img/CERTIFICADO.webp" alt="Certificado nivel 28">
    <div class="grid-wod">
      <figure><img src="/assets/img/WOD1.webp" alt="WOD 1"><figcaption>WOD 1</figcaption></figure>
      <figure><img src="/assets/img/WOD2.webp" alt="WOD 2"><figcaption>WOD 2</figcaption></figure>
      <figure><img src="/assets/img/WOD3.webp" alt="WOD 3"><figcaption>WOD 3</figcaption></figure>
    </div>
  `;
}

init();
