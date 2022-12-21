import { ENUM__ROLES, __LOCALSTORAGE_LOGGED__, timeouts } from "./constants.js";
import { consoleField, fastConsoleField } from "./constants.js";

export const _queue = [];

export const logger = (msg) => {
    const d = new Date().toISOString().replace("T", " ").split(".")[0];
    const str = `${d} [DEBUG] ${msg}`;

    // console.log(str);
    _queue.push(str);

    window.localStorage.setItem(__LOCALSTORAGE_LOGGED__, JSON.stringify(_queue));
};

export function outputConsole(msg, role = ENUM__ROLES.INFO) {
    const parent = role === ENUM__ROLES.FAST ? fastConsoleField : consoleField;

    switch (role) {
        case ENUM__ROLES.INFO: // default info
            msg = `&#8505;&#65039; ${msg}`;
            break;
        case ENUM__ROLES.WARN: // warning
            msg = `&#9888;&#65039; ${msg}`;
            break;
        case ENUM__ROLES.FAST:
            msg = `&#127921; ${msg}`;
            break;
    }

    function addMsgEl() {
        const msgSpan = document.createElement("span");
        msgSpan.innerHTML = msg;

        parent.appendChild(msgSpan);

        logger(msg);
    }

    function outAnimation(timeout = 2500, callback) {
        const last = parent.lastChild;

        if (timeouts.length) {
            timeouts.forEach((t) => clearTimeout(t));
        }

        const t1 = setTimeout(() => {
            last.classList.add("console--out");

            const t2 = setTimeout(() => {
                parent.removeChild(last);

                if (callback) callback();
            }, 300);

            timeouts.push(t2);
        }, timeout);

        timeouts.push(t1);
    }

    if (parent.children.length) {
        if (role !== ENUM__ROLES.FAST) {
            outAnimation(0, () => {
                addMsgEl();
                // outAnimation();
            });
        } else {
            parent.replaceChildren();
            addMsgEl();
        }
    } else {
        addMsgEl();
        // if (role !== ENUM__ROLES.FAST) outAnimation();
    }
}

export function randRng(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
