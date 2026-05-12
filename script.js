const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelectorAll(".nav a");

function syncHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
}

menuToggle.addEventListener("click", () => {
  header.classList.toggle("is-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => header.classList.remove("is-open"));
});

document.querySelectorAll("img").forEach((image) => {
  image.addEventListener("error", () => {
    const fallback = image.closest(".photo-slot");
    if (fallback) {
      image.remove();
    }
  });
});

window.addEventListener("scroll", syncHeader, { passive: true });
syncHeader();

const canvas = document.querySelector("[data-network]");
const context = canvas.getContext("2d");
let width = 0;
let height = 0;
let nodes = [];
let pointer = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;
  width = canvas.offsetWidth;
  height = canvas.offsetHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  createNodes();
}

function createNodes() {
  const count = Math.max(40, Math.min(110, Math.floor(width / 16)));
  nodes = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: index % 9 === 0 ? 2.4 : 1.4,
  }));
}

function draw() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#102326";
  context.fillRect(0, 0, width, height);

  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - node.x;
      const dy = pointer.y - node.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 180) {
        node.x -= dx * 0.0009;
        node.y -= dy * 0.0009;
      }
    }
  }

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i];
      const b = nodes[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 118) {
        context.strokeStyle = `rgba(111, 221, 207, ${0.18 * (1 - distance / 118)})`;
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.stroke();
      }
    }
  }

  for (const node of nodes) {
    context.fillStyle = node.radius > 2 ? "rgba(199, 147, 61, 0.92)" : "rgba(236, 251, 247, 0.72)";
    context.beginPath();
    context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    context.fill();
  }

  requestAnimationFrame(draw);
}

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    active: true,
  };
});

canvas.addEventListener("pointerleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();
draw();
