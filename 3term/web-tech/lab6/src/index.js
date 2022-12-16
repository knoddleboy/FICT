const r = document.querySelector(":root");

const glColor1 = document.querySelector("#gl-color1");
const glColor2 = document.querySelector("#gl-color2");
const glDuration = document.querySelector("#gl-duration");
const glShift = document.querySelector("#gl-shift");
const glContent = document.querySelector("#gl-content");
const glitchText = document.querySelector("#glitch");

glColor1.addEventListener("change", (e) => {
    r.style.setProperty("--gl-1-color", e.target.value);
});

glColor2.addEventListener("change", (e) => {
    r.style.setProperty("--gl-2-color", e.target.value);
});

glDuration.addEventListener("change", (e) => {
    let val = e.target.value;
    if (val > 30) val = 30;
    r.style.setProperty("--gl-dur", `${val}s`);
});

glShift.addEventListener("change", (e) => {
    let val = e.target.value;
    if (val > 10) val = 10;
    r.style.setProperty("--gl-shift", `${val}px`);
});

glContent.addEventListener("change", (e) => {
    const val = e.target.value;

    glitchText.innerHTML = val;
    r.style.setProperty("--gl-content", `"${val}"`);
});
