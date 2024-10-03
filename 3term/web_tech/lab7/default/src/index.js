import { isCollide, outputConsole, _queue } from "./utils.js";
import { ENUM__ROLES, timeouts, __LOCALSTORAGE_LOGGED__, circlesParams } from "./constants.js";
import {
    playButton,
    closeButton,
    startButton,
    fastConsoleField,
    asideUpper,
    headerBox,
} from "./constants.js";
import { workBlock, animBlock } from "./constants.js";

let circles = [];

class Circle {
    constructor(color, size, dx, dy) {
        this.color = color;
        this.dx = dx || 0;
        this.dy = dy || 0;

        this.width = size;
        this.height = size;

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
        if (!circles.length) {
            return;
        }

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
        }, 1000 / 240);
    }
}

function createCircles() {
    const { width, height } = animBlock;

    circlesParams.forEach(({ color, size, dx, dy }) => {
        const c = new Circle(color, size, dx, dy);
        c.placeRandomly(width, height);

        circles.push(c);
    });
}

function resetParams() {
    animBlock.el.replaceChildren();
    fastConsoleField.replaceChildren();
    headerBox.innerHTML = "0s";

    startButton.innerHTML = "Start";
    startButton.removeAttribute("disabled");

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
    workBlock.el.style.display = "initial";

    window.localStorage.setItem(__LOCALSTORAGE_LOGGED__, "");

    if (!circles.length) {
        createCircles();
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

    resetParams();
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
        resetParams();
        createCircles();

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
