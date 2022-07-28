"use strict";
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
function GetProfileData() {
    return gapi.client.youtube.channels.list({
        "part": [
            "snippet,contentDetails,statistics"
        ],
        "mine": true
    })
        .then(function (response) {
        var array = response;
        console.log("all data");
        console.log(array["result"]["items"]["0"]);
        var desc = array["result"]["items"]["0"]["snippet"]["description"];
        var country = array["result"]["items"]["0"]["snippet"]["country"];
        var title = array["result"]["items"]["0"]["snippet"]["title"];
        console.log("description of channel");
        console.log(desc);
        console.log("The Country");
        console.log(country);
        console.log("Title of channel");
        console.log(title);
    }, function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "738406360954-727ohtsje2p1se0vngbosd5oot1e601l.apps.googleusercontent.com" });
});
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
