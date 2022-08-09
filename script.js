//set default size of canvas
let canvasSize = ((window.innerHeight + window.innerWidth) / 2) * 0.5
//graph parameters
const sliders = {radius: 4, resolution: 0.1, start: 0, stop: Math.PI * 8, scale: 200}

class Canvas {
  //a utility class to reference the current canvas' context
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.canvas.height = canvasSize;
    this.canvas.width = canvasSize;
    this.ctx = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();
  }
}

//define the graph as a canvas object
const canvas = new Canvas();

function fractal(){
    //draw function
    for (let time = sliders.start; time < sliders.stop; time += sliders.resolution){
        let x = (canvasSize / 2) - Math.sin( ((3 * time) + Math.PI) / 4 ) * sliders.scale
        let y = (canvasSize / 2) - Math.sin(time) * sliders.scale

        canvas.ctx.fillStyle = `rgb(
            ${255 - (time / sliders.stop) * 255}, 
            ${(time / sliders.stop) * 148}, 
            ${(time / sliders.stop) * 255}
            )`
        canvas.ctx.strokeStyle = "rgba(255,255,255,0.5)"
        canvas.ctx.beginPath()
        canvas.ctx.arc(x, y, sliders.radius, 0, 2 * Math.PI, false)
        canvas.ctx.fill()
        canvas.ctx.stroke()
        canvas.ctx.closePath()
    }
    //update step counter (but don't go below zero)
    steps = (sliders.stop - sliders.start) / sliders.resolution
    document.getElementById("steps").innerHTML = `Completed ${
        steps >= 0 ? Math.floor(steps) : 0 } calculations`
}

function resizeCanvas(){
    canvasSize = ((window.innerHeight + window.innerWidth) / 2) * 0.5
    canvas.canvas.height = canvasSize
    canvas.canvas.width = canvasSize
    canvas.canvas.style.height = `${canvasSize}px`
    canvas.canvas.style.width = `${canvasSize}px`

    //some css logic to make things wrap nicely
    if(window.innerHeight > window.innerWidth){
        document.getElementById("rows").style.flexDirection = "column-reverse"
        sliders.scale -= 20
    }

    //redraw everything onto new canvas
    clearCanvas()
    fractal()
    return canvasSize
}

function clearCanvas(){
    canvas.ctx.fillStyle = "black"
    canvas.ctx.fillRect(0,0,canvasSize, canvasSize)
}

function getSlider(slider){
    return document.getElementById(`${slider}`).valueAsNumber
}

//assign each slider an event listener to adjust corresponding value and re-render graph
Object.getOwnPropertyNames(sliders).map(slider => {
    document.getElementById(`${slider}_slider`).oninput = () => { 
        clearCanvas()
        sliders[slider] = getSlider(`${slider}_slider`)
        fractal()
    };
})

window.onresize = resizeCanvas

//load initial graph
resizeCanvas()
fractal()
