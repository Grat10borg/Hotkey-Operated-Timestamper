"use strict";
let Clipoffset = 26;
let TimestampTxt = document.getElementById("TimestampTxt");
let RawTxt = TimestampTxt.innerHTML;
let HotV = "V-1.0";
var AppAcessToken = "bzs6p3k7o39u8bv6y3hotdi1dszdlw";
let client_id2 = 0;
var AclientId = "";
let StreamerName = "grat_grot10_berg";
var TwitchConnected = false;
var MultiDimStreamArr = Array();
var MultiDimRecordArr = Array();
var StreamDatesArr = Array();
var RecordDatesArr = Array();
var DescArrS = new Array();
var DescArrR = new Array();
validateToken();
if (CutOuts(RawTxt) == 1) {
    if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
        if (DomSet() == 1) {
        }
        else {
            console.log("Failed Placing Things in the Websites");
        }
    }
    else {
        console.log("Error Creating Description");
    }
}
else {
    console.log("Error Sorting Timestamps");
}
let TwitchClip = document.getElementById("TwitchClip");
TwitchClip.addEventListener("click", async function (event) {
    if (TwitchConnected == true) {
        let UserIdResp = await HttpCalling(`https://api.twitch.tv/helix/users?login=${StreamerName}`);
        let UserVods = await HttpCalling(`https://api.twitch.tv/helix/videos?user_id=${UserIdResp["data"][0]["id"]}`);
        let TwitchStreamedDate = Array();
        let FullDateTwitch = Array();
        for (let index = 0; index < UserVods["data"].length; index++) {
            if (UserVods["data"][index]["type"] == "highlight") {
                continue;
            }
            else {
                let Timestamps = UserVods["data"][index]["published_at"].split("T");
                FullDateTwitch.push(UserVods["data"][index]["published_at"]);
                TwitchStreamedDate.push(Timestamps[0]);
            }
        }
        let AcorBtns = document.getElementsByClassName("accordion-button");
        let StreamedDate = Array();
        for (let index = 0; index < AcorBtns.length; index++) {
            let Timestamps = AcorBtns[index].innerHTML.split(" ");
            StreamedDate.push(Timestamps[0]);
        }
        let Aproved_StreamTime = Array();
        let StreamIndex = Array();
        for (let i = 0; i < TwitchStreamedDate.length; i++) {
            for (let index = 0; index < StreamedDate.length; index++) {
                if (TwitchStreamedDate[i] == StreamedDate[index]) {
                    console.log(TwitchStreamedDate[i] + " == " + StreamedDate[index]);
                    Aproved_StreamTime.push(StreamedDate.indexOf(TwitchStreamedDate[i]));
                    console.log(TwitchStreamedDate);
                    StreamIndex.push(i);
                }
            }
        }
        for (let index = 0; index < Aproved_StreamTime.length; index++) {
            let AcordBtn = document.getElementById(`AcordBtn-${Aproved_StreamTime[index]}`);
            AcordBtn.innerHTML = `${TwitchStreamedDate[StreamIndex[index]]} - ${UserVods["data"][StreamIndex[index]]["title"]}`;
        }
        let d = new Date();
        let RFCdato = new Date();
        RFCdato.setDate(RFCdato.getDate() - 35);
        let http2 = `https://api.twitch.tv/helix/clips?broadcaster_id=${UserIdResp["data"][0]["id"]}&first=100&started_at=${RFCdato.toISOString()}&ended_at=${d.toISOString()}`;
        let resp = await HttpCalling(http2);
        let MultiStreamClips = Array();
        for (let index = 0; index < TwitchStreamedDate.length; index++) {
            let DayDate = TwitchStreamedDate[index].split("T");
            let Clips = Array();
            for (let i = 0; i < resp["data"].length; i++) {
                let TestDate = Array();
                if (resp["data"][i]["creator_name"] == StreamerName) {
                    let str = resp["data"][i]["created_at"];
                    TestDate = str.split("T");
                }
                if (DayDate[0] == TestDate[0]) {
                    Clips.push(resp["data"][i]);
                }
            }
            MultiStreamClips.push(Clips);
        }
        let StreamDateTimer = Array();
        for (let index = 0; index < FullDateTwitch.length; index++) {
            StreamDateTimer.push(parseISOString(FullDateTwitch[index]));
        }
        for (let index = 0; index < TwitchStreamedDate.length; index++) {
            let Desc = document.getElementById(`myInput${index}`);
            if (Desc.innerHTML.search(TwitchStreamedDate[StreamIndex[index]]) != -1) {
                console.log("did not find: " + TwitchStreamedDate[StreamIndex[index]] + " in acord button");
                index++;
                continue;
            }
            for (let i = 0; i < MultiStreamClips[StreamIndex[index]].length; i++) {
                Desc.innerHTML = Desc.innerHTML.replace(`[ClipNo${i}]`, MultiStreamClips[StreamIndex[index]][i]["title"]);
            }
        }
    }
    else {
        validateToken();
        console.log("Token was not validated try again..");
    }
});
function CutOuts(RawTxt) {
    let RawTxtArr = RawTxt.split("\n");
    let StreamArr = Array();
    let RecordArr = Array();
    var Catch = false;
    var LineScene = "";
    let ClipNo = 0;
    let xs = 0;
    let xr = 0;
    for (let index = 0; index < RawTxtArr.length; index++) {
        let Word = RawTxtArr[index];
        if (Word.match(/EVENT:START.*/i)) {
            if (Word.match(/.*Record.*/i)) {
                let resarr = Word.split(" ");
                RecordDatesArr.push(resarr[3] + " " + resarr[4]);
            }
            else if (Word.match(/.*Stream.*/i)) {
                let resarr = Word.split(" ");
                StreamDatesArr.push(resarr[3] + " " + resarr[4]);
            }
            continue;
        }
        if (Word.match(/EVENT:STOP.*/i)) {
            if (typeof StreamArr !== "undefined") {
                if (StreamArr.length != 0) {
                    StreamArr.unshift("▸ 0:00 Start");
                    MultiDimStreamArr[xs] = StreamArr;
                    xs++;
                }
            }
            if (typeof RecordArr !== "undefined") {
                if (RecordArr.length != 0) {
                    RecordArr.unshift("▸ 0:00 Start");
                    MultiDimRecordArr[xr] = RecordArr;
                    xr++;
                }
            }
            StreamArr = [];
            RecordArr = [];
            ClipNo = 0;
            continue;
        }
        if (Word.match(/EVENT:SCENE.*/i)) {
            let resarr = Word.split(" ");
            LineScene = resarr[3];
            Catch = true;
            continue;
        }
        if (Catch == true) {
            if (to2Time(Word) != "0:00") {
                if (Word.match(/\d:\d\d:\d\d\s.*/i)) {
                    if (Word.match(/.*Record.*/i)) {
                        let Timestamp = "▸ " + to2Time(Word) + " " + LineScene;
                        RecordArr.push(Timestamp);
                    }
                    if (Word.match(/.*Stream.*/i)) {
                        let Timestamp = "▸ " + to2Time(Word) + " " + LineScene;
                        StreamArr.push(Timestamp);
                        Catch = false;
                    }
                    continue;
                }
            }
        }
        else if (Word.search(/0:00:00.*/i) != 0) {
            if (Word.match(/.*Record.*/i)) {
                let Timestamp = "• " + to2Time(AddClipDelay(Word, Clipoffset)) + ` [ClipNo${ClipNo}]`;
                ClipNo++;
                RecordArr.push(Timestamp);
            }
            if (Word.match(/.*Stream.*/i)) {
                let Timestamp = "• " + to2Time(AddClipDelay(Word, Clipoffset)) + ` [ClipNo${ClipNo}]`;
                ClipNo++;
                StreamArr.push(Timestamp);
            }
            else {
                continue;
            }
        }
    }
    if (typeof MultiDimStreamArr != "undefined" &&
        MultiDimStreamArr != null &&
        MultiDimStreamArr.length != null &&
        MultiDimStreamArr.length > 0) {
        return 1;
    }
    else if (typeof MultiDimRecordArr != "undefined" &&
        MultiDimRecordArr != null &&
        MultiDimRecordArr.length != null &&
        MultiDimRecordArr.length > 0) {
        return 1;
    }
    else {
        return 0;
    }
}
function SetOps(MultiDimStreamArr, MultiDimRecordArr) {
    let res = document.getElementById("DescTxt");
    let res1 = document.getElementById("IntroTxt");
    let res2 = document.getElementById("SocialTxt");
    let res3 = document.getElementById("CreditsTxt");
    let DescTxt = res.innerHTML;
    let IntroTxt = res1.innerHTML;
    let SocialTxt = res2.innerHTML;
    let CreditsTxt = res3.innerHTML;
    var Description = "";
    if (MultiDimStreamArr.length > 0) {
        for (let index = 0; index < MultiDimStreamArr.length; index++) {
            let resArray = MultiDimStreamArr[index];
            Description = DescTxt + "\n\n";
            Description =
                Description +
                    `Hotkey, Operated, Time-stamper (H.O.T) ${HotV} \n(Clips are Offset by -${Clipoffset})\n`;
            for (let i = 0; i < resArray.length; i++) {
                let timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description =
                Description +
                    "\n" +
                    IntroTxt +
                    "\n\n" +
                    SocialTxt +
                    "\n\n" +
                    CreditsTxt;
            DescArrS.push(Description);
            Description = "";
        }
        return 1;
    }
    else if (MultiDimRecordArr.length > 0) {
        for (let index = 0; index < MultiDimRecordArr.length; index++) {
            let resArray = MultiDimRecordArr[index];
            Description = DescTxt + "\n\n";
            for (let i = 0; i < resArray.length; i++) {
                let timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description =
                Description +
                    "\n\n" +
                    IntroTxt +
                    "\n\n" +
                    SocialTxt +
                    "\n\n" +
                    CreditsTxt;
            DescArrR.push(Description);
            Description = "";
        }
        return 1;
    }
    else {
        console.log("Both Stream and Recording Arrays returned Nothing.");
        return 0;
    }
}
function DomSet() {
    DescArrS.reverse();
    DescArrR.reverse();
    StreamDatesArr.reverse();
    RecordDatesArr.reverse();
    let SidebarDiv = document.getElementById("SideBar");
    let nav = document.createElement("nav");
    let ul = document.createElement("ul");
    if (DescArrS.length > 0) {
        let liSeparate = document.createElement("li");
        let aSeprate = document.createElement("a");
        aSeprate.classList.add("nav-link", "text-center");
        aSeprate.setAttribute("href", "#Stream");
        aSeprate.innerHTML = "# Streams";
        liSeparate.classList.add("RecordStreamli", "rounded");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (let index = 0; index < DescArrS.length; index++) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.innerHTML = `> - Stream - ${index + 1}`;
            a.setAttribute("href", `#Stream-${index}`);
            a.classList.add("nav-link", "text-center");
            li.classList.add("rounded");
            li.append(a);
            ul.append(li);
        }
        SetIns(DescArrS, StreamDatesArr, "Stream");
    }
    else if (DescArrS.length < 0) {
        console.log("No stream Timestamps found");
    }
    if (DescArrR.length > 0) {
        let liSeparate = document.createElement("li");
        let aSeprate = document.createElement("a");
        aSeprate.classList.add("nav-link", "text-center");
        aSeprate.setAttribute("href", "#Record");
        aSeprate.innerHTML = "# Recordings";
        liSeparate.classList.add("RecordStreamli");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (let index = 0; index < DescArrR.length; index++) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.innerHTML = `> - Record - ${index + 1}`;
            a.setAttribute("href", `#Record-${index}`);
            a.classList.add("nav-link", "text-center");
            li.append(a);
            ul.append(li);
        }
        SetIns(DescArrR, RecordDatesArr, "Record");
    }
    else {
        console.log("No recording Timestamps found");
    }
    nav.append(ul);
    SidebarDiv.append(nav);
    return 1;
}
function SetIns(DescArr, DatesArr, string) {
    var DescDiv = document.getElementById("DescriptionAreaDiv");
    for (let index = 0; index < DescArr.length; index++) {
        let AcordDiv = document.createElement("div");
        AcordDiv.classList.add("accordion", "mt-4");
        let AcordItem = document.createElement("div");
        AcordItem.classList.add("accordion-item");
        AcordItem.setAttribute("id", `${string}-${index}`);
        let AcordBody = document.createElement("div");
        AcordBody.classList.add("accordion-body");
        let h2 = document.createElement("h2");
        h2.classList.add("accordion-header");
        let button = document.createElement("button");
        button.classList.add("accordion-button", "btn", "collapsed");
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#collapse${index}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `collapse${index}`);
        button.setAttribute("id", `AcordBtn-${index}`);
        let collapsedDiv = document.createElement("div");
        collapsedDiv.classList.add("accordion-collapse", "collapse");
        collapsedDiv.setAttribute("id", `collapse${index}`);
        collapsedDiv.setAttribute("data-bs-parent", `#accordion${index}`);
        let CharDiv = document.createElement("div");
        CharDiv.classList.add("d-flex", "justify-content-between");
        let PNo = document.createElement("p");
        PNo.setAttribute("id", `CharCount${index}`);
        PNo.innerHTML = "Test";
        let h4 = document.createElement("h4");
        h4.innerHTML = `# Suggested Description`;
        let Textarea = document.createElement("textarea");
        Textarea.classList.add("d-flex", "m-1", "res", "form-control", "Textarea");
        Textarea.innerHTML = DescArr[index];
        Textarea.setAttribute("id", `myInput${index}`);
        button.innerHTML = DatesArr[index] + ` - ${string}`;
        let TwitchIcon = document.createElement("img");
        TwitchIcon.setAttribute("src", "img\\TwitchIconsmol.png");
        TwitchIcon.classList.add("imgIcon");
        let TwitchIcon2 = document.createElement("img");
        TwitchIcon2.setAttribute("src", "img\\TwitchIconsmol.png");
        TwitchIcon2.classList.add("imgIcon");
        let YoutubeIcon = document.createElement("img");
        YoutubeIcon.setAttribute("src", "img\\Youtube.png");
        YoutubeIcon.classList.add("imgIcon");
        let ButtonDiv = document.createElement("div");
        let SelectBtn = document.createElement("button");
        let CopyBtn = document.createElement("button");
        let YoutubeBtn = document.createElement("button");
        ButtonDiv.classList.add("my-3");
        YoutubeBtn.innerHTML = "Update YT Vid";
        CopyBtn.innerHTML = "Copy Text";
        SelectBtn.innerHTML = "Select Text";
        SelectBtn.classList.add("btn", "mx-1", "Select", "button");
        CopyBtn.classList.add("btn", "mx-1", "Copy", "button");
        YoutubeBtn.classList.add("btn", "mx-1", "Send", "button");
        YoutubeBtn.setAttribute("id", "authbtn");
        SelectBtn.setAttribute("value", `${index}`);
        CopyBtn.setAttribute("value", `${index}`);
        YoutubeBtn.setAttribute("value", `${index}`);
        h2.append(button);
        AcordItem.append(h2);
        CharDiv.append(h4);
        CharDiv.append(PNo);
        AcordBody.append(CharDiv);
        AcordBody.append(Textarea);
        SelectBtn.append(TwitchIcon);
        CopyBtn.append(TwitchIcon2);
        YoutubeBtn.append(YoutubeIcon);
        ButtonDiv.append(SelectBtn);
        ButtonDiv.append(CopyBtn);
        ButtonDiv.append(YoutubeBtn);
        AcordBody.append(ButtonDiv);
        collapsedDiv.append(AcordBody);
        AcordItem.append(collapsedDiv);
        AcordDiv.append(AcordItem);
        DescDiv.append(AcordDiv);
    }
}
function AddClipDelay(timestamp, Clipoffset) {
    let res = timestamp.split(" ");
    let DigitA = res[0].split(":");
    DigitA[2] = DigitA[2] - Clipoffset;
    if (DigitA[2] < 0) {
        if (DigitA[1] != "00") {
            DigitA[1] = DigitA[1] - 1;
            DigitA[2] = DigitA[2] + 60;
            if (DigitA[1] < 9) {
                DigitA[1] = "0" + DigitA[1];
            }
            if (DigitA[2] < 9) {
                DigitA = "0" + DigitA[2];
            }
        }
        else if (DigitA[0] != 0) {
            DigitA[0] = DigitA[0] - 1;
            DigitA[1] = DigitA[1] + 59;
            DigitA[2] = DigitA[2] + 60;
            if (DigitA[1] < 9) {
                DigitA[1] = "0" + DigitA[1];
            }
            if (DigitA[2] < 9) {
                DigitA[2] = "0" + DigitA[2];
            }
        }
        else {
            DigitA[2] = "00";
            return DigitA[0] + ":" + DigitA[1] + ":" + DigitA[2];
        }
    }
    if (DigitA[2] < 9) {
        return DigitA[0] + ":" + DigitA[1] + ":0" + DigitA[2];
    }
    return DigitA[0] + ":" + DigitA[1] + ":" + DigitA[2];
}
function to2Time(timestamp) {
    let res = timestamp.split(" ");
    let DigitA = res[0].split(":");
    if (DigitA[0] == "0") {
        if (DigitA[1].match(/0\d/i)) {
            if (DigitA[1].match(/00/i)) {
                DigitA[1] = DigitA[1].replace("00", "0");
                return DigitA[1] + ":" + DigitA[2];
            }
            DigitA[1] = DigitA[1].replace("0", "");
            return DigitA[1] + ":" + DigitA[2];
        }
        else {
            return DigitA[1] + ":" + DigitA[2];
        }
    }
    else {
        return res[0];
    }
}
function ErrorMessage(string, Err) {
    alert(string + +"'' " + Err + " ''");
}
function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
async function validateToken() {
    await fetch("https://id.twitch.tv/oauth2/validate", {
        headers: {
            Authorization: "Bearer " + AppAcessToken,
        },
    })
        .then((resp) => resp.json())
        .then((resp) => {
        if (resp.status) {
            if (resp.status == 401) {
                console.log("This token is invalid ... " + resp.message);
                return 0;
            }
            console.log("Unexpected output with a status");
            return 0;
        }
        if (resp.client_id) {
            AclientId = resp.client_id;
            TwitchConnected = true;
            console.log("Token Validated Sucessfully");
            return 1;
        }
        console.log("unexpected Output");
        return 0;
    })
        .catch((err) => {
        console.log(err);
        return 0;
    });
    return 1;
}
async function HttpCalling(HttpCall) {
    const respon = await fetch(`${HttpCall}`, {
        headers: {
            Authorization: "Bearer " + AppAcessToken,
            "Client-ID": AclientId,
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
