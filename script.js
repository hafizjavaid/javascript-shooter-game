// LOAD SOUNDS
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const scoreDiv = document.querySelector("#score");

canvas.width = innerWidth - 8;
canvas.height = innerHeight - 8;

let playerX = 10;
let playerY = canvas.height - 10;
let detect = false;

class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = 10;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  update(e) {
    this.draw();
    this.x += this.velocity;
    playerX = this.x;
    if (playerX + this.radius > canvas.width) {
      this.x = canvas.width - 10;
      playerX = this.x;
    }
  }
  update2(e) {
    this.draw();
    this.x -= this.velocity;
    playerX = this.x;
    if (this.x - this.radius <= 0) {
      this.x = 10;
      playerX = this.x;
      console.log(e);
    }
  }
}

class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  update() {
    this.draw();
    // SWOOSHING.play();
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

class Enimies {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }
  update() {
    this.draw();
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }
}

const friction = 0.98;
// The particles after explision
class Particles {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.opacity = 1;
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }
  update() {
    this.draw();
    this.velocity.x *= friction;
    this.velocity.y *= friction;

    this.y += this.velocity.y;
    this.x += this.velocity.x;
    this.opacity -= 0.01;
  }
}

function drawEnimies() {
  setInterval(() => {
    const radius = randomIntFromRange(5, 30);
    let x;
    let y;
    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = -10;
    } else {
      y = Math.random() < 0.5 ? 0 - radius : (y = -10);
      +radius;
      x = Math.random() * canvas.width;
    }

    const angle = Math.atan2(playerY - y, playerX - x);
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
    enimies.push(new Enimies(x, y, radius, color, velocity));
  }, 500);
}

let player = new Player(playerX, playerY, 10, "#e25822");
let projectiles = [];
let enimies = [];
let particles = [];
// let player = new Player(playerX, playerY, 10, "white")

function init() {
  player = new Player(playerX, playerY, 10, "#e25822");
  projectiles = [];
  enimies = [];
  particles = [];
  score = 0;
  scoreDiv.innerHTML = score;
  document.querySelector(".points").innerHTML = score;
}
setInterval((e) => {
  {
    // const angle = Math.atan2(e.clientY - playerY, e.clientX - playerX);
    const angle = -90;
    const velocity = {
      x: 0,
      y: -10,
    };
    // SWOOSHING.play();
    projectiles.push(
      new Projectile(playerX, playerY - 15, 7, "white", velocity)
    );
  }
}, 100);

addEventListener("keydown", (e) => {
  // console.log(e.keyCode);
  if (e.keyCode == 37) {
    player.update2(e);
    console.log(playerX);
  } else if (e.keyCode == 39) {
    console.log("Hello");
    // playerX += 1;
    player.update(e);
    console.log(playerX);
  }
});

let animationId;
let score = 0;
// Animation Loop
function animate() {
  animationId = requestAnimationFrame(animate);
  c.fillStyle = "rgba(0,0,0,5)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.draw();
  projectiles.forEach((projectile, index) => {
    // SWOOSHING.play();

    projectile.update();

    // If moving away from window screen then remove it from arry
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        projectiles.splice(index, 1);
      });
    }
  });

  // After explosion mean reaction particles
  particles.forEach((particle, index) => {
    if (particle.opacity <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });

  enimies.forEach((enimie, index) => {
    enimie.update();

    // For Collision Between Player + Target or enemies
    const dist = Math.hypot(player.x - enimie.x, player.y - enimie.y);
    if (dist - enimie.radius - player.radius < 1) {
      cancelAnimationFrame(animationId);
      SCORE_S.play();
      document.querySelector(".modal").style.display = "flex";
      document.querySelector(".points").innerHTML = score;
    }

    // For Collision Between Bullets + Target or enemies
    projectiles.forEach((projectile, sIndex) => {
      const dist = Math.hypot(projectile.x - enimie.x, projectile.y - enimie.y);

      if (dist - enimie.radius - projectile.radius < 1) {
        DIE.play();
        for (let i = 0; i < enimie.radius; i++) {
          particles.push(
            new Particles(
              projectile.x,
              projectile.y,
              Math.random() * 2,
              enimie.color,
              {
                x: (Math.random() - 0.5) * (Math.random() * 5),
                y: (Math.random() - 0.5) * (Math.random() * 5),
              }
            )
          );
        }

        if (enimie.radius - 10 > 10) {
          score += 10;
          scoreDiv.innerHTML = score;
          enimie.radius -= 10;
          setTimeout(() => {
            projectiles.splice(sIndex, 1);
          }, 0);
        } else {
          score += 30;
          scoreDiv.innerHTML = score;
          setTimeout(() => {
            enimies.splice(index, 1);
            projectiles.splice(sIndex, 1);
          }, 0);
        }
      }
    });
  });
}

document.querySelector("#btn").addEventListener("click", () => {
  init();
  animate();
  drawEnimies();
  document.querySelector(".modal").style.display = "none";
});

// init();
// animate();
// drawEnimies();
