"use strict";
let userid = "";
let client_id = "";
$$.api_valid();
$$.btnchar();
let selectchannel = $$.id("selectchannel");
for (let index = 0; index < config.highlighter_channels.length; index++) {
    const channel = config.highlighter_channels[index];
    let option = $$.make("option");
    option.class = 'selectoption';
    option.value = channel;
    option.innerhtml = channel;
    selectchannel.append(option);
}
if (config.twitch_api_token != "" && config.twitch_api_token != null) {
    let input = $$.id("twitchaccesstoken");
    input.value = config.timestamp_path;
}
let searchhistory = $$.id("usehistory");
let searchbar = $$.id("usesearch");
searchhistory.addeventlistener("click", function () {
    $$.id("selectchannel").disabled = false;
    $$.id("inputchannel").disabled = true;
    userfind($$.id("selectchannel").options[$$.id("selectchannel").selectedindex].value);
}, true);
searchbar.addeventlistener("click", function () {
    $$.id("selectchannel").disabled = true;
    $$.id("inputchannel").disabled = false;
    if ($$.id("inputchannel").value.length > 5) {
        userfind($$.id("inputchannel").value);
    }
}, true);
var id;
var form = $$.query("#highlighform");
var errordiv = $$.id("errordiv");
form.addeventlistener("submit", async function (event) {
    event.preventdefault();
    let startdate = new date(form.date.value);
    if (startdate == "invalid date") {
        startdate = new date();
        startdate.setdate(startdate.getdate() - 90);
        $$.log("start date was not given, getting clips from 90 days ago");
    }
    let enddate = new date(form.enddate.value);
    let game_id = form.selectgame.options[form.selectgame.selectedindex].value;
    if (game_id == "") {
        game_id = "none";
    }
    let viewcount = form.viewcount.value;
    if (viewcount == "") {
        viewcount = 1;
    }
    try {
        startdate = startdate.toisostring();
    }
    catch (error) {
        $$.log("the set date value was not allowed");
        $$.log(error);
    }
    if (enddate == "invalid date") {
        enddate = new date();
        $$.log("end date not selected defaulting to todays date");
        enddate = enddate.toisostring();
    }
    else {
        enddate = enddate.toisostring();
    }
    let clipresp = await $$.api(`https://api.twitch.tv/helix/clips?broadcaster_id=`
        + `${userid}&first=100&started_at=${startdate}&ended_at=${enddate}`, true);
    $$.log(clipresp);
    clipsorter(clipresp, game_id, viewcount);
}, true);
var searchinput = $$.id("inputchannel");
searchinput.addeventlistener("keyup", async function () {
    if (searchinput.value.length > 5) {
        userfind(searchinput.value);
    }
});
let channelselect = $$.query("#selectchannel");
channelselect.addeventlistener("change", async function () {
    let streamername = channelselect.options[channelselect.selectedindex].value;
    if (streamername != "none") {
        userfind(channelselect.options[channelselect.selectedindex].value);
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
            userid = userresp["data"][0]["id"];
            let d = new date();
            let rfcdato = new date();
            rfcdato.setdate(rfcdato.getdate() - 90);
            let gameresp = await $$.api(`https://api.twitch.tv/helix/clips?broadcaster_id=` +
                `${userid}&first=100&started_at=${rfcdato.toisostring()}` +
                `&ended_at=${d.toisostring()}`, true);
            if (gameresp["data"].length != 0) {
                $$.log(twitchlogin + " is searchable!");
                var gameids = new set();
                for (let index = 0; index < gameresp["data"].length; index++) {
                    gameids.add(gameresp["data"][index]["game_id"]);
                }
                let httpcall = "https://api.twitch.tv/helix/games?";
                let index = 0;
                gameids.foreach((gameid) => {
                    if (index == 0) {
                        httpcall = httpcall + "id=" + gameid;
                    }
                    else {
                        httpcall = httpcall + "&id=" + gameid;
                    }
                    index++;
                });
                let selectgameresp = await $$.api(httpcall, true);
                let selectboxg = $$.id("selectgame");
                while (selectboxg.firstchild) {
                    selectboxg.firstchild.remove();
                }
                let optionnone = $$.make("option");
                optionnone.setattribute("value", "none");
                optionnone.append($.createtextnode("any game id"));
                selectboxg.appendchild(optionnone);
                for (let index = 0; index < selectgameresp["data"].length; index++) {
                    let gameid = selectgameresp["data"][index]["id"];
                    let gamename = selectgameresp["data"][index]["name"];
                    let optionsg = $$.make("option");
                    optionsg.setattribute("value", gameid);
                    optionsg.append($.createtextnode(gamename));
                    selectboxg.appendchild(optionsg);
                }
                selectboxg.disabled = false;
            }
        }
    }
}
async function clipsorter(clips, game_id, viewcount) {
    var arrclips = array();
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
    let datemsec = array();
    for (let index = 0; index < arrclips.length; index++) {
        datemsec[index] = date.parse(`${arrclips[index]["created_at"]}`);
    }
    datemsec.sort(function (a, b) {
        return a - b;
    });
    let datesort = array();
    for (let index = 0; index < datemsec.length; index++) {
        let d = new date(datemsec[index]);
        let s = d.toisostring();
        let a = s.split(".000");
        datesort[index] = a[0] + a[1];
    }
    let sortcliped = array();
    for (let index = 0; index < datesort.length; index++) {
        for (let index2 = 0; index2 < arrclips.length; index2++) {
            if (arrclips[index2]["created_at"].indexof(datesort[index]) == 0) {
                sortcliped[index] = arrclips[index2];
                continue;
            }
        }
    }
    $$.log(sortcliped);
    if (config.highlight_sorting == "datereverse") {
        sortcliped.reverse();
    }
    else if (config.highlight_sorting == "random") {
        for (var i = sortcliped.length - 1; i > 0; i--) {
            var b = math.floor(math.random() * (i + 1));
            var temp = sortcliped[i];
            sortcliped[i] = sortcliped[b];
            sortcliped[b] = temp;
        }
    }
    let textnode = document.createtextnode(`‣ found: ${sortcliped.length} clips` +
        `, thats ${totime(duration)} of content!`);
    let insertp = $$.make("p");
    insertp.appendchild(textnode);
    let datap = $$.query("#datap");
    datap.textcontent =
        "you did it! good job, heres the data from the"
            + "query(s) you did ヾ(•ω•`)o";
    let datadiv = $$.query("#datadiv");
    datadiv.appendchild(insertp);
    let textareadiv = $$.query("#linksarea");
    let clipcredit = new set();
    let x = 0;
    duration = 0;
    let text = "";
    let beforedesc = await $$.txt(config.highlighter_before_timestamps);
    text = text + beforedesc + "\n\n";
    let localetext = "";
    if (config.localize_on == true) {
        let localebeforedesc = await $$.txt(config.local_highlighter_before_timestamps);
        localetext = localetext + localebeforedesc + "\n\n";
    }
    textareadiv.innerhtml = "";
    for (let i = 0; i < sortcliped.length; i++) {
        if (i == 0) {
            text = text + `• 0:00 ${sortcliped[i]["title"]}\n`;
            if (config.localize_on == true) {
                localetext = localetext + `• 0:00 ${sortcliped[i]["title"]}\n`;
            }
        }
        else {
            text = text + `• ${totime(duration)} ${sortcliped[i]["title"]}\n`;
            if (config.localize_on == true) {
                localetext =
                    localetext + `• ${totime(duration)} ${sortcliped[i]["title"]}\n`;
            }
        }
        duration = duration + sortcliped[i]["duration"];
        clipcredit.add(sortcliped[i]["creator_name"]);
        let rowdiv = $$.make("div");
        let button = $$.make("button");
        let a = $$.make("a");
        let p = $$.make("p");
        rowdiv.classlist.add("row", "m-2", "ps-0");
        rowdiv.classlist.add("linkbg");
        button.classlist.add("col-3", "p-1", "btn", "clipbtn");
        button.setattribute("value", `btn-${i}`);
        button.setattribute("href", "#iframeplayerlater");
        a.classlist.add("col-6", "cliplink");
        a.setattribute("id", `clip-${i}`);
        a.setattribute("target", "_blank");
        a.setattribute("href", sortcliped[i]["url"]);
        p.classlist.add("col-3", "text-center");
        button.textcontent = "play clip →";
        a.text = ` ‣ clip ${i + 1} - '${sortcliped[i]["title"]}'`;
        p.append(document.createtextnode(`${sortcliped[i]["duration"]} sec/s (${totime(duration)}in all)`));
        rowdiv.append(button);
        rowdiv.append(a);
        rowdiv.append(p);
        textareadiv.append(rowdiv);
        $$.btnchar();
    }
    let clipbtns = $.queryselectorall(".clipbtn");
    for (let i = 0; i < clipbtns.length; i++) {
        clipbtns[i].addeventlistener("click", function (event) {
            $$.log(event.target.value);
            let id = event.target.value.split("-");
            $$.log(id);
            let link = $$.id(`clip-${id[1]}`);
            $$.log(link);
            iframclipbuilder(link.href);
        }, true);
    }
    text = text + "clips by:";
    if (config.localize_on == true) {
        localetext = localetext + "clips by:";
    }
    clipcredit.foreach((element) => {
        text = text + ` ${element},`;
        if (config.localize_on == true) {
            localetext = localetext + ` ${element},`;
        }
    });
    let afterdesc = await $$.txt(config.highlighter_after_timestamps);
    text = text.slice(0, text.length - 1);
    text = text + "\n\n" + afterdesc;
    let desc = $$.query("#myinput0");
    desc.textcontent = text;
    if (config.localize_on == true) {
        let localafterdesc = await $$.txt(config.local_highlighter_after_timestamps);
        localetext = localetext.slice(0, text.length - 1);
        localetext = localetext + "\n\n" + localafterdesc;
        let localdesc = $$.query("#localdescription");
        localdesc.textcontent = localetext;
    }
    let charcount = text.length;
    let p = $$.query(`#charcount0`);
    p.textcontent = `${charcount}`;
    if (charcount > 5000) {
        p.setattribute("class", "charared");
    }
    else if (charcount > 3000) {
        p.setattribute("class", "charayellow");
    }
    else {
        p.setattribute("class", "charagreen");
    }
    if (config.localize_on == true) {
        let charcount = localetext.length;
        let p = $$.query(`#charcount1`);
        p.textcontent = `${charcount}`;
        if (charcount > 5000) {
            p.setAttribute("class", "CharaRed");
        }
        else if (Charcount > 3000) {
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
    ErrorDiv.append(H4);
    ErrorDiv.append(p);
}
