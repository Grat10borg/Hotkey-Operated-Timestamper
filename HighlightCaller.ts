//#region Import Export, doesnt work yet
var TclientId = "uqiitin0qzty2b0xeet7bczpfouppc"; // This is made in the: https://dev.twitch.tv/console/apps aswell as the redirect
var Tredirect = "http://localhost/Hotkey-Operated-Timestamper/Highlight.php"; // also change redirect in the Twitch dev area: https://dev.twitch.tv/console/apps.. Remember twiches redirect and Yours need to Match
var TappAcess = "ncma1vkg5ebul64cxjo60vjv5ddomb";

let res = document.getElementById("DescTxt") as HTMLInputElement;
let res1 = document.getElementById("IntroTxt") as HTMLInputElement;
let res2 = document.getElementById("SocialTxt") as HTMLInputElement;
let res3 = document.getElementById("CreditsTxt") as HTMLInputElement;

let Desc1 = res.innerHTML;
let intro = res1.innerHTML;
let socialLinks = res2.innerHTML;
let Credits = res3.innerHTML;

console.log(intro);

// Website Data Handling

//#region AuthButton

let AuthA = document.getElementById("authorize_email") as HTMLElement;
AuthA.setAttribute(
  "href",
  "https://id.twitch.tv/oauth2/authorize?client_id=" +
    TclientId +
    "&redirect_uri=" +
    encodeURIComponent(Tredirect) +
    "&response_type=token&scope=user:read:email"
);
let empty = document.getElementById("access_token") as HTMLElement;
empty.textContent = "";

//#endregion

//#region Submit button form

// Getting Form Data
// Make btn event for Clearing button, only makes an alert
var Id: string;
var form = document.querySelector("#HighlighForm") as any;
var ErrorDiv = document.getElementById("ErrorDiv") as HTMLElement;
form.addEventListener(
  "submit",
  function (event: any): void {
    event.preventDefault();

    let date = new Date(form.date.value) as any; // changes to string later
    if (date == "Invalid Date") {
      date = new Date();
      date.setDate(date.getDate() - 90);
      console.log("start date was not given, getting clips from 90 days ago");
    }
    let endDate = new Date(form.endDate.value) as any; // changes to string later too
    let game_id = form.SelectGame.options[form.SelectGame.selectedIndex].value;
    let viewCount = form.viewcount.value;
    if (viewCount == "") {
      // sets default value if none is given
      viewCount = 1;
    }

    //let Id = form.SelectChannel.options[form.SelectChannel.selectedIndex].value;

    // Tests if start date is an aproved date, else print error
    try {
      date = date.toISOString();
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
    fetchUser(
      true,
      TappAcess,
      form.SelectChannel.options[form.SelectChannel.selectedIndex].value,
      date,
      endDate,
      game_id,
      viewCount
    );
  },
  true
);

//#endregion

//#region ChannelSelect Eventhandler

let ChannelSelect = document.querySelector("#SelectChannel") as any;
ChannelSelect.addEventListener("change", function () {
  let value = ChannelSelect.options[ChannelSelect.selectedIndex].value;
  console.log("Searching for " + value); // en
  ErrorDiv.innerHTML = ""; // clear errors
  validateToken(value); // this starts a daisy chain
});

//#endregion

// Twitch Api Handling

//#region Twitch Auth and Logging in

if (document.location.hash && document.location.hash != "") {
  var parsedHash = new URLSearchParams(window.location.hash.slice(1));
  if (parsedHash.get("access_token")) {
    var Useraccess_token = parsedHash.get("access_token");

    // unlock selectbox for querying when logged in
    let selectbox = document.getElementById(
      "SelectChannel"
    ) as HTMLInputElement;
    selectbox.disabled = false;
    //console.log(`din Access Token fra Twitch er: ${access_token}`); // access tokens bliver ny lavet hver reload
  }
} else if (document.location.search && document.location.search != "") {
  var parsedParams = new URLSearchParams(window.location.search);
  if (parsedParams.get("error_description")) {
    let p = document.getElementById("access_token") as HTMLElement;
    p.textContent =
      parsedParams.get("error") + " - " + parsedParams.get("error_description");
  }
}

//#endregion

//#region ValidateToken, Validates the TappAcess Token and then calls fetchUser()

let client_id = "";
function validateToken(value) {
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
        //console.log(resp);
        console.log("Unexpected output with a status");
        //document.getElementById('output').textContent = 'Unexpected output with a status?';
        return;
      }
      if (resp.client_id) {
        client_id = resp.client_id;

        //console.log("Token is valid");

        if (resp.user_id) {
          //  console.log("Token is type User Access");
          fetchUser(false, TappAcess, value, "", "", "", 0);
        } else {
          // console.log("Token is type App Access");
          fetchUser(false, TappAcess, value, "", "", "", 0);
        }

        return;
      }
      console.log("unexpected Output");
    })
    .catch((err) => {
      ErrorMsg("An Error Occured VALIDATING token data", err, "Error");
      console.log(err);
      console.log("An Error Occured VALIDATING token data");
    });
}

//#endregion

//#region fetchUser()

function fetchUser(
  submit: boolean,
  access_token: string,
  streamerName: string,
  date: string,
  endDate: string,
  game_id: string,
  viewCount: number
): any {
  //console.log("access token" + access_token);
  //console.log("streamername" + streamerName);
  // console.log(TclientId);
  fetch(`https://api.twitch.tv/helix/users?login=${streamerName}`, {
    headers: {
      "Client-ID": client_id,
      Authorization: "Bearer " + access_token,
    },
  })
    .then((resp) => resp.json())
    .then((resp) => {
      //console.log(resp);
      if (submit == true) {
        //console.log("broadcastid = " + resp["data"][0]["id"]);
        //console.log(res);

        Id = resp["data"][0]["id"];
        FetchCallClip(date, endDate, Id, game_id, viewCount); // get clips afterward
      } else {
        GetChosenChannelGames(resp["data"][0]["id"]);
      }
    })
    .catch((err) => {
      ErrorMsg(
        "Could not fetch user Are you sure its spelt correctly?",
        err,
        "Error"
      );
      console.log(err);
    });
}

//#endregion

//#region GetChosenChannelGames gets all the different games the called channel has played for the last 30 days

function GetChosenChannelGames(id: string) {
  let d = new Date();
  let RFCdato = new Date();
  RFCdato.setDate(RFCdato.getDate() - 90); // takes a month worth of clips
  fetch(
    // https://api.twitch.tv/helix/clips?broadcaster_id=485848067 // gets from specific channel
    // gets clips out from specific queries, like broadcaster_id, id and Game_id: https://dev.twitch.tv/docs/api/reference#get-clips
    `https://api.twitch.tv/helix/clips?broadcaster_id=${id}&first=100&started_at=${RFCdato.toISOString()}&ended_at=${d.toISOString()}`,
    {
      // from the inputted date it takes clips for 2 weeks forward unless said otherwise
      headers: {
        "Client-ID": TclientId, // client id is made Here: https://dev.twitch.tv/console/apps
        Authorization: "Bearer " + Useraccess_token, // access token is made Through the Twitch CLI: https://dev.twitch.tv/docs/api#step-1-register-an-application
      },
    }
  ) // after cURL then do this
    .then((response) => response.json()) // UnJsons the response
    .then((response) => {
      // if successfull
      //console.log(response["data"]);
      var GameIds = new Set(); // sets can only hold uniq values
      for (let index = 0; index < response["data"].length; index++) {
        //console.log(response["data"][index]["game_id"]);
        GameIds.add(response["data"][index]["game_id"]);
      }
      //console.log(GameIds);
      GetGamesFromIds(GameIds);
    })
    .catch((err) => {
      ErrorMsg("Error Logging in try again", err, "Warning");
      console.log(err);
    });
}

//#endregion

//#region GetGamesFromIds

function GetGamesFromIds(Game_ids: any) {
  // SETUP

  let httpcall = "https://api.twitch.tv/helix/games?"; // cannot handle more then 100 ids at one time
  let index = 0;
  Game_ids.forEach((Gameid) => {
    //console.log(Gameid);
    if (index == 0) {
      httpcall = httpcall + "id=" + Gameid;
    } else {
      httpcall = httpcall + "&id=" + Gameid;
    }
    index++;
  });
  //console.log(httpcall);

  // API CALL

  fetch(`${httpcall}`, {
    headers: {
      "Client-ID": TclientId,
      Authorization: "Bearer " + Useraccess_token,
    },
  })
    .then((response) => response.json())
    .then((response) => {
      // if successfull
      //console.log(response);

      // getting select box
      let selectboxG = document.getElementById(
        "SelectGame"
      ) as HTMLInputElement;

      while (selectboxG.firstChild) {
        // remove old data
        selectboxG.firstChild.remove();
      }

      // Updating Game Select box with game name and ids
      for (let index = 0; index < response["data"].length; index++) {
        let gameid = response["data"][index]["id"];
        let gamename = response["data"][index]["name"];

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
    })
    .catch((err) => {
      // if erorr, print it
      ErrorMsg(
        "Failed to fetch game names from game ids, try again",
        err,
        "Warning"
      );
      console.log(err);
    });
}

//#endregion

//#region  GetUserBroadcastId, gets the broadcastid from the logged in user, calls clipfetch after

// gets user data ChannelId
function GetUsersBroadcastId(
  RFCdate: string,
  RFCDateEnd: string,
  game_id: string,
  viewCount: number
) {
  fetch(`https://api.twitch.tv/helix/users`, {
    // calls fetch to fetch users own id
    headers: {
      "Client-ID": TclientId, // client id is made Here: https://dev.twitch.tv/console/apps
      Authorization: "Bearer " + Useraccess_token, // access token is made Through the Twitch CLI: https://dev.twitch.tv/docs/api#step-1-register-an-application
    },
  }) // after cURL then do this
    .then((response) => response.json()) // UnJsons the response
    .then((response) => {
      // if successfull
      console.log("Api Kald Fuldgjort");
      console.log(response);
      var arr = response;
      FetchCallClip(
        RFCdate,
        RFCDateEnd,
        arr["data"]["0"]["id"],
        game_id,
        viewCount
      );
    })
    .catch((err) => {
      // if erorr, print it
      ErrorMsg(
        "could not get YOUR username, could not find logged in user's username",
        err,
        "Error"
      );
      console.log(err);
    });
}
//#endregion

//#region FetchCallClip does a fetchcall from the values you give it, and then calls clip sorter

// returns response (max 100), takes RFC3339 date and Broadcaster_id
function FetchCallClip(
  RFCdate: string,
  RFCDateEnd: string,
  Id: string,
  game_id: string,
  viewCount: number
) {
  fetch(
    // https://api.twitch.tv/helix/clips?broadcaster_id=485848067 // gets from specific channel
    // gets clips out from specific queries, like broadcaster_id, id and Game_id: https://dev.twitch.tv/docs/api/reference#get-clips
    `https://api.twitch.tv/helix/clips?broadcaster_id=${Id}&first=100&started_at=${RFCdate}&ended_at=${RFCDateEnd}`,
    {
      // from the inputted date it takes clips for 2 weeks forward unless said otherwise
      headers: {
        "Client-ID": TclientId, // client id is made Here: https://dev.twitch.tv/console/apps
        Authorization: "Bearer " + Useraccess_token, // access token is made Through the Twitch CLI: https://dev.twitch.tv/docs/api#step-1-register-an-application
      },
    }
  ) // after cURL then do this
    .then((response) => response.json()) // UnJsons the response
    .then((response) => {
      // if successfull
      let Udata = document.getElementById("user_data") as HTMLElement;
      Udata.textContent = "Success";
      //console.log(response); // logs response
      ClipSorter(response, game_id, viewCount);
    })
    .catch((err) => {
      ErrorMsg(
        "Failed in fetching Clips, did you remember to give a Date?",
        err,
        "Warning"
      );

      console.log(err);
      let Udata = document.getElementById("user_data") as HTMLElement;
      Udata.textContent = "Failed getting clips";
    });
}

//#endregion

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
  // Array sorted now

  // Set in Data
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

  // Set in Links

  let textAreaDiv = document.querySelector("#Linksarea") as HTMLElement;
  let Desc = document.querySelector("#myInput0") as HTMLInputElement;
  let clipCredit = new Set(); // holds credit for clips

  let x = 0;
  duration = 0;
  let text = ""; // initialzes vars for getting duration
  text = text + Desc1 + "\n\n"; // adds the description
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
    let a = document.createElement("a");
    let p = document.createElement("p");

    // set classes
    rowdiv.classList.add("row", "m-2");
    if (i % 2 == 0) {
      // adds a slightly darker background every Other link
      rowdiv.classList.add("Linkbg");
    }
    a.classList.add("col-8", "ClipLink"); // uses cool styling
    a.setAttribute("target", "_blank"); // opens in new tab
    a.setAttribute("href", sortcliped[i]["url"]); // sets anchor
    p.classList.add("col-4", "text-center");

    // set text
    a.text = ` ‣ Clip ${i + 1} - '${sortcliped[i]["title"]}'`; // sets text
    p.append(
      document.createTextNode(
        `${sortcliped[i]["duration"]} sec/s (${toTime(duration)}in all)`
      )
    );

    // append data
    rowdiv.append(a);
    rowdiv.append(p);
    textAreaDiv.append(rowdiv);
  }

  let accordLink = document.querySelector("#accordLink") as HTMLInputElement;
  accordLink.disabled = false;
  // Make Description for Would be Hightligt

  text = text + "Clips by:";
  clipCredit.forEach((element) => {
    // note: clipcredit is a Set it only holds unique values
    text = text + ` ${element},`;
  });

  text = text.slice(0, text.length - 1);
  text = text + "\n\n" + intro + "\n\n";
  text = text + socialLinks + "\n\n";
  text = text + Credits;
  Desc.textContent = text;

  // Update text counter on set in
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

  let accorddesc = document.querySelector("#accordDesc") as HTMLInputElement;
  accorddesc.disabled = false;
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
