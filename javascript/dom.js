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
    api_valid: validateTwitchToken.bind($),
    api: ApiCall.bind($),
    log: console.log,
};
let TwitchClientID = "";
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
            $$.id("ShowPrivateIcon").src = "img\\Icons\\UnlockedIcon.png";
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
    }
}
async function validateTwitchToken() {
    let p = $$.id("AccessTokenTime");
    if (config.TWITCH_API_TOKEN != undefined && config.TWITCH_API_TOKEN != "" && config.TWITCH_API_TOKEN != null) {
        await fetch("https://id.twitch.tv/oauth2/validate", {
            headers: { Authorization: "Bearer " + config.TWITCH_API_TOKEN, },
        }).then((resp) => resp.json()).then((resp) => {
            if (resp.status) {
                if (resp.status == 401) {
                    alert("This token ('" + config.TWITCH_API_TOKEN + "') is invalid (" + resp.message + ")!");
                    console.log("[INVALID TOKEN]: Try making a new token, or setting [TWITCH_ON] to false in the config.js file!");
                    let Submitbtn = $$.id("Submit");
                    Submitbtn.disabled = true;
                    p.innerHTML = `• Your Token is invalid, try to follow H.O.T wiki for help!.`;
                    return 0;
                }
                alert("Unexpected response while validating token, check console for info.. (っ °Д °;)っ");
                $$.log("[Unexpected Token Output]");
                $$.log(resp.status);
                return 0;
            }
            if (resp.client_id) {
                TwitchClientID = resp.client_id;
                $$.log("[TOKEN VALIDATED]: Token Validated Sucessfully");
                let Time = new Date(resp.expires_in * 1000);
                let TimeStrDash = Time.toISOString().split("-");
                let TimeStrT = TimeStrDash[2].split("T");
                let TimeString = `${parseInt(TimeStrDash[1].substring(1, 2)) - 1} Month ${TimeStrT[0]} Days & ${TimeStrT[1].substring(0, 8)} Hours`;
                p.innerHTML = `• Current Token Will Expire In: <br> ${TimeString}.`;
                return 1;
            }
            $$.log("[TOKEN UNEXPECTED OUTCOME] unexpected Output");
            $$.log(resp.status);
            p.innerHTML = `• Your Token returned an unforseen result?. check console for info.`;
            return 0;
        })
            .catch((err) => {
            $$.log(err);
            return 0;
        });
        return 1;
    }
    else {
        p.innerHTML = `• Could not get you Twitchkey, try looking in config.js`;
        $$.log("H.O.T could not get your TwitchKey, you will not be able to use Clip-Stamps");
        let TwitchClipbtn = $$.id("TwitchClip");
        if (TwitchClipbtn != null)
            TwitchClipbtn.disabled = true;
        return 0;
    }
}
async function ApiCall(HttpCall, Twitch) {
    if (Twitch == true) {
        const respon = await fetch(`${HttpCall}`, {
            headers: {
                Authorization: "Bearer " + config.TWITCH_API_TOKEN,
                "Client-ID": TwitchClientID,
            },
        })
            .then((respon) => respon.json())
            .then((respon) => {
            return respon;
        })
            .catch((err) => {
            $$.log(err);
            return err;
        });
        return respon;
    }
    else {
        const respon = await fetch(`${HttpCall}`, {
            headers: {},
        })
            .then((respon) => respon.json())
            .then((respon) => {
            return respon;
        })
            .catch((err) => {
            $$.log(err);
            return err;
        });
        return respon;
    }
}
