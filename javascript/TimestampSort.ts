let Clipoffset = 26; // twitch default

let TimestampTxt = document.getElementById("TimestampTxt") as HTMLInputElement;
let RawTxt = TimestampTxt.innerHTML;
let HotV = "V-1.0"; // the version of H.o.t

// Get these from Files in the furture
var AppAcessToken = "bzs6p3k7o39u8bv6y3hotdi1dszdlw" as string;
var AclientId = "" as string;

let StreamerName = "grat_grot10_berg" as string;
var TwitchConnected = false; // tells if the Twitch HTTP calls should be called or not.

var MultiDimStreamArr = Array(); // Holds Raw Data from txt
var MultiDimRecordArr = Array(); // Holds Raw Data from txt
var StreamDatesArr = Array(); // Holds data for when a stream was streamed
var RecordDatesArr = Array(); // Holds data for when a Recording was recorded
var DescArrS = new Array(); // holds all the Finished Stream descriptions
var DescArrR = new Array(); // holds all the Finished Recording descriptions

//#region Token Validation.
validateToken();
//#endregion

//#region Basic Setup H.O.T NON Twitch API
if (CutOuts(RawTxt) == 1) {
  // Runs CutOuts and if successful run next Method in line
  if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
    // Runs SetOps if sucessful run next Method in line
    // Set in Data to Webpage
    if (DomSet() == 1) {
      // Domset needs to be ran before we call ValidateToken();
    } else {
      // Error logging
      console.log("Failed Placing Things in the Websites");
    }
  } else {
    console.log("Error Creating Description");
  }
} else {
  console.log("Error Sorting Timestamps");
}
//#endregion

// Twitch handling

// Event handlers

//#region TwitchClip gets twitch clips for your description when clicked
let TwitchClip = document.getElementById("TwitchClip") as HTMLInputElement;

TwitchClip.addEventListener("click", async function (event: any) {
  if (TwitchConnected == true) {
    // Calling API to get ID of streamer with this name
    let UserIdResp = await HttpCalling(
      `https://api.twitch.tv/helix/users?login=${StreamerName}`
    );
    // Calling API to gather VODS from this user.
    let UserVods = await HttpCalling(
      `https://api.twitch.tv/helix/videos?user_id=${UserIdResp["data"][0]["id"]}`
    );
    let TwitchStreamedDate = Array();
    let FullDateTwitch = Array();

    //#region VOD Sorting
    for (let index = 0; index < UserVods["data"].length; index++) {
      if (UserVods["data"][index]["type"] == "highlight") {
        continue; // skip highlights
      } else {
        // places the Date "2022-08-22" in a array
        let Timestamps = UserVods["data"][index]["published_at"].split("T");
        FullDateTwitch.push(UserVods["data"][index]["published_at"]);
        TwitchStreamedDate.push(Timestamps[0]);
      }
    }
    //#endregion

    //#region Getting Timestamp from Acord buttons
    // Getting Timestamps from Acord buttons
    let AcorBtns = document.getElementsByClassName("accordion-button");
    let StreamedDate = Array(); // date a stream took place local ver
    for (let index = 0; index < AcorBtns.length; index++) {
      let Timestamps = AcorBtns[index].innerHTML.split(" ");
      StreamedDate.push(Timestamps[0]);
    }
    //#endregion

    //#region StreamDate Aprover
    let Aproved_StreamTime = Array();
    let StreamIndex = Array(); // holds the Aproved index for TwitchStreamedDate
    for (let i = 0; i < TwitchStreamedDate.length; i++) {
      for (let index = 0; index < StreamedDate.length; index++) {
        // if "2022-08-22" == "2022-08-22"
        if (TwitchStreamedDate[i] == StreamedDate[index]) {
          Aproved_StreamTime.push(StreamedDate.indexOf(TwitchStreamedDate[i]));
          StreamIndex.push(i);
        }
      }
    }
    //#endregion

    //#region Acord Title Placer
    // Adds titles to acord buttons for easy seeing stream timestamps.
    // Also removes some of the less useful date data like hours minutes, seconds replaces it with the title of the stream instead.
    for (let index = 0; index < Aproved_StreamTime.length; index++) {
      let AcordBtn = document.getElementById(
        `AcordBtn-${Aproved_StreamTime[index]}`
      ) as HTMLElement;
      AcordBtn.innerHTML = `${TwitchStreamedDate[StreamIndex[index]]} - ${
        UserVods["data"][StreamIndex[index]]["title"]
      }`;
    }
    //#endregion

    // Getting clips from 35 days ago to today.
    //#region Setting up
    let d = new Date();
    let RFCdato = new Date();
    RFCdato.setDate(RFCdato.getDate() - 35); // takes a month worth of clips
    let http2 = `https://api.twitch.tv/helix/clips?broadcaster_id=${
      UserIdResp["data"][0]["id"]
    }&first=100&started_at=${RFCdato.toISOString()}&ended_at=${d.toISOString()}`;
    let resp = await HttpCalling(http2);
    //#endregion
    let MultiUnsortedClips = Array();
    //#region Getting and sorting clips into arrays sorted by Stream dates
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

      // Sort clips after Date Newest to Oldest.
      MultiUnsortedClips.push(Clips);
    }
    //#endregion

    //#region Clip Sorter
    let ClipsDateArr = Array();
    let MultiStreamClips = Array();
    for (let index = 0; index < MultiUnsortedClips.length; index++) {
      let Clips = Array();
      for (let i = 0; i < MultiUnsortedClips[index].length; i++) {
        Clips.push(parseISOString(MultiUnsortedClips[index][i]["created_at"]));
      }
      // Sorting to correct dates
      Clips.sort(function (a, b) {
        return a - b;
      });
      ClipsDateArr.push(Clips);
    }
    //#endregion

    //#region Make Multidim sorted array
    let TempSortedClips = Array();
    for (let x = 0; x < MultiUnsortedClips.length; x++) {
      // multi dim array = 11, 5
      let UnsortedClipArr = MultiUnsortedClips[x];
      for (let q = 0; q < ClipsDateArr[x].length; q++) {
        for (let y = 0; y < UnsortedClipArr.length; y++) {
          // 11 elements in one array
          let Date = parseISOString(
            UnsortedClipArr[y]["created_at"].toString()
          ); // Clip Unsorted Dates
          if (ClipsDateArr[x][q].toString() == Date.toString()) {
            TempSortedClips.push(MultiUnsortedClips[x][y]);
          }
        }
      }
      MultiStreamClips.push(TempSortedClips);
      TempSortedClips = Array(); // reset
    }
    //#endregion

    //#region Foreaching, Sorting and placing in ALL timestamps from Twitch
    for (let index = 0; index < TwitchStreamedDate.length; index++) {
      // TextArea
      let Desc = document.getElementById(`myInput${index}`) as HTMLInputElement;
      var NewDesc = ""; // Finished Description Var

      // Handling of BAD data
      if (Desc == null) {
        continue; // skip non existing descriptions, if you dont have a full copy of local timestamps.
      }
      if (Desc.innerHTML.search(TwitchStreamedDate[StreamIndex[index]]) != -1) {
        continue; // Skip timestamps if local timestamps does not contain copy of the stream searched for.
      }
      console.log(TwitchStreamedDate[StreamIndex[index]]);
      console.log(MultiStreamClips[StreamIndex[index]]);

      let TimestampTwitch = Array();
      let LocalSceneShift = Array();
      let TimeTwitch = Array();
      let LocalSceneTime = Array();

      // get Clip Offset but should also get Start Creative or Scene shift timestamps.
      //#region Getting Local Scene Shift timestamps
      // get Local Timestamps for scenes
      let LocalSceneShifttemp = Array();
      let LocalSceneTimetemp = Array();
      for (let V = 0; V < MultiDimStreamArr[index].length; V++) {
        let res = MultiDimStreamArr[V];
        if (res == undefined) {
          // for some reason keeps running into indexes it doesnt have? this fixes it but MAyyyy be not the best fix
          continue;
        }
        for (let i = 0; i < res.length; i++) {
          let Timestamp = res[i]; // String with timestamp
          if (Timestamp.match(/▸.*/i)) {
            LocalSceneShift.push(Timestamp);
            let R = Timestamp.split(" ");
            LocalSceneTime.push(R[1]);
          }
        }
        LocalSceneShifttemp = LocalSceneShift;
        LocalSceneTimetemp = LocalSceneTime;
        LocalSceneShift = Array();
        LocalSceneTime = Array();
      }

      //#endregion

      //#region Creating timestamps with titles in a single string
      // sets in Clip timestamp.
      for (let i = 0; i < MultiStreamClips[StreamIndex[index]].length; i++) {
        // gives a timestamp close to LOCAL timestamp from Twitch API.
        TimestampTwitch.push(
          "• " +
            SectoTimestamp(
              MultiStreamClips[StreamIndex[index]][i]["vod_offset"]
            ) +
            " " +
            MultiStreamClips[StreamIndex[index]][i]["title"]
        );
        TimeTwitch.push(
          SectoTimestamp(MultiStreamClips[StreamIndex[index]][i]["vod_offset"])
        );
      }
      //#endregion

      // set timestamp arrays into one big one that we have to sort.
      let TimestampArr = Array();
      let TimeArr = Array();
      TimestampArr = LocalSceneShifttemp.concat(TimestampTwitch);
      TimeArr = LocalSceneTimetemp.concat(TimeTwitch);

      // sort timestamps into correct sorting
      // fun fact the indexes are named: Q,T,Pie,u because thats what u are :)
      //#region Making Timestamps into Dates and sorting them.
      let SortTime = Array();
      for (let q = 0; q < TimestampArr.length; q++) {
        SortTime.push(TimestampToDate(TimeArr[q]));
      }

      SortTime.sort();
      //#endregion
      let Timestamps = Array();
      //#region Sorted Dates get turned into timestamps again.
      for (let t = 0; t < SortTime.length; t++) {
        let T = SortTime[t].toString().split(" ");
        let TestHour = T[4].split(":");
        let Timestamp;
        if (TestHour[0][0] == "0") {
          Timestamp = to2Time(T[4].substring(1)); // skips >0<0:20:40 of the timestamp
          Timestamps.push(Timestamp);
        } else {
          // keeps extra hour placement for 24 hour timestamps.
          Timestamp = to2Time(T[4]);
          Timestamps.push(Timestamp);
        }
      }
      //#endregion
      let CompleteTimestampArr = Array();
      //#region finding the correct indexs for titles and completing the sorting
      // for each til we find the correct index
      for (let Pie = 0; Pie < Timestamps.length; Pie++) {
        let Reg = new RegExp(Timestamps[Pie] + ".*");
        for (let u = 0; u < TimeArr.length; u++) {
          if (TimeArr[u].match(Reg)) {
            CompleteTimestampArr.push(TimestampArr[u]);
            break;
          }
        }
      }
      //#endregion

      //#region Making the new description and placing it into the correct Text area
      // Makes a Working Description
      // If Not Null
      if (CompleteTimestampArr.length > 0) {
        // if has Values
        for (let index = 0; index < CompleteTimestampArr.length; index++) {
          let res = document.getElementById("BeforeDesc") as HTMLInputElement;
          let res1 = document.getElementById("AfterDesc") as HTMLInputElement;

          let BeforeDesc = res.innerHTML;
          let AfterDesc = res1.innerHTML;
          let resArray = CompleteTimestampArr;

          NewDesc = BeforeDesc + "\n\n";
          NewDesc =
            NewDesc + `Hotkey, Operated, Time-stamper (H.O.T) ${HotV}\n`;
          for (let i = 0; i < resArray.length; i++) {
            let timestamp = resArray[i];
            NewDesc = NewDesc + timestamp + "\n";
          }
          NewDesc = NewDesc + "\n" + AfterDesc;
          Desc.innerHTML = NewDesc;
          NewDesc = "";
        }
      }
      //#endregion
    }
    //#endregion
  } else {
    // if token was not validated when you clicked, it'll try to validate, then you can click again and it Should work*
    validateToken();
    console.log("Token was not validated try again..");
  }
});
//#endregion

// Large Functions

//#region CutOuts: Function Removes NonUsefull data from RawTxt Data
// makes a Clean Version Timestamp version from the Raw txt
// Input : A Timestamp Txt Made by the StreamReader Plugin for OBS:
// Outputs: Sets Data in Multidim-Stream/RecordArr with a clean set of Timestamps -
// returns 1 if sucessful and 0 if failed
//- with Scenes marked with their names and Clips marked
function CutOuts(RawTxt: string) {
  let RawTxtArr = RawTxt.split("\n"); // splits them by Spaces : EVENT:START, RECORDING, @, etc...
  let StreamArr = Array();
  let RecordArr = Array();
  var Catch = false as boolean; // catch is activated when nearing the end of the VOD/Stream. it tells it to stop/catch the varibles for now and place it in the arrays
  var LineScene = "" as String;
  // maybe remove ClipNo later
  let ClipNo = 0 as number;
  let xs = 0; // x Stream
  let xr = 0; // x Recording
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
      StreamArr = []; // clear array for new rerun
      RecordArr = []; // clear array for new rerun
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

//#region SetOps: Function Sorts the clean timestamps into a description
// Makes: a Description from PHP Txts and clean timestamps
// Input : Clean timestamps made by CutOuts()
// Outputs: a Finished Description only missing Clip names
// returns 1 if sucessful and 0 if failed
function SetOps(MultiDimStreamArr: string[], MultiDimRecordArr: string[]) {
  // Set in All the timestamps correctly

  // Getting More Txts from PHP and ./Texts
  let res = document.getElementById("BeforeDesc") as HTMLInputElement;
  let res1 = document.getElementById("AfterDesc") as HTMLInputElement;

  let BeforeDesc = res.innerHTML;
  let AfterDesc = res1.innerHTML;
  var Description = ""; // Finished Description Var

  // Makes a Working Description
  // If Not Null

  if (MultiDimStreamArr.length > 0) {
    // if has Values
    for (let index = 0; index < MultiDimStreamArr.length; index++) {
      let resArray = MultiDimStreamArr[index];

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
    return 1;
  } else if (MultiDimRecordArr.length > 0) {
    // if has Values
    for (let index = 0; index < MultiDimRecordArr.length; index++) {
      let resArray = MultiDimRecordArr[index];

      Description = BeforeDesc + "\n\n";
      for (let i = 0; i < resArray.length; i++) {
        let timestamp = resArray[i];
        Description = Description + timestamp + "\n";
      }
      Description = Description + "\n" + AfterDesc;
      DescArrR.push(Description);
      Description = "";
    }
    return 1;
  } else {
    // error message
    console.log("Both Stream and Recording Arrays returned Nothing.");
    return 0;
  }
}
//#endregion

//#region DomSet: Sorts Arrays and Calls SetIns() also sorts data and makes Sidebar content on the webpage
// makes: The sidebar content,
// Input: Nothing
// Outputs: a Working side bar, also calls SetIns()
// returns Nothing
function DomSet() {
  DescArrS.reverse(); // makes array be Newest First
  DescArrR.reverse();
  StreamDatesArr.reverse();
  RecordDatesArr.reverse();

  // Update Sidebar
  let SidebarDiv = document.getElementById("SideBar") as HTMLElement;
  let nav = document.createElement("nav");
  let ul = document.createElement("ul");

  //nav.classList.add("navbar");
  //ul.classList.add("nav", "flex-column", "text-center");

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
  } else if (DescArrS.length < 0) {
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
    // recordings have not been tested yet may not work
    SetIns(DescArrR, RecordDatesArr, "Record");
  } else {
    console.log("No recording Timestamps found");
  }
  nav.append(ul);
  SidebarDiv.append(nav);
  return 1;
}
//#endregion

//#region SetIns: Function Takes Arrays and Sets them into the Webpage does not sort.
// makes: The Acordions for Streams or Recordings on the page by setting them in
// Input: A sorted Timestamp array, Date Array, and a String with the name of the array content.
// Outputs: Nothing, Void;
// returns Nothing
function SetIns(DescArr, DatesArr, string: string) {
  var DescDiv = document.getElementById(
    "DescriptionAreaDiv"
  ) as HTMLInputElement;
  for (let index = 0; index < DescArr.length; index++) {
    // Makes Vars for a bootstrap Accordion
    // Acord Div
    let AcordDiv = document.createElement("div");
    AcordDiv.classList.add("accordion", "mt-4");

    // Acord Item
    let AcordItem = document.createElement("div");
    AcordItem.classList.add("accordion-item");
    AcordItem.setAttribute("id", `${string}-${index}`);
    // Acord Body
    let AcordBody = document.createElement("div");
    AcordBody.classList.add("accordion-body");
    // H2
    let h2 = document.createElement("h2");
    h2.classList.add("accordion-header");

    // Button for Acordion
    let button = document.createElement("button");
    button.classList.add("accordion-button", "btn", "collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#collapse${index}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `collapse${index}`);
    button.setAttribute("id", `AcordBtn-${index}`);

    // Collapse Div
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
    // Text Area for Description

    let Textarea = document.createElement("textarea");
    Textarea.classList.add("d-flex", "m-1", "res", "form-control", "Textarea");
    Textarea.innerHTML = DescArr[index];
    Textarea.setAttribute("id", `myInput${index}`);
    button.innerHTML = DatesArr[index] + ` - ${string}`;
    // Select, Copy, Youtube Bar Vars

    // Buttons
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

    // Apending
    h2.append(button);
    AcordItem.append(h2);

    //collapsedDiv.

    // Over Text area Bar
    CharDiv.append(h4);
    CharDiv.append(PNo);
    AcordBody.append(CharDiv);
    // Textarea
    AcordBody.append(Textarea);

    // Button Bar
    ButtonDiv.append(SelectBtn);
    ButtonDiv.append(CopyBtn);
    ButtonDiv.append(YoutubeBtn);
    AcordBody.append(ButtonDiv);

    // Final Appening
    collapsedDiv.append(AcordBody);
    AcordItem.append(collapsedDiv);
    AcordDiv.append(AcordItem);
    DescDiv.append(AcordDiv);
  }
}
//#endregion

// Small Functions
//#region V Small Functions V

//#region AddClipDelay: Function Adds ClipDelay to 0:07:30 like timestamps
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

//#region to2Time: Function Shortens a Timestamp and removes non usefull infomation
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

//#region SectoTimestamp function, makes a timestamp that will work in the youtube description
// converts the time into minutes and hours from seconds
function SectoTimestamp(seconds: any) {
  let date = new Date(); // find out why it prints timestamps like "12:12:26" remove the 12 // Fixed
  date.setHours(0, 0, 0); // sets date to 00:00:00
  date.setSeconds(seconds); // adds secounds making it into a timestamp
  let dateText = date.toString(); // cuts timestamp out // effectively the same that gets printed when you do console.log(date);
  dateText = dateText.substring(16, 25);
  let DigitA = dateText.split(":"); // *8*, *07*, *28*
  if (DigitA[0] == "00") {
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
    if (DigitA[0][0] == "0") {
      // removes stuff like 08:07:28
      return DigitA[0][1] + ":" + DigitA[1] + ":" + DigitA[2];
    } else {
      return dateText; // returns values like  8:07:28, 24:03:53. does not touch timestamp
    }
  }
}
//#endregion

//#region TimestampToDate(Timestamp String) converts a 1:09:24 timestamp into a date time
function TimestampToDate(timestamp: string) {
  //1:09:24
  let T = Array();
  T = timestamp.split(":");
  let date = new Date();
  date.setHours(0, 0, 0);
  if (T.length == 3) {
    date.setHours(T[0]);
    date.setMinutes(T[1]);
    date.setSeconds(T[2]);
    return date;
  } else {
    date.setMinutes(T[0]);
    date.setSeconds(T[1]);
    return date;
  }
}

//#endregion

//#region ErrorMessage() makes an alert from data
// Error messages out an alert
function ErrorMessage(string, Err) {
  alert(string + +"'' " + Err + " ''");
}
//#endregion

//#region parseISOString(Isostring) turns an iso String of a date into a Date object.
function parseISOString(Isostring) {
  var b = Isostring.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}
//#endregion

// needs a VALID Twitch App Auth Token
//#region validateToken() Validates Token if sucessful returns 1 if not 0
// Calls the Twitch api with Out App Acess Token and returns a ClientId and tells us if the App Acess Token is Valid or Not
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
        console.log(resp);
        let date = new Date();
        date.setSeconds(resp.expires_in);
        let p = document.getElementById("AccessTokenTime") as HTMLElement;
        p.innerHTML =`• Your Token will Expire on: \n ${date.toString()}`;
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
//#endregion

// needs ValidateToken() to be ran first
//#region [async] HttpCaller(HttpCall) multipurpose HttpCaller calls the Httpcall returns The Response if Success if not: 0
// This makes most calls, intead of a lot of differnt functions this does them instead.
// TO find out what is called look where its called as the HTTPCALL would need to be sent over.
async function HttpCalling(HttpCall: string) {
  const respon = await fetch(`${HttpCall}`, {
    headers: {
      Authorization: "Bearer " + AppAcessToken,
      "Client-ID": AclientId, // can also use Tclient_id. !! comment out Tclient if not being used !!
    },
  })
    .then((respon) => respon.json())
    .then((respon) => {
      // Return Response on Success
      return respon;
    })
    .catch((err) => {
      // Print Error if any. And return 0
      console.log(err);
      return err;
    });
  return respon;
}
//#endregion
//#endregion
