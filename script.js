// 1. Animación de brasas y chispas en el Hero
const canvas = document.getElementById('fireCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({ length: 65 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  size: Math.random() * 3 + 1,
  speedY: Math.random() * 1.4 + 0.4,
  speedX: (Math.random() - 0.5) * 0.8,
  color: Math.random() > 0.45 ? '#F5C518' : '#D92323',
  alpha: Math.random() * 0.8 + 0.2
}));

function animateFire() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    p.y -= p.speedY;
    p.x += p.speedX;
    if (p.y < 0) {
      p.y = canvas.height;
      p.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateFire);
}
animateFire();

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

  btnEnviarCotizacion.href = `https://wa.me/5510455547?text=${encodeURIComponent(mensaje)}`;
}

selectPaquete.addEventListener('change', actualizarCotizacion);
rangePersonas.addEventListener('input', actualizarCotizacion);
extraTuetano.addEventListener('change', actualizarCotizacion);
extraMolleja.addEventListener('change', actualizarCotizacion);

// Inicializar al cargar
actualizarCotizacion();