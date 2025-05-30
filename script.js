// Matrix rain background
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;
let cols = Math.floor(w / 18);
let ypos = Array(cols).fill(0);
function matrixRain() {
  ctx.fillStyle = 'rgba(0,0,0,0.13)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#00ff41';
  ctx.font = '18px Fira Mono, monospace';
  for (let i = 0; i < cols; i++) {
    let text = String.fromCharCode(0x30A0 + Math.random() * 96);
    ctx.fillText(text, i * 18, ypos[i] * 18);
    if (Math.random() > 0.975) ypos[i] = 0;
    else ypos[i]++;
  }
}
setInterval(matrixRain, 50);
window.addEventListener('resize', () => {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
  cols = Math.floor(w / 18);
  ypos = Array(cols).fill(0);
});

// Terminal typewriter
const terminalText = `Gracias por darnos todo siempre, te quiero mucho y si bien no lo expreso todo el tiempo,\nde verdad lo siento. Muchas gracias por todas las oportunidades que me das en la vida,\naprecio muchísimo todo tu esfuerzo.`;
let i = 0;
function typeWriter() {
  const container = document.getElementById("terminalContainer");
  if (i < terminalText.length) {
    container.innerHTML = terminalText.slice(0, i+1) + '<span class="terminal-cursor"></span>';
    i++;
    setTimeout(typeWriter, 55);
  } else {
    container.innerHTML = terminalText + '<span class="terminal-cursor"></span>';
  }
}
setTimeout(typeWriter, 2500);

// Fade in effect on scroll
function fadeImagesOnScroll() {
  document.querySelectorAll(".fade-image").forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      img.classList.add("fade-in");
    }
  });
}
window.addEventListener("scroll", fadeImagesOnScroll);
window.addEventListener("DOMContentLoaded", fadeImagesOnScroll);

// OCR
async function processImage() {
  const input = document.getElementById('imageInput');
  const status = document.getElementById('ocrStatus');
  const output = document.getElementById('ocrResult');
  if (!input.files.length) {
    alert("Selecciona una imagen");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    status.innerText = "Procesando imagen...";
    Tesseract.recognize(reader.result, 'spa', {
      logger: m => {
        status.innerText = `${m.status} (${Math.round(m.progress * 100)}%)`;
      }
    }).then(({ data: { text } }) => {
      status.innerText = "Completado";
      output.value = text;
    }).catch(err => {
      status.innerText = "Error al procesar";
      console.error(err);
    });
  };
  reader.readAsDataURL(input.files[0]);
}
// Descargar TXT
function downloadText() {
  const text = document.getElementById('ocrResult').value;
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "digitalizacion.txt";
  a.click();
}
// Descargar PDF
async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('courier', 'normal');
  doc.setFontSize(12);
  const lines = doc.splitTextToSize(document.getElementById('ocrResult').value, 180);
  doc.text(lines, 10, 15);
  doc.save("digitalizacion.pdf");
}
