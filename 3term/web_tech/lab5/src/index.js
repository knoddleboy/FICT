"use strict";

/**
 * 1. Swap the texts marked "1" and "2".
 */

const el1_1 = document.querySelector(".aside__upper");
const el2_1 = document.querySelector(".nav__navbar");

const el1_text = el1_1.textContent;
const el2_text = el2_1.textContent;

el1_1.innerHTML = el2_text;
el2_1.innerHTML = el1_text;

/**
 * 2. Write a function that calculates the area of an ellipse, taking
 *    the necessary values from the corresponding variables in the script,
 *    and outputs the result at the end content in block "3".
 */

const semiMajorAxis = 4;
const semiMinorAxis = 3;

function ellipseArea(a, b) {
    const area = a * b * Math.PI;
    return area.toFixed(2);
}

const article = document.querySelector(".article");
const ellipseAreaEl = document.createElement("span");
ellipseAreaEl.innerHTML = `Ellipse area with <i>a = ${semiMajorAxis}</i>, <i>b = ${semiMinorAxis}</i>: <b>${ellipseArea(
    semiMajorAxis,
    semiMinorAxis
)}</b>`;
article.append(ellipseAreaEl);

/**
 * 3. Write a script that defines all the divisors of a given natural number,
 *    taking this number from of the appropriate form in block "3", and received
 *    the result is displayed using a dialog box and stores in cookies, and:
 *
 *      a) when updating the web page in the browser
 *         information is displayed to the user using a dialog box,
 *         stored in cookies, with a question about the need to delete data
 *         from cookies, and no the form mentioned above is output;
 *
 *      b) when confirming the question, the corresponding cookies are
 *         deleted, and the web page is updated with the initial state with
 *         the existing data entry form;
 *
 *      c) in case of refusal, the following dialog box with information is
 *         displayed the user about the presence of cookies and the need to
 *         reload the web page.
 */

import { getDivisors, setCookie, getCookie, deleteCookie } from "./utils.js";

const __COOKIE_DIVISORS__ = "divisors";

const naturalNumberForm = document.querySelector("#naturalNumberForm");
const formInput = document.querySelector("#naturalNumber");

const fromCookie = getCookie(__COOKIE_DIVISORS__);

if (fromCookie) {
    const res = confirm(
        `You have saved data in cookies:\n${fromCookie}\nWould you like to delete it?`
    );

    if (res) {
        deleteCookie(__COOKIE_DIVISORS__);
        document.location.reload();
    } else {
        alert("You have saved data in cookies. Reload the window.");
    }
} else {
    naturalNumberForm.setAttribute("style", "display: initial;");
}

function submitDividers(e) {
    e.preventDefault();

    const val = formInput.value;
    const divs = getDivisors(val);

    alert(`Divisors of ${val}:\n` + divs);
    setCookie(__COOKIE_DIVISORS__, divs);
}

naturalNumberForm.addEventListener("submit", submitDividers);

/**
 * 4. Write a script that, when the mouseover event occurs, sets the right-alignment
 *    of the contents of blocks "1" and "2" when the user sets the corresponding
 *    checkboxes in the form and stores the corresponding values in the browser's
 *    localStorage so that the next time the web page is opened, the right-alignment
 *    properties of the contents of blocks "1" and "2" were set from of stored values
 *    in localStorage.
 */

const __LOCAL_STORAGE_ALIGN__ = "blocksAlign";

const block1 = document.querySelector(".aside__upper");
const block2 = document.querySelector(".nav__navbar");

const saveAlignmentForm = document.querySelector("#saveAlignmentForm");
const saveAlignmentBl1Input = document.querySelector("#saveAlignmentBl1");
const saveAlignmentBl2Input = document.querySelector("#saveAlignmentBl2");

const localStorageAlign = JSON.parse(window.localStorage.getItem(__LOCAL_STORAGE_ALIGN__));

// get initial values from localStorage
if (localStorageAlign && localStorageAlign.block1) {
    block1.classList.add("alignRight");
    saveAlignmentBl1Input.checked = true;
}

if (localStorageAlign && localStorageAlign.block2) {
    block2.classList.add("alignRight");
    saveAlignmentBl2Input.checked = true;
}

function alignContentRight1() {
    saveAlignmentBl1Input.checked = !block1.classList.contains("alignRight");
    block1.classList.toggle("alignRight");
}

function alignContentRight2() {
    saveAlignmentBl2Input.checked = !block2.classList.contains("alignRight");
    block2.classList.toggle("alignRight");
}

block1.addEventListener("mouseover", alignContentRight1);
block2.addEventListener("mouseover", alignContentRight2);

saveAlignmentBl1Input.addEventListener("change", alignContentRight1);
saveAlignmentBl2Input.addEventListener("change", alignContentRight2);

function saveAlignment(e) {
    e.preventDefault();

    window.localStorage.setItem(
        __LOCAL_STORAGE_ALIGN__,
        JSON.stringify({
            block1: saveAlignmentBl1Input.checked,
            block2: saveAlignmentBl2Input.checked,
        })
    );
}

saveAlignmentForm.addEventListener("submit", saveAlignment);

/**
 * 5. Write a script for creating an unnumbered list:
 *      a) the necessary elements of the form appear in the corresponding numbered
 *         blocks (1..5) as a result of clicking on the text link in the block;
 *
 *      b) the number of items in the unnumbered list is unlimited;
 *
 *      c) a button is placed next to it, as a result of clicking on which the
 *         entered data of the numbered list is stored in the localStorage of the
 *         browser (structured at your discretion);
 *
 *      d) next to it is a button for deleting the data of the unnumbered list
 *         from localStorage.
 *
 *      e) if the list was not deleted by the button from point d), reloading the
 *         web page leads to the display of the list in place of the initial content
 *         of the block.
 */

const __LOCAL_STORAGE_LIST__ = "listItems";

const list = document.querySelector(".list");
const listAddButton = document.querySelector(".list-add");
const listSaveButton = document.querySelector(".list-button-save");
const listDeleteButton = document.querySelector(".list-button-delete");

const savedList = JSON.parse(window.localStorage.getItem(__LOCAL_STORAGE_LIST__));

function createListItem(e, value = null) {
    const item = document.createElement("li");
    const itemInput = document.createElement("input");
    itemInput.setAttribute("type", "text");
    itemInput.setAttribute("class", "list-item");

    if (value) {
        itemInput.setAttribute("value", value);
    }

    item.appendChild(itemInput);
    list.append(item);
}

if (savedList) {
    for (const li in savedList) {
        if (savedList.hasOwnProperty(li)) {
            createListItem(null, savedList[li]);
        }
    }
}

listAddButton.addEventListener("click", createListItem);

function saveListToLocalStorage() {
    const itemValues = {};
    Array.from(list.children).forEach((it, idx) => {
        const val = it.children[0].value;
        itemValues[idx] = val;
    });

    window.localStorage.setItem(__LOCAL_STORAGE_LIST__, JSON.stringify(itemValues));
}

listSaveButton.addEventListener("click", saveListToLocalStorage);

listDeleteButton.addEventListener("click", () => {
    window.localStorage.removeItem(__LOCAL_STORAGE_LIST__);
    list.replaceChildren();
});
