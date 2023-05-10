"use strict";
const $ = document;
const $$ = {
    dom: document,
    id: $.getElementById.bind($),
    class: $.getElementsByClassName.bind($),
    make: $.createElement.bind($),
    query: $.querySelector.bind($),
    query_all: $.querySelectorAll.bind($),
    txt: fetchTXT.bind($),
    btnchar: AddBTNCharcounters.bind($),
    log: console.log,
};
async function fetchTXT(Url) {
    await fetch(Url)
        .then(response => response.text())
        .then((txt) => {
        let textarea = $$.make("textarea");
        textarea.textContent = txt;
        textarea.id = Url;
        textarea.hidden = true;
        $.body.append(textarea);
    });
    let text = $$.id(Url).innerHTML;
    $$.id(Url).outerHTML = "";
    return text;
}
function AddBTNCharcounters() {
    let StartTextareas = $$.query_all(".Charcounts");
    let Select = $$.query_all(".Select");
    let Copy = $$.query_all(".Copy");
    let Clear = $$.query(".Clear");
    let ScrollTop = $$.id("ScrollTop");
    let ShowHiddenText = $$.id("ShowSettings");
    let Locked = $$.id("Locked");
    for (let i = 0; i < Select.length; i++) {
        Select[i].addEventListener("click", function (event) {
            StartTextareas[event.target.value].select();
            StartTextareas[event.target.value].setSelectionRange(0, 99999);
            navigator.clipboard.writeText(StartTextareas[event.target.value].value);
        }, true);
    }
    for (let i = 0; i < Copy.length; i++) {
        Copy[i].addEventListener("click", function (event) {
            StartTextareas[event.target.value].select();
            StartTextareas[event.target.value].setSelectionRange(0, 99999);
            navigator.clipboard.writeText(StartTextareas[event.target.value].value);
        }, true);
    }
    for (let i = 0; i < StartTextareas.length; i++) {
        let p = $$.query(`#CharCount${i}`);
        p.innerHTML = StartTextareas[i].innerHTML.length;
        if (StartTextareas[i].innerHTML.length > 5000)
            p.setAttribute("class", "CharaRed");
        else if (StartTextareas[i].innerHTML.length > 3000)
            p.setAttribute("class", "CharaYellow");
        else
            p.setAttribute("class", "CharaGreen");
        StartTextareas[i].addEventListener("keyup", function (event) {
            p.textContent = event.target.value.length;
            if (event.target.value.length > 5000)
                p.setAttribute("class", "CharaRed");
            else if (event.target.value.length > 3000)
                p.setAttribute("class", "CharaYellow");
            else
                p.setAttribute("class", "CharaGreen");
        });
    }
    if (ScrollTop != null) {
        ScrollTop.addEventListener("click", function () { let TopNav = $$.id("TopNav"); TopNav.scrollIntoView(true); });
    }
    if (ShowHiddenText != null) {
        ShowHiddenText.addEventListener("click", function () {
            let PasswordInputs = $$.query_all('[type="password"]');
            if (PasswordInputs != null) {
                PasswordInputs.forEach((Input) => { Input.type = "text"; });
            }
        });
    }
    if (Locked != null) {
        Locked.addEventListener("click", function () {
            let Clear = $$.id("Clear");
            let LockedIcon = $$.id("LockedIcon");
            Clear.disabled = false;
            LockedIcon.src = "img\\Icons\\UnlockedIcon.png";
        }, true);
    }
    if (Clear != null) {
        Clear.addEventListener("click", function () { alert("Clearing Timestamps"); window.location.href = "clear.php"; }, true);
    }
}