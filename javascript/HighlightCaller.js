"use strict";
let PBeforeDesc = document.getElementById("BeforeDesc");
let PAfterDesc = document.getElementById("AfterDesc");
let PTKey = document.getElementById("TwitchKey");
let PLBeforeDesc = document.getElementById("LocalBeforeDesc");
let PLAfterDesc = document.getElementById("LocalAfterDesc");
let BeforeDesc = PBeforeDesc.innerHTML;
let AfterDesc = PAfterDesc.innerHTML;
var TappAcess = PTKey.innerHTML;
let LocalBeforeDesc = PLBeforeDesc.innerHTML;
let LocalAfterDesc = PLAfterDesc.innerHTML;
let UserId = "";
let client_id = "";
validateTToken();
var Id;
var form = document.querySelector("#HighlighForm");
var ErrorDiv = document.getElementById("ErrorDiv");
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let Startdate = new Date(form.date.value);
    if (Startdate == "Invalid Date") {
        Startdate = new Date();
        Startdate.setDate(Startdate.getDate() - 90);
        console.log("start date was not given, getting clips from 90 days ago");
    }
    let endDate = new Date(form.endDate.value);
    let game_id = form.SelectGame.options[form.SelectGame.selectedIndex].value;
    let viewCount = form.viewcount.value;
    if (viewCount == "") {
        viewCount = 1;
    }
    try {
        Startdate = Startdate.toISOString();
    }
    catch (error) {
        console.log("The Set Date Value was Not allowed");
        console.log(error);
    }
    if (endDate == "Invalid Date") {
        endDate = new Date();
        console.log("End Date not selected Defaulting to Todays Date");
        endDate = endDate.toISOString();
    }
    else {
        endDate = endDate.toISOString();
    }
    let ClipResp = await HttpCaller(`https://api.twitch.tv/helix/clips?broadcaster_id=${UserId}&first=100&started_at=${Startdate}&ended_at=${endDate}`);
    console.log(ClipResp);
    ClipSorter(ClipResp, game_id, viewCount);
}, true);
let ChannelSelect = document.querySelector("#SelectChannel");
ChannelSelect.addEventListener("change", async function () {
    let StreamerName = ChannelSelect.options[ChannelSelect.selectedIndex].value;
    if (StreamerName != "none") {
        console.log("Searching for " + StreamerName);
        ErrorDiv.innerHTML = "";
        let UserResp = await HttpCaller(`https://api.twitch.tv/helix/users?login=${StreamerName}`);
        UserId = UserResp["data"][0]["id"];
        let d = new Date();
        let RFCdato = new Date();
        RFCdato.setDate(RFCdato.getDate() - 90);
        let GameResp = await HttpCaller(`https://api.twitch.tv/helix/clips?broadcaster_id=${UserId}&first=100&started_at=${RFCdato.toISOString()}&ended_at=${d.toISOString()}`);
        var GameIds = new Set();
        for (let index = 0; index < GameResp["data"].length; index++) {
            GameIds.add(GameResp["data"][index]["game_id"]);
        }
        let httpcall = "https://api.twitch.tv/helix/games?";
        let index = 0;
        GameIds.forEach((Gameid) => {
            if (index == 0) {
                httpcall = httpcall + "id=" + Gameid;
            }
            else {
                httpcall = httpcall + "&id=" + Gameid;
            }
            index++;
        });
        let SelectGameResp = await HttpCaller(httpcall);
        let selectboxG = document.getElementById("SelectGame");
        while (selectboxG.firstChild) {
            selectboxG.firstChild.remove();
        }
        let optionNone = document.createElement("option");
        optionNone.setAttribute("value", "None");
        optionNone.append(document.createTextNode("Any Game Id"));
        selectboxG.appendChild(optionNone);
        for (let index = 0; index < SelectGameResp["data"].length; index++) {
            let gameid = SelectGameResp["data"][index]["id"];
            let gamename = SelectGameResp["data"][index]["name"];
            let optionsG = document.createElement("option");
            optionsG.setAttribute("value", gameid);
            optionsG.append(document.createTextNode(gamename));
            selectboxG.appendChild(optionsG);
        }
        selectboxG.disabled = false;
    }
});
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
    let clipCredit = new Set();
    let x = 0;
    duration = 0;
    let localmode = false;
    let locale = document.getElementById("Local");
    if (locale.innerHTML != "" && locale.innerHTML != "none") {
        localmode = true;
    }
    let text = "";
    text = text + BeforeDesc + "\n\n";
    let LocaleText = "";
    if (localmode == true) {
        let LocaleBeforeDesc = document.getElementById("LocalBeforeDesc");
        LocaleText = LocaleText + LocaleBeforeDesc.innerHTML + "\n\n";
    }
    textAreaDiv.innerHTML = "";
    for (let i = 0; i < sortcliped.length; i++) {
        if (i == 0) {
            text = text + `• 0:00 ${sortcliped[i]["title"]}\n`;
            if (localmode == true) {
                LocaleText = LocaleText + `• 0:00 ${sortcliped[i]["title"]}\n`;
            }
        }
        else {
            text = text + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
            if (localmode == true) {
                LocaleText = LocaleText + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
            }
        }
        duration = duration + sortcliped[i]["duration"];
        clipCredit.add(sortcliped[i]["creator_name"]);
        let rowdiv = document.createElement("div");
        let button = document.createElement("button");
        let a = document.createElement("a");
        let p = document.createElement("p");
        rowdiv.classList.add("row", "m-2", "ps-0");
        rowdiv.classList.add("Linkbg");
        button.classList.add("col-3", "p-1", "btn", "ClipBtn");
        button.setAttribute("value", `Btn-${i}`);
        button.setAttribute("href", "#IframePlayerLater");
        a.classList.add("col-6", "ClipLink");
        a.setAttribute("id", `Clip-${i}`);
        a.setAttribute("target", "_blank");
        a.setAttribute("href", sortcliped[i]["url"]);
        p.classList.add("col-3", "text-center");
        button.textContent = "Play Clip →";
        a.text = ` ‣ Clip ${i + 1} - '${sortcliped[i]["title"]}'`;
        p.append(document.createTextNode(`${sortcliped[i]["duration"]} sec/s (${toTime(duration)}in all)`));
        rowdiv.append(button);
        rowdiv.append(a);
        rowdiv.append(p);
        textAreaDiv.append(rowdiv);
    }
    let ClipBtns = document.querySelectorAll(".ClipBtn");
    for (let i = 0; i < ClipBtns.length; i++) {
        ClipBtns[i].addEventListener("click", function (event) {
            console.log(event.target.value);
            let Id = event.target.value.split("-");
            console.log(Id);
            let Link = document.getElementById(`Clip-${Id[1]}`);
            console.log(Link);
            IframClipBuilder(Link.href);
        }, true);
    }
    text = text + "Clips by:";
    if (localmode == true) {
        LocaleText = LocaleText + "Clips by:";
    }
    clipCredit.forEach((element) => {
        text = text + ` ${element},`;
        if (localmode == true) {
            LocaleText = LocaleText + ` ${element},`;
        }
    });
    text = text.slice(0, text.length - 1);
    text = text + "\n\n" + AfterDesc;
    let Desc = document.querySelector("#myInput0");
    Desc.textContent = text;
    if (localmode == true) {
        LocaleText = LocaleText.slice(0, text.length - 1);
        LocaleText = LocaleText + "\n\n" + LocalAfterDesc;
        let localDesc = document.querySelector("#LocalDescription");
        localDesc.textContent = LocaleText;
    }
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
    if (localmode == true) {
        let Charcount = LocaleText.length;
        let p = document.querySelector(`#CharCount1`);
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
    }
    let accorddesc = document.querySelector("#accordDesc");
    accorddesc.disabled = false;
    let accordLink = document.querySelector("#accordLink");
    accordLink.disabled = false;
    if (localmode == true) {
        let accordLocal = document.querySelector("#accordLocalDesc");
        accordLocal.disabled = false;
    }
}
function IframClipBuilder(ClipLink) {
    let divPlayer = document.getElementById("IframePlayerLater");
    let menuDiv = document.getElementById("MenuLogoDiv");
    let slug = ClipLink.split("/");
    let Iframe = document.createElement("iframe");
    Iframe.setAttribute("src", `https://clips.twitch.tv/embed?clip=${slug[3]}&parent=localhost&autoplay=true&muted=true`);
    Iframe.setAttribute("frameborder", "0");
    Iframe.setAttribute("allowfullscreen", "true");
    Iframe.setAttribute("scrolling", "no");
    Iframe.setAttribute("height", "378");
    Iframe.setAttribute("width", "620");
    Iframe.setAttribute("id", "IframeClip");
    menuDiv.innerHTML = "";
    divPlayer.innerHTML = "";
    divPlayer.append(Iframe);
    divPlayer.scrollIntoView();
}
async function validateTToken() {
    console.log("Your AccessToken: " + TappAcess);
    let p = document.getElementById("AccessTokenTime");
    if (TappAcess != undefined && TappAcess != "" && TappAcess != null) {
        await fetch("https://id.twitch.tv/oauth2/validate", {
            headers: {
                Authorization: "Bearer " + TappAcess,
            },
        })
            .then((resp) => resp.json())
            .then((resp) => {
            if (resp.status) {
                if (resp.status == 401) {
                    console.log("This token ('" +
                        TappAcess +
                        "') is invalid (" +
                        resp.message +
                        ").. The Submit Button has been Disabled. you cannot use H.O.T: Highlighter without a Token! _(._. )>");
                    let Submitbtn = document.getElementById("Submit");
                    Submitbtn.disabled = true;
                    p.innerHTML = `• Your Token is invalid, try to follow H.O.T wiki for help!.`;
                    return 0;
                }
                console.log("Unexpected output with a status");
                return 0;
            }
            if (resp.client_id) {
                client_id = resp.client_id;
                console.log("Token Validated Sucessfully");
                let Time = new Date(resp.expires_in * 1000);
                let TimeStrDash = Time.toISOString().split("-");
                let TimeStrT = TimeStrDash[2].split("T");
                let TimeString = `${parseInt(TimeStrDash[1].substring(1, 2)) - 1} Month ${TimeStrT[0]} Days & ${TimeStrT[1].substring(0, 8)} Hours`;
                p.innerHTML = `• Current Token Will Expire In: <br> ${TimeString}.`;
                return 1;
            }
            console.log("unexpected Output");
            p.innerHTML = `• Your Token returned an unforseen result?.`;
            return 0;
        })
            .catch((err) => {
            console.log(err);
            return 0;
        });
        return 1;
    }
    else {
        return 0;
    }
}
async function HttpCaller(HttpCall) {
    const respon = await fetch(`${HttpCall}`, {
        headers: {
            Authorization: "Bearer " + TappAcess,
            "Client-ID": client_id,
        },
    })
        .then((respon) => respon.json())
        .then((respon) => {
        return respon;
    })
        .catch((err) => {
        console.log(err);
        return err;
    });
    return respon;
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
