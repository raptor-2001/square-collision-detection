  

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY
})

addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Utility functions
function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)]
}

// Get the distance
function distance(x1, y1, x2, y2){
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance,2) + Math.pow(yDistance,2));
 
}

/**
 * Rotates coordinate system for velocities
 *
 * Takes velocities and alters them as if the coordinate system they're on was rotated
 *
 * @param  Object | velocity | The velocity of an individual particle
 * @param  Float  | angle    | The angle of collision between two objects in radians
 * @return Object | The altered x and y velocities after the coordinate system has been rotated
 */

 function rotate(velocity, angle) {
  const rotatedVelocities = {
      x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
      y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
  };

  return rotatedVelocities;
}

// Objects
class Partical {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.velocity = {
      x: (Math.random() - 0.5)*5,
      y: Math.random() - 0.5,
    }
    this.radius = radius
    this.color = color
    this.mass = 1
    this.opacity = 0;
  }

  draw() {
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.save();
    c.globalAlpha = this.opacity;
    c.fillStyle = this.color;
    c.fill();
    c.restore();
    c.strokeStyle = this.color
    c.stroke()
    c.closePath()
  }

  update = particles => {
    this.draw();
    for(let i = 0; i<particles.length; i++){
      if(this === particles[i]) continue;
      if(distance(this.x, this.y, particles[i].x,particles[i].y) - this.radius*2 < 0){
          resolveCollision(this,particles[i]);
      }
    }
    
    if(this.x - this.radius <= 0 || this.x+this.radius >= innerWidth){
      this.velocity.x = -this.velocity.x;
    }
    if(this.y - this.radius <= 0 || this.y+this.radius >= innerHeight){
      this.velocity.y = -this.velocity.y;
    }

    // Mouse Collosion detection
    if(distance(mouse.x,mouse.y,this.x,this.y) < 120 && this.opacity<0.2){
      this.opacity +=0.4;
    }else if(this.opacity > 0){
      this.opacity -=0.4;
      this.opacity = Math.max(0,this.opacity);
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}


// Implementation
let particles;

function init() {
  particles = [];

  for(let i = 0; i<200; i++){
    let radius = 15;
    let x = randomIntFromRange(radius,canvas.width-radius);
    let y = randomIntFromRange(radius,canvas.height-radius);
    let color = randomColor(colors);

    if(i !==0 ){
      for(let j = 0; j<particles.length; j++){
        if(distance(x,y,particles[j].x,particles[j].y) - radius*2 < 0){
          x = randomIntFromRange(radius,canvas.width-radius);;
          y = randomIntFromRange(radius,canvas.height-radius);
          j=0;
        } 
      }
    }
    particles.push(new Partical(x,y,radius,color));
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)


  c.fillStyle = '#1A1A23'
  c.fillRect(0,0,canvas.width,canvas.height)
  const blueRectangleX = canvas.width/2 - 50;
  if(mouse.x + 100 >= blueRectangleX  && 
     mouse.x <= canvas.width/2 - 50 + 100 &&
     mouse.y + 100 >= canvas.height / 2 - 50 &&
     mouse.y <= canvas.height/2 - 50 + 100){
      c.fillStyle = 'white'
      c.fillRect(0,0,canvas.width,canvas.height)
  }

  // Red Rectangle
  c.fillStyle = '#E86262'
  c.fillRect(mouse.x, mouse.y,100,100);

  // Blue Rectangle
  c.fillStyle = '#92ABEA'
  c.fillRect(canvas.width/2 - 50,canvas.height/2 -50, 100, 100);


}
init()
animate()
