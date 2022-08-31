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
var YclientId = "738406360954-727ohtsje2p1se0vngbosd5oot1e601l.apps.googleusercontent.com";
var YApiKey = "AIzaSyCq512yjXdQLtdUV3n7CzKIe78oDufRovU";
var arrayIds = Array();
var arrayVidname = Array();
var optionValue = 0;
var gapi;
var auth = document.querySelector('.authUpload');
auth.addEventListener('click', function (event) {
    authAllowDescChange().then(loadClientChannel()).then(GetVideoIds);
}, true);
var Send = document.querySelectorAll('.Send');
for (let i = 0; i < Send.length; i++) {
    Send[i].addEventListener('click', function (event) {
        console.log(event.target.value);
        var num = event.target.value;
        var selectText = document.getElementById(`myInput${num}`);
        selectText.select();
        selectText.setSelectionRange(0, 99999);
        var select = document.querySelector('.SelectId');
        GitPushDescription(selectText.value, select.value, arrayIds, arrayVidname);
    }, true);
}
function authAllowDescChange() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
        .then(function () { console.log("Sign-in successful"); }, function (err) { console.error("Error signing in", err); });
}
function loadClientChannel() {
    gapi.client.setApiKey(YApiKey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () { console.log("GAPI client loaded for API"); }, function (err) { console.error("Error loading GAPI client for API", err); });
}
function GetVideoIds() {
    return gapi.client.youtube.search.list({
        "part": [
            "snippet"
        ],
        "forMine": true,
        "maxResults": 10,
        "order": "date",
        "type": [
            "video"
        ]
    })
        .then(function (response) {
        console.log("Response", response);
        var arrayR = response;
        for (let index = 0; index < arrayR.result.items.length; index++) {
            arrayIds[index] = arrayR["result"]["items"][`${index}`]["id"]["videoId"];
            arrayVidname[index] = arrayR["result"]["items"][`${index}`]["snippet"]["title"];
            let option = document.createElement("option");
            option.appendChild(document.createTextNode(`${arrayVidname[index]}`));
            option.setAttribute("value", index);
            let Selectbox = document.querySelector('.SelectId');
            Selectbox.appendChild(option);
            let selectid = document.getElementById('selectId');
            selectid.disabled = false;
        }
        console.log(arrayIds);
        console.log(arrayVidname);
    }, function (err) {
        console.error("Execute error", err);
        alert("You havent selected a video, or logged in");
    });
}
function GitPushDescription(selectText, SelectValue, arrayIds, arrayVidname) {
    console.log(arrayVidname[SelectValue]);
    return gapi.client.youtube.videos.update({
        "part": [
            "snippet"
        ],
        "resource": {
            "id": `${arrayIds[SelectValue]}`,
            "snippet": {
                "title": `${arrayVidname[SelectValue]}`,
                "description": `${selectText}`,
                "categoryId": "22"
            }
        }
    })
        .then(function (response) {
        console.log("Response", response);
    }, function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: YclientId });
});
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "738406360954-727ohtsje2p1se0vngbosd5oot1e601l.apps.googleusercontent.com" });
});
