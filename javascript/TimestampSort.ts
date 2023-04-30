// Misc
let HotV = "V-1.0_beta"; // the version of H.o.t


// Get these from Files in the future
let TimestampTxt = $$.id("TimestampTxt") as HTMLInputElement;
let RawTxt;

// Settings
var AppAcessToken;
var SettingsLocal;
if (TimestampTxt != null) {
  RawTxt = TimestampTxt.innerHTML;
  
} else {
  $$.log(
    "Your Timestamp.Txt was not found!, check if the filepath is correct or if it doesnt have data in it!"
  );
}
if (config.TWITCH_API_TOKEN == "" || config.TWITCH_API_TOKEN == null) {
  $$.log(
    "H.O.T could not get your TwitchKey, you will not be able to use Clip-Stamps"
  );
  let TwitchClipbtn = $$.id("TwitchClip") as HTMLInputElement;
  TwitchClipbtn.disabled = true;
}
if (config.CLIP_OFFSET == null) {
  $$.log(
    "you didnt set a config.CLIP_OFFSET, H.O.T has defaulted to 26 seconds of offset."
  );
}
if (config.TWITCH_LOGIN == null || config.TWITCH_LOGIN == "") {
  $$.log(
    "you didnt set a TwitchLoginName, you will not be able to use Clip-Stamps"
  );
  let TwitchClipbtn = $$.id("TwitchClip") as HTMLInputElement;
  TwitchClipbtn.disabled = true;
}
if (config.LOCALIZE_ON == false) {
  $$.log("LocalSettings not found Turning off Local Mode");
  SettingsLocal = "" as string;
  //SettingsLocal = Plocal.innerHTML as string;
} else {
 
}

// Asigned later
var AclientId = "" as string;
var TwitchConnected = false; // tells if the Twitch HTTP calls should be called or not.

var MultiDimStreamArr = Array(); // Holds Raw Data from txt
var MultiDimRecordArr = Array(); // Holds Raw Data from txt
var StreamDatesArr = Array(); // Holds data for when a stream was streamed
var RecordDatesArr = Array(); // Holds data for when a Recording was recorded
var DescArrS = new Array(); // holds all the Finished Stream descriptions
var LocalDescArrS = new Array();
var DescArrR = new Array(); // holds all the Finished Recording descriptions
var LocalDescArrR = new Array();

var StreamDatesRaw = new Array();

//#region Token Validation.
validateToken();
//#endregion

//#region Basic Setup H.O.T NON Twitch API
if (config.INFOWRITER_ON == true) { // run if infowriter is installed.
  if (CutOuts(RawTxt) == 1) {
    // Runs CutOuts and if successful run next Method in line
    //@ts-expect-error
    if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
      // Runs SetOps if sucessful run next Method in line
      // Set in Data to Webpage
      let stats = $$.id("Stats") as HTMLElement;
      stats.innerHTML = `• Found ${MultiDimStreamArr.length} Streams, and ${MultiDimRecordArr.length} Recordings`;
      if (DomSet() == 1) {
        // Domset needs to be ran before we call ValidateToken();
      } else {
        // Error logging
        $$.log("Failed Placing Things in the Websites");
      }
    } else {
      $$.log("Error Creating Description");
    }
  } else {
    $$.log("Error Sorting Timestamps");
  }
}
//#endregion

// Twitch handling

// Event handlers

// Twitch Clip Needs A Big Clean up.
//#region TwitchClip gets twitch clips for your description when clicked
let TwitchClip = $$.id("TwitchClip") as HTMLInputElement;

TwitchClip.addEventListener("click", async function (event: any) {
  if (TwitchConnected == true) {
    // Calling API to get ID of streamer with this name
    let UserIdResp = await HttpCalling(
      `https://api.twitch.tv/helix/users?login=${config.TWITCH_LOGIN}`
    );

    //#region Getting Timestamp from Acord buttons
    let AcorBtns = Array();
    let StreamedDate = Array(); // date a stream took place local ver

    // getting acordbuttons & local timestamps.
    for (let index = 0; index < StreamDatesArr.length; index++) {
      AcorBtns.push($$.id(`AcordBtn-${index}`));
    }
    for (let index = 0; index < AcorBtns.length; index++) {
      let Timestamps = AcorBtns[index].innerHTML.split(" ");
      StreamedDate.push(Timestamps[5] +"T"+ Timestamps[6]+".000Z");
    }
    //#endregion
    //#region Checking if there even is any VODS
    let VODcount = 0;
    let UserVods = (await HttpCalling(
      `https://api.twitch.tv/helix/videos?user_id=${UserIdResp["data"][0]["id"]}`
    )) as Array<string>;
    // counting VODs
    for (let index = 0; index < UserVods["data"].length; index++) {
      if (UserVods["data"][index]["type"] != "highlight") {
        VODcount++;
      }
    }
    //#endregion
    let textareaPrint = 0 as number;
    for (let StreamsStreamed = 0; StreamsStreamed < StreamedDate.length; StreamsStreamed++) {
      
    if (VODcount != 0 || VODcount != null) {
      let res = AcorBtns[StreamsStreamed].innerHTML.split(" ");
      // Gets Sorted Clips on the same day of the stream.
      var MultidimClipResps = SortClips(
        await GetClipsFromDate(res[5], UserIdResp["data"][0]["id"]),
        false
      ) as Array<string>;

      // Description Vars
      var TimestampTwitch = Array();
      let LocalSceneShift = Array();
      let LocalSceneTime = Array();

      // get Clip Offset but should also get Start Creative or Scene shift timestamps.
      //#region Getting Local Scene Shift timestamps
      // get Local Timestamps for scenes
      let LocalSceneShifttemp = Array();
      //let LocalSceneTimetemp = Array();
      for (let V = 0; V < MultiDimStreamArr[StreamsStreamed].length; V++) {
        let res = MultiDimStreamArr[StreamsStreamed];
        if (res == undefined) {
          // for some reason keeps running into indexes it doesnt have? this fixes it but MAyyyy be not the best fix
          continue;
        } else {
          for (let i = 0; i < res.length; i++) {
            let Timestamp = res[i]; // String with timestamp
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
          let ClipTimestamp = "" as string
          if(MultidimClipResps[i]["vod_offset"] != null && MultidimClipResps[i]["vod_offset"] != "") {
            ClipTimestamp = SectoTimestamp(MultidimClipResps[i]["vod_offset"]);
          }
          else {
            ClipTimestamp = GetClipVODOffsetFromDate(StreamedDate[StreamsStreamed], ClipDates[i].toISOString());
          }
          // gives a timestamp close to LOCAL timestamp from Twitch API.
          TimestampTwitch.push(
            "• " +
              
            ClipTimestamp +
              " " +
              MultidimClipResps[i]["title"]
          );
      }

      //#endregion

      // set timestamp arrays into one big one that we have to sort.
      let TimestampArr = Array();
      TimestampArr = LocalSceneShifttemp.concat(TimestampTwitch);

      // sort timestamps into correct sorting
      // fun fact the indexes are named: Q,T,Pie,u because thats what u are :)
      //#region Making Timestamps into Dates and sorting them.
      let SortTime = Array();
      for (let q = 0; q < TimestampArr.length; q++) {
        let res = TimestampArr[q].split(" ");
        SortTime.push(TimestampToDate(res[1]));
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
        for (let u = 0; u < TimestampArr.length; u++) {
          if (TimestampArr[u].match(Reg)) {
            CompleteTimestampArr.push(TimestampArr[u]);
            break;
          }
        }
      }
      //#endregion

      // Creates both a local (if enabled) and normal description and replaces the correct index of description.
      DescriptionReplace(CompleteTimestampArr, textareaPrint, false);
      textareaPrint++;
      // @ts-expect-error
      if(config.LOCALIZE_ON != false && config.LOCALIZE_ON != "false") {
        DescriptionReplace(CompleteTimestampArr, textareaPrint, true);
        textareaPrint++;
      }

      // change Acord button titles.
      ChangeAcordButtonNames(MultidimClipResps, StreamsStreamed, AcorBtns);
    } else {
      // Found No Vods to get names from.
      // Getting clips without a VOD
      $$.log("Getting clips for streams without VODs");


    }
  }
    // Found No Vods to get names from.
  } else {
    $$.log("Failed to Validate Token Try Again");
    validateToken();
  }
});



//#endregion

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
      //$$.log("In Event Stop: " + Word); // enters
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
      //$$.log("word passed 0:00:00 test:"+ Word);
      if (Word.match(/.*Record.*/i)) {
        let Timestamp =
          "• " + to2Time(AddClipDelay(Word, config.CLIP_OFFSET)) + ` [ClipNo${ClipNo}]`;
        ClipNo++;
        RecordArr.push(Timestamp);
      }
      if (Word.match(/.*Stream.*/i)) {
        // 7:58:58 Stream Time Marker
        let Timestamp =
          "• " + to2Time(AddClipDelay(Word, config.CLIP_OFFSET)) + ` [ClipNo${ClipNo}]`;
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
async function SetOps(MultiDimStreamArr: string[], MultiDimRecordArr: string[]) {
  // Set in All the timestamps correctly
  let BeforeDesc = await $$.txt("Texts/BeforeTimestamps.txt") as string;
  let AfterDesc = await $$.txt("Texts/AfterTimestamps.txt") as string;
  let LocalBeforeDesc = await $$.txt("Texts/LocaleBeforeTimestamps.txt") as string;
  let LocalAfterDesc = await $$.txt("Texts/LocaleAfterTimestamps.txt") as string;

  let success = false;
  var Description = ""; // Finished Description Var
  var LocalDescript = ""; // finished description in another language

  // Makes a Working Description
  // If Not Null
  if (MultiDimStreamArr.length > -1) {
    // if has Values
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
    // if has Values
    for (let index = 0; index < MultiDimRecordArr.length; index++) {
      let resArray = MultiDimRecordArr[index];
      if (config.LOCALIZE_ON != false) {
        // LocalBeforeDesc = LocalBeforeDesc;
        // LocalAfterDesc = LocalAfterDesc;
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
  } else {
    // error message
    // $$.log("Both Stream and Recording Arrays returned Nothing.");
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
  LocalDescArrS.reverse();
  LocalDescArrR.reverse();
  StreamDatesArr.reverse();
  RecordDatesArr.reverse();
  // Update Sidebar
  let SidebarDiv = $$.id("SideBar") as HTMLElement;
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
    console.log("in DOM SET");
    SetIns(
      DescArrS,
      StreamDatesArr,
      "Stream",
      "StreamingNo",
      LocalDescArrS,
      "LocaleDesc-",
      "streamtextarr",
      0
    );
  } else if (DescArrS.length < 0) {
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
    // If LocalMode is on it will double the amount of textareas and charcounters since now both a tranlated and original description is made!
    if (config.LOCALIZE_ON == false) {
      SetIns(
        DescArrR,
        RecordDatesArr,
        "Record",
        "RecordingNo",
        LocalDescArrR,
        "recordLocalInput",
        "recordInput",
        DescArrS.length
      );
    } else {
      SetIns(
        DescArrR,
        RecordDatesArr,
        "Record",
        "RecordingNo",
        LocalDescArrR,
        "recordLocalInput",
        "recordInput",
        DescArrS.length * 2
      );
    }
  } else {
    $$.log("No recording Timestamps found");
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

function SetIns(
  DescArr: Array<string>,
  DatesArr: Array<string>,
  string: string,
  IDname: string,
  LocalArr: Array<string>,
  LocalID: string,
  TextAreaID: string,
  CharCount_index: number
) {
  console.log("in Setins");
  var DescDiv = $$.id(
    "DescriptionAreaDiv"
  ) as HTMLInputElement;
  for (let index = 0; index < DescArr.length; index++) {
    // Makes Vars for a bootstrap Accordion
    // Acord Div
    let AcordDiv = $$.make("div");
    AcordDiv.classList.add("accordion", "mt-4");

    // Acord Item
    let AcordItem = $$.make("div");
    AcordItem.classList.add("accordion-item");
    AcordItem.setAttribute("id", `${string}-${index}`);
    // Acord Body
    let AcordBody = $$.make("div");
    AcordBody.classList.add("accordion-body");
    // H2
    let h2 = $$.make("h2");
    h2.classList.add("accordion-header");

    // Button for Acordion
    let button = $$.make("button");
    button.classList.add("accordion-button", "btn", "collapsed");
    button.setAttribute("type", "button");
    button.setAttribute("data-bs-toggle", "collapse");
    button.setAttribute("data-bs-target", `#${IDname + index}`);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", `${IDname + index}`);
    button.setAttribute("id", `AcordBtn-${index}`);

    // Collapse Div
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
    // Text Area for Description

    let LocalTextarea = $$.make("textarea");
    if (config.LOCALIZE_ON == true) {
      LocalTextarea.classList.add(
        "d-flex",
        "m-1",
        "res",
        "form-control",
        "Charcounts"
      );
      LocalTextarea.innerHTML = LocalArr[index];
      LocalTextarea.setAttribute("id", `myLocalInput${index}`);
    }

    let Textarea = $$.make("textarea");
    Textarea.classList.add(
      "d-flex",
      "m-1",
      "res",
      "form-control",
      "Textarea",
      "Charcounts"
    );
    Textarea.innerHTML = DescArr[index];
    Textarea.setAttribute("id", `${TextAreaID}${index}`);
    if (index % 2) {
      button.innerHTML =
        "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXTIcon.png'> " +
        "| " +
        DatesArr[index] +
        ` - ${string}`;
    } else {
      button.innerHTML =
        "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXT2Icon.png'> " +
        "| " +
        DatesArr[index] +
        ` - ${string}`;
    }

    // Select, Copy, Youtube Bar Vars

    // Buttons
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
    // Apending
    h2.append(button);
    AcordItem.append(h2);

    //collapsedDiv.

    // Over Text area Bar
    CharDiv.append(h3);
    CharDiv.append(PNo);
    AcordBody.append(CharDiv);
    // Textarea
    AcordBody.append(Textarea);
    // Button Bar
    ButtonDiv.append(SelectBtn);
    ButtonDiv.append(CopyBtn);
    ButtonDiv.append(YoutubeBtn);
    AcordBody.append(ButtonDiv);

    CharCount_index++; // Counter for how many TextAreas there is.

    if (config.LOCALIZE_ON == true) {
      let hr = $$.make("hr") as HTMLElement;
      let FontDiv = $$.make("div") as HTMLElement;
      FontDiv.classList.add("d-flex", "justify-content-between");
      let h3 = $$.make("h3") as HTMLElement;
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
      // Copy/select Buttons
      let ButtonDivL = $$.make("div");
      ButtonDivL.classList.add("my-3");
      // Select
      let SelectLBtn = $$.make("button") as HTMLElement;
      SelectLBtn.innerHTML = "Select Text";
      SelectLBtn.classList.add("btn", "mx-1", "Select", "button");
      SelectLBtn.setAttribute("value", `${CharCount_index}`);
      // Copy
      let CopyBtnL = $$.make("button");
      CopyBtnL.innerHTML = "Copy Text";
      CopyBtnL.classList.add("btn", "mx-1", "Copy", "button");
      CopyBtnL.setAttribute("value", `${CharCount_index}`);
      // Youtube
      let YoutubeBtnL = $$.make("button");
      YoutubeBtnL.innerHTML = "Update YT Vid";
      YoutubeBtnL.classList.add("btn", "mx-1", "Send", "button");
      YoutubeBtnL.setAttribute("id", "authbtn");
      YoutubeBtnL.setAttribute("value", `${CharCount_index}`);

      // Appending
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

    console.log(AcordDiv);
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
  let dateText = date.toString(); // cuts timestamp out // effectively the same that gets printed when you do $$.log(date);
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
  if (
    AppAcessToken != undefined &&
    AppAcessToken != "" &&
    AppAcessToken != null
  ) {
    await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {
        Authorization: "Bearer " + AppAcessToken,
      },
    })
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.status) {
          if (resp.status == 401) {
            $$.log("This token is invalid ... " + resp.message);
            return 0;
          }
          $$.log("Unexpected output with a status");
          return 0;
        }
        if (resp.client_id) {
          AclientId = resp.client_id;
          TwitchConnected = true;
          $$.log("Token Validated Sucessfully");
          let p = $$.id("AccessTokenTime") as HTMLElement;
          let Time = new Date(resp.expires_in * 1000);
          let TimeStrDash = Time.toISOString().split("-");
          let TimeStrT = TimeStrDash[2].split("T");
          let TimeString = `${
            parseInt(TimeStrDash[1].substring(1, 2)) - 1
          } Month ${TimeStrT[0]} Days & ${TimeStrT[1].substring(0, 8)} Hours`;
          p.innerHTML = `• Current Token Will Expire In: <br> ${TimeString}.`;
          return 1;
        }
        $$.log("unexpected Output");
        return 0;
      })
      .catch((err) => {
        $$.log(err);
        return 0;
      });
    return 1;
  } else {
    return 0;
  }
}
//#endregion

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
      $$.log(err);
      return err;
    });
  return respon;
}
//#endregion
//#endregion

//#region functions for ClipStamps
// gets clips from a date plus 1 day forward, needs date and streamerID
async function GetClipsFromDate(StreamedDate: string, StreamerID: string) {
  let StartDate = new Date(StreamedDate); // starting date set to stream start time.
  let EndDate = new Date(StreamedDate); // gets whole day worth time. note: going over 24 hours stream time would be a problem.
  EndDate.setDate(EndDate.getDate() + 1);
  let http2 = `https://api.twitch.tv/helix/clips?broadcaster_id=${StreamerID}&first=100&started_at=${StartDate.toISOString()}&ended_at=${EndDate.toISOString()}`;
  let resp = await HttpCalling(http2);

  // Test if Clipper is the Streamer
  let Clips = Array();
  for (let i = 0; i < resp["data"].length; i++) {
    if (
      resp["data"][i]["creator_name"].toLowerCase() == config.TWITCH_LOGIN.toLowerCase()
    ) {
      Clips.push(resp["data"][i]);
    } else {
      // Ignore clips not made by self.
    }
  }

  return Clips;
}

function SortClips(Clips: Array<string>, GetClipDates: boolean) {
  let SortedClips = Array(); // holds sorted clips
  let ClipsDateArr = Array(); // holds dates of clips for sorting.
  for (let index = 0; index < Clips.length; index++) {
    ClipsDateArr.push(parseISOString(Clips[index]["created_at"]));
  }
  // Sorting to correct dates
  ClipsDateArr.sort(function (a, b) {
    return a - b;
  });
  for (let q = 0; q < ClipsDateArr.length; q++) {
    for (let y = 0; y < Clips.length; y++) {
      // 11 elements in one array
      let Date = parseISOString(Clips[y]["created_at"].toString()); // Clip Unsorted Dates
      if (ClipsDateArr[q].toString() == Date.toString()) {
        SortedClips.push(Clips[y]);
      }
    }
  }
  if (GetClipDates == true) {
    return ClipsDateArr;
  } else {
    return SortedClips;
  }
}

// changes titles of acord buttons
async function ChangeAcordButtonNames(
  Clips: Array<string>,
  index: number,
  AcordButtonArr: Array<HTMLElement>
) {
  let gameresp = await HttpCalling(
    `https://api.twitch.tv/helix/games?id=${Clips[0]["game_id"]}` // just picks the game of the first clips data.
  );
  if (index % 2) {
    AcordButtonArr[index].innerHTML =
      "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXTIcon.png'> " +
      "| " +
      StreamDatesArr[index] +
      ` - Playing: '${gameresp["data"][0]["name"]}'  → With: ${Clips.length} Clips`;
  } else {
    AcordButtonArr[index].innerHTML =
      "<img class='imgIcon me-2' src='img\\Icons\\TimestampTXT2Icon.png'> " +
      "| " +
      StreamDatesArr[index] +
      ` - Playing: '${gameresp["data"][0]["name"]}'  → With: ${Clips.length} Clips`;
  }
}

// Calcs how many seconds into the vod a clip was made, effectively making the Twitch VODOffset without the need for the api
function GetClipVODOffsetFromDate(StreamDate:string, ClipedDate: String) {
  let StreamDateTime = parseISOString(StreamDate) as Date;
  let ClipDateTime = parseISOString(ClipedDate) as Date;
  var secounds = (StreamDateTime.getTime() - ClipDateTime.getTime()) / 1000 as any;
  if(secounds < 0){
    secounds = Math.abs(secounds);
  }
  return SectoTimestamp(secounds);
}

// Replaces the descriptions of the textareas
async function DescriptionReplace(TimestampsArr: Array<string>, Index: number, localprint: boolean) {
  let Desc = $$.class(`Charcounts`) as any;
  if (localprint == true) {
    var LNewDesc = ""; // Finished Description Var
    let res = $$.id("LocalBeforeDesc") as HTMLInputElement;
    let res1 = $$.id("LocalAfterDesc") as HTMLInputElement;

    let BeforeDescL = res.innerHTML;
    let AfterDescL = res1.innerHTML;

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
  } else {
    var NewDesc = ""; // Finished Description Var
    let res = $$.id("BeforeDesc") as HTMLInputElement;
    let res1 = $$.id("AfterDesc") as HTMLInputElement;

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
//#endregion