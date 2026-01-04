const canvas = document.getElementById('canvas-background');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

// Gestion de la souris
let mouse = {
    x: null,
    y: null,
    radius: 150 // Rayon de répulsion
}

window.addEventListener('mousemove', function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

// Classe Particule
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 30) + 1; 
    }

    // Dessiner la particule (POINT)
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        // COULEUR DES POINTS : Rouge #D32F2F avec 40% d'opacité
        ctx.fillStyle = 'rgba(211, 47, 47, 0.4)'; 
        
        ctx.fill();
    }

    // Mettre à jour la position
    update() {
        // Mouvement rebond sur les bords
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Interaction Souris (Répulsion)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = mouse.radius;
            const force = (maxDistance - distance) / maxDistance;
            
            const directionX = forceDirectionX * force * this.density;
            const directionY = forceDirectionY * force * this.density;

            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                 this.x += this.directionX;
                 this.y += this.directionY;
            }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;

        this.draw();
    }
}

// Initialisation
function init() {
    particlesArray = [];
    // Calcul du nombre de particules selon la taille de l'écran
    let numberOfParticles = (canvas.height * canvas.width) / 9000; 

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1; 
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5; 
        let directionY = (Math.random() * 1) - 0.5;
        let color = '#D32F2F'; // Couleur de base

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Boucle d'animation
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    
    connect();
}

// Dessiner les traits entre les points (LIGNES)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            
            if (distance < (canvas.width/7) * (canvas.height/7)) {
                opacityValue = 1 - (distance / 20000);
                
                // COULEUR DES LIGNES : Rouge #D32F2F avec opacité dynamique (max 0.4)
                // Le * 0.4 permet de garder les traits très discrets
                ctx.strokeStyle = 'rgba(211, 47, 47,' + (opacityValue * 0.4) + ')';
                
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

init();
animate();
// ===== TITRE DYNAMIQUE (Easter Egg) =====
let docTitle = document.title; // 

window.addEventListener("blur", () => {
    document.title = "404: Recruteur introuvable ?"; 
});

window.addEventListener("focus", () => {
    document.title = docTitle; // Remet le titre normal quand on revient
});