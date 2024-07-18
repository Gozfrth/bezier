// TODO:
// Add clicks on vertices to initiate movement of the vertex (maybe onMouseUp can be used to update b1.selectedVertex?)
// Explore the formulaic notation to plot
// Cubic Bezier Curve

// ONLY b2 used here, ignore b1 for now

import './style.css'
import { Vector2 } from './vertex2';
import { QuadBezier } from './quadraticBezier';

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
const rect = canvas.getBoundingClientRect();
const c = canvas.getContext("2d")


const b1 = new QuadBezier(new Vector2(40, 20), new Vector2(430, 20), new Vector2(430, 400))

let b2;
let count = 0;
let tempPoints = []

var slider = document.getElementById("myRange");

slider.oninput = function () {
  b2.t = this.value;
  if (threeVerts)
    b2.updateTPoint(t);
  document.getElementById("container").innerHTML = `Current T Value is: ${b2.t}`

}

document.getElementById("container").innerHTML = `Current T Value is: 0`

canvas.onclick = function (e) {
  count++;
  if (!threeVerts) {
    if (count === 1) {
      // b2.p1 = new Vector2(e.clientX, e.clientY)
      tempPoints.push(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
    } else if (count === 2) {
      // b2.p1 = new Vector2(e.clientX, e.clientY)
      tempPoints.push(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
    } else if (count === 3) {
      // b2.p1 = new Vector2(e.clientX, e.clientY)
      tempPoints.push(new Vector2(e.clientX - rect.left, e.clientY - rect.top))
      b2 = new QuadBezier(tempPoints[0], tempPoints[1], tempPoints[2], stepSize)
      threeVerts = true
    }
    else {
      console.log("ERROR");
    }
  }
}

function updateVertex(e, down) {
  let Xer = e.clientX - rect.left
  let Yer = e.clientY - rect.top
  if (down) {
    console.log("Down")
    if (b2.p1.x - 5 < Xer && Xer < b2.p1.x + 5 && b2.p1.y - 5 < Yer && Yer < b2.p1.y + 5) {
      vert = 1
      console.log("1")
    } else if (b2.p2.x - 5 < Xer && Xer < b2.p2.x + 5 && b2.p2.y - 5 < Yer && Yer < b2.p2.y + 5) {
      vert = 2
      console.log("2")
    } else if (b2.p3.x - 5 < Xer && Xer < b2.p3.x + 5 && b2.p3.y - 5 < Yer && Yer < b2.p3.y + 5) {
      vert = 3
      console.log("3")
    } else {
      vert = -1
      console.log("-1")
      return
    }
  } else {
    console.log("Up")
    switch (vert) {
      case 1:
        console.log("1")
        b2.p1 = new Vector2(Xer, Yer)
        b2.reset()
        break
      case 2:
        console.log("2")
        b2.p2 = new Vector2(Xer, Yer)
        b2.reset()
        break
      case 3:
        console.log("3")
        b2.p3 = new Vector2(Xer, Yer)
        b2.reset()
        break
      default:
        console.log("-1")
        vert = -1
        return;
    }
  }
}


canvas.onmousedown = function (e) {
  if (threeVerts) {
    updateVertex(e, true);
  }
}

canvas.onmouseup = function (e) {
  if (threeVerts) {
    updateVertex(e, false);
  }
}
let vert = -1

function drawBezierGuides() {
  b1.draw();
}
function drawBezierGuides2() {
  b2.draw(c);
}

function init() {
}

let threeVerts = false
function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight)
  if (!threeVerts) {
    tempPoints.forEach(point => {
      c.beginPath();
      c.fillStyle = "rgba(0, 0, 0, 0.5)";
      c.arc(point.x, point.y, 4, 0, Math.PI * 2);
      c.fill();
      c.closePath();

    });
  } else {
    drawBezierGuides2(c);
  }
  requestAnimationFrame(animate)
}

init()
animate();