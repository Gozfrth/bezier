// TODO:
// Add clicks on vertices again... to initiate movement of the vertex (maybe onMouseUp can be used to update b1.selectedVertex?)
// Add new vertices 
// window resize
// add w vs t graph also

// Explore the formulaic notation to plot the bezier curve

// ONLY b2 used here, ignore b1 for now

import './style.css'
import { Vector2 } from './vertex2';
import { GenBezier } from './genBezier';
import { righty } from './vertexMenu';

document.querySelector('#app').innerHTML = `
  <div>
    <h1>Beziers</h1>
    <canvas></canvas>
    <div class="slidecontainer">
      <input type="range" min="0" max="1" value="0" step="0.01" class="slider" id="myRange">
    </div>
    <div id = "container"></div>
    <div id = "righty" class = "rightyHide"></div>
  </div>
`
// Above canvas tag    <div style="margin-bottom: 1em; text-align: center;color: #888;">Click 3 points for Quadratic Bezier Curve</div>


const stepSize = 0.01
let t = 0;
const canvas = document.querySelector("canvas")
canvas.width = 475
canvas.height = innerHeight / 2
const rect = canvas.getBoundingClientRect();
const c = canvas.getContext("2d")

const b1 = new GenBezier([new Vector2(40, 20), new Vector2(430, 20), new Vector2(430, 400), new Vector2(40, 400), new Vector2(210, 210), new Vector2(310, 310)], stepSize)


const shouldDel = (vert) => {
  b1.delete(vert) //should call reset automatically
}
const shouldAdd = (x, y) => {
  b1.add(new Vector2(x, y))
}
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  righty(e, b1.points, rect, shouldDel, shouldAdd) // [true/false, index to delete]
});

var slider = document.getElementById("myRange");

slider.oninput = function () {
  b1.updateTPoint(this.value);
  document.getElementById("container").innerHTML = `Current T Value is: ${b1.t}`

}

document.getElementById("container").innerHTML = `Current T Value is: 0`




let vertInd = -1
function updateVertex(e, down) {
  let Xer = e.clientX - rect.left
  let Yer = e.clientY - rect.top
  if (down) {
    console.log("Down")
    for (let i = 0; i < b1.points.length; i++) {
      if (b1.points[i].x - 5 < Xer && b1.points[i].x + 5 > Xer && b1.points[i].y - 5 < Yer && b1.points[i].y + 5 > Yer) {
        vertInd = i
      }
    }
  } else {
    console.log("Up")
    if (vertInd < b1.points.length && vertInd != -1) { // valid vertInd
      console.log(vertInd)
      b1.points[vertInd] = new Vector2(Xer, Yer)
      b1.reset()
      vertInd = -1
    }
  }
}

let isDown = false
canvas.onmousedown = function (e) {
  // if (threeVerts) {
  if (e.button === 0) {
    isDown = true
    updateVertex(e, true);
  }
  // }
}

canvas.onmouseup = function (e) {
  // if (threeVerts) {
  if (e.button === 0) {
    updateVertex(e, false);
  }
  // }
}

// Update vertices function to be added here

function drawBezierGuides(c) {
  b1.draw(c);
}

function init() {
}

function animate() {
  c.clearRect(0, 0, innerWidth, innerHeight)
  drawBezierGuides(c);
  requestAnimationFrame(animate)
}

init()
animate();

document.getElementById("righty").addEventListener('contextmenu', (e) => e.preventDefault())

document.addEventListener('click', function (event) {
  if (event.button !== 2) { // If the clicked button is not the right button
    document.getElementById("righty").className = 'rightyHide';
  }
});
