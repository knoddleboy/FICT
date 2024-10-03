import { outputConsole, _queue, randRng } from "./utils.js";
import { ENUM__ROLES, timeouts, __LOCALSTORAGE_LOGGED__, circlesParams } from "./constants.js";
import {
    playButton,
    closeButton,
    startButton,
    fastConsoleField,
    asideUpper,
    headerBox,
    workBlock,
    animBlock,
} from "./constants.js";

export const canvasBlock = {
    el: null,
    ctx: null,
    width: null,
    height: null,
};

let stopSignal = false;

let playTimer;
let playTimerValue;

const circles = [];

class Circle {
    constructor(x, y, velX, velY, color, size = 20) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        const ctx = canvasBlock.ctx;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x + this.size >= canvasBlock.width) {
            this.velX = -this.velX;

            outputConsole(`<b>${this.color}</b> circle touched wall`, ENUM__ROLES.FAST);
        }

        if (this.x <= this.size) {
            this.velX = -this.velX;

            outputConsole(`<b>${this.color}</b> circle touched wall`, ENUM__ROLES.FAST);
        }

        if (this.y + this.size >= canvasBlock.height) {
            this.velY = -this.velY;

            outputConsole(`<b>${this.color}</b> circle touched wall`, ENUM__ROLES.FAST);
        }

        if (this.y <= this.size) {
            this.velY = -this.velY;

            outputConsole(`<b>${this.color}</b> circle touched wall`, ENUM__ROLES.FAST);
        }

        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (let i = 0; i < circles.length; i++) {
            if (!(this === circles[i])) {
                const dx = this.x - circles[i].x;
                const dy = this.y - circles[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + circles[i].size) {
                    reloadAnimation();
                    clearInterval(playTimer);

                    stopSignal = true;

                    outputConsole(`<b>${this.color}</b> and <b>${circles[i].color}</b> collided`);
                }
            }
        }
    }
}

function loop() {
    canvasBlock.ctx.clearRect(0, 0, canvasBlock.width, canvasBlock.height);

    for (let i = 0; i < circles.length; i++) {
        circles[i].draw();
        circles[i].update();
        circles[i].collisionDetect();
    }

    if (playTimerValue > 54 && headerBox.style.color !== "red") {
        headerBox.style.color = "red";
    }

    if (playTimerValue > 60) {
        reloadAnimation();
        clearInterval(playTimer);

        outputConsole("animation <b>time out</b>");
    }

    if (circles.length && !stopSignal) {
        requestAnimationFrame(loop);
    }
}

function createCircles(colorsParams) {
    const width = canvasBlock.width;
    const height = canvasBlock.height;

    // const size = 20;

    colorsParams.forEach(({ color, size, velX, velY }) => {
        const circle = new Circle(
            randRng(0 + size, width - size),
            randRng(0 + size, height - size),
            velX,
            velY,
            color,
            size
        );

        circle.draw();
        circle.collisionDetect();

        circles.push(circle);
    });
}

function createCanvas() {
    const dpi = window.devicePixelRatio;
    const canvas = document.createElement("canvas");

    canvas.width = animBlock.clientWidth * dpi;
    canvas.height = animBlock.clientHeight * dpi;

    animBlock.appendChild(canvas);

    canvasBlock.el = canvas;
    canvasBlock.ctx = canvas.getContext("2d");
    canvasBlock.width = canvas.width;
    canvasBlock.height = canvas.height;
}

function resetParams() {
    if (canvasBlock.ctx) canvasBlock.ctx.clearRect(0, 0, canvasBlock.width, canvasBlock.height);
    fastConsoleField.replaceChildren();
    headerBox.innerHTML = "0s";

    startButton.innerHTML = "Start";
    startButton.removeAttribute("disabled");

    headerBox.style.color = "black";

    circles.length = 0;
    _queue.length = 0;

    timeouts.forEach((t) => clearTimeout(t));
    clearInterval(playTimer);
}

function reloadAnimation() {
    startButton.innerHTML = "Reload";
    startButton.removeAttribute("disabled");
}

playButton.addEventListener("click", () => {
    workBlock.style.display = "initial";

    if (!animBlock.hasChildNodes()) {
        createCanvas();
    }

    if (!circles.length) {
        createCircles(circlesParams);
    }

    window.localStorage.setItem(__LOCALSTORAGE_LOGGED__, "");

    outputConsole("click: <b>play</b> button");
});

closeButton.addEventListener("click", () => {
    workBlock.style.display = "none";

    const logged = window.localStorage.getItem(__LOCALSTORAGE_LOGGED__);
    if (logged) {
        asideUpper.replaceChildren();
        JSON.parse(logged).forEach((l) => {
            const li = document.createElement("li");
            li.innerHTML = l;
            asideUpper.appendChild(li);
        });
    }

    resetParams();
});

startButton.addEventListener("click", () => {
    if (!circles.length) {
        outputConsole("first create circles: click <b>play</b> button", ENUM__ROLES.WARN);
        return;
    }

    // actual reload click
    if (startButton.innerHTML === "Reload") {
        resetParams();
        createCircles(circlesParams);

        outputConsole("click: <b>reload</b> button");
        return;
    }

    stopSignal = false;

    loop();

    startButton.setAttribute("disabled", true);

    (() => {
        playTimerValue = 1;
        headerBox.innerHTML = "0s";
        playTimer = setInterval(() => {
            headerBox.innerHTML = `${playTimerValue}s`;
            playTimerValue++;
        }, 1000);
    })();

    outputConsole("click: <b>start</b> button");
});
