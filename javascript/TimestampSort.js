"use strict";
let HotV = "V-1.0";
let TimestampTxt = document.getElementById("TimestampTxt");
let PKey = document.getElementById("TwitchKey");
let PClip = document.getElementById("ClipOffset");
let PLogin = document.getElementById("TwitchLogin");
let Plocal = document.getElementById("Local");
let RawTxt;
var AppAcessToken;
let Clipoffset;
let StreamerName;
var SettingsLocal;
if (TimestampTxt != null) {
    RawTxt = TimestampTxt.innerHTML;
}
else {
    console.log("Your Timestamp.Txt was not found!, check if the filepath is correct or if it doesnt have data in it!");
}
if (PKey != null) {
    AppAcessToken = PKey.innerHTML;
}
else {
    console.log("H.O.T could not get your TwitchKey, you will not be able to use Clip-Stamps");
    let TwitchClipbtn = document.getElementById("TwitchClip");
    TwitchClipbtn.disabled = true;
}
if (PClip != null) {
    Clipoffset = parseInt(PClip.innerHTML);
}
else {
    console.log("you didnt set a ClipOffset, H.O.T has defaulted to 26 seconds of offset.");
    Clipoffset = 26;
}
if (PLogin != null) {
    StreamerName = PLogin.innerHTML;
}
else {
    console.log("you didnt set a TwitchLoginName, you will not be able to use Clip-Stamps");
    let TwitchClipbtn = document.getElementById("TwitchClip");
    TwitchClipbtn.disabled = true;
}
if (Plocal != null) {
    SettingsLocal = Plocal.innerHTML;
}
else {
    console.log("LocalSettings not found Turning off Local Mode");
    SettingsLocal = "";
}
var AclientId = "";
var TwitchConnected = false;
var MultiDimStreamArr = Array();
var MultiDimRecordArr = Array();
var StreamDatesArr = Array();
var RecordDatesArr = Array();
var DescArrS = new Array();
var LocalDescArrS = new Array();
var DescArrR = new Array();
var LocalDescArrR = new Array();
var StreamDatesRaw = new Array();
validateToken();
if (RawTxt != undefined && RawTxt != "" && RawTxt != null) {
    if (CutOuts(RawTxt) == 1) {
        if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
            let statsP = document.getElementById("Stats");
            statsP.innerHTML = `• Found ${MultiDimStreamArr.length} Streams, and ${MultiDimRecordArr.length} Recordings`;
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
}
let TwitchClip = document.getElementById("TwitchClip");
TwitchClip.addEventListener("click", async function (event) {
    if (TwitchConnected == true) {
        let UserIdResp = await HttpCalling(`https://api.twitch.tv/helix/users?login=${StreamerName}`);
        let AcorBtns = Array();
        let StreamedDate = Array();
        for (let index = 0; index < StreamDatesArr.length; index++) {
            AcorBtns.push(document.getElementById(`AcordBtn-${index}`));
        }
        for (let index = 0; index < AcorBtns.length; index++) {
            let Timestamps = AcorBtns[index].innerHTML.split(" ");
            StreamedDate.push(Timestamps[5] + "T" + Timestamps[6] + ".000Z");
        }
        let VODcount = 0;
        let UserVods = (await HttpCalling(`https://api.twitch.tv/helix/videos?user_id=${UserIdResp["data"][0]["id"]}`));
        for (let index = 0; index < UserVods["data"].length; index++) {
            if (UserVods["data"][index]["type"] != "highlight") {
                VODcount++;
            }
        }
        for (let StreamsStreamed = 0; StreamsStreamed < StreamedDate.length; StreamsStreamed++) {
            if (VODcount != 0 || VODcount != null) {
                let res = AcorBtns[StreamsStreamed].innerHTML.split(" ");
                var MultidimClipResps = SortClips(await GetClipsFromDate(res[5], UserIdResp["data"][0]["id"]), false);
                var TimestampTwitch = Array();
                let TimeTwitch = Array();
                let LocalSceneShift = Array();
                let LocalSceneTime = Array();
                let LocalSceneShifttemp = Array();
                for (let V = 0; V < MultiDimStreamArr[StreamsStreamed].length; V++) {
                    let res = MultiDimStreamArr[V];
                    if (res == undefined) {
                        continue;
                    }
                    else {
                        for (let i = 0; i < res.length; i++) {
                            let Timestamp = res[i];
                            if (Timestamp.match(/▸.*/i)) {
                                LocalSceneShift.push(Timestamp);
                                let R = Timestamp.split(" ");
                                LocalSceneTime.push(R[1]);
                            }
                        }
                        LocalSceneShifttemp = LocalSceneShift;
                        LocalSceneShift = Array();
                    }
                }
                console.log(MultidimClipResps);
                let ClipDates = SortClips(MultidimClipResps, true);
                for (let i = 0; i < MultidimClipResps.length; i++) {
                    let ClipTimestamp = "";
                    if (MultidimClipResps[i]["vod_offset"] != null && MultidimClipResps[i]["vod_offset"] != "") {
                        ClipTimestamp = SectoTimestamp(MultidimClipResps[i]["vod_offset"]);
                    }
                    else {
                        ClipTimestamp = GetClipVODOffsetFromDate(StreamedDate[StreamsStreamed], ClipDates[i].toISOString());
                    }
                    TimestampTwitch.push("• " +
                        ClipTimestamp +
                        " " +
                        MultidimClipResps[i]["title"]);
                }
                let TimestampArr = Array();
                TimestampArr = LocalSceneShifttemp.concat(TimestampTwitch);
                let SortTime = Array();
                for (let q = 0; q < TimestampArr.length; q++) {
                    let res = TimestampArr[q].split(" ");
                    SortTime.push(TimestampToDate(res[1]));
                }
                SortTime.sort();
                let Timestamps = Array();
                for (let t = 0; t < SortTime.length; t++) {
                    let T = SortTime[t].toString().split(" ");
                    let TestHour = T[4].split(":");
                    let Timestamp;
                    if (TestHour[0][0] == "0") {
                        Timestamp = to2Time(T[4].substring(1));
                        Timestamps.push(Timestamp);
                    }
                    else {
                        Timestamp = to2Time(T[4]);
                        Timestamps.push(Timestamp);
                    }
                }
                let CompleteTimestampArr = Array();
                for (let Pie = 0; Pie < Timestamps.length; Pie++) {
                    let Reg = new RegExp(Timestamps[Pie] + ".*");
                    for (let u = 0; u < TimestampArr.length; u++) {
                        if (TimestampArr[u].match(Reg)) {
                            CompleteTimestampArr.push(TimestampArr[u]);
                            break;
                        }
                    }
                }
                DescriptionReplace(CompleteTimestampArr, StreamsStreamed);
                ChangeAcordButtonNames(MultidimClipResps, StreamsStreamed, AcorBtns);
            }
            else {
                console.log("Getting clips for streams without VODs");
            }
        }
    }
    else {
        console.log("Failed to Validate Token Try Again");
        validateToken();
    }
});
function GetClipVODOffsetFromDate(StreamDate, ClipedDate) {
    let StreamDateTime = parseISOString(StreamDate);
    let ClipDateTime = parseISOString(ClipedDate);
    var secounds = (StreamDateTime.getTime() - ClipDateTime.getTime()) / 1000;
    if (secounds < 0) {
        secounds = Math.abs(secounds);
    }
    return SectoTimestamp(secounds);
}
async function DescriptionReplace(TimestampsArr, Index) {
    let Desc = document.getElementsByClassName(`Charcounts`);
    var NewDesc = "";
    var LNewDesc = "";
    if (SettingsLocal != false && SettingsLocal != "false") {
        let res = document.getElementById("LocalBeforeDesc");
        let res1 = document.getElementById("LocalAfterDesc");
        let res2 = document.getElementById("BeforeDesc");
        let res3 = document.getElementById("AfterDesc");
        let BeforeDescL = res.innerHTML;
        let AfterDescL = res1.innerHTML;
        let BeforeDesc = res2.innerHTML;
        let AfterDesc = res3.innerHTML;
        let resArray = TimestampsArr;
        LNewDesc = BeforeDescL + "\n\n";
        LNewDesc = LNewDesc + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
        NewDesc = BeforeDesc + "\n\n";
        NewDesc = NewDesc + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
        for (let i = 0; i < resArray.length; i++) {
            let timestamp = resArray[i];
            LNewDesc = LNewDesc + timestamp + "\n";
            NewDesc = NewDesc + timestamp + "\n";
        }
        LNewDesc = LNewDesc + "\n" + AfterDescL;
        NewDesc = NewDesc + "\n" + AfterDesc;
        Desc[Index].innerHTML = NewDesc;
        Desc[Index + 1].innerHTML = LNewDesc;
        LNewDesc = "";
        NewDesc = "";
    }
    else {
        let res = document.getElementById("BeforeDesc");
        let res1 = document.getElementById("AfterDesc");
        let BeforeDesc = res.innerHTML;
        let AfterDesc = res1.innerHTML;
        let resArray = TimestampsArr;
        NewDesc = BeforeDesc + "\n\n";
        NewDesc = NewDesc + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
        for (let i = 0; i < resArray.length; i++) {
            let timestamp = resArray[i];
            NewDesc = NewDesc + timestamp + "\n";
        }
        NewDesc = NewDesc + "\n" + AfterDesc;
        Desc[Index].innerHTML = NewDesc;
        NewDesc = "";
    }
}
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
    let res = document.getElementById("BeforeDesc");
    let res1 = document.getElementById("AfterDesc");
    let res2 = document.getElementById("LocalBeforeDesc");
    let res3 = document.getElementById("LocalAfterDesc");
    let BeforeDesc = res.innerHTML;
    let AfterDesc = res1.innerHTML;
    let LocalBeforeDesc;
    let LocalAfterDesc;
    let success = false;
    var Description = "";
    var LocalDescript = "";
    if (MultiDimStreamArr.length > -1) {
        for (let index = 0; index < MultiDimStreamArr.length; index++) {
            let resArray = MultiDimStreamArr[index];
            if (SettingsLocal != "") {
                LocalBeforeDesc = res2.innerHTML;
                LocalAfterDesc = res3.innerHTML;
                LocalDescript = LocalBeforeDesc + "\n\n";
                LocalDescript =
                    LocalDescript +
                        `Hotkey, Operated, Time-stamper (H.O.T) ${HotV} \n(Clips are Offset by -${Clipoffset})\n`;
                for (let i = 0; i < resArray.length; i++) {
                    let timestamp = resArray[i];
                    LocalDescript = LocalDescript + timestamp + "\n";
                }
                LocalDescript = LocalDescript + "\n" + LocalAfterDesc;
                LocalDescArrS.push(LocalDescript);
                LocalDescript = "";
            }
            Description = BeforeDesc + "\n\n";
            Description =
                Description +
                    `Hotkey, Operated, Time-stamper (H.O.T) ${HotV} \n(Clips are Offset by -${Clipoffset})\n`;
            for (let i = 0; i < resArray.length; i++) {
                let timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description = Description + "\n" + AfterDesc;
            DescArrS.push(Description);
            Description = "";
        }
        success = true;
    }
    if (MultiDimRecordArr.length > -1) {
        for (let index = 0; index < MultiDimRecordArr.length; index++) {
            let resArray = MultiDimRecordArr[index];
            if (SettingsLocal != "") {
                LocalBeforeDesc = res2.innerHTML;
                LocalAfterDesc = res3.innerHTML;
                LocalDescript = LocalBeforeDesc + "\n\n";
                LocalDescript =
                    LocalDescript + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
                for (let i = 0; i < resArray.length; i++) {
                    let timestamp = resArray[i];
                    LocalDescript = LocalDescript + timestamp + "\n";
                }
                LocalDescript = LocalDescript + "\n" + LocalAfterDesc;
                LocalDescArrR.push(LocalDescript);
                LocalDescript = "";
            }
            Description = BeforeDesc + "\n\n";
            Description =
                Description + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
            for (let i = 0; i < resArray.length; i++) {
                let timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description = Description + "\n" + AfterDesc;
            DescArrR.push(Description);
            Description = "";
        }
        success = true;
    }
    if (success == true) {
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
    LocalDescArrS.reverse();
    LocalDescArrR.reverse();
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
        SetIns(DescArrS, StreamDatesArr, "Stream", "StreamingNo", LocalDescArrS, "LocaleDesc-", "streamtextarr", 0);
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
        liSeparate.classList.add("RecordStreamli", "rounded");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (let index = 0; index < DescArrR.length; index++) {
            let li = document.createElement("li");
            let a = document.createElement("a");
            a.innerHTML = `> - Record - ${index + 1}`;
            a.setAttribute("href", `#Record-${index}`);
            a.classList.add("nav-link", "text-center");
            li.classList.add("rounded");
            li.append(a);
            ul.append(li);
        }
        if (SettingsLocal == "") {
            SetIns(DescArrR, RecordDatesArr, "Record", "RecordingNo", LocalDescArrR, "recordLocalInput", "recordInput", DescArrS.length);
        }
        else {
            SetIns(DescArrR, RecordDatesArr, "Record", "RecordingNo", LocalDescArrR, "recordLocalInput", "recordInput", DescArrS.length * 2);
        }
    }
    else {
        console.log("No recording Timestamps found");
    }
    nav.append(ul);
    SidebarDiv.append(nav);
    return 1;
}
function SetIns(DescArr, DatesArr, string, IDname, LocalArr, LocalID, TextAreaID, CharCount_index) {
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
        button.setAttribute("data-bs-target", `#${IDname + index}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `${IDname + index}`);
        button.setAttribute("id", `AcordBtn-${index}`);
        let collapsedDiv = document.createElement("div");
        collapsedDiv.classList.add("accordion-collapse", "collapse");
        collapsedDiv.setAttribute("id", `${IDname + index}`);
        collapsedDiv.setAttribute("data-bs-parent", `#accordion${index}`);
        let CharDiv = document.createElement("div");
        CharDiv.classList.add("d-flex", "justify-content-between");
        let PNo = document.createElement("p");
        PNo.setAttribute("id", `CharCount${CharCount_index}`);
        PNo.innerHTML = "CharCounter";
        let h3 = document.createElement("h3");
        h3.innerHTML = `# Suggested Description`;
        let LocalTextarea = document.createElement("textarea");
        if (SettingsLocal != "") {
            LocalTextarea.classList.add("d-flex", "m-1", "res", "form-control", "Charcounts");
            LocalTextarea.innerHTML = LocalArr[index];
            LocalTextarea.setAttribute("id", `myLocalInput${index}`);
        }
        let Textarea = document.createElement("textarea");
        Textarea.classList.add("d-flex", "m-1", "res", "form-control", "Textarea", "Charcounts");
        Textarea.innerHTML = DescArr[index];
        Textarea.setAttribute("id", `${TextAreaID}${index}`);
        if (index % 2) {
            button.innerHTML =
                "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXTIcon.png'> " +
                    "| " +
                    DatesArr[index] +
                    ` - ${string}`;
        }
        else {
            button.innerHTML =
                "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXT2Icon.png'> " +
                    "| " +
                    DatesArr[index] +
                    ` - ${string}`;
        }
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
        SelectBtn.setAttribute("value", `${CharCount_index}`);
        CopyBtn.setAttribute("value", `${CharCount_index}`);
        YoutubeBtn.setAttribute("value", `${CharCount_index}`);
        h2.append(button);
        AcordItem.append(h2);
        CharDiv.append(h3);
        CharDiv.append(PNo);
        AcordBody.append(CharDiv);
        AcordBody.append(Textarea);
        ButtonDiv.append(SelectBtn);
        ButtonDiv.append(CopyBtn);
        ButtonDiv.append(YoutubeBtn);
        AcordBody.append(ButtonDiv);
        CharCount_index++;
        if (SettingsLocal != "") {
            let hr = document.createElement("hr");
            let FontDiv = document.createElement("div");
            FontDiv.classList.add("d-flex", "justify-content-between");
            let h3 = document.createElement("h3");
            h3.innerHTML = "# Suggested Description: (" + SettingsLocal + ")";
            h3.setAttribute("class", "my-2");
            let PNo = document.createElement("p");
            PNo.setAttribute("id", `CharCount${CharCount_index}`);
            PNo.innerHTML = "CharCounter";
            let input = document.createElement("input");
            input.classList.add("form-control", "p-3", "my-2");
            input.setAttribute("id", `${LocalID}Title-${index}`);
            input.setAttribute("placeholder", `title in locale language`);
            LocalTextarea.setAttribute("id", `${LocalID}${index}`);
            let ButtonDivL = document.createElement("div");
            ButtonDivL.classList.add("my-3");
            let SelectLBtn = document.createElement("button");
            SelectLBtn.innerHTML = "Select Text";
            SelectLBtn.classList.add("btn", "mx-1", "Select", "button");
            SelectLBtn.setAttribute("value", `${CharCount_index}`);
            let CopyBtnL = document.createElement("button");
            CopyBtnL.innerHTML = "Copy Text";
            CopyBtnL.classList.add("btn", "mx-1", "Copy", "button");
            CopyBtnL.setAttribute("value", `${CharCount_index}`);
            let YoutubeBtnL = document.createElement("button");
            YoutubeBtnL.innerHTML = "Update YT Vid";
            YoutubeBtnL.classList.add("btn", "mx-1", "Send", "button");
            YoutubeBtnL.setAttribute("id", "authbtn");
            YoutubeBtnL.setAttribute("value", `${CharCount_index}`);
            ButtonDivL.append(SelectLBtn);
            ButtonDivL.append(CopyBtnL);
            ButtonDivL.append(YoutubeBtnL);
            FontDiv.append(h3);
            FontDiv.append(PNo);
            AcordBody.append(hr);
            AcordBody.append(FontDiv);
            AcordBody.append(input);
            AcordBody.append(LocalTextarea);
            AcordBody.append(ButtonDivL);
            CharCount_index++;
        }
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
function SectoTimestamp(seconds) {
    let date = new Date();
    date.setHours(0, 0, 0);
    date.setSeconds(seconds);
    let dateText = date.toString();
    dateText = dateText.substring(16, 25);
    let DigitA = dateText.split(":");
    if (DigitA[0] == "00") {
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
        if (DigitA[0][0] == "0") {
            return DigitA[0][1] + ":" + DigitA[1] + ":" + DigitA[2];
        }
        else {
            return dateText;
        }
    }
}
function TimestampToDate(timestamp) {
    let T = Array();
    T = timestamp.split(":");
    let date = new Date();
    date.setHours(0, 0, 0);
    if (T.length == 3) {
        date.setHours(T[0]);
        date.setMinutes(T[1]);
        date.setSeconds(T[2]);
        return date;
    }
    else {
        date.setMinutes(T[0]);
        date.setSeconds(T[1]);
        return date;
    }
}
function ErrorMessage(string, Err) {
    alert(string + +"'' " + Err + " ''");
}
function parseISOString(Isostring) {
    var b = Isostring.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
async function validateToken() {
    if (AppAcessToken != undefined &&
        AppAcessToken != "" &&
        AppAcessToken != null) {
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
                let p = document.getElementById("AccessTokenTime");
                let Time = new Date(resp.expires_in * 1000);
                let TimeStrDash = Time.toISOString().split("-");
                let TimeStrT = TimeStrDash[2].split("T");
                let TimeString = `${parseInt(TimeStrDash[1].substring(1, 2)) - 1} Month ${TimeStrT[0]} Days & ${TimeStrT[1].substring(0, 8)} Hours`;
                p.innerHTML = `• Current Token Will Expire In: <br> ${TimeString}.`;
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
    else {
        return 0;
    }
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
async function GetClipsFromDate(StreamedDate, StreamerID) {
    let StartDate = new Date(StreamedDate);
    let EndDate = new Date(StreamedDate);
    EndDate.setDate(EndDate.getDate() + 1);
    let http2 = `https://api.twitch.tv/helix/clips?broadcaster_id=${StreamerID}&first=100&started_at=${StartDate.toISOString()}&ended_at=${EndDate.toISOString()}`;
    let resp = await HttpCalling(http2);
    let Clips = Array();
    for (let i = 0; i < resp["data"].length; i++) {
        if (resp["data"][i]["creator_name"].toLowerCase() ==
            StreamerName.toLowerCase()) {
            Clips.push(resp["data"][i]);
        }
        else {
        }
    }
    return Clips;
}
function SortClips(Clips, GetClipDates) {
    let SortedClips = Array();
    let ClipsDateArr = Array();
    for (let index = 0; index < Clips.length; index++) {
        ClipsDateArr.push(parseISOString(Clips[index]["created_at"]));
    }
    ClipsDateArr.sort(function (a, b) {
        return a - b;
    });
    for (let q = 0; q < ClipsDateArr.length; q++) {
        for (let y = 0; y < Clips.length; y++) {
            let Date = parseISOString(Clips[y]["created_at"].toString());
            if (ClipsDateArr[q].toString() == Date.toString()) {
                SortedClips.push(Clips[y]);
            }
        }
    }
    if (GetClipDates == true) {
        return ClipsDateArr;
    }
    else {
        return SortedClips;
    }
}
async function ChangeAcordButtonNames(Clips, index, AcordButtonArr) {
    let gameresp = await HttpCalling(`https://api.twitch.tv/helix/games?id=${Clips[0]["game_id"]}`);
    if (index % 2) {
        AcordButtonArr[index].innerHTML =
            "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXTIcon.png'> " +
                "| " +
                StreamDatesArr[index] +
                ` - Playing: '${gameresp["data"][0]["name"]}'  → With: ${Clips.length} Clips`;
    }
    else {
        AcordButtonArr[index].innerHTML =
            "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXT2Icon.png'> " +
                "| " +
                StreamDatesArr[index] +
                ` - Playing: '${gameresp["data"][0]["name"]}'  → With: ${Clips.length} Clips`;
    }
}
