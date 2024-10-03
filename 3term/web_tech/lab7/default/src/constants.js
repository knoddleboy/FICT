export const ENUM__ROLES = {
    INFO: "INFO",
    WARN: "WARN",
    FAST: "FAST",
};

export const __LOCALSTORAGE_LOGGED__ = "logged";

export const playButton = document.querySelector(".play-btn");
export const closeButton = document.querySelector(".close-btn");
export const startButton = document.querySelector(".circles-start-btn");
export const consoleField = document.querySelector(".console-output");
export const fastConsoleField = document.querySelector(".fast-console-output");
export const asideUpper = document.querySelector(".aside__upper-wrapper");
export const headerBox = document.querySelector(".header-box"); // for timer

export const workBlock = {
    el: document.querySelector(".work"),
    get width() {
        return this.el.clientWidth;
    },
    get height() {
        return this.el.clientHeight;
    },
};

export const animBlock = {
    el: document.querySelector(".anim"),
    get width() {
        return this.el.clientWidth;
    },
    get height() {
        return this.el.clientHeight;
    },
};

export const timeouts = [];

export const circlesParams = [];
