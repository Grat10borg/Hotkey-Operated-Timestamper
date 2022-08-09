"use strict";
var TclientId = "uqiitin0qzty2b0xeet7bczpfouppc";
var Tredirect = "http://localhost/Hotkey-Operated-Timestamper/Highlight.php";
var TappAcess = "ncma1vkg5ebul64cxjo60vjv5ddomb";
let res = document.getElementById("DescTxt");
let res1 = document.getElementById("IntroTxt");
let res2 = document.getElementById("SocialTxt");
let res3 = document.getElementById("CreditsTxt");
let Desc1 = res.innerHTML;
let intro = res1.innerHTML;
let socialLinks = res2.innerHTML;
let Credits = res3.innerHTML;
console.log(intro);
let AuthA = document.getElementById("authorize_email");
AuthA.setAttribute("href", "https://id.twitch.tv/oauth2/authorize?client_id=" +
    TclientId +
    "&redirect_uri=" +
    encodeURIComponent(Tredirect) +
    "&response_type=token&scope=user:read:email");
let empty = document.getElementById("access_token");
empty.textContent = "";
var Id;
var form = document.querySelector("#HighlighForm");
var ErrorDiv = document.getElementById("ErrorDiv");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    let date = new Date(form.date.value);
    if (date == "Invalid Date") {
        date = new Date();
        date.setDate(date.getDate() - 90);
        console.log("start date was not given, getting clips from 90 days ago");
    }
    let endDate = new Date(form.endDate.value);
    let game_id = form.SelectGame.options[form.SelectGame.selectedIndex].value;
    let viewCount = form.viewcount.value;
    if (viewCount == "") {
        viewCount = 1;
    }
    try {
        date = date.toISOString();
    }
    catch (error) {
        console.log("The Set Date Value was Not allowed");
        console.log(error);
    }
    if (endDate == "Invalid Date") {
        endDate = new Date();
        console.log("Sluts Dato var ikke sat, defaulter til Dagens dato som sluts dato");
        endDate = endDate.toISOString();
    }
    else {
        endDate = endDate.toISOString();
    }
    fetchUser(true, TappAcess, form.SelectChannel.options[form.SelectChannel.selectedIndex].value, date, endDate, game_id, viewCount);
}, true);
let ChannelSelect = document.querySelector("#SelectChannel");
ChannelSelect.addEventListener("change", function () {
    let value = ChannelSelect.options[ChannelSelect.selectedIndex].value;
    console.log("Searching for " + value);
    ErrorDiv.innerHTML = "";
    validateToken(value);
});
if (document.location.hash && document.location.hash != "") {
    var parsedHash = new URLSearchParams(window.location.hash.slice(1));
    if (parsedHash.get("access_token")) {
        var Useraccess_token = parsedHash.get("access_token");
        let selectbox = document.getElementById("SelectChannel");
        selectbox.disabled = false;
    }
}
else if (document.location.search && document.location.search != "") {
    var parsedParams = new URLSearchParams(window.location.search);
    if (parsedParams.get("error_description")) {
        let p = document.getElementById("access_token");
        p.textContent =
            parsedParams.get("error") + " - " + parsedParams.get("error_description");
    }
}
let client_id = "";
function validateToken(value) {
    fetch("https://id.twitch.tv/oauth2/validate", {
        headers: {
            Authorization: "Bearer " + TappAcess,
        },
    })
        .then((resp) => resp.json())
        .then((resp) => {
        if (resp.status) {
            if (resp.status == 401) {
                console.log("This token is invalid" + resp.message);
                return;
            }
            console.log("Unexpected output with a status");
            return;
        }
        if (resp.client_id) {
            client_id = resp.client_id;
            if (resp.user_id) {
                fetchUser(false, TappAcess, value, "", "", "", 0);
            }
            else {
                fetchUser(false, TappAcess, value, "", "", "", 0);
            }
            return;
        }
        console.log("unexpected Output");
    })
        .catch((err) => {
        ErrorMsg("An Error Occured VALIDATING token data", err, "Error");
        console.log(err);
        console.log("An Error Occured VALIDATING token data");
    });
}
function fetchUser(submit, access_token, streamerName, date, endDate, game_id, viewCount) {
    fetch(`https://api.twitch.tv/helix/users?login=${streamerName}`, {
        headers: {
            "Client-ID": client_id,
            Authorization: "Bearer " + access_token,
        },
    })
        .then((resp) => resp.json())
        .then((resp) => {
        if (submit == true) {
            Id = resp["data"][0]["id"];
            FetchCallClip(date, endDate, Id, game_id, viewCount);
        }
        else {
            GetChosenChannelGames(resp["data"][0]["id"]);
        }
    })
        .catch((err) => {
        ErrorMsg("Could not fetch user Are you sure its spelt correctly?", err, "Error");
        console.log(err);
    });
}
function GetChosenChannelGames(id) {
    let d = new Date();
    let RFCdato = new Date();
    RFCdato.setDate(RFCdato.getDate() - 90);
    fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=100&started_at=${RFCdato.toISOString()}&ended_at=${d.toISOString()}`, {
        headers: {
            "Client-ID": TclientId,
            Authorization: "Bearer " + Useraccess_token,
        },
    })
        .then((response) => response.json())
        .then((response) => {
        var GameIds = new Set();
        for (let index = 0; index < response["data"].length; index++) {
            GameIds.add(response["data"][index]["game_id"]);
        }
        GetGamesFromIds(GameIds);
    })
        .catch((err) => {
        ErrorMsg("Error Logging in try again", err, "Warning");
        console.log(err);
    });
}
function GetGamesFromIds(Game_ids) {
    let httpcall = "https://api.twitch.tv/helix/games?";
    let index = 0;
    Game_ids.forEach((Gameid) => {
        if (index == 0) {
            httpcall = httpcall + "id=" + Gameid;
        }
        else {
            httpcall = httpcall + "&id=" + Gameid;
        }
        index++;
    });
    fetch(`${httpcall}`, {
        headers: {
            "Client-ID": TclientId,
            Authorization: "Bearer " + Useraccess_token,
        },
    })
        .then((response) => response.json())
        .then((response) => {
        let selectboxG = document.getElementById("SelectGame");
        while (selectboxG.firstChild) {
            selectboxG.firstChild.remove();
        }
        for (let index = 0; index < response["data"].length; index++) {
            let gameid = response["data"][index]["id"];
            let gamename = response["data"][index]["name"];
            let optionsG = document.createElement("option");
            optionsG.setAttribute("value", gameid);
            optionsG.append(document.createTextNode(gamename));
            selectboxG.appendChild(optionsG);
        }
        let optionNone = document.createElement("option");
        optionNone.setAttribute("value", "None");
        optionNone.append(document.createTextNode("Any Game Id"));
        selectboxG.appendChild(optionNone);
        selectboxG.disabled = false;
    })
        .catch((err) => {
        ErrorMsg("Failed to fetch game names from game ids, try again", err, "Warning");
        console.log(err);
    });
}
function GetUsersBroadcastId(RFCdate, RFCDateEnd, game_id, viewCount) {
    fetch(`https://api.twitch.tv/helix/users`, {
        headers: {
            "Client-ID": TclientId,
            Authorization: "Bearer " + Useraccess_token,
        },
    })
        .then((response) => response.json())
        .then((response) => {
        console.log("Api Kald Fuldgjort");
        console.log(response);
        var arr = response;
        FetchCallClip(RFCdate, RFCDateEnd, arr["data"]["0"]["id"], game_id, viewCount);
    })
        .catch((err) => {
        ErrorMsg("could not get YOUR username, could not find logged in user's username", err, "Error");
        console.log(err);
    });
}
function FetchCallClip(RFCdate, RFCDateEnd, Id, game_id, viewCount) {
    fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${Id}&first=100&started_at=${RFCdate}&ended_at=${RFCDateEnd}`, {
        headers: {
            "Client-ID": TclientId,
            Authorization: "Bearer " + Useraccess_token,
        },
    })
        .then((response) => response.json())
        .then((response) => {
        let Udata = document.getElementById("user_data");
        Udata.textContent = "Success";
        ClipSorter(response, game_id, viewCount);
    })
        .catch((err) => {
        ErrorMsg("Failed in fetching Clips, did you remember to give a Date?", err, "Warning");
        console.log(err);
        let Udata = document.getElementById("user_data");
        Udata.textContent = "Failed getting clips";
    });
}
function ClipSorter(Clips, game_id, viewCount) {
    var arrclips = Array();
    let duration = 0;
    let j = 0;
    for (let i = 0; i < Clips["data"]["length"]; i++) {
        var clip = Clips["data"][i];
        if (game_id == "None") {
            if (clip["view_count"] > viewCount) {
                arrclips[j] = Clips["data"][i];
                duration = duration + clip["duration"];
                j++;
            }
        }
        else {
            if (clip["game_id"] == game_id) {
                if (clip["view_count"] > viewCount) {
                    arrclips[j] = Clips["data"][i];
                    duration = duration + clip["duration"];
                    j++;
                }
            }
        }
    }
    let datemsec = Array();
    for (let index = 0; index < arrclips.length; index++) {
        datemsec[index] = Date.parse(`${arrclips[index]["created_at"]}`);
    }
    datemsec.sort(function (a, b) {
        return a - b;
    });
    let datesort = Array();
    for (let index = 0; index < datemsec.length; index++) {
        let d = new Date(datemsec[index]);
        let s = d.toISOString();
        let a = s.split(".000");
        datesort[index] = a[0] + a[1];
    }
    let sortcliped = Array();
    for (let index = 0; index < datesort.length; index++) {
        for (let index2 = 0; index2 < arrclips.length; index2++) {
            if (arrclips[index2]["created_at"].indexOf(datesort[index]) == 0) {
                sortcliped[index] = arrclips[index2];
                continue;
            }
            else {
            }
        }
    }
    console.log(sortcliped);
    let textNode = document.createTextNode(`‣ Found: ${sortcliped.length} Clips, Thats ${toTime(duration)} of content!`);
    let insertP = document.createElement("p");
    insertP.appendChild(textNode);
    let DataP = document.querySelector("#DataP");
    DataP.textContent =
        "you did it! good job, heres the data from the query(s) you did ヾ(•ω•`)o";
    let DataDiv = document.querySelector("#DataDiv");
    DataDiv.appendChild(insertP);
    let textAreaDiv = document.querySelector("#Linksarea");
    let Desc = document.querySelector("#myInput0");
    let clipCredit = new Set();
    let x = 0;
    duration = 0;
    let text = "";
    text = text + Desc1 + "\n\n";
    textAreaDiv.innerHTML = "";
    for (let i = 0; i < sortcliped.length; i++) {
        if (i == 0) {
            text = text + `• 0:00 ${sortcliped[i]["title"]}\n`;
        }
        else {
            text = text + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
        }
        duration = duration + sortcliped[i]["duration"];
        clipCredit.add(sortcliped[i]["creator_name"]);
        let rowdiv = document.createElement("div");
        let a = document.createElement("a");
        let p = document.createElement("p");
        rowdiv.classList.add("row", "m-2");
        if (i % 2 == 0) {
            rowdiv.classList.add("Linkbg");
        }
        a.classList.add("col-8", "ClipLink");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", sortcliped[i]["url"]);
        p.classList.add("col-4", "text-center");
        a.text = ` ‣ Clip ${i + 1} - '${sortcliped[i]["title"]}'`;
        p.append(document.createTextNode(`${sortcliped[i]["duration"]} sec/s (${toTime(duration)}in all)`));
        rowdiv.append(a);
        rowdiv.append(p);
        textAreaDiv.append(rowdiv);
    }
    let accordLink = document.querySelector("#accordLink");
    accordLink.disabled = false;
    text = text + "Clips by:";
    clipCredit.forEach((element) => {
        text = text + ` ${element},`;
    });
    text = text.slice(0, text.length - 1);
    text = text + "\n\n" + intro + "\n\n";
    text = text + socialLinks + "\n\n";
    text = text + Credits;
    Desc.textContent = text;
    let Charcount = text.length;
    let p = document.querySelector(`#CharCount0`);
    p.textContent = `${Charcount}`;
    if (Charcount > 5000) {
        p.setAttribute("class", "CharaRed");
    }
    else if (Charcount > 3000) {
        p.setAttribute("class", "CharaYellow");
    }
    else {
        p.setAttribute("class", "CharaGreen");
    }
    let accorddesc = document.querySelector("#accordDesc");
    accorddesc.disabled = false;
}
function ErrorMsg(Msg, systemMsg, color) {
    let H4 = document.createElement("h4");
    let p = document.createElement("p");
    H4.classList.add(`${color}`);
    p.classList.add(`${color}`);
    H4.innerHTML = Msg;
    p.innerText = systemMsg;
    ErrorDiv.append(H4);
    ErrorDiv.append(p);
}
function toTime(seconds) {
    let date = new Date();
    date.setHours(0, 0, 0);
    date.setSeconds(seconds);
    let dateText = date.toString();
    dateText = dateText.substring(16, 25);
    let arrayD = dateText.split(":");
    if (arrayD[0][0] == "0") {
        if (arrayD[0][1]) {
            if (arrayD[1][0] == "0") {
                if (arrayD[1][1] == "0") {
                    dateText = "0:" + arrayD[2];
                }
                else {
                    dateText = arrayD[1][1] + ":" + arrayD[2];
                }
            }
            else {
                dateText = arrayD[1] + ":" + arrayD[2];
            }
        }
        else {
            dateText = arrayD[0][1] + ":" + arrayD[1] + ":" + arrayD[2];
        }
    }
    else {
        dateText = arrayD[0] + ":" + arrayD[1] + ":" + arrayD[2];
    }
    return dateText;
}
