let Clipoffset = 26; // twitch default

let TimestampTxt = document.getElementById("TimestampTxt") as HTMLInputElement;
let RawTxt = TimestampTxt.innerHTML;

// Get these from Files in the furture
var TappAcess = "ncma1vkg5ebul64cxjo60vjv5ddomb" as string;
let client_id2 = "" as string;

var MultiDimStreamArr = Array(); // Holds Raw Data from txt
var MultiDimRecordArr = Array(); // Holds Raw Data from txt
var StreamDatesArr = Array(); // Holds data for when a stream was streamed
var RecordDatesArr = Array(); // Holds data for when a Recording was recorded
var DescArrS = new Array(); // holds all the Finished Stream descriptions
var DescArrR = new Array(); // holds all the Finished Recording descriptions

if (CutOuts(RawTxt) == 1) {
  // Runs CutOuts and if successful run next Method in line
  if (SetOps(MultiDimStreamArr, MultiDimRecordArr)) {
    // Runs SetOps if sucessful run next Method in line
    DomSet(); // Set in Data to Webpage
  } else {
    console.log("Error Creating Description");
  }
} else {
  console.log("Error Sorting Timestamps");
}

// Twitch handling

// calls functions getting data from recent Twitch VODs
validateToken2(TappAcess);

//#region validateToken2: Validates App Token and Calls fetchUserId()
// makes: Nothing
// Input: TappAcess: A Twitch App Access Token
// Outputs: a Validated Token and Calls fetchUserId()
function validateToken2(TappAcess) {
  fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: "Bearer " + TappAcess,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status) {
        if (resp.status == 401) {
          console.log("This token is invalid" + resp.message);
          // document.getElementById('output').textContent = 'This token is invalid: ' + resp.message;
          return;
        }
        console.log(resp);
        console.log("Unexpected output with a status");
        //document.getElementById('output').textContent = 'Unexpected output with a status?';
        return;
      }
      if (resp.client_id) {
        client_id2 = resp.client_id;

        //console.log("Token is valid");
        if (resp.user_id) {
           console.log("Token is type User Access");
        } else {
           console.log("Token is type App Access");
        }
        fetchUserId(client_id2, TappAcess, "grat_grot10_berg");
        return;
      }
      console.log(resp);
      console.log("unexpected Output");
    })
    .catch((err) => {
      ErrorMessage("An Error Occured VALIDATING token data", err);
    });
}
//#endregion

//#region fetchUserId: Fetches the User Id of a User from a TwitchUsername then calls fetchVods()
// makes: Nothing
// Input: ClientId, App Access Token, StreamerName
// Outputs: Outputs the Id of a User and calls fetchVods()
function fetchUserId(
  client_id2 : string,
  access_token: string,
  streamerName: string
): any {
  fetch(`https://api.twitch.tv/helix/users?login=${streamerName}`, {
    headers: {
      "Client-ID": client_id2,
      Authorization: "Bearer " + access_token,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
    console.log(resp);

    fetchVods(resp.data[0].id);
    })
    .catch((err) => {
      console.log(
        "Could not fetch user Are you sure its spelt correctly?",
        err,
      );
      console.log(err);
    });
}
//#endregion

//#region fetchVods: Gets the Vods from The streamers Recent Streams
// Input: ClientId, App Access Token, UserId
// Outputs: Outputs the Id of a User and calls fetchVods()
function fetchVods(user_Id) {
  fetch(`https://api.twitch.tv/helix/videos?user_id=${user_Id}`, {
    headers: {
      "Client-ID": client_id2,
      Authorization: "Bearer " + TappAcess,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
     console.log(resp);

      

    })
    .catch((err) => {
      console.log("An Error Occured VALIDATING token data", err);
    });
}
//#endregion


// Event handlers


// Large Functions

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

  nav.classList.add("navbar");
  ul.classList.add("nav", "flex-column", "text-center");

  if (DescArrS.length > 0) {
    let liSeparate = document.createElement("li");
    let aSeprate = document.createElement("a");
    liSeparate.classList.add("nav-item", "m-3");
    aSeprate.classList.add("navlink", "me-4");
    aSeprate.setAttribute("href", "#Stream");
    aSeprate.innerHTML = "# Streams";
    liSeparate.append(aSeprate);
    ul.append(liSeparate);
    for (let index = 0; index < DescArrS.length; index++) {
      let li = document.createElement("li");
      li.classList.add("nav-item", "m-3");
      let a = document.createElement("a");
      a.innerHTML = `◍ Stream - ${index + 1}`;
      a.setAttribute("href", `#Stream-${index}`);
      a.classList.add("navlink", "text-center");
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
    liSeparate.classList.add("nav-item", "m-3");
    aSeprate.classList.add("navlink", "me-4");
    aSeprate.setAttribute("href", "#Record");
    aSeprate.innerHTML = "# Recordings";
    liSeparate.append(aSeprate);
    ul.append(liSeparate);
    for (let index = 0; index < DescArrR.length; index++) {
      let li = document.createElement("li");
      li.classList.add("nav-item", "m-3");
      let a = document.createElement("a");
      a.innerHTML = `▶ Record - ${index + 1}`;
      a.setAttribute("href", `#Record-${index}`);
      a.classList.add("navlink", "text-center");
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
  let res = document.getElementById("DescTxt") as HTMLInputElement;
  let res1 = document.getElementById("IntroTxt") as HTMLInputElement;
  let res2 = document.getElementById("SocialTxt") as HTMLInputElement;
  let res3 = document.getElementById("CreditsTxt") as HTMLInputElement;

  let DescTxt = res.innerHTML;
  let IntroTxt = res1.innerHTML;
  let SocialTxt = res2.innerHTML;
  let CreditsTxt = res3.innerHTML;
  var Description = ""; // Finished Description Var

  // Makes a Working Description
  // If Not Null
  if (MultiDimStreamArr.length > 0) {
    // if has Values
    for (let index = 0; index < MultiDimStreamArr.length; index++) {
      let resArray = MultiDimStreamArr[index];

      Description = DescTxt + "\n\n";
      Description =
        Description +
        `Hotkey, Operated, Time-stamper (H.O.T) V.2.3 \n(Clips are Offset by -${Clipoffset})\n`;
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
  } else if (MultiDimRecordArr.length > 0) {
    // if has Values
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
  } else {
    // error message
    console.log("Both Stream and Recording Arrays returned Nothing.");
    return 0;
  }
}
//#endregion

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
  var Catch = false as boolean;
  var LineScene = "" as String;
  let ClipNo = 0 as number;
  let xs = 0;
  let xr = 0;
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

//#region Setins: Function Takes Arrays and Sets them into the Webpage does not sort.
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

    // Icons for BTNS
    let TwitchIcon = document.createElement("img");
    TwitchIcon.setAttribute("src", "img\\TwitchIconsmol.png");
    TwitchIcon.classList.add("imgIcon");
    let TwitchIcon2 = document.createElement("img");
    TwitchIcon2.setAttribute("src", "img\\TwitchIconsmol.png");
    TwitchIcon2.classList.add("imgIcon");
    let YoutubeIcon = document.createElement("img");
    YoutubeIcon.setAttribute("src", "img\\Youtube.png");
    YoutubeIcon.classList.add("imgIcon");

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
    SelectBtn.append(TwitchIcon);
    CopyBtn.append(TwitchIcon2);
    YoutubeBtn.append(YoutubeIcon);
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

//#region ErrorMessage() makes an alert from data
// Error messages out an alert
function ErrorMessage(string, Err) {
  alert(string + +"'' " +Err+ " ''" );
}
//#endregion