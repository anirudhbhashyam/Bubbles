const canvas = document.querySelector("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const canvasContext = canvas.getContext("2d");

const palette = [
    "#413c58",
    "#a3c4bc",
    "#6bab90",
    "#a5243d",
    "#decbb7",
    "#ffad69"
];

class Circle {
    constructor(x, y, radius, color, vel, g_vel) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vel = vel;
        this.g_vel = g_vel;
        this.active = false;
    }

    draw() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        canvasContext.fillStyle = this.color;
        canvasContext.fill();
    }

    move(movement_x, movement_y) {
        this.x += movement_x;
        this.y += movement_y;
    }

    update() {
        this.radius += this.g_vel;

        if (this.radius < 2) {
            this.g_vel *= -1
        }
    }

    isClicked(mouse_x, mouse_y) {
        let dist = Math.hypot(
            mouse_x - this.x,
            mouse_y - this.y,
        );

        return (dist <= this.radius);
    }

    handleMouseDownEvent() {
        this.active = true;
    }

    handleMouseUpEvent() {
        this.active = false;
    }
}

let circles = [];

function setup() {
    for (let i = 0; i < 6; i++) {
        const r = 50;
        const x = Math.random() * (canvas.width - r);
        const y = Math.random() * (canvas.height - r);
        const color = palette[i % palette.length];
        const g_vel = Math.random() * 0.5 + 0.1;
        circles.push(
            new Circle(x, y, r, color, 0, g_vel)
        );
    }
}

function run() {
    circles.forEach(
        (circle) => {
            circle.draw();
            circle.update();
        }
    );

    for (let i = 0; i < circles.length; i++) {
        for (let j = i; j < circles.length; j++) {
            dist = Math.hypot(
               circles[i].x - circles[j].x,
               circles[i].y - circles[j].y
            );
            if (
                dist < 1 + (circles[i].radius + circles[j].radius)
            ) { 
                circles[i].g_vel *= -1;
                circles[j].g_vel *= -1;
            }
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    canvasContext.fillStyle = "rgba(20, 20, 20, 0.9)";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    run();
}

window.addEventListener(
    "mousedown", (e) => {
        for (let c of circles) {
            if (c.isClicked(e.clientX, e.clientY)) {
                c.handleMouseDownEvent();
            }
        }
    }
);

window.addEventListener(
    "mousemove", (e) => {
        for (let c of circles) {
            if (c.active) {
                c.move(e.movementX, e.movementY);
            }
        }
    }
)

window.addEventListener(
    "mouseup", () => {
        circles.forEach(
            (c) => {
                c.handleMouseUpEvent();
            }
        )
    }
)

setup();
animate();