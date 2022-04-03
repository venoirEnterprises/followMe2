// Credit to PhysicsMatters on youtube i.e.  https://twitter.com/MattersPhysics for the tutorial that built this

const canvas = document.createElement("canvas");
const drawing = canvas.getContext("2d");
canvas.width = (window.innerWidth) - 15;
canvas.height = (window.innerHeight / 2) - 15;
let time = 0;

const xStart = 0;
let x = xStart;

const yStart = canvas.height; //(0,0) is in the top right
let y = yStart;

const angle = document.getElementById("angle")
const speed = document.getElementById("speed")
const g = 0.05; //gravitational force [px]

let oldTimestamp = 0;
var secondsPassed = 0;//between each frame
var animationSpeed = document.getElementById("animation")// how fast to animate the process. Tick speed

let run = false;
let start = document.getElementById("start");

start.addEventListener("click", function () {
    if (!run) {
        start.value ='stop';
    } else {
        start.value = 'start';
        x = xStart;
        y = yStart;
        time = 0;
    }
    run = !run
});

function init() {
    window.requestAnimationFrame(animationLoop);
}

function animationLoop(timestamp) {
    secondsPassed = (timestamp - oldTimestamp) / 1000 //ms to seconds
    oldTimestamp = timestamp;//new frame, we need to keep getting the difference between each frame
    update();
    draw();
    window.requestAnimationFrame(animationLoop);
}

function update() {
    if (run) {
        time += animationSpeed.value * secondsPassed;
        x = speed.value * Math.cos(-angle.value * Math.PI / 180) * time + xStart;
        y = .5 * g * time * time + speed.value * Math.sin(-angle.value * Math.PI / 180) * time + yStart;
    }
}

function draw() {
    drawing.clearRect(0, 0, canvas.width, canvas.height);// remove all old objects
    drawing.beginPath();
    drawing.fillStyle = "green";
    drawing.rect(0, canvas.height, canvas.width, -canvas.height + 200);
    drawing.fill();
    drawing.beginPath();
    drawing.fillStyle = "blue";
    drawing.rect(0, -canvas.height + 200, canvas.width, canvas.height);
    drawing.fill();
    drawing.beginPath();
    drawing.fillStyle = "black";
    drawing.arc(x, y, 10, 0, 2 * Math.PI);
    drawing.fill();
    drawing.fillStyle = "white";
    drawing.fillText("Angle: " + angle.value, 50, 80);
    drawing.fillText("Speed: " + speed.value, 50, 90);
    drawing.fillText("Animation speed: " + animationSpeed.value, 50, 100);
    drawing.beginPath();
    drawing.moveTo(xStart, yStart);
    drawing.strokeStyle = "grey";
    drawing.lineTo(xStart + 80 * Math.cos(angle.value * Math.PI / 180), yStart - 80 * Math.sin(angle.value * Math.PI / 180));
    drawing.lineWidth = "40";
    drawing.stroke();
}

document.body.appendChild(canvas);
init();
