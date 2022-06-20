// Credit to PhysicsMatters on youtube i.e.  https://twitter.com/MattersPhysics for the tutorial that built this

const canvas = document.getElementById("canvas");
const drawing = canvas.getContext("2d");
let mouseX = "";
let mouseY = "";
let mouseStartX = "";
let mouseStartY = "";
let mouseEndX = "";
let mouseEndY = "";
let blueLength = "";
let time = 0;
let draggingMouse = false;
let mouseDown = false;
let ballExists = false;

const xStart = 0;
let x = xStart;

const yStart = canvas.height - 200; //(0,0) is in the top right
let y = yStart;

let angle = 45
let angleFromDrag = 0;
const speed = 5;
const g = 0.05; //gravitational force [px]

let oldTimestamp = 0;
var secondsPassed = 0;//between each frame
var animationSpeed = 81

let run = false;
//let start = document.getElementById("start");

//start.addEventListener("click", function () {
//    go()
//});

function init() {
    window.requestAnimationFrame(animationLoop);    
}

function animationLoop(timestamp) {
    secondsPassed = (timestamp - oldTimestamp) / 1000 //ms to seconds
    oldTimestamp = timestamp;//new frame, we need to keep getting the difference between each frame
    update();
    drawing.clearRect(0, 0, canvas.width, canvas.height);// remove all old objects
    drawBall();
    draw();
    window.requestAnimationFrame(animationLoop);
}

function update() {
    if (run) {
        moveBall()
    }
}

function moveBall() {
    const speed = (Math.round(blueLength / 50) > 5 ? 5 : Math.round(blueLength / 50)) + 3;
    time += animationSpeed * secondsPassed;
    x = speed * Math.cos(-angle * Math.PI / 180) * time + xStart;
    y = .5 * g * time * time + speed * Math.sin(-angle * Math.PI / 180) * time + yStart;
}

function drawBall() {
    drawing.beginPath();
    drawing.fillStyle = "black";
    drawing.arc(x, y, 10, 0, 2 * Math.PI);
    drawing.fill();
}

function draw() {
    drawing.beginPath();
    drawing.fillStyle = "black";
    drawing.arc(x, y, 10, 0, 2 * Math.PI);    
    //drawing.fillText("X: " + mouseX + ", Y: " + mouseY, 10, 20);
    //drawing.fillText("X: " + mouseStartX + ", Y: " + mouseEndX, 10, 50);
    //drawing.fillText("ballY:" + y + " canvasY: " + yStart, 10, 80);
    //drawing.fillText("dragAngle:" + angleFromDrag + " angle: " + angle, 10, 110);
    //drawing.fillText("blueLengthL " + blueLength, 10, 140);
    drawing.fill();
    drawing.fillStyle = "white";
    if (draggingMouse && !ballExists && !hasCollided()) {
        drawing.beginPath();
        drawing.moveTo(mouseStartX, mouseStartY);
        drawing.lineWidth = "10";
        drawing.strokeStyle = "blue"
        drawing.lineTo(mouseEndX, mouseEndY);
        drawing.stroke();
        blueLength = Math.hypot(mouseEndX - mouseStartX, mouseEndY - mouseStartY)
    }
    drawing.beginPath();
    drawing.moveTo(xStart, yStart);
    drawing.strokeStyle = "black";
    drawing.lineTo(xStart + 80 * Math.cos(angle * Math.PI / 180), yStart - 80 * Math.sin(angle * Math.PI / 180));
    drawing.lineWidth = "40";
    drawing.stroke();
    if (hasCollided()) {
        go();
    }
}

canvas.addEventListener("mousemove", function (e) {        
    if (draggingMouse && !ballExists && !hasCollided()) {
        cRect = canvas.getBoundingClientRect();
        mouseEndX = Math.round(e.clientX - cRect.left);
        mouseEndY = Math.round(e.clientY - cRect.top);
        angleFromDrag = Math.round(Math.atan2(mouseEndY - mouseStartY, mouseStartX - mouseEndX) * 180 / Math.PI);
        angleFromDrag = angleFromDrag > 90 ? 90 : angleFromDrag;
        angleFromDrag = angleFromDrag < 0 ? 0 : angleFromDrag;
        angle = angleFromDrag;
    }
    if (mouseDown) {
        draggingMouse = true;
    }
});

canvas.addEventListener("mousedown", function (e) {    
    draggingMouse = false;
    mouseDown = true;
    cRect = canvas.getBoundingClientRect();
    mouseStartX = Math.round(e.clientX - cRect.left);
    mouseStartY = Math.round(e.clientY - cRect.top);
});

canvas.addEventListener("mouseup", function (e) {
    mouseDown = false;
    if (draggingMouse && !ballExists) {
        go();
        draggingMouse = false;
    }
});

function go() {
    if (!run && !ballExists) {
        ballExists = true;
        run = !run
    } else if (hasCollided()) {
        x = xStart;
        y = yStart;
        time = 0;
        run = !run;
        ballExists = false;
    }
}

function hasCollided() {
    return y > canvas.height + 10 || x > canvas.width + 10;
}

document.body.appendChild(canvas);
init();
