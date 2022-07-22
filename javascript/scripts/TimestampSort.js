"use strict";
let Clipoffset = 30;
let TimestampTxt = document.getElementById("TimestampTxt");
console.log(TimestampTxt.innerHTML);
let RawTxt = TimestampTxt.innerHTML;
var MultiDimStreamArr = Array();
var MultiDimRecordArr = Array();
CutOuts(RawTxt);
function CutOuts(RawTxt) {
    let RawTxtArr = RawTxt.split("\n");
    let StreamArr = Array();
    let RecordArr = Array();
    var Catch = false;
    let LineScene = "";
    for (let index = 0; index < RawTxtArr.length; index++) {
        let Word = RawTxtArr[index];
        if (Word.match(/EVENT:START.*/i)) {
            continue;
        }
        if (Word.match(/EVENT:STOP.*/i)) {
            if (typeof StreamArr !== 'undefined') {
                if (StreamArr.length != 0) {
                    StreamArr.unshift(StreamArr, "▸ 0:00 Start");
                    MultiDimStreamArr.push(StreamArr);
                }
            }
            if (typeof RecordArr !== 'undefined') {
                if (RecordArr.length != 0) {
                    RecordArr.unshift(RecordArr, "▸ 0:00 Start");
                    MultiDimRecordArr.push(RecordArr);
                }
            }
            StreamArr = Array();
            RecordArr = Array();
            continue;
        }
        if (Word.match(/EVENT:SCENE.*/i)) {
            let LineScene = Word.split(" ");
            Catch = true;
            continue;
        }
        if (Catch == true) {
            if (toTime2(Word) != "0:00") {
                if (Word.match(/\d:\d\d:\d\d\s.*/i)) {
                    if (Word.match(/.*Record.*/i)) {
                        let Timestamp = "▸ " + toTime2(Word) + LineScene;
                        RecordArr.push(Timestamp);
                        Catch = false;
                    }
                    if (Word.match(/.*Stream.*/i)) {
                        let Timestamp = "▸ " + toTime2(Word) + LineScene;
                        StreamArr.push(Timestamp);
                        Catch = false;
                    }
                }
            }
        }
        else if (Word.match(/0:00:00.*/i)) {
            if (Word.match(/.*Record.*/i)) {
                let Timestamp = toTime2(AddClipDelay(Word, Clipoffset));
                RecordArr.push(Timestamp);
            }
            if (Word.match(/.*Stream.*/i)) {
                let Timestamp = toTime2(AddClipDelay(Word, Clipoffset));
                StreamArr.push(Timestamp);
            }
        }
    }
    console.log(MultiDimStreamArr);
    console.log(MultiDimRecordArr);
    console.log(RawTxtArr);
}
function AddClipDelay(Word, Clipoffset) {
    let Time = Word.split();
    let TwoTime = Time[0].split(":");
    let ThreeTime = TwoTime[0] + TwoTime[1] + TwoTime[2];
    let date = new Date();
    date.setHours(0, 0, 0);
    date.setSeconds(ThreeTime);
    date.setSeconds(-Clipoffset);
    return date.toTimeString();
}
function toTime2(seconds) {
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
