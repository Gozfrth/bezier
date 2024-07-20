// TODO:
// Bug: Vertices are not being added after degree goes to 0
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
    <h1>Bezier Curves</h1>
    <div id = "currentDegree"> Current Degree: 3</div>
    <canvas></canvas>
    <div class="slidecontainer">
      <input type="range" min="0" max="1" value="0" step="0.01" class="slider" id="myRangeT">
    </div>
    <div id = "containerT"></div>
    <div class="slidecontainer">
      <input type="text" min="0.001" max="1" value="0.01" class="text" id="myRangeStep">
    </div>
    
    <div id = "righty" class = "rightyHide"></div>
    <div id = "containerStep"></div>
  </div>
`

const stepSize = 0.01
const canvas = document.querySelector("canvas")
canvas.width = 475
canvas.height = innerHeight / 2
const rect = canvas.getBoundingClientRect();
const c = canvas.getContext("2d")

const b1 = new GenBezier([new Vector2(40, 20), new Vector2(430, 20), new Vector2(430, 400), new Vector2(40, 400)], stepSize)
// new Vector2(210, 210), new Vector2(310, 310)

let currDegreeText = document.getElementById("currentDegree")

// RIGHT CLICK CONTEXTMENU
const shouldDel = (vert) => {
  b1.delete(vert) // will call reset automatically
  currDegreeText.innerHTML = `Current Degree: ${b1.points.length - 1}`
}
const shouldAdd = (x, y) => {
  b1.add(new Vector2(x, y)) // will call reset automatically
  currDegreeText.innerHTML = `Current Degree: ${b1.points.length - 1}`
}
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault()
  righty(e, b1.points, rect, shouldDel, shouldAdd) // [true/false, index to delete]
});

document.getElementById("righty").addEventListener('contextmenu', (e) => e.preventDefault())
document.addEventListener('click', function (event) {
  if (event.button !== 2) { // If the clicked button is not the right button
    document.getElementById("righty").className = 'rightyHide';
  }
});


// T AND STEP SIZE SLIDER/TEXT
// SLIDER to update T value 
var sliderT = document.getElementById("myRangeT");

sliderT.oninput = function () {
  b1.updateTPoint(this.value);
  document.getElementById("containerT").innerHTML = `Current T Value is: ${b1.t}`
}
document.getElementById("containerT").innerHTML = `Current T Value is: 0`

// TEXT to update Step Size
var textS = document.getElementById("myRangeStep");

function isValidStepSize(val) {
  return (1000 % (val * 1000) === 0)
}

textS.oninput = function () {
  let temp = parseFloat(this.value)
  if (isValidStepSize(temp)) {
    b1.updateStepSize(temp)
    document.getElementById("containerStep").innerHTML = `Current Step Size(fraction of 1) is: ${this.value}`
    // Edit step of sliderT
    sliderT.step = temp
  }
}
document.getElementById("containerStep").innerHTML = `Current Step Size(fraction of 1) is: 0.1`


// Handles updating Vertices
let vertInd = -1
function updateVertex(e, down) {
  let Xer = e.clientX - rect.left
  let Yer = e.clientY - rect.top
  if (down) {
    // Mouse Down
    console.log("Down")
    for (let i = 0; i < b1.points.length; i++) {
      if (b1.points[i].x - 5 < Xer && b1.points[i].x + 5 > Xer && b1.points[i].y - 5 < Yer && b1.points[i].y + 5 > Yer) {
        // If mouse is approximately on a vertex
        vertInd = i // i is index of vertex Clicked
        b1.updateCache = true
        break
      }
    }
  } else {
    // Mouse Up
    console.log("Up")
    if (vertInd < b1.points.length && vertInd >= 0) { // valid vertInd
      console.log(vertInd)
      b1.points[vertInd] = new Vector2(Xer, Yer)
      b1.reset()
      vertInd = -1
    }
    b1.updateCache = false
  }
}

// Mouse Events for Vertex Movement
let isDown = false
canvas.onmousedown = function (e) {
  if (e.button === 0) {
    isDown = true
    updateVertex(e, true);
  }
}

function isValidVertInd() {
  return vertInd >= 0 && vertInd < b1.points.length
}

canvas.onmousemove = function (e) {
  if (isDown && isValidVertInd(vertInd)) {
    b1.points[vertInd] = new Vector2(e.clientX - rect.left, e.clientY - rect.top)
    b1.reset(true)
  }
}

canvas.onmouseup = function (e) {
  // if (threeVerts) {
  if (e.button === 0) {
    isDown = false
    updateVertex(e, false);
  }
  // }
}

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