/* =========================================
   SPECTRUM - DOTS.JS (Particle System)
   ========================================= */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// Styling the canvas to stay in the background
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1'; 
canvas.style.pointerEvents = 'none';

let particles = [];
const particleCount = 100; // Adjust this for more/fewer dots

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.2; // Horizontal speed
        this.vy = (Math.random() - 0.5) * 1.2; // Vertical speed
        this.size = Math.random() * 2 + 1;
        // Spectrum Colors: Neon Blue or Neon Pink
        this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff'; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off left/right walls
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        // Bounce off top/bottom walls
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // Reset blur for performance
    }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    // Clear the canvas every frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i
