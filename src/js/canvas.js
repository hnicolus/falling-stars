import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('resize', () => {
  canvas.width = innerWidth
  canvas.height = innerHeight

  init()
})

// Objects
class Star {
  constructor(x, y, radius, color) {
    this.x = x
    this.y = y
    this.radius = radius
    this.color = color
    this.gravity = 1
    this.friction = 0.8
    this.velocity = {
      x: utils.randomIntFromRange(-3, 3),
      y: 3
    }
  }

  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    //When ball hits bottom of screen
    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      this.velocity.y = -this.velocity.y * this.friction;
      this.shatter()
    } else {
      this.velocity.y += this.gravity;
    }
    this.y += this.velocity.y;
    this.x += this.velocity.x;
  }

  shatter() {
    this.radius -= 3
    for (let i = 0; i < 8; i++) {
      //create particles
      particles.push(new Particle(this.x, this.y, 2))
    }
  }
}

class Particle {
  constructor(x, y, radius, color) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.gravity = 0.2;
    this.friction = 0.8;
    this.ttl = 100;
    this.opacity = 1;
    this.velocity = {
      x: utils.randomIntFromRange(-5, 5),
      y: utils.randomIntFromRange(-15, 15)
    }
  }
  draw() {
    c.save()
    c.beginPath()
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = `rgba(227,234,239,${this.opacity})`
    c.shadowColor = '#E3EAEF'
    c.shadowBlur = 20
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.draw()
    //When ball hits bottom of screen

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
      this.velocity.y = -this.velocity.y * this.friction;
    } else {
      this.velocity.y += this.gravity;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    // this.opacity = this.ttl / 100
    this.opacity -= 1 / this.ttl
  }

}

function createmountainRange(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = canvas.width / mountainAmount
    c.beginPath()
    c.moveTo(i * mountainWidth, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height)
    c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height)
    c.lineTo(i * mountainWidth - 325, canvas.height)
    c.fillStyle = color
    c.fill()
    c.closePath()

  }
}
// Implementation
const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height)
backgroundGradient.addColorStop(0, '#171e26')
backgroundGradient.addColorStop(1, '#3f586b')


let stars
let particles
let backgroundStars
let ticker
let randomSpawnRate = 75
let groundHeight = 100
function init() {
  ticker = 0
  stars = []
  particles = []
  backgroundStars = []

  // for (let i = 0; i < 1; i++) {
  //   stars.push(new Star(canvas.width / 2, 30, 30, '#E3EAEF'))
  // }

  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const radius = Math.random() * 3
    backgroundStars.push(new Star(x, y, radius, 'white'))

  }

}

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = backgroundGradient
  c.fillRect(0, 0, canvas.width, canvas.height)

  backgroundStars.forEach(star => {
    star.draw()
  })
  createmountainRange(1, canvas.height - 50, '#384551')
  createmountainRange(2, canvas.height - 150, '#2B3843')
  createmountainRange(3, canvas.height - 350, '#26333E')

  c.fillStyle = '#182028'
  c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

  stars.forEach((star, index) => {
    star.update()

    if (star.radius <= 0) {
      stars.splice(index, 1)
    }
  })

  particles.forEach((particle, index) => {
    particle.update()
    if (particle.ttl <= 0) {
      particles.splice(index, 1)
    }
  })

  ticker++
  if (ticker % randomSpawnRate == 0) {
    const radius = 12
    const x = Math.max(radius, Math.random() * canvas.width - radius)

    stars.push(new Star(x, -100, radius, '#E3EAEF'))

    randomSpawnRate = utils.randomIntFromRange(75, 200)
  }
}

init()
animate()
