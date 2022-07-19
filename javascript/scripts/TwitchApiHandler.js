"use strict";
var TclientId = "uqiitin0qzty2b0xeet7bczpfouppc";
var Tredirect = "http://localhost/Hotkey-Operated-Timestamper/Highlight.php";
var TappAcess = "ncma1vkg5ebul64cxjo60vjv5ddomb";
var Desc1 = "Catch the chaos in bullet-time! https://twitch.tv/grat_grot10_berg\n°•°•°•°•°•°•°•°•°•°•°•°•°•°•°•°•°•°•";
var intro = "Introduction\nDamn Daniel damn back at it again with those (mostly) chill streams DANIEL DAMN 😳\nI play mostly short games, and draw and such including: pixelart, live2d, shake-art, minecraft skins, lowpoly || autistic";
var socialLinks = "Socials\nTwic 📡 : https://twitch.tv/grat_grot10_berg \nTwit 🐦 : https://twitter.com/GratGrottenberg \nDisc 📀 : https://discord.gg/nVTZQT95uy";
var Credits = "Music ♪ ♪ ♪ ♪ \nAll music used for now is made by: Emile Van Kreiken ♪ & Shane Mesa\nEmile's Bandcam: https://music.emilevankrieken.com/album/the-aether-ii-original-soundtrack\nShean's Link: https://smarturl.it/mother4\n\nThese Songs in a YT playlist:\nhttps://www.youtube.com/playlist?list=PLkH2vNUD5wMWjKwhSan0U-f6T-trpOirc";
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
    validateToken(value);
});
let GameSelect = document.querySelector("#SelectGame");
GameSelect.addEventListener("change", function () {
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
        console.log(err);
        console.log("An Error Occured loading token data");
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
        console.log(err);
        let Udata = document.getElementById("user_data");
        Udata.textContent = "Error Logging in try again";
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
        console.log(err);
        let Udata = document.getElementById("user_data");
        Udata.textContent = "Could not convert game ids into game names";
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
        console.log(err);
        let Udata = document.getElementById("user_data");
        Udata.textContent = "Something went wrong";
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
        console.log(err);
        let Udata = document.getElementById("user_data");
        Udata.textContent = "Something went wrong";
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
    clipCredit.forEach(element => {
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
