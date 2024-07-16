// TODO:
// Add clicks on vertices to initiate movement of the vertex (maybe onMouseUp can be used to update b1.selectedVertex?)
// Explore the formulaic notation to plot
// Cubic Bezier Curve

// ONLY b2 used here, ignore b1 for now

import './style.css'

document.querySelector('#app').innerHTML = `
  <div >
    <h1>Beziers</h1>
    <div style="margin-bottom: 1em; text-align: center;color: #888;">Click 3 points for Quadratic Bezier Curve</div>
    <canvas></canvas>
    <div class="slidecontainer">
      <input type="range" min="0" max="1" value="0" step="0.01" class="slider" id="myRange">
    </div>
    <div id = "container"></div>
  </div>
`

const stepSize = 0.01
let t = 0;
const canvas = document.querySelector("canvas")
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2
const c = canvas.getContext("2d")

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
  constructor(p1, p2, p3) {
    this.p1 = p1
    this.p2 = p2
    this.p3 = p3
    this.tPoint1 = this.p1.lerp(this.p2, 0)
    this.tPoint2 = this.p2.lerp(this.p3, 0)
    this.tPoint3 = this.tPoint1.lerp(this.tPoint2, 0)
    this.bezierPoints = []
  }

  draw() {
    this.drawCircle(this.p1, 6, "rgba(0, 0, 0, 0.5)");
    this.drawCircle(this.p2, 6, "rgba(0, 0, 0, 0.5)");
    this.drawCircle(this.p3, 6, "rgba(0, 0, 0, 0.5)");
    this.drawLine();
    this.drawCircle(this.p1, 6, "rgba(0, 0, 0, 0.5)");
    this.drawCircle(this.p2, 6, "rgba(0, 0, 0, 0.5)");
    this.drawCircle(this.p3, 6, "rgba(0, 0, 0, 0.5)");
    this.drawTPoints();
    this.drawInterpolators();
    this.drawBezierCurve();
  }

  drawLine() {
    c.beginPath();
    c.moveTo(this.p1.x, this.p1.y);
    c.lineTo(this.p2.x, this.p2.y);
    c.moveTo(this.p2.x, this.p2.y);
    c.lineTo(this.p3.x, this.p3.y);
    c.stroke();
    c.closePath();
  }

  drawCircle(center, radius, fillStyle) {
    c.beginPath();
    c.fillStyle = fillStyle;
    c.arc(center.x, center.y, radius, 0, Math.PI * 2);
    c.fill();
    c.closePath();
  }

  drawTPoints() {
    this.drawCircle(this.tPoint1, 4, "rgba(255, 0, 0, 0.7)");
    this.drawCircle(this.tPoint2, 4, "rgba(255, 0, 0, 0.7)");
    this.drawCircle(this.tPoint3, 4, "rgba(255, 0, 0, 0.7)");
  }
  updateTPoint(t) {
    this.tPoint1 = this.p1.lerp(this.p2, t)
    this.tPoint2 = this.p2.lerp(this.p3, t)
    this.tPoint3 = this.tPoint1.lerp(this.tPoint2, t)
  }
  drawInterpolators() {
    c.beginPath();
    c.moveTo(this.tPoint1.x, this.tPoint1.y);
    c.lineTo(this.tPoint2.x, this.tPoint2.y);
    c.stroke();
    c.closePath();
  }
  computeBezierPoints() {
    this.bezierPoints = []
    for (let i = 0; i <= 1; i += stepSize) {
      let p12 = this.p1.lerp(this.p2, i)
      let p23 = this.p2.lerp(this.p3, i)
      let p123 = p12.lerp(p23, i)
      this.bezierPoints.push(p123)
    }
  }
  drawBezierCurve() {
    if (this.bezierPoints.length === 0) {
      this.computeBezierPoints();
    }
    c.beginPath();
    c.moveTo(this.bezierPoints[0].x, this.bezierPoints[0].y);
    for (let i = 1; i < this.bezierPoints.length; i++) {
      c.lineTo(this.bezierPoints[i].x, this.bezierPoints[i].y);
    }
    c.stroke()
    c.closePath();
  }
}


const b1 = new BezierGuide(new Vector2(40, 20), new Vector2(430, 20), new Vector2(430, 400))

let b2;
let count = 0;
let tempPoints = []

var slider = document.getElementById("myRange");

slider.oninput = function () {
  t = this.value;
  if (ready)
    b2.updateTPoint(t);
  document.getElementById("container").innerHTML = `Current T Value is: ${t}`

}

document.getElementById("container").innerHTML = `Current T Value is: ${t}`

canvas.onclick = function (e) {
  const rect = canvas.getBoundingClientRect();
  count++;
  if (count === 1) {
    // b2.p1 = new Vector2(e.clientX, e.clientY)
    tempPoints.push(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
  } else if (count === 2) {
    // b2.p1 = new Vector2(e.clientX, e.clientY)
    tempPoints.push(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
  } else if (count === 3) {
    // b2.p1 = new Vector2(e.clientX, e.clientY)
    tempPoints.push(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
    b2 = new BezierGuide(tempPoints[0], tempPoints[1], tempPoints[2])
    ready = true
    canvas.removeEventListener("click", canvas.onclick)
  } else {
    canvas.removeEventListener("click", canvas.onclick)
  }
}


function drawBezierGuides() {
  b1.draw();
}
function drawBezierGuides2() {
  b2.draw();
}


function init() {
}

let ready = false
function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight)
  if (!ready) {
    tempPoints.forEach(point => {
      c.beginPath();
      c.fillStyle = "rgba(0, 0, 0, 0.5)";
      c.arc(point.x, point.y, 4, 0, Math.PI * 2);
      c.fill();
      c.closePath();

    });
  } else {
    drawBezierGuides2();
  }
  requestAnimationFrame(animate)
}

init()
animate();