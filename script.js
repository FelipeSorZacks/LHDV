// 1. Brasas y chispas en TODA la página (canvas fijo)
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');
const esMovil = window.matchMedia('(max-width: 700px)').matches;
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function nuevaParticula(inicio) {
  return {
    x: Math.random() * canvas.width,
    y: inicio ? Math.random() * canvas.height : canvas.height + 10,
    size: Math.random() * 2.6 + 0.8,
    speedY: Math.random() * 1.2 + 0.4,
    speedX: (Math.random() - 0.5) * 0.7,
    color: Math.random() > 0.45 ? '#F5C518' : '#D92323',
    alpha: Math.random() * 0.6 + 0.25
  };
}
const particles = Array.from({ length: esMovil ? 32 : 70 }, () => nuevaParticula(true));

function animateFire() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, i) => {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    if (!esMovil) { // halo suave (en celular se omite para ahorrar batería)
      ctx.globalAlpha = p.alpha * 0.25;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    p.y -= p.speedY;
    p.x += p.speedX + Math.sin(p.y / 40) * 0.25;
    if (p.y < -10) particles[i] = nuevaParticula(false);
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateFire);
}
if (!reducirMovimiento) animateFire();

// Menú hamburguesa (celular)
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
navToggle.addEventListener('click', () => {
  const abierto = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', abierto);
  navToggle.textContent = abierto ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.textContent = '☰';
}));

// =====================================================
// VIDEOS DE TIKTOK — para actualizarlos solo cambia estos dos links
// (pega el link completo del video, o solo el número del final)
// =====================================================
const VIDEOS_TIKTOK = {
  parrilla: 'https://www.tiktok.com/@lhdv.nz/video/7690756409776016658',
  eventos:  'https://www.tiktok.com/@lhdv.nz/video/7662564778237381906'
};

document.querySelectorAll('.tiktok-Wrapper[data-video]').forEach(caja => {
  const link = VIDEOS_TIKTOK[caja.dataset.video] || '';
  const id = (link.match(/video\/(\d+)/) || link.match(/^(\d+)$/) || [])[1];
  if (!id) return;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.tiktok.com/player/v1/${id}?loop=1&autoplay=1&music_info=0&description=0&rel=0`;
  iframe.allow = 'fullscreen; autoplay; encrypted-media';
  iframe.loading = 'lazy';
  iframe.title = 'Video de Los Hijos de Villa en TikTok';
  caja.appendChild(iframe);
  const enlace = document.getElementById('link-' + caja.dataset.video);
  if (enlace && link.startsWith('http')) enlace.href = link;
});

// 2. Sistema de Pestañas (Parrilla Clásica vs Parrilla Tradicional)
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.paquete-panel');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    btn.classList.add('active');
    const targetId = btn.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');
  });
});

// 3. Calculadora de Cotización Oficial
const selectPaquete = document.getElementById('selectPaquete');
const rangePersonas = document.getElementById('rangePersonas');
const numPersonasLabel = document.getElementById('numPersonasLabel');
const extraTuetano = document.getElementById('extraTuetano');
const extraMolleja = document.getElementById('extraMolleja');
const precioPorPersonaEl = document.getElementById('precioPorPersona');
const precioTotalEl = document.getElementById('precioTotal');
const avisoMinimoEl = document.getElementById('avisoMinimo');
const btnEnviarCotizacion = document.getElementById('btnEnviarCotizacion');

function obtenerPrecioUnitario(paquete, personas) {
  if (paquete === 'clasica') {
    if (personas <= 35) return 480;
    if (personas <= 50) return 470;
    if (personas <= 70) return 460;
    if (personas <= 100) return 450;
    if (personas <= 150) return 440;
    return 430;
  } else {
    // Paquete Tradicional
    if (personas <= 30) return 390;
    if (personas <= 50) return 380;
    if (personas <= 70) return 370;
    if (personas <= 100) return 360;
    if (personas <= 150) return 350;
    return 340;
  }
}

function actualizarCotizacion() {
  const paquete = selectPaquete.value;
  let personas = parseInt(rangePersonas.value, 10);

  // Validar mínimo de 30 personas para Parrilla Clásica
  if (paquete === 'clasica' && personas < 30) {
    avisoMinimoEl.textContent = '* El Paquete Parrilla Clásica requiere un mínimo de 30 personas (calculado sobre 30).';
    personas = 30;
  } else {
    avisoMinimoEl.textContent = '';
  }

  numPersonasLabel.textContent = rangePersonas.value;

  const baseUnitario = obtenerPrecioUnitario(paquete, personas);
  let extrasPorPersona = 0;
  const extrasTexto = [];

  if (extraTuetano.checked) {
    extrasPorPersona += 75;
    extrasTexto.push('Tuétano');
  }
  if (extraMolleja.checked) {
    extrasPorPersona += 55;
    extrasTexto.push('Molleja de Ternera');
  }

  const unitarioFinal = baseUnitario + extrasPorPersona;
  const totalEvento = unitarioFinal * personas;

  precioPorPersonaEl.textContent = `$${unitarioFinal.toFixed(2)} MXN`;
  precioTotalEl.textContent = `$${totalEvento.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;

  const nombrePaquete = paquete === 'clasica' ? 'Parrilla Clásica' : 'Parrilla Tradicional';
  const detalleExtras = extrasTexto.length > 0 ? ` con extras (${extrasTexto.join(', ')})` : '';
  const mensaje = `Hola Los Hijos de Villa, me interesa cotizar el *Paquete ${nombrePaquete}* para *${personas} personas*${detalleExtras}. Presupuesto estimado en web: $${totalEvento.toLocaleString('es-MX')} MXN.`;

  btnEnviarCotizacion.href = `https://wa.me/525510455547?text=${encodeURIComponent(mensaje)}`;
}

selectPaquete.addEventListener('change', actualizarCotizacion);
rangePersonas.addEventListener('input', actualizarCotizacion);
extraTuetano.addEventListener('change', actualizarCotizacion);
extraMolleja.addEventListener('change', actualizarCotizacion);

// Inicializar al cargar
actualizarCotizacion();