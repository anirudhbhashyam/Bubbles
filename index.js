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
    "#ffad69",
    "#1f363d",
    "#b5aa9d",
    "#ffa5ab",
    "#eaeaea"
];

class Circle {
    constructor(x, y, radius, color, vel, g_vel, max_size) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vel = vel;
        this.g_vel = g_vel;
        this.max_size = max_size;
        this.active = false;
    }

    draw() {
        canvasContext.beginPath();
        canvasContext.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        canvasContext.fillStyle = this.color + "cc";
        canvasContext.fill();
    }

    move(movement_x, movement_y) {
        this.x += movement_x;
        this.y += movement_y;
    }

    update() {
        this.radius += this.g_vel;

        if (this.radius < 2 || this.radius >= this.max_size) {
            this.g_vel *= -1
        }
    }

    isClicked(mouse_x, mouse_y) {
        // TODO: Find the maximum z index.
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
};

class World {
    constructor() {
        this.bubbles = []
    }

    create_bubbles() {
        for (let i = 0; i < 10; i++) {
            const r = 50;
            const x = Math.random() * (canvas.width - r);
            const y = Math.random() * (canvas.height - r);
            const color = palette[i % palette.length];
            const g_vel = Math.random() * 0.5 + 0.1;
            const max_size = Math.random() * 100 + 100;

            this.bubbles.push(
                new Circle(x, y, r, color, 0, g_vel, max_size)
            );
        }
    }

    draw() {
        this.bubbles.forEach(
            (b) => {
                b.draw();
            }
        )
    }

    collide() {
        for (let i = 0; i < this.bubbles.length; i++) {
            for (let j = i; j < this.bubbles.length; j++) {
                let dist = Math.hypot(
                    this.bubbles[i].x - this.bubbles[j].x,
                    this.bubbles[i].y - this.bubbles[j].y
                );
                if (
                    dist < 1 + (this.bubbles[i].radius + this.bubbles[j].radius)
                ) { 
                    this.bubbles[i].g_vel *= -1;
                    this.bubbles[j].g_vel *= -1;
                }
            }
        }

    }

    update() {
        this.bubbles.forEach(
            (b) => {
                b.update();
            }
        )
    }
};


// function recordGIF() {
//     const chunks = [];
//     const stream = canvas.captureStream();
//     const recorder = new MediaRecorder(stream);

//     recorder.ondataavailable = (e) => { chunks.push(e.data) };

//     recorder.onstop = (e) => exportVid(
//         new Blob(chunks, {type: "video/mp4"})
//     );

//     recorder.start();

//     setTimeout(
//         () => {
//             recorder.stop();
//         },
//         3000
//     );
// }

// function exportVid(blob) {
//     const video = document.createElement("video");
//     video.src = URL.createObjectURL(blob);
//     video.controls = true;
//     document.body.appendChild(video);

//     const a = document.createElement("a");
//     a.download = "my_gif.mp4";
//     a.href = video.src;
//     document.body.appendChild(a);
//     a.click();
// }

function eventHandler(circles) {
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
}

function main() {
    const world = new World();
    world.create_bubbles();
    let start;

    function step(timestamp) {

        if (start === undefined) {
            start = timestamp;
        }

        const elapsed = timestamp - start;
        start = timestamp;

        canvasContext.fillStyle = "rgba(20, 20, 20, 0.9)";
        canvasContext.fillRect(0, 0, canvas.width, canvas.height);

        world.draw();

        // world.collide();
        
        world.update();
        
        window.requestAnimationFrame(step);
    }
    
    window.requestAnimationFrame(step);
    eventHandler(world.bubbles);
}

main();