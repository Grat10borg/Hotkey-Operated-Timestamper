"use strict";
let HotV = "V-1.0_beta";
if (config.TWITCH_API_TOKEN != "" || config.TWITCH_API_TOKEN != null) {
    let input = $$.id("TwitchTokenP");
    input.value = config.TWITCH_API_TOKEN;
}
if (config.CLIP_OFFSET == null) {
    $$.log("you didnt set a config.CLIP_OFFSET, H.O.T has defaulted to 26 seconds of offset.");
}
else {
    let input = $$.id("ClipOffsetIn");
    input.value = config.CLIP_OFFSET;
}
if (config.TWITCH_LOGIN == null || config.TWITCH_LOGIN == "") {
    $$.log("you didnt set a TwitchLoginName, you will not be able to use Clip-Stamps");
    let TwitchClipbtn = $$.id("TwitchClip");
    TwitchClipbtn.disabled = true;
}
else {
    let input = $$.id("TwitchLogin");
    input.value = config.TWITCH_LOGIN;
}
if (config.LOCALIZE_ON == false) {
    $$.log("LocalSettings not found Turning off Local Mode");
}
else {
}
if (config.TIMESTAMP_PATH != null && config.TIMESTAMP_PATH != "") {
    let p = $$.id("TimestampPath");
    p.innerHTML = "• currently getting timestamps from: " + config.TIMESTAMP_PATH;
    let input = $$.id("TimeSPathIn");
    input.value = config.TIMESTAMP_PATH;
}
var AclientId = "";
var MultiDimStreamArr = Array();
var MultiDimRecordArr = Array();
var StreamDatesArr = Array();
var RecordDatesArr = Array();
var DescArrS = new Array();
var LocalDescArrS = new Array();
var DescArrR = new Array();
var LocalDescArrR = new Array();
var StreamDatesRaw = new Array();
$$.api_valid();
if (config.INFOWRITER_ON == true) {
    CutOuts();
}
let TwitchClip = $$.id("TwitchClip");
TwitchClip.addEventListener("click", async function (event) {
    if (config.TWITCH_ON == true) {
        let UserIdResp = await $$.api(`https://api.twitch.tv/helix/users?login=${config.TWITCH_LOGIN}`, true);
        $$.log(UserIdResp);
        let AcorBtns = Array();
        let StreamedDate = Array();
        for (let index = 0; index < StreamDatesArr.length; index++) {
            AcorBtns.push($$.id(`AcordBtn-${index}`));
        }
        for (let index = 0; index < AcorBtns.length; index++) {
            let Timestamps = AcorBtns[index].innerHTML.split(" ");
            StreamedDate.push(Timestamps[5] + "T" + Timestamps[6] + ".000Z");
        }
        let VODcount = 0;
        let UserVods = (await $$.api(`https://api.twitch.tv/helix/videos?user_id=${UserIdResp["data"][0]["id"]}`, true));
        for (let index = 0; index < UserVods["data"].length; index++) {
            if (UserVods["data"][index]["type"] != "highlight") {
                VODcount++;
            }
        }
        let textareaPrint = 0;
        for (let StreamsStreamed = 0; StreamsStreamed < StreamedDate.length; StreamsStreamed++) {
            if (VODcount != 0 || VODcount != null) {
                let res = AcorBtns[StreamsStreamed].innerHTML.split(" ");
                var MultidimClipResps = SortClips(await GetClipsFromDate(res[5], UserIdResp["data"][0]["id"]), false);
                var TimestampTwitch = Array();
                let LocalSceneShift = Array();
                let LocalSceneTime = Array();
                let LocalSceneShifttemp = Array();
                for (let V = 0; V < MultiDimStreamArr[StreamsStreamed].length; V++) {
                    let res = MultiDimStreamArr[StreamsStreamed];
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
                DescriptionReplace(CompleteTimestampArr, textareaPrint, false);
                textareaPrint++;
                if (config.LOCALIZE_ON != false && config.LOCALIZE_ON != "false") {
                    DescriptionReplace(CompleteTimestampArr, textareaPrint, true);
                    textareaPrint++;
                }
                ChangeAcordButtonNames(MultidimClipResps, StreamsStreamed, AcorBtns);
            }
            else {
                $$.log("Getting clips for streams without VODs");
            }
        }
    }
    else {
        $$.log("Failed to Validate Token Try Again");
        $$.api_valid();
    }
});
async function CutOuts() {
    let timestamps = await $$.txt(config.TIMESTAMP_PATH);
    if (timestamps == "")
        $$.log("Your Timestamp.Txt was not found!, check if the filepath is correct or if it doesnt have data in it!");
    let RawTxtArr = timestamps.split("\n");
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
                let Timestamp = "• " + to2Time(AddClipDelay(Word, config.CLIP_OFFSET)) + ` [ClipNo${ClipNo}]`;
                ClipNo++;
                RecordArr.push(Timestamp);
            }
            if (Word.match(/.*Stream.*/i)) {
                let Timestamp = "• " + to2Time(AddClipDelay(Word, config.CLIP_OFFSET)) + ` [ClipNo${ClipNo}]`;
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
        SetOps(MultiDimStreamArr, MultiDimRecordArr);
    }
    else if (typeof MultiDimRecordArr != "undefined" &&
        MultiDimRecordArr != null &&
        MultiDimRecordArr.length != null &&
        MultiDimRecordArr.length > 0) {
    }
    else {
    }
}
async function SetOps(MultiDimStreamArr, MultiDimRecordArr) {
    let BeforeDesc = await $$.txt(config.DESCRIPTION_MAKER_BEFORE_TIMESTAMPS);
    let AfterDesc = await $$.txt(config.DESCRIPTION_MAKER_AFTER_TIMESTAMPS);
    let LocalBeforeDesc = await $$.txt(config.LOCAL_DESCRIPTION_MAKER_BEFORE_TIMESTAMPS);
    let LocalAfterDesc = await $$.txt(config.LOCAL_DESCRIPTION_MAKER_AFTER_TIMESTAMPS);
    let success = false;
    var Description = "";
    var LocalDescript = "";
    let stats = $$.id("Stats");
    stats.innerHTML = `• Found ${MultiDimStreamArr.length} Streams, and ${MultiDimRecordArr.length} Recordings`;
    if (MultiDimStreamArr.length > -1) {
        for (let index = 0; index < MultiDimStreamArr.length; index++) {
            let resArray = MultiDimStreamArr[index];
            if (config.LOCALIZE_ON != false) {
                LocalDescript = LocalBeforeDesc + "\n\n";
                LocalDescript =
                    LocalDescript +
                        `Hotkey, Operated, Time-stamper (H.O.T) ${HotV} \n(Clips are Offset by -${config.CLIP_OFFSET})\n`;
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
                    `Hotkey, Operated, Time-stamper (H.O.T) ${HotV} \n(Clips are Offset by -${config.CLIP_OFFSET})\n`;
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
            if (config.LOCALIZE_ON != false) {
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
        DomSet(DescArrS, DescArrR);
    }
    else {
        return 0;
    }
}
function DomSet(DescArrS, DescArrR) {
    DescArrS.reverse();
    DescArrR.reverse();
    LocalDescArrS.reverse();
    LocalDescArrR.reverse();
    StreamDatesArr.reverse();
    RecordDatesArr.reverse();
    let SidebarDiv = $$.id("SideBar");
    let nav = $$.make("nav");
    let ul = $$.make("ul");
    if (DescArrS.length > 0) {
        let liSeparate = $$.make("li");
        let aSeprate = $$.make("a");
        aSeprate.classList.add("nav-link", "text-center");
        aSeprate.setAttribute("href", "#Stream");
        aSeprate.innerHTML = "# Streams";
        liSeparate.classList.add("RecordStreamli", "rounded");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (let index = 0; index < DescArrS.length; index++) {
            let li = $$.make("li");
            let a = $$.make("a");
            a.innerHTML = `> - Stream - ${index + 1}`;
            a.setAttribute("href", `#Stream-${index}`);
            a.classList.add("nav-link", "text-center");
            li.classList.add("rounded");
            li.append(a);
            ul.append(li);
        }
        SetIns(DescArrS, StreamDatesArr, "Stream", "StreamingNo", LocalDescArrS, "LocaleDesc-", "streamtextarr", 0);
    }
    else if (DescArrS.length < 0 || DescArrS.length == 0) {
        $$.log("No stream Timestamps found");
    }
    if (DescArrR.length > 0) {
        let liSeparate = $$.make("li");
        let aSeprate = $$.make("a");
        aSeprate.classList.add("nav-link", "text-center");
        aSeprate.setAttribute("href", "#Record");
        aSeprate.innerHTML = "# Recordings";
        liSeparate.classList.add("RecordStreamli", "rounded");
        liSeparate.append(aSeprate);
        ul.append(liSeparate);
        for (let index = 0; index < DescArrR.length; index++) {
            let li = $$.make("li");
            let a = $$.make("a");
            a.innerHTML = `> - Record - ${index + 1}`;
            a.setAttribute("href", `#Record-${index}`);
            a.classList.add("nav-link", "text-center");
            li.classList.add("rounded");
            li.append(a);
            ul.append(li);
        }
        if (config.LOCALIZE_ON == false) {
            SetIns(DescArrR, RecordDatesArr, "Record", "RecordingNo", LocalDescArrR, "recordLocalInput", "recordInput", DescArrS.length);
        }
        else {
            SetIns(DescArrR, RecordDatesArr, "Record", "RecordingNo", LocalDescArrR, "recordLocalInput", "recordInput", DescArrS.length * 2);
        }
    }
    else {
        $$.log("No recording Timestamps found");
    }
    nav.append(ul);
    SidebarDiv.append(nav);
    return 1;
}
function SetIns(DescArr, DatesArr, string, IDname, LocalArr, LocalID, TextAreaID, CharCount_index) {
    var DescDiv = $$.id("DescriptionAreaDiv");
    for (let index = 0; index < DescArr.length; index++) {
        let AcordDiv = $$.make("div");
        AcordDiv.classList.add("accordion", "mt-4");
        let AcordItem = $$.make("div");
        AcordItem.classList.add("accordion-item");
        AcordItem.setAttribute("id", `${string}-${index}`);
        let AcordBody = $$.make("div");
        AcordBody.classList.add("accordion-body");
        let h2 = $$.make("h2");
        h2.classList.add("accordion-header");
        let button = $$.make("button");
        button.classList.add("accordion-button", "btn", "collapsed");
        button.setAttribute("type", "button");
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", `#${IDname + index}`);
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `${IDname + index}`);
        button.setAttribute("id", `AcordBtn-${index}`);
        let collapsedDiv = $$.make("div");
        collapsedDiv.classList.add("accordion-collapse", "collapse");
        collapsedDiv.setAttribute("id", `${IDname + index}`);
        collapsedDiv.setAttribute("data-bs-parent", `#accordion${index}`);
        let CharDiv = $$.make("div");
        CharDiv.classList.add("d-flex", "justify-content-between");
        let PNo = $$.make("p");
        PNo.setAttribute("id", `CharCount${CharCount_index}`);
        PNo.innerHTML = "CharCounter";
        let h3 = $$.make("h3");
        h3.innerHTML = `# Suggested Description`;
        let LocalTextarea = $$.make("textarea");
        if (config.LOCALIZE_ON == true) {
            LocalTextarea.classList.add("d-flex", "m-1", "res", "form-control", "Charcounts");
            LocalTextarea.innerHTML = LocalArr[index];
            LocalTextarea.setAttribute("id", `myLocalInput${index}`);
        }
        let Textarea = $$.make("textarea");
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
        let ButtonDiv = $$.make("div");
        let SelectBtn = $$.make("button");
        let CopyBtn = $$.make("button");
        let YoutubeBtn = $$.make("button");
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
        if (config.LOCALIZE_ON == true) {
            let hr = $$.make("hr");
            let FontDiv = $$.make("div");
            FontDiv.classList.add("d-flex", "justify-content-between");
            let h3 = $$.make("h3");
            h3.innerHTML = "# Suggested Description: (" + config.LOCALIZE_LANGUAGE + ")";
            h3.setAttribute("class", "my-2");
            let PNo = $$.make("p");
            PNo.setAttribute("id", `CharCount${CharCount_index}`);
            PNo.innerHTML = "CharCounter";
            let input = $$.make("input");
            input.classList.add("form-control", "p-3", "my-2");
            input.setAttribute("id", `${LocalID}Title-${index}`);
            input.setAttribute("placeholder", `title in locale language`);
            LocalTextarea.setAttribute("id", `${LocalID}${index}`);
            let ButtonDivL = $$.make("div");
            ButtonDivL.classList.add("my-3");
            let SelectLBtn = $$.make("button");
            SelectLBtn.innerHTML = "Select Text";
            SelectLBtn.classList.add("btn", "mx-1", "Select", "button");
            SelectLBtn.setAttribute("value", `${CharCount_index}`);
            let CopyBtnL = $$.make("button");
            CopyBtnL.innerHTML = "Copy Text";
            CopyBtnL.classList.add("btn", "mx-1", "Copy", "button");
            CopyBtnL.setAttribute("value", `${CharCount_index}`);
            let YoutubeBtnL = $$.make("button");
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
        $$.btnchar();
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
async function GetClipsFromDate(StreamedDate, StreamerID) {
    let StartDate = new Date(StreamedDate);
    let EndDate = new Date(StreamedDate);
    EndDate.setDate(EndDate.getDate() + 1);
    let http2 = `https://api.twitch.tv/helix/clips?broadcaster_id=${StreamerID}&first=100&started_at=${StartDate.toISOString()}&ended_at=${EndDate.toISOString()}`;
    let resp = await $$.api(http2, true);
    let Clips = Array();
    for (let i = 0; i < resp["data"].length; i++) {
        if (resp["data"][i]["creator_name"].toLowerCase() == config.TWITCH_LOGIN.toLowerCase()) {
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
    let gameresp = await $$.api(`https://api.twitch.tv/helix/games?id=${Clips[0]["game_id"]}`, true);
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
function GetClipVODOffsetFromDate(StreamDate, ClipedDate) {
    let StreamDateTime = parseISOString(StreamDate);
    let ClipDateTime = parseISOString(ClipedDate);
    var secounds = (StreamDateTime.getTime() - ClipDateTime.getTime()) / 1000;
    if (secounds < 0) {
        secounds = Math.abs(secounds);
    }
    return SectoTimestamp(secounds);
}
async function DescriptionReplace(TimestampsArr, Index, localprint) {
    let Desc = $$.class(`Charcounts`);
    if (localprint == true) {
        var LNewDesc = "";
        let BeforeDescL = await $$.txt(config.LOCAL_DESCRIPTION_MAKER_BEFORE_TIMESTAMPS);
        let AfterDescL = await $$.txt(config.LOCAL_DESCRIPTION_MAKER_AFTER_TIMESTAMPS);
        let resArray = TimestampsArr;
        LNewDesc = BeforeDescL + "\n\n";
        LNewDesc = LNewDesc + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
        for (let i = 0; i < resArray.length; i++) {
            let timestamp = resArray[i];
            LNewDesc = LNewDesc + timestamp + "\n";
        }
        LNewDesc = LNewDesc + "\n" + AfterDescL;
        Desc[Index].innerHTML = LNewDesc;
        LNewDesc = "";
    }
    else {
        var NewDesc = "";
        let BeforeDesc = await $$.txt(config.DESCRIPTION_MAKER_BEFORE_TIMESTAMPS);
        let AfterDesc = await $$.txt(config.DESCRIPTION_MAKER_AFTER_TIMESTAMPS);
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
