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

document.querySelector('#app').innerHTML = `
  <div >
    <h1>Beziers</h1>
    <canvas></canvas>
    <div class="slidecontainer">
      <input type="range" min="0" max="1" value="0" step="0.01" class="slider" id="myRange">
    </div>
    <div id = "container"></div>
  </div>
`
// Above canvas tag    <div style="margin-bottom: 1em; text-align: center;color: #888;">Click 3 points for Quadratic Bezier Curve</div>


const stepSize = 0.01
let t = 0;
const canvas = document.querySelector("canvas")
canvas.width = innerWidth / 2
canvas.height = innerHeight / 2
const rect = canvas.getBoundingClientRect();
const c = canvas.getContext("2d")


const b1 = new GenBezier([new Vector2(40, 20), new Vector2(430, 20), new Vector2(430, 400), new Vector2(40, 400), new Vector2(210, 210), new Vector2(310, 310)], stepSize)


var slider = document.getElementById("myRange");

slider.oninput = function () {
  b1.updateTPoint(this.value);
  document.getElementById("container").innerHTML = `Current T Value is: ${b1.t}`

}

document.getElementById("container").innerHTML = `Current T Value is: 0`

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