"use strict";
var Copy = document.querySelectorAll(".Copy");
for (let i = 0; i < Copy.length; i++) {
    Copy[i].addEventListener("click", function (event) {
        copyText(event);
    }, true);
}
function copyText(event) {
    console.log(event.target.value);
    var num = event.target.value;
    var copyText = document.getElementById(`myInput${num}`);
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Copied the text: " + copyText.value);
}
let Select = document.querySelectorAll(".Select");
for (let i = 0; i < Select.length; i++) {
    Select[i].addEventListener("click", function (event) {
        SelectText(event);
    }, true);
}
function SelectText(event) {
    console.log(event.target.value);
    var num = event.target.value;
    var selectText = document.getElementById(`myInput${num}`);
    selectText.select();
    selectText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(selectText.value);
}
const Clear = document.querySelector(".Clear");
Clear?.addEventListener("click", function () {
    alert("Clearing Timestamps");
}, true);
let Textarea = document.querySelectorAll(".Textarea");
for (let i = 0; i < Textarea.length; i++) {
    Textarea[i].addEventListener("keyup", function (event) {
        let Charcount = CalcChars(event);
        let p = document.querySelector(`#CharCount${i}`);
        p.textContent = Charcount;
        if (Charcount > 5000) {
            p.setAttribute("class", "CharaRed");
        }
        else if (Charcount > 3000) {
            p.setAttribute("class", "CharaYellow");
        }
        else {
            p.setAttribute("class", "CharaGreen");
        }
    });
}
let StartTextarea = document.querySelectorAll(".Textarea");
for (let i = 0; i < StartTextarea.length; i++) {
    let Charcount = StartTextarea[i].value;
    let p = document.querySelector(`#CharCount${i}`);
    p.textContent = Charcount.length;
    if (Charcount > 5000) {
        p.setAttribute("class", "CharaRed");
    }
    else if (Charcount > 3000) {
        p.setAttribute("class", "CharaYellow");
    }
    else {
        p.setAttribute("class", "CharaGreen");
    }
}
function CalcChars(event) {
    let string = event.target.value;
    return string.length;
}
