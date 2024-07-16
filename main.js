import './style.css'

const zero = 0

document.querySelector('#app').innerHTML = `
  <div >
    <h1>Beziers</h1>
    <canvas></canvas>
    <input type="text" placeholder="t_value" id="tValueInput"></input>
    <div class="slidecontainer">
      <input type="range" min="0" max="1" value="0" step="0.01" class="slider" id="myRange">
    </div>
    <div id = "container"></div>
  </div>
`

class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  add(vec) {
    return new Vector2(this.x + vec.x, this.y + vec.y)
  }

  subtract(vec) {
    return new Vector2(this.x - vec.x, this.y - vec.y)
  }

  // Multiply wid a scalar
  scale(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  // Lin interpolate
  lerp(vec, t) {
    return new Vector2(this.x + (vec.x - this.x) * t, this.y + (vec.y - this.y) * t);
  }
}

class BezierGuide {
  constructor(p1, p2) {
    this.p1 = p1
    this.p2 = p2
    this.tPoint = p1.lerp(p2, 0)
  }

  draw(c) {
    this.drawLine(c, this.p1, this.p2);
    this.drawCircle(c, this.p1, 6, "rgba(0, 0, 0, 0.5)");
    this.drawCircle(c, this.p2, 6, "rgba(0, 0, 0, 0.5)");
    this.drawTPoint(c);
  }

  drawLine(c, p1, p2) {
    c.beginPath();
    c.moveTo(p1.x, p1.y);
    c.lineTo(p2.x, p2.y);
    c.stroke();
    c.closePath();
  }

  drawCircle(c, center, radius, fillStyle) {
    c.beginPath();
    c.fillStyle = fillStyle;
    c.arc(center.x, center.y, radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }

  drawTPoint(c) {
    this.drawCircle(c, this.tPoint, 4, "rgba(255, 0, 0, 0.7)");
  }
  getTPoint(t) {
    this.tPoint = this.p1.lerp(this.p2, t)
    return this.tPoint
  }
}
const canvas = document.querySelector("canvas")
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2

const input = document.getElementById("tValueInput");


var slider = document.getElementById("myRange");

slider.oninput = function () {
  t = this.value;
  bGuides.forEach(b => {
    b.getTPoint(t);
  });
  document.getElementById("container").innerHTML = `Current T Value is: ${t}`

}

let t = 0;

input.onkeydown = (e) => {
  if (e.keyCode == 13) {
    tSubmit();
  }
}

document.getElementById("container").innerHTML = `Current T Value is: ${t}`

function tSubmit() {
  t = input.value || 0;
  bGuides.forEach(b => {
    b.getTPoint(t);
  });
  console.log(input.value);
  document.getElementById("container").innerHTML = `Current T Value is: ${t}`

}

const c = canvas.getContext("2d")

const b1 = new BezierGuide(new Vector2(40, 20), new Vector2(430, 20))
const b2 = new BezierGuide(new Vector2(40, 400), new Vector2(430, 400))
let b3 = new BezierGuide(b1.getTPoint(0), b2.getTPoint(0))

let bGuides = [b1, b2, b3];

function drawBezierGuides() {
  bGuides.forEach(b => {
    b.draw(c);
  });
}


function connect2Points(p1, p2, c, drawPoints = false) {
  c.beginPath();
  c.moveTo(p1.x, p1.y)
  c.lineTo(p2.x, p2.y)
  c.strokewidth = 2;
  c.stroke();
  c.closePath();
  if (drawPoints) {
    c.beginPath();
    c.fillStyle = "rgba(0, 0, 0, 1)";
    c.arc(p1.x, p1.y, 6, 0, Math.PI * 2);
    c.fill();
    c.arc(p2.x, p2.y, 6, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }
}

function init() {
}

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight)
  b3.p1 = b1.getTPoint(t);
  b3.p2 = b2.getTPoint(t);
  drawBezierGuides();
  requestAnimationFrame(animate)
}

init()
animate();