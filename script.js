const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const balls = [];
const particles = [];

const colors = [
  { r: 255, g: 165, b: 0 }, 
  { r: 0, g: 0, b: 255 },   
  { r: 255, g: 0, b: 0 },   
  { r: 0, g: 255, b: 0 },  
];
const date = "01 Januari 2025 | 01 Rajab 1446H";
const rajab = "اللهُمَّ بَارِكْ لَنَا فِي رَجَبَ";
const newyear = "Happy New Year";
const textPosition = { x: canvas.width / 2, y: canvas.height / 2 - 50 };
let textBrightness = Array(canvas.width).fill(0); 


class Ball {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.color = color;
    this.hasExploded = false; 
  }

  draw() {
    ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.shadowColor = 'rgba(255, 255, 255, 0.7)'; 
    ctx.shadowBlur = 20;


    ctx.fill();

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}

class Particle {
  constructor(x, y, angle, speed, size, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.size = size;
    this.color = color;
    this.opacity = 1;
    this.gravity = 0.02; 
    this.velocityY = Math.random() * -2 - 1;
  }

  update() {
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.velocityY; 
    this.velocityY += this.gravity; 

    this.speed *= 0.98; 

    this.opacity -= 0.005; 
    if (this.opacity < 0) this.opacity = 0;

    const dx = Math.abs(this.x - textPosition.x);
    const dy = Math.abs(this.y - textPosition.y);
    const distanceToText = Math.sqrt(dx * dx + dy * dy);

    if (distanceToText < 100) {
      textBrightness[~~this.x] = Math.min(1, textBrightness[~~this.x] + 0.05);
    }
  }

  draw() {
      ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)'; 
      ctx.shadowBlur = 5;

      ctx.fill();

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
  }
}

function createExplosion(x, y, color) {
  const numParticles = 100; 
  for (let i = 0; i < numParticles; i++) {
    const angle = Math.random() * Math.PI * 2; 
    const speed = Math.random() * 3 + 2; 
    const size = Math.random() * 1.5 + 2; 
   
    particles.push(new Particle(x, y, angle, speed, size, color));
  }
}

function drawText() {
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < canvas.width; i++) {
    if (textBrightness[i] > 0) {
      textBrightness[i] *= 0.95; 
    }
  }

  ctx.font = "18px Arial"; 
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillText(date, textPosition.x, textPosition.y - 80);

  ctx.font = "80px Dynalight";
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillText(rajab, textPosition.x, textPosition.y);

  ctx.font = "60px Dynalight";
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillText(newyear, textPosition.x, textPosition.y + 80);

  particles.forEach((particle) => {
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      100
    );
    gradient.addColorStop(
      0,
      `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.6)` 
    );
    gradient.addColorStop(
      0.5,
      `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.4)` 
    );
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;

    ctx.font = "18px Arial"; 
    ctx.fillText(date, textPosition.x, textPosition.y - 80);

    ctx.font = "80px Dynalight"; 
    ctx.fillText(rajab, textPosition.x, textPosition.y);

    ctx.font = "60px Dynalight";
    ctx.fillText(newyear, textPosition.x, textPosition.y + 80);
  });
}

function animate() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach((ball, index) => {
    if (!ball.hasExploded) {
      ball.draw();
    }
  });

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();
    if (particle.opacity <= 0) {
      particles.splice(index, 1);
    }
  });
  drawText();
 
  requestAnimationFrame(animate);
}

canvas.addEventListener("click", (event) => {
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  const ball = new Ball(event.clientX, event.clientY, randomColor);
  balls.push(ball);


  gsap.to(ball, {
    y: ball.y - 300,
    duration: 1,
    onComplete: () => {
      if (!ball.hasExploded) {
        ball.hasExploded = true;
        createExplosion(ball.x, ball.y, ball.color);
        balls.splice(balls.indexOf(ball), 1);
      }
    },
  });
});

animate();

