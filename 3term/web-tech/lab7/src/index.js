import { isCollide, outputConsole, _queue } from "./utils.js";
import { ENUM__ROLES, ENUM__SWITCH, timeouts, __LOCALSTORAGE_LOGGED__ } from "./constants.js";
import {
    playButton,
    closeButton,
    startButton,
    fastConsoleField,
    asideUpper,
    headerBox,
    animSwitch,
} from "./constants.js";
import { workBlock, animBlock, canvasBlock, isCanvasMode } from "./constants.js";

let circles = [];

class Circle {
    constructor(color, dx, dy) {
        this.color = color;
        this.dx = dx || 0;
        this.dy = dy || 0;

        this.width = 10; // 20
        this.height = 10; // 20

        this.el = document.createElement("div");

        const styles = `
            width: ${this.width}px;
            height: ${this.height}px;
            border-radius: 50%;
            background-color: ${color};
            position: absolute;
            top: 0;
            left: 0;
        `;

        this.el.setAttribute("style", styles);

        animBlock.el.appendChild(this.el);
    }

    placeRandomly(w, h) {
        this.el.style.top = (Math.random() * (h - this.height)).toFixed() + "px";
        this.el.style.left = (Math.random() * (w - this.width)).toFixed() + "px";
    }

    #moveTo(x, y) {
        this.el.style.left = x + "px";
        this.el.style.top = y + "px";
    }

    #changeDirectionIfNecessary(x, y) {
        if (x < 0 || x > animBlock.width - this.width) {
            this.dx = -this.dx;

            outputConsole(`<b>${this.color}</b> circle touched wall`, ENUM__ROLES.FAST);
        }
        if (y < 0 || y > animBlock.height - this.height) {
            this.dy = -this.dy;

            outputConsole(`<b>${this.color}</b> circle touched wall`, ENUM__ROLES.FAST);
        }
    }

    getXY(parent = animBlock.el) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = this.el.getBoundingClientRect();
        const offsetY = elRect.top - parentRect.top;
        const offsetX = elRect.left - parentRect.left;
        return [offsetX, offsetY];
    }

    drawFromCurrentPosition(parent) {
        const [offsetX, offsetY] = this.getXY(parent);

        this.draw(offsetX, offsetY);
    }

    draw(x, y) {
        this.#moveTo(x, y);

        const ball = this;

        setTimeout(() => {
            if (isCollide(circles[0], circles[1])) {
                reloadAnimation();
                clearInterval(playTimer);

                outputConsole("circles collided");

                return;
            } else if (playTimerValue > 60) {
                reloadAnimation();
                clearInterval(playTimer);

                outputConsole("animation <b>time out</b>");

                return;
            }

            ball.#changeDirectionIfNecessary(x, y);
            ball.draw(x + ball.dx * 0.6, y + ball.dy * 0.4);
        }, 1000 / 1000); // 240
    }
}

function createCircles() {
    const { width, height } = animBlock;

    const c1 = new Circle("yellow", 4, 3);
    const c2 = new Circle("red", 2, 6);

    c1.placeRandomly(width, height);
    c2.placeRandomly(width, height);

    return [c1, c2];
}

function reloadAnimation() {
    startButton.innerHTML = "Reload";
    startButton.removeAttribute("disabled");
}

playButton.addEventListener("click", () => {
    workBlock.el.style.display = "initial";

    window.localStorage.setItem(__LOCALSTORAGE_LOGGED__, "");

    if (!circles.length) {
        circles = createCircles();
    }

    outputConsole("click: <b>play</b> button");
});

closeButton.addEventListener("click", () => {
    workBlock.el.style.display = "none";

    const logged = window.localStorage.getItem(__LOCALSTORAGE_LOGGED__);
    if (logged) {
        asideUpper.replaceChildren();
        JSON.parse(logged).forEach((l) => {
            const li = document.createElement("li");
            li.innerHTML = l;
            asideUpper.appendChild(li);
        });
    }

    timeouts.forEach((t) => clearTimeout(t));
});

let playTimer;
let playTimerValue;

startButton.addEventListener("click", () => {
    if (!circles.length) {
        outputConsole("first create circles: click <b>play</b> button", ENUM__ROLES.WARN);
        return;
    }

    // actual reload click
    if (startButton.innerHTML === "Reload") {
        startButton.innerHTML = "Start";

        animBlock.el.replaceChildren();
        fastConsoleField.replaceChildren();
        headerBox.innerHTML = "0s";

        _queue.length = 0;

        circles = createCircles();

        outputConsole("click: <b>reload</b> button");

        return;
    }

    circles.forEach((circle) => {
        circle.drawFromCurrentPosition(animBlock.el);
    });

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

animSwitch.addEventListener("click", () => {
    if (isCanvasMode()) {
        animSwitch.innerHTML = ENUM__SWITCH.Default;
        animBlock.el.replaceChildren();

        const canvas = document.createElement("canvas");
        canvas.setAttribute("class", "canvas");
        animBlock.el.appendChild(canvas);
    } else {
        animSwitch.innerHTML = ENUM__SWITCH.Canvas;
        animBlock.el.replaceChildren();
    }
});
