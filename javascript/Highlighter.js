"use strict";
const twitch = {
    userid: "",
};
$$.api_valid();
$$.btnchar();
let selectchannel = $$.id("SelectChannel");
for (let index = 0; index < config.HIGHLIGHTER_CHANNELS.length; index++) {
    const channel = config.HIGHLIGHTER_CHANNELS[index];
    let option = $$.make("option");
    option.class = 'selectoption';
    option.value = channel;
    option.innerHTML = channel;
    selectchannel.append(option);
}
if (config.TWITCH_API_TOKEN != "" && config.TWITCH_API_TOKEN != null) {
    let input = $$.id("TwitchAccessToken");
    input.value = config.TIMESTAMP_PATH;
}
let searchhistory = $$.id("useHistory");
let searchbar = $$.id("useSearch");
searchhistory.addEventListener("click", function () {
    $$.id("SelectChannel").disabled = false;
    $$.id("InputChannel").disabled = true;
    let channelselect = $$.id("SelectChannel");
    userfind(channelselect.options[channelselect.selectedIndex].value);
}, true);
searchbar.addEventListener("click", function () {
    $$.id("SelectChannel").disabled = true;
    $$.id("InputChannel").disabled = false;
    if ($$.id("InputChannel").value.length > 5) {
        userfind($$.id("InputChannel").value);
    }
}, true);
var id;
var form = $$.query("#HighlighForm");
var errordiv = $$.id("ErrorDiv");
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    let startdate = new Date(form.date.value);
    if (startdate == "invalid date") {
        startdate = new Date();
        startdate.setDate(startdate.getdate() - 90);
        $$.log("start date was not given, getting clips from 90 days ago");
    }
    let enddate = new Date(form.endDate.value);
    let game_id = form.SelectGame.options[form.SelectGame.selectedIndex].value;
    if (game_id == "") {
        game_id = "none";
    }
    let viewcount = form.viewcount.value;
    if (viewcount == "") {
        viewcount = 1;
    }
    try {
        startdate = startdate.toISOString();
    }
    catch (error) {
        $$.log("the set date value was not allowed");
        $$.log(error);
    }
    if (enddate == "invalid date") {
        enddate = new Date();
        $$.log("end date not selected defaulting to todays date");
        enddate = enddate.toISOString();
    }
    else {
        enddate = enddate.toISOString();
    }
    let clipresp = await $$.api(`https://api.twitch.tv/helix/clips?broadcaster_id=`
        + `${twitch.userid}&first=100&started_at=${startdate}&ended_at=${enddate}`, true);
    $$.log(clipresp);
    clipsorter(clipresp, game_id, viewcount);
}, true);
var searchinput = $$.id("InputChannel");
searchinput.addEventListener("keyup", async function () {
    if (searchinput.value.length > 5) {
        userfind(searchinput.value);
    }
});
let channelselect = $$.query("#SelectChannel");
channelselect.addEventListener("change", async function () {
    let streamername = channelselect.options[channelselect.selectedIndex].value;
    if (streamername != "none") {
        userfind(channelselect.options[channelselect.selectedIndex].value);
    }
});
async function userfind(twitchlogin) {
    if (twitchlogin != "none" && twitchlogin != "") {
        $$.log("searching for " + twitchlogin);
        errordiv.innerhtml = "";
        let userresp = await $$.api(`https://api.twitch.tv/helix/users?login=${twitchlogin}`, true);
        if (userresp["data"].length == 0) {
            $$.log("user not found");
            return;
        }
        else {
            twitch.userid = userresp["data"][0]["id"];
            let d = new Date();
            let rfcdato = new Date();
            rfcdato.setDate(rfcdato.getDate() - 90);
            let gameresp = await $$.api(`https://api.twitch.tv/helix/clips?broadcaster_id=` +
                `${twitch.userid}&first=100&started_at=${rfcdato.toISOString()}` +
                `&ended_at=${d.toISOString()}`, true);
            if (gameresp["data"].length != 0) {
                $$.log(twitchlogin + " is searchable!");
                var gameids = new Set();
                for (let index = 0; index < gameresp["data"].length; index++) {
                    gameids.add(gameresp["data"][index]["game_id"]);
                }
                let httpcall = "https://api.twitch.tv/helix/games?";
                let index = 0;
                gameids.forEach((gameid) => {
                    if (index == 0) {
                        selectchannel;
                        httpcall = httpcall + "id=" + gameid;
                    }
                    else {
                        httpcall = httpcall + "&id=" + gameid;
                    }
                    index++;
                });
                let selectgameresp = await $$.api(httpcall, true);
                let selectboxg = $$.id("SelectGame");
                while (selectboxg.firstChild) {
                    selectboxg.firstChild.remove();
                }
                let optionnone = $$.make("option");
                optionnone.setAttribute("value", "none");
                optionnone.append($.createTextNode("any game id"));
                selectboxg.appendChild(optionnone);
                for (let index = 0; index < selectgameresp["data"].length; index++) {
                    let gameid = selectgameresp["data"][index]["id"];
                    let gamename = selectgameresp["data"][index]["name"];
                    let optionsg = $$.make("option");
                    optionsg.setAttribute("value", gameid);
                    optionsg.append($.createTextNode(gamename));
                    selectboxg.appendChild(optionsg);
                }
                selectboxg.disabled = false;
            }
        }
    }
}
async function clipsorter(clips, game_id, viewcount) {
    var arrclips = Array();
    let duration = 0;
    let j = 0;
    for (let i = 0; i < clips["data"]["length"]; i++) {
        var clip = clips["data"][i];
        if (game_id == "none") {
            if (clip["view_count"] > viewcount) {
                arrclips[j] = clips["data"][i];
                duration = duration + clip["duration"];
                j++;
            }
        }
        else {
            if (clip["game_id"] == game_id) {
                if (clip["view_count"] > viewcount) {
                    arrclips[j] = clips["data"][i];
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
        }
    }
    $$.log(sortcliped);
    if (config.HIGHLIGHT_SORTING == "datereverse") {
        sortcliped.reverse();
    }
    else if (config.HIGHLIGHT_SORTING == "random") {
        for (var i = sortcliped.length - 1; i > 0; i--) {
            var b = Math.floor(Math.random() * (i + 1));
            var temp = sortcliped[i];
            sortcliped[i] = sortcliped[b];
            sortcliped[b] = temp;
        }
    }
    let textnode = document.createTextNode(`‣ found: ${sortcliped.length} clips` +
        `, thats ${toTime(duration)} of content!`);
    let insertp = $$.make("p");
    insertp.appendChild(textnode);
    let datap = $$.query("#DataP");
    datap.textContent =
        "you did it! good job, heres the data from the"
            + "query(s) you did ヾ(•ω•`)o";
    let datadiv = $$.query("#DataDiv");
    datadiv.appendChild(insertp);
    let textareadiv = $$.query("#Linksarea");
    let clipcredit = new Set();
    let x = 0;
    duration = 0;
    let text = "";
    let beforedesc = await $$.txt(config.HIGHLIGHTER_BEFORE_TIMESTAMPS);
    text = text + beforedesc + "\n\n";
    let localetext = "";
    if (config.LOCALIZE_ON == true) {
        let localebeforedesc = await $$.txt(config.LOCAL_HIGHLIGHTER_BEFORE_TIMESTAMPS);
        localetext = localetext + localebeforedesc + "\n\n";
    }
    textareadiv.innerHTML = "";
    for (let i = 0; i < sortcliped.length; i++) {
        if (i == 0) {
            text = text + `• 0:00 ${sortcliped[i]["title"]}\n`;
            if (config.LOCALIZE_ON == true) {
                localetext = localetext + `• 0:00 ${sortcliped[i]["title"]}\n`;
            }
        }
        else {
            text = text + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
            if (config.LOCALIZE_ON == true) {
                localetext =
                    localetext + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
            }
        }
        duration = duration + sortcliped[i]["duration"];
        clipcredit.add(sortcliped[i]["creator_name"]);
        let rowdiv = $$.make("div");
        let button = $$.make("button");
        let a = $$.make("a");
        let p = $$.make("p");
        rowdiv.classList.add("row", "m-2", "ps-0");
        rowdiv.classList.add("linkbg");
        button.classList.add("col-3", "p-1", "btn", "clipbtn");
        button.setAttribute("value", `btn-${i}`);
        button.setAttribute("href", "#iframeplayerlater");
        a.classList.add("col-6", "cliplink");
        a.setAttribute("id", `clip-${i}`);
        a.setAttribute("target", "_blank");
        a.setAttribute("href", sortcliped[i]["url"]);
        p.classList.add("col-3", "text-center");
        button.textContent = "play clip →";
        a.text = ` ‣ clip ${i + 1} - '${sortcliped[i]["title"]}'`;
        p.append(document.createTextNode(`${sortcliped[i]["duration"]} sec/s (${toTime(duration)}in all)`));
        rowdiv.append(button);
        rowdiv.append(a);
        rowdiv.append(p);
        textareadiv.append(rowdiv);
        $$.btnchar();
    }
    let clipbtns = $.querySelectorAll(".clipbtn");
    for (let i = 0; i < clipbtns.length; i++) {
        clipbtns[i].addEventListener("click", function (event) {
            $$.log(event.target.value);
            let id = event.target.value.split("-");
            $$.log(id);
            let link = $$.id(`clip-${id[1]}`);
            $$.log(link);
            IframClipBuilder(link.href);
        }, true);
    }
    text = text + "clips by:";
    if (config.LOCALIZE_ON == true) {
        localetext = localetext + "clips by:";
    }
    clipcredit.forEach((element) => {
        text = text + ` ${element},`;
        if (config.LOCALIZE_ON == true) {
            localetext = localetext + ` ${element},`;
        }
    });
    let afterdesc = await $$.txt(config.HIGHLIGHTER_AFTER_TIMESTAMPS);
    text = text.slice(0, text.length - 1);
    text = text + "\n\n" + afterdesc;
    let desc = $$.query("#myInput0");
    desc.textContent = text;
    if (config.LOCALIZE_ON == true) {
        let localafterdesc = await $$.txt(config.LOCAL_HIGHLIGHTER_AFTER_TIMESTAMPS);
        localetext = localetext.slice(0, text.length - 1);
        localetext = localetext + "\n\n" + localafterdesc;
        let localdesc = $$.query("#LocalDescription");
        localdesc.textContent = localetext;
    }
    let charcount = text.length;
    let p = $$.query(`#CharCount0`);
    p.textContent = `${charcount}`;
    if (charcount > 5000) {
        p.setAttribute("class", "charared");
    }
    else if (charcount > 3000) {
        p.setAttribute("class", "charayellow");
    }
    else {
        p.setAttribute("class", "charagreen");
    }
    if (config.LOCALIZE_ON == true) {
        let charcount = localetext.length;
        let p = $$.query(`#CharCount1`);
        p.textContent = `${charcount}`;
        if (charcount > 5000) {
            p.setAttribute("class", "CharaRed");
        }
        else if (charcount > 3000) {
            p.setAttribute("class", "CharaYellow");
        }
        else {
            p.setAttribute("class", "CharaGreen");
        }
    }
    let accorddesc = $$.query("#accordDesc");
    accorddesc.disabled = false;
    let accordLink = $$.query("#accordLink");
    accordLink.disabled = false;
    if (config.LOCALIZE_ON == true) {
        let accordLocal = $$.query("#accordLocalDesc");
        accordLocal.disabled = false;
    }
}
function IframClipBuilder(ClipLink) {
    let divPlayer = $$.id("IframePlayerLater");
    let menuDiv = $$.id("MenuLogoDiv");
    let slug = ClipLink.split("/");
    let Iframe = $$.make("iframe");
    Iframe.setAttribute("src", `https://clips.twitch.tv/embed?clip=${slug[3]}` +
        `&parent=localhost&autoplay=true&muted=true`);
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
    let H4 = $$.make("h4");
    let p = $$.make("p");
    H4.classList.add(`${color}`);
    p.classList.add(`${color}`);
    H4.innerHTML = Msg;
    p.innerText = systemMsg;
    errordiv.append(H4);
    errordiv.append(p);
}
