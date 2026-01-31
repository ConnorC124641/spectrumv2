/* =========================================
   SPECTRUM - DOTS.JS (Fixed Version)
   ========================================= */

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

// 1. Fix the Canvas Styles
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1'; 
canvas.style.pointerEvents = 'none';
// 2. Apply the dark background color directly to the canvas
canvas.style.background = '#0a0a0a'; 

let particles = [];
const particleCount = 100;

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
        this.vx = (Math.random() - 0.5) * 1.2;
        this.vy = (Math.random() - 0.5) * 1.2;
        this.size = Math.random() * 2 + 1;
        // Check if theme colors are saved, otherwise use defaults
        const c1 = localStorage.getItem('primaryColor') || '#ff00ff';
        const c2 = localStorage.getItem('secondaryColor') || '#00ffff';
        this.color = Math.random() > 0.5 ? c1 : c2; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

// Initialize
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        let p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
            let p2 = particles[j];
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = p1.color;
                ctx.globalAlpha = 1 - (distance / 120); 
                ctx.lineWidth = 0.5;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();
// Add this at the very bottom of dots.js
function setupFavorites() {
    // 1. Find all game buttons
    const gameButtons = document.querySelectorAll('.game-btn');
    const favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];

    // If no buttons are found, wait and try one more time
    if (gameButtons.length === 0) {
        console.log("No game buttons found yet, retrying...");
        return;
    }

    gameButtons.forEach(btn => {
        // Stop if we already added a favorite button here
        if (btn.nextElementSibling && btn.nextElementSibling.classList.contains('fav-btn')) return;

        const gameName = btn.innerText.trim();
        
        // 2. Create Favorite Button
        const favBtn = document.createElement('button');
        favBtn.className = "fav-btn";
        
        // Check if it's already a favorite
        const isFav = favorites.includes(gameName);
        favBtn.innerHTML = isFav ? "⭐ Favorited" : "☆ Favorite";

        // 3. Simple click logic
        favBtn.onclick = (e) => {
            e.preventDefault();
            let currentFavs = JSON.parse(localStorage.getItem('myFavorites')) || [];
            if (currentFavs.includes(gameName)) {
                currentFavs = currentFavs.filter(f => f !== gameName);
                favBtn.innerHTML = "☆ Favorite";
            } else {
                currentFavs.push(gameName);
                favBtn.innerHTML = "⭐ Favorited";
            }
            localStorage.setItem('myFavorites', JSON.stringify(currentFavs));
        };

        // 4. Put it after the button
        btn.after(favBtn);
    });
}
let filterActive = false;

function toggleFavFilter() {
    filterActive = !filterActive;
    
    // Get all the data we need upfront (Read phase)
    const filterBtn = document.getElementById('filter-favs');
    const favorites = JSON.parse(localStorage.getItem('myFavorites')) || [];
    const gameButtons = document.querySelectorAll('.game-btn');

    // Update the button text immediately
    if (filterBtn) {
        filterBtn.innerText = filterActive ? "Show Favorites Only (ON)" : "Show Favorites Only (OFF)";
        filterBtn.classList.toggle('active', filterActive);
    }

    // Tell browser to update the games in the next frame (Write phase)
    requestAnimationFrame(() => {
        gameButtons.forEach(btn => {
            const gameName = btn.innerText.trim();
            // Find the container (card or wrapper)
            const container = btn.closest('.game-card') || btn.closest('.game-wrapper') || btn.parentElement;

            // If Filter is ON and game is NOT in favorites -> Hide it
            if (filterActive && !favorites.includes(gameName)) {
                container.classList.add('hidden-game');
            } else {
                // Otherwise show it
                container.classList.remove('hidden-game');
            }
        });
    });
}
