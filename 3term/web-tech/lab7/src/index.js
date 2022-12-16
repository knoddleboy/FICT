const playButton = document.querySelector(".play-btn");
const closeButton = document.querySelector(".close-btn");
const circlesStartButton = document.querySelector(".circles-start-btn");

const workBlock = {
    el: document.querySelector(".work"),
    get width() {
        return this.el.clientWidth;
    },
    get height() {
        return this.el.clientHeight;
    },
};

const animBlock = {
    el: document.querySelector(".anim"),
    get width() {
        return this.el.clientWidth;
    },
    get height() {
        return this.el.clientHeight;
    },
};

class Circle {
    constructor(color, dx, dy) {
        this.dx = dx || 0;
        this.dy = dy || 0;

        this.width = 20;
        this.height = 20;

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
        }
        if (y < 0 || y > animBlock.height - this.height) {
            this.dy = -this.dy;
        }
    }

    drawFromCurrentPosition(parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = this.el.getBoundingClientRect();
        const offsetY = elRect.top - parentRect.top;
        const offsetX = elRect.left - parentRect.left;

        this.draw(offsetX, offsetY);
    }

    draw(x, y) {
        this.#moveTo(x, y);
        const ball = this;
        setTimeout(function () {
            ball.#changeDirectionIfNecessary(x, y);
            ball.draw(x + ball.dx * 0.6, y + ball.dy * 0.4);
        }, 1000 / 240);
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

let circles = [];

playButton.addEventListener("click", () => {
    workBlock.el.style.display = "initial";
    circles = createCircles();
});
closeButton.addEventListener("click", () => {
    workBlock.el.style.display = "none";
});

circlesStartButton.addEventListener("click", () => {
    circles[0].drawFromCurrentPosition(animBlock.el);
    circles[1].drawFromCurrentPosition(animBlock.el);
});
