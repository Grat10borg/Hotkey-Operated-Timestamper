//#region Import Export, doesnt work yet

let PBeforeDesc = document.getElementById("BeforeDesc") as HTMLInputElement;
let PAfterDesc = document.getElementById("AfterDesc") as HTMLInputElement;
let PTKey = document.getElementById("TwitchKey") as HTMLElement;

// Settings
let BeforeDesc = PBeforeDesc.innerHTML;
let AfterDesc = PAfterDesc.innerHTML;
var TappAcess = PTKey.innerHTML;

// Asigned later
let UserId = "";
let client_id = "";
validateTToken();
// Website Data Handling

//#region Submit button form

// Getting Form Data
// Make btn event for Clearing button, only makes an alert
var Id: string;
var form = document.querySelector("#HighlighForm") as any;
var ErrorDiv = document.getElementById("ErrorDiv") as HTMLElement;
form.addEventListener(
  "submit",
  async function (event: any) {
    event.preventDefault();
    //#region Setting of Start and End Date and Viewcount
    let Startdate = new Date(form.date.value) as any; // changes to string later
    if (Startdate == "Invalid Date") {
      Startdate = new Date();
      Startdate.setDate(Startdate.getDate() - 90);
      console.log("start date was not given, getting clips from 90 days ago");
    }
    let endDate = new Date(form.endDate.value) as any; // changes to string later too
    let game_id = form.SelectGame.options[form.SelectGame.selectedIndex].value;
    let viewCount = form.viewcount.value;
    if (viewCount == "") {
      // sets default value if none is given
      viewCount = 1;
    }
    //#endregion

    //#region Testing if Values are Valid 
    // Tests if start date is an aproved date, else print error
    try {
      Startdate = Startdate.toISOString();
    } catch (error) {
      console.log("The Set Date Value was Not allowed");
      console.log(error);
    }
    // Makes sure the End Date always is a Aproved Date
    if (endDate == "Invalid Date") {
      endDate = new Date(); // make end date be Today right now, clips wont be in the future anyways
      console.log(
        "Sluts Dato var ikke sat, defaulter til Dagens dato som sluts dato"
      );
      endDate = endDate.toISOString();
    } else {
      endDate = endDate.toISOString();
    }
    //#endregion

    //#region HTTPCalling Fitting Clips, Then calls Clip Sorter
    let ClipResp = await HttpCaller(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${UserId}&first=100&started_at=${Startdate}&ended_at=${endDate}`
    );
    console.log(ClipResp);
    ClipSorter(ClipResp, game_id, viewCount);
    //#endregion
    
  },
  true
);

//#endregion

// Twitch Api Handling

//#region ChannelSelect Eventhandler
let ChannelSelect = document.querySelector("#SelectChannel") as any;
ChannelSelect.addEventListener("change", async function () {
//#region Getting channel ID
  let StreamerName = ChannelSelect.options[ChannelSelect.selectedIndex].value;
  console.log("Searching for " + StreamerName); // en
  ErrorDiv.innerHTML = ""; // clear errors
  let UserResp = await HttpCaller(
    `https://api.twitch.tv/helix/users?login=${StreamerName}`
  );
  UserId = UserResp["data"][0]["id"];
  //#endregion

  //#region Getting GameNames From Clips
  let d = new Date();
  let RFCdato = new Date();
  RFCdato.setDate(RFCdato.getDate() - 90); // takes a month worth of clips
  let GameResp = await HttpCaller(
    `https://api.twitch.tv/helix/clips?broadcaster_id=${UserId}&first=100&started_at=${RFCdato.toISOString()}&ended_at=${d.toISOString()}`
  );
  var GameIds = new Set(); // sets can only hold uniq values
  for (let index = 0; index < GameResp["data"].length; index++) {
    GameIds.add(GameResp["data"][index]["game_id"]);
  }
  //#endregion

  //#region Getting GameIDs From GameNames
  let httpcall = "https://api.twitch.tv/helix/games?"; // cannot handle more then 100 ids at one time
  let index = 0;
  GameIds.forEach((Gameid) => {
    //console.log(Gameid);
    if (index == 0) {
      httpcall = httpcall + "id=" + Gameid;
    } else {
      httpcall = httpcall + "&id=" + Gameid;
    }
    index++;
  });
  //#endregion

  //#region Getting Games from Selected Channel and Placing it on Website.
  let SelectGameResp = await HttpCaller(httpcall);
  // getting select box
  let selectboxG = document.getElementById("SelectGame") as HTMLInputElement;

  while (selectboxG.firstChild) {
    // remove old data
    selectboxG.firstChild.remove();
  }
  // Updating Game Select box with game name and ids
  for (let index = 0; index < SelectGameResp["data"].length; index++) {
    let gameid = SelectGameResp["data"][index]["id"];
    let gamename = SelectGameResp["data"][index]["name"];

    let optionsG = document.createElement("option");
    optionsG.setAttribute("value", gameid);
    optionsG.append(document.createTextNode(gamename));
    selectboxG.appendChild(optionsG);
  }
  let optionNone = document.createElement("option");
  optionNone.setAttribute("value", "None");
  optionNone.append(document.createTextNode("Any Game Id"));
  selectboxG.appendChild(optionNone);
  selectboxG.disabled = false;
  //#endregion
});
//#endregion

// Large functions

//#region sorts clips from the response and then prints it into the textareas on the page

// sorts clips out from specified values
function ClipSorter(Clips: Response, game_id: string, viewCount: number) {
  //#region Sorting Clip Response data by viewcount + game_id + tests if they're in correct order by date.
  var arrclips = Array();
  let duration = 0;
  let j = 0;
  for (let i = 0; i < Clips["data"]["length"]; i++) {
    var clip = Clips["data"][i];
    if (game_id == "None") {
      if (clip["view_count"] > viewCount) {
        // get clip with correct amount of views
        arrclips[j] = Clips["data"][i];
        duration = duration + clip["duration"]; // gets the Full duration of all the queried clips
        j++;
      }
    } else {
      if (clip["game_id"] == game_id) {
        // gets the game with the fitting game id
        // does work
        if (clip["view_count"] > viewCount) {
          // get clip with correct amount of views
          arrclips[j] = Clips["data"][i];
          duration = duration + clip["duration"]; // gets the Full duration of all the queried clips
          j++;
        }
      }
    }
  }

  // even though the api normally gives you the clips in the right order (SOMETIMES), this is for those few times it doesnt

  // date sorting

  let datemsec = Array();
  for (let index = 0; index < arrclips.length; index++) {
    datemsec[index] = Date.parse(`${arrclips[index]["created_at"]}`);
  }
  datemsec.sort(function (a, b) {
    // Correctly sorted array, in parsed date
    return a - b; // sort the larger value
  });
  let datesort = Array();
  for (let index = 0; index < datemsec.length; index++) {
    let d = new Date(datemsec[index]);
    let s = d.toISOString();
    let a = s.split(".000"); // for some reason makes extra milisecond values that the twichapi Does not have
    datesort[index] = a[0] + a[1]; // makes correctly sorted Date in IsoDate format
  }

  let sortcliped = Array();
  for (let index = 0; index < datesort.length; index++) {
    //console.log(datesort[index]);
    for (let index2 = 0; index2 < arrclips.length; index2++) {
      //console.log(arrclips[index2]["created_at"].indexOf(datesort[index]));
      if (arrclips[index2]["created_at"].indexOf(datesort[index]) == 0) {
        // console.log(arrclips[index2]["created_at"] + " Was equal to " + datesort[index]);
        sortcliped[index] = arrclips[index2];
        continue; // stops loop when clip was found
      } else {
      } // nada
    }
  }
  console.log(sortcliped);
  //#endregion

  //#region Set in Data
  let textNode = document.createTextNode(
    `‣ Found: ${sortcliped.length} Clips, Thats ${toTime(duration)} of content!`
  );
  let insertP = document.createElement("p") as HTMLElement;
  insertP.appendChild(textNode);
  let DataP = document.querySelector("#DataP") as HTMLElement;
  DataP.textContent =
    "you did it! good job, heres the data from the query(s) you did ヾ(•ω•`)o";
  let DataDiv = document.querySelector("#DataDiv") as HTMLElement;
  DataDiv.appendChild(insertP);
  //#endregion
 
  //#region Set in Links
  let textAreaDiv = document.querySelector("#Linksarea") as HTMLElement;
  let Desc = document.querySelector("#myInput0") as HTMLInputElement;
  let clipCredit = new Set(); // holds credit for clips

  let x = 0;
  duration = 0;
  let text = ""; // initialzes vars for getting duration
  text = text + BeforeDesc + "\n\n"; // adds the description
  textAreaDiv.innerHTML = ""; // removes ALL previous links
  for (let i = 0; i < sortcliped.length; i++) {
    // duration getter, + highlight description maker
    if (i == 0) {
      text = text + `• 0:00 ${sortcliped[i]["title"]}\n`; // makes start chapter for youtube description
    } else {
      text = text + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
    }
    duration = duration + sortcliped[i]["duration"];
    clipCredit.add(sortcliped[i]["creator_name"]);

    // Link Area

    // initializing
    let rowdiv = document.createElement("div");
    let button = document.createElement("button");
    let a = document.createElement("a");
    let p = document.createElement("p");

    // set classes
    rowdiv.classList.add("row", "m-2", "ps-0");
    if (i % 2 == 0) {
      // adds a slightly darker background every Other link
      rowdiv.classList.add("Linkbg");
    }
    button.classList.add("col-3", "p-1", "btn", "HighSubmit", "ClipBtn");
    button.setAttribute("value", `Btn-${i}`);
    button.setAttribute("href", "#IframePlayerLater");
    a.classList.add("col-6", "ClipLink"); // uses cool styling
    a.setAttribute("id", `Clip-${i}`);
    a.setAttribute("target", "_blank"); // opens in new tab
    a.setAttribute("href", sortcliped[i]["url"]); // sets anchor
    p.classList.add("col-3", "text-center");

    // set text
    button.textContent="Play Clip →";
    a.text = ` ‣ Clip ${i + 1} - '${sortcliped[i]["title"]}'`; // sets text
    p.append(
      document.createTextNode(
        `${sortcliped[i]["duration"]} sec/s (${toTime(duration)}in all)`
      )
    );

    // append data
    rowdiv.append(button);
    rowdiv.append(a);
    rowdiv.append(p);
    textAreaDiv.append(rowdiv);
  }
 // Add event handler for watching clips with button clicks
let ClipBtns = document.querySelectorAll(".ClipBtn");
for (let i = 0; i < ClipBtns.length; i++) {
  ClipBtns[i].addEventListener(
        "click",
        function(event: any) {
          console.log(event.target.value);
          let Id = event.target.value.split("-");
          console.log(Id);
          let Link = document.getElementById(`Clip-${Id[1]}`) as HTMLAnchorElement;
          console.log(Link);
          IframClipBuilder(Link.href);
        },
        true
    );
}

//#endregion
  
  //#region Description Making
  // Make Description for Would be Hightligt
  text = text + "Clips by:";
  clipCredit.forEach((element) => {
    // note: clipcredit is a Set it only holds unique values
    text = text + ` ${element},`;
  });

  text = text.slice(0, text.length - 1);
  text = text + "\n\n" + AfterDesc;
  Desc.textContent = text;
  //#endregion

  //#region Text Counter Set in
  let Charcount = text.length;
  let p = document.querySelector(`#CharCount0`) as HTMLElement; // needs to be html element
  p.textContent = `${Charcount}`;
  if (Charcount > 5000) {
    // timestamps likely wont work, and its over the Maximum the youtube description can handle
    p.setAttribute("class", "CharaRed");
  } else if (Charcount > 3000) {
    // timestamps may stop working. thumbnails may also lose graphics at this/a bit under size too
    p.setAttribute("class", "CharaYellow");
  } else {
    // become green, Prime Timestamp range.
    p.setAttribute("class", "CharaGreen");
  }
  //#endregion

  // Making Acordian Accessible
  let accorddesc = document.querySelector("#accordDesc") as HTMLInputElement;
  accorddesc.disabled = false;
  let accordLink = document.querySelector("#accordLink") as HTMLInputElement;
  accordLink.disabled = false;
}
//#endregion


//#region IframeClipBuilder(IframeId: string) // Accepts Any Link to A Twitch Clip
// ran when you click submit. sets an Iframe on the website
function IframClipBuilder(ClipLink: string) {
  let divPlayer = document.getElementById("IframePlayerLater") as HTMLElement; 
  let menuDiv = document.getElementById("MenuLogoDiv") as HTMLElement; 
  let slug = ClipLink.split("/");
  let Iframe = document.createElement("iframe");
  Iframe.setAttribute("src", `https://clips.twitch.tv/embed?clip=${slug[3]}&parent=localhost&autoplay=true&muted=true`);
  Iframe.setAttribute("frameborder", "0");
  Iframe.setAttribute("allowfullscreen", "true");
  Iframe.setAttribute("scrolling", "no");
  Iframe.setAttribute("height", "378");
  Iframe.setAttribute("width", "620");
  menuDiv.innerHTML="";// remove logo
  divPlayer.innerHTML=""; // or old clip
  divPlayer.append(Iframe);
  divPlayer.scrollIntoView(); // move view upto player
}
//#endregion

// Small functions

//#region ValidateToken, Validates the TappAcess Token and then calls fetchUser()

// needs a VALID Twitch App Auth Token
//#region validateToken() Validates Token if sucessful returns 1 if not 0
// Calls the Twitch api with Out App Acess Token and returns a ClientId and tells us if the App Acess Token is Valid or Not
async function validateTToken() {
  console.log("Your AccessToken: "+TappAcess);
  if(TappAcess != undefined && TappAcess != "" && TappAcess != null) {
  await fetch("https://id.twitch.tv/oauth2/validate", {
    headers: {
      Authorization: "Bearer " + TappAcess,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status) {
        if (resp.status == 401) {
          console.log("This token ('"+TappAcess+"') is invalid ... " + resp.message);
          return 0;
        }
        console.log("Unexpected output with a status");
        return 0;
      }
      if (resp.client_id) {
        client_id = resp.client_id;
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
else { return 0; }
}

// async function validateTToken() {
//   fetch("https://id.twitch.tv/oauth2/validate", {
//     headers: {
//       Authorization: "Bearer " + TappAcess,
//     },
//   })
//     .then((resp) => resp.json())
//     .then(async (resp) => {
//       if (resp.status) {
//         if (resp.status == 401) {
//           console.log("This token is invalid" + resp.message);
//           // document.getElementById('output').textContent = 'This token is invalid: ' + resp.message;
//           return 0;
//         }
//         console.log("Unexpected output with a status");
//         return 0;
//       }
//       if (resp.client_id) {
//         client_id = resp.client_id; // Getting Client Id for page
//         console.log("Validated Token");
//         return 1;
//       }
//       console.log("unexpected Output");
//     })
//     .catch((err) => {
//       ErrorMsg("An Error Occured VALIDATING token data", err, "Error");
//       console.log(err);
//       console.log("An Error Occured VALIDATING token data");
//       return 0;
//     });
// }

//#endregion

//#region HTTPCaller Method Calls the HTTP call you give with the credentials for the Twitch api
async function HttpCaller(HttpCall: string) {
  const respon = await fetch(`${HttpCall}`, {
    headers: {
      Authorization: "Bearer " + TappAcess,
      "Client-ID": client_id,
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

//#region toTime function, makes a timestamp that will work in the youtube description
// converts the time into minutes and hours from seconds
function toTime(seconds: any) {
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

//#region ErrorMsg() Makes an error message taking MSG, SystemMsg, Color of Warning
function ErrorMsg(Msg: string, systemMsg: any, color: string) {
  let H4 = document.createElement("h4");
  let p = document.createElement("p");
  H4.classList.add(`${color}`);
  p.classList.add(`${color}`);
  H4.innerHTML = Msg;
  p.innerText = systemMsg;
  ErrorDiv.append(H4);
  ErrorDiv.append(p);
}
//#endregion
