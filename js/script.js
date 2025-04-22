const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');
const countdownDisplay = document.getElementById('countdown');
const messageContainer = document.getElementById('message-container');
const finalMessageContainer = document.getElementById('final-message-container'); // Novo container
const constellationContainer = document.getElementById('constellation-container');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        };
        this.alpha = 1;
        this.friction = 0.98;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.005;
    }
}

class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = { x: 0, y: Math.random() * -3 - 1 };
        this.particles = [];
        this.lifespan = 180;
        this.hasExploded = false;
        this.timeSinceSpawn = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    explode() {
        for (let i = 0; i < 70; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }

    update() {
        this.timeSinceSpawn++;
        this.lifespan--;

        if (this.lifespan <= 0 && !this.hasExploded) {
            this.explode();
            this.velocity = { x: 0, y: 0 };
            this.hasExploded = true;
            this.timeSinceExplosion = 0;
        } else if (this.lifespan > 0) {
            this.y += this.velocity.y;
        }

        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update();
            this.particles[i].draw();

            if (this.particles[i].alpha <= 0) {
                this.particles.splice(i, 1);
                i--;
            }
        }

        if (this.hasExploded) {
            this.timeSinceExplosion++;
        }
    }
}

let fireworks = [];
let countdown = 5;
countdownDisplay.textContent = countdown;
let fireworksStarted = false;
let fireworksDuration = 10000;
let fireworksStartTime;
const message = "FELIZ ANIVERSÁRIO JAJA";
const words = message.split(" ");
let wordIndex = 0;
let messageEndTime;
let constellationTimeout;

const countdownInterval = setInterval(() => {
    countdown--;
    countdownDisplay.textContent = countdown;

    if (countdown <= 0) {
        clearInterval(countdownInterval);
        countdownDisplay.style.display = 'none';
        startFireworks();
    }
}, 1000);

function startFireworks() {
    fireworksStarted = true;
    fireworksStartTime = Date.now();
    animate();
}

function showNextWord() {
    if (wordIndex < words.length) {
        messageContainer.textContent = words[wordIndex];
        messageContainer.style.opacity = 1;
        setTimeout(() => {
            messageContainer.style.opacity = 0;
            wordIndex++;
            if (wordIndex < words.length) {
                setTimeout(showNextWord, 3000);
            } else {
                messageEndTime = Date.now();
                constellationTimeout = setTimeout(showFinalMessage, 10000); // Alterado para showFinalMessage
            }
        }, 4000);
    }
}

function showFinalMessage() {
    finalMessageContainer.textContent = "O MELHOR BORRACHEIRO DE CÓDIGO"; // Frase desejada
    finalMessageContainer.style.opacity = 1;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
    });

    if (Math.random() < 0.03) {
        const x = Math.random() * canvas.width;
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        fireworks.push(new Firework(x, canvas.height, color));
    }

    if (fireworksStarted && Date.now() - fireworksStartTime > fireworksDuration && wordIndex < words.length) {
        fireworksStarted = false;
        fireworks = [];
        showNextWord();
    } else if (wordIndex === words.length && Date.now() - messageEndTime > 10000 && !constellationTimeout) {
        constellationTimeout = setTimeout(showFinalMessage, 0); // Alterado para showFinalMessage
    }
}