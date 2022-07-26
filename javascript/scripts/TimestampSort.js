"use strict";
let Clipoffset = 26;
let TimestampTxt = document.getElementById("TimestampTxt");
let RawTxt = TimestampTxt.innerHTML;
var MultiDimStreamArr = Array();
var MultiDimRecordArr = Array();
var StreamDatesArr = Array();
var RecordDatesArr = Array();
var DescArrS = new Array();
var DescArrR = new Array();
if (CutOuts(RawTxt) == 1) {
    console.log(1);
    if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
        DomSet();
        console.log(1);
    }
    else {
        console.log("Error Creating Description");
    }
}
else {
    console.log("Error Sorting Timestamps");
}
function DomSet() {
    let DescDiv = document.getElementById("DescriptionAreaDiv");
    DescArrS.reverse();
    DescArrR.reverse();
    StreamDatesArr.reverse();
    RecordDatesArr.reverse();
    for (let index = 0; index < DescArrS.length; index++) {
        let Textarea = document.createElement("textarea");
        Textarea.classList.add("m-1", "res", "form-control", "Textarea");
        Textarea.innerHTML = DescArrS[index];
        DescDiv.append(Textarea);
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
            Description = Description + `Hotkey, Operated, Time-stamper (H.O.T) V.2.3 \n(Clips are Offset by -${Clipoffset})\n`;
            for (let i = 0; i < resArray.length; i++) {
                let timestamp = resArray[i];
                Description = Description + timestamp + "\n";
            }
            Description = Description + "\n" + IntroTxt + "\n\n" + SocialTxt + "\n\n" + CreditsTxt;
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
            Description = Description + "\n\n" + IntroTxt + "\n\n" + SocialTxt + "\n\n" + CreditsTxt;
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
