
let Clipoffset = 30;

let TimestampTxt = document.getElementById("TimestampTxt") as HTMLInputElement;
console.log(TimestampTxt.innerHTML);  
let RawTxt = TimestampTxt.innerHTML;

var MultiDimStreamArr = Array(); 
var MultiDimRecordArr = Array();
CutOuts(RawTxt);

function CutOuts(RawTxt) {
   let RawTxtArr = RawTxt.split("\n"); // splits them by Spaces : EVENT:START, RECORDING, @, etc...
   let StreamArr = Array();
   let RecordArr = Array();
   var Catch = false;
   let LineScene = "";
   for (let index = 0; index < RawTxtArr.length; index++) {
    let Word = RawTxtArr[index]; // effectively a Foreach loop but without javascripts weird foreach loops
    if(Word.match(/EVENT:START.*/i)) {
        continue;
    }
    if (Word.match(/EVENT:STOP.*/i)) {
         // add what ever array into multidim array
         if(typeof StreamArr !== 'undefined') {
            if(StreamArr.length != 0) {
                StreamArr.unshift(StreamArr, "▸ 0:00 Start");
                MultiDimStreamArr.push(StreamArr);
            }
         }
         if(typeof RecordArr !== 'undefined') {
            if(RecordArr.length != 0) {
                RecordArr.unshift(RecordArr, "▸ 0:00 Start");
                MultiDimRecordArr.push(RecordArr);
            }
        }
        StreamArr = Array(); // clear array for new rerun
        RecordArr = Array(); // clear array for new rerun
        continue;
    }
    if(Word.match(/EVENT:SCENE.*/i)) {
        let LineScene = Word.split(" ");
        Catch = true;
        continue;
    }
    if(Catch == true) {
        if(toTime2(Word) != "0:00") { // if empty 
            if (Word.match(/\d:\d\d:\d\d\s.*/i)) { // if its a timestamp
                if(Word.match(/.*Record.*/i)) { // if "Record" is in the timestamp
                    let Timestamp = "▸ "+toTime2(Word) + LineScene;
                    RecordArr.push(Timestamp); // should place this at the end of the array
                    Catch = false;
                }
                if(Word.match(/.*Stream.*/i)) {
                    let Timestamp = "▸ "+toTime2(Word) + LineScene;
                    StreamArr.push(Timestamp); // should place this at the end of the array
                    Catch = false;
                }
            }
        }
    }
    else if(Word.match(/0:00:00.*/i)) {
        if(Word.match(/.*Record.*/i)) {
            let Timestamp = toTime2(AddClipDelay(Word, Clipoffset));
            RecordArr.push(Timestamp);
        }
        if(Word.match(/.*Stream.*/i)) { // 7:58:58 Stream Time Marker
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
    let ThreeTime = TwoTime[0]+TwoTime[1]+TwoTime[2];
    let date = new Date();
    date.setHours(0, 0, 0); // sets date to 00:00:00
    date.setSeconds(ThreeTime);
    date.setSeconds(-Clipoffset); // minus clip offset hopefully
    return date.toTimeString();
}

// find out how to add implimented functions so we dont need the double here

//#region toTime function, makes a timestamp that will work in the youtube description
// converts the time into minutes and hours from seconds
function toTime2(seconds: any) {
    let date = new Date(); // find out why it prints timestamps like "12:12:26" remove the 12 // Fixed
    date.setHours(0, 0, 0); // sets date to 00:00:00
    //console.log(date);
    date.setSeconds(seconds); // adds secounds making it into a timestamp
    let dateText = date.toString(); // cuts timestamp out // effectively the same that gets printed when you do console.log(date);
    dateText = dateText.substring(16, 25);
    //console.log(dateText);
    let arrayD = dateText.split(":");
    //console.log(arrayD);
    //console.log(dateText);
  
    // if first hour value is 0
    if (arrayD[0][0] == "0") {
      //console.log("in [0][0]");
      // if secound hour value is 0
      if (arrayD[0][1]) {
        //console.log("in [0][1]");
        // if first minute value is 0
        if (arrayD[1][0] == "0") {
          //console.log("in [1][0]");
          // if second minute value is 0
          if (arrayD[1][1] == "0") {
            //console.log("in [1][1]");
            // a 0:30 large timestamp
            dateText = "0:" + arrayD[2];
          } else {
            // a 1:00 large timestamp
            dateText = arrayD[1][1] + ":" + arrayD[2];
          }
        } else {
          // a 10:00 large timestamp
          dateText = arrayD[1] + ":" + arrayD[2];
        }
      } else {
        // a 4:00:00 large timestamp
        dateText = arrayD[0][1] + ":" + arrayD[1] + ":" + arrayD[2];
      }
    } else {
      // a 24:00:00 large timestamp
      dateText = arrayD[0] + ":" + arrayD[1] + ":" + arrayD[2];
    }
    return dateText;
  }
  //#endregion