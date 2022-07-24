let Clipoffset = 26;

let TimestampTxt = document.getElementById("TimestampTxt") as HTMLInputElement;
let RawTxt = TimestampTxt.innerHTML;

var MultiDimStreamArr = Array();
var MultiDimRecordArr = Array();
var StreamDatesArr = Array(); // Holds data for when a stream was streamed
var RecordDatesArr = Array(); // Holds data for when a Recording was recorded
console.log(CutOuts(RawTxt)); // Sets in



//#region CutOuts Function: Removes NonUsefull data from RawTxt Data
// makes a Clean Version Timestamp version from the Raw txt
// Input : A Timestamp Txt Made by the StreamReader Plugin for OBS:
// Outputs: Sets Data in Multidim-Stream/RecordArr with a clean set of Timestamps -
// returns 1 if sucessful and 0 if failed
//- with Scenes marked with their names and Clips marked
function CutOuts(RawTxt: string) {
  let RawTxtArr = RawTxt.split("\n"); // splits them by Spaces : EVENT:START, RECORDING, @, etc...
  let StreamArr = Array();
  let RecordArr = Array();
  var Catch = false as boolean;
  var LineScene = "" as String;
  let ClipNo = 0 as number;
  for (let index = 0; index < RawTxtArr.length; index++) {
    let Word = RawTxtArr[index]; // effectively a Foreach loop but without javascripts weird foreach loops
    if (Word.match(/EVENT:START.*/i)) {
      if (Word.match(/.*Record.*/i)) {
        let resarr = Word.split(" ");
        RecordDatesArr.push(resarr[3] + " " + resarr[4]);
      } else if (Word.match(/.*Stream.*/i)) {
        let resarr = Word.split(" ");
        StreamDatesArr.push(resarr[3] + " " + resarr[4]);
      }
      continue;
    }
    if (Word.match(/EVENT:STOP.*/i)) {
      //console.log("In Event Stop: " + Word); // enters
      // add what ever array into multidim array
      if (typeof StreamArr !== "undefined") {
        if (StreamArr.length != 0) {
          StreamArr.unshift(StreamArr, "▸ 0:00 Start");
          MultiDimStreamArr.push(StreamArr);
        }
      }
      if (typeof RecordArr !== "undefined") {
        if (RecordArr.length != 0) {
          RecordArr.unshift(RecordArr, "▸ 0:00 Start");
          MultiDimRecordArr.push(RecordArr);
        }
      }
      StreamArr = Array(); // clear array for new rerun
      RecordArr = Array(); // clear array for new rerun
      ClipNo = 0; // resets clip counter
      continue;
    }
    if (Word.match(/EVENT:SCENE.*/i)) {
      let resarr = Word.split(" ");
      LineScene = resarr[3]; // BRB, PLAYING, OUTRO, etc
      Catch = true; // marks next Record & Stream timestamp as a Scene Timestamp
      continue;
    }
    if (Catch == true) {
      if (to2Time(Word) != "0:00") {
        // if empty
        if (Word.match(/\d:\d\d:\d\d\s.*/i)) {
          // if its a timestamp
          if (Word.match(/.*Record.*/i)) {
            // if "Record" is in the timestamp
            let Timestamp = "▸ " + to2Time(Word) + " " + LineScene;
            RecordArr.push(Timestamp); // should place this at the end of the array
          }
          if (Word.match(/.*Stream.*/i)) {
            let Timestamp = "▸ " + to2Time(Word) + " " + LineScene;
            StreamArr.push(Timestamp); // should place this at the end of the array
            Catch = false;
          }
          continue;
        }
      }
    } else if (Word.search(/0:00:00.*/i) != 0) {
      //console.log("word passed 0:00:00 test:"+ Word);
      if (Word.match(/.*Record.*/i)) {
        let Timestamp =
          "• " + to2Time(AddClipDelay(Word, Clipoffset)) + ` [ClipNo${ClipNo}]`;
        ClipNo++;
        RecordArr.push(Timestamp);
      }
      if (Word.match(/.*Stream.*/i)) {
        // 7:58:58 Stream Time Marker
        let Timestamp =
          "• " + to2Time(AddClipDelay(Word, Clipoffset)) + ` [ClipNo${ClipNo}]`;
        ClipNo++;
        StreamArr.push(Timestamp);
      } else {
        continue;
      }
    }
  }
  //console.log(RawTxtArr); // RawTxt data in a Array
  //console.log(MultiDimStreamArr);
  //console.log(MultiDimRecordArr);

  // test if success
  if (
    typeof MultiDimStreamArr != "undefined" &&
    MultiDimStreamArr != null &&
    MultiDimStreamArr.length != null &&
    MultiDimStreamArr.length > 0
  ) {
    return 1; // success
  } else if (
    typeof MultiDimRecordArr != "undefined" &&
    MultiDimRecordArr != null &&
    MultiDimRecordArr.length != null &&
    MultiDimRecordArr.length > 0
  ) {
    return 1; // success
  } else {
    return 0; // Error
  }
}
//#endregion

//#region AddClipDelay Function Adds ClipDelay to 0:07:30 like timestamps
// Adds Clip Delay to a timestamp
function AddClipDelay(timestamp: any, Clipoffset: number) {
  // input: 0:07:28 Stream Time Marker
  // outputs: 8:06:58 (Timestamp Minus Clipoffset)
  let res = timestamp.split(" "); // *8:07:28*, Stream, Time, Marker
  let DigitA = res[0].split(":"); // *8*, *07*, *28*
  DigitA[2] = DigitA[2] - Clipoffset; // 28 - 30 = -2
  if (DigitA[2] < 0) {
    // if lower than 0
    if (DigitA[1] != "00") {
      // if 07 has value or not
      DigitA[1] = DigitA[1] - 1; // 07 = 06
      DigitA[2] = DigitA[2] + 60; // 60 + -2 = 58
      if (DigitA[1] < 9) {
        // adds back the 0 removed while doing math
        DigitA[1] = "0" + DigitA[1];
      }
      if (DigitA[2] < 9) {
        // adds back another 0 removed by math if need be
        DigitA = "0" + DigitA[2];
      }
    } else if (DigitA[0] != 0) {
      // if there is a 1 hour we could retract instead
      DigitA[0] = DigitA[0] - 1; // 0:42:01
      DigitA[1] = DigitA[1] + 59;
      DigitA[2] = DigitA[2] + 60;
      if (DigitA[1] < 9) {
        // adds back another 0 removed by math if need be
        DigitA[1] = "0" + DigitA[1];
      }
      if (DigitA[2] < 9) {
        // adds back another 0 removed by math if need be
        DigitA[2] = "0" + DigitA[2];
      }
    } else {
      // if we cant pull any numbers
      DigitA[2] = "00";
      return DigitA[0] + ":" + DigitA[1] + ":" + DigitA[2];
    }
  }
  if (DigitA[2] < 9) {
    return DigitA[0] + ":" + DigitA[1] + ":0" + DigitA[2];
  }
  return DigitA[0] + ":" + DigitA[1] + ":" + DigitA[2];
}
//#endregion

//#region Shortens a Timestamp and removes non usefull infomation
function to2Time(timestamp: string) {
  // input: 0:07:28 Stream Time Marker OR 0:07:28
  // outputs: 7:28 (a perfect format timestamp)
  let res = timestamp.split(" "); // *8:07:28*, Stream, Time, Marker
  let DigitA = res[0].split(":"); // *8*, *07*, *28*
  if (DigitA[0] == "0") {
    // 8:07:28
    if (DigitA[1].match(/0\d/i)) {
      // 20:00
      if (DigitA[1].match(/00/i)) {
        DigitA[1] = DigitA[1].replace("00", "0");
        return DigitA[1] + ":" + DigitA[2]; // 20:00
      }
      DigitA[1] = DigitA[1].replace("0", "");
      return DigitA[1] + ":" + DigitA[2]; // 20:00
    } else {
      return DigitA[1] + ":" + DigitA[2];
    }
  } else {
    return res[0]; // returns values like  8:07:28, 24:03:53. does not touch timestamp
  }
}
//#endregion
