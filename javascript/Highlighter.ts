// settings
// asigned later
const twitch = {
	userid : "" as string,
	//client_id : "" as string,
}
//validatettoken();
$$.api_valid(); // validates twitch api
$$.btnchar(); // set up buttons on page
// website data handling


// set in highlighter quick search channels.
let selectchannel = $$.id("SelectChannel") as HTMLSelectElement;
for (let index = 0; index < config.HIGHLIGHTER_CHANNELS.length;
index++) {
  const channel = config.HIGHLIGHTER_CHANNELS[index];
  let option = $$.make("option"); 
  option.class='selectoption'; 
  option.value=channel; 
  option.innerHTML=channel;
  selectchannel.append(option);
}

if(config.TWITCH_API_TOKEN != "" && config.TWITCH_API_TOKEN != null) {
  let input = $$.id("TwitchAccessToken") as HTMLInputElement;
  input.value=config.TIMESTAMP_PATH;
}

//#region enable or disable searchbar
let searchhistory = $$.id("useHistory") as any;
let searchbar = $$.id("useSearch") as any;
searchhistory.addEventListener("click", function () {
  $$.id("SelectChannel").disabled=false;
  $$.id("InputChannel").disabled=true;
  
  //userfind($$.id("SelectChannel").options[
  //$$.id("SelectChannel").selectedindex].value);
  let channelselect = $$.id("SelectChannel") as HTMLSelectElement;
  userfind (channelselect.options[channelselect.selectedIndex].value);
},true);

searchbar.addEventListener("click", function () {
  $$.id("SelectChannel").disabled=true;
  $$.id("InputChannel").disabled=false;

  if ($$.id("InputChannel").value.length > 5) {
    userfind($$.id("InputChannel").value);
  }
},true);
//#endregion


//#region submit button form

// getting form data
// make btn event for clearing button, only makes an alert
var id : string;
var form = $$.query("#HighlighForm") as any;
var errordiv = $$.id("ErrorDiv") as any;
form.addEventListener(
  "submit",
  async function (event: any) {
    event.preventDefault();
    //#region setting of start and end date and viewcount
    let startdate = new Date(form.date.value) as any; 
    // changes to string later
    if (startdate == "invalid date") {
      startdate = new Date();
      startdate.setDate(startdate.getdate() - 90);
      $$.log("start date was not given, getting clips from 90 days ago");
    }
    let enddate = new Date(form.endDate.value) as any;
    // changes to string later too
    let game_id = form.SelectGame.options[
    form.SelectGame.selectedIndex].value;
    if (game_id == "") {
      game_id = "none";
    }
    let viewcount = form.viewcount.value;
    if (viewcount == "") {
      viewcount = 1;
    }
    //#endregion

    //#region testing if values are valid
    // tests if start date is an aproved date, else print error
    try {
      startdate = startdate.toISOString();
    } catch (error) {
      $$.log("the set date value was not allowed");
      $$.log(error);
    }
    // makes sure the end date always is a aproved date
    if (enddate == "invalid date") {
      enddate = new Date();
      // make end date be today right now, clips wont be in the future
      // anyways
      $$.log("end date not selected defaulting to todays date");
      enddate = enddate.toISOString();
    } else {
      enddate = enddate.toISOString();
    }
    //#endregion

    //#region httpcalling fitting clips, then calls clip sorter
    let clipresp = await $$.api(
      `https://api.twitch.tv/helix/clips?broadcaster_id=`
    +`${twitch.userid}&first=100&started_at=${startdate}&ended_at=${enddate}`
    ,true);
    $$.log(clipresp);
    clipsorter(clipresp, game_id, viewcount);
    //#endregion
  },
  true
);

//#endregion

// twitch api handling

//#region channelselect & channelsearch eventhandler
var searchinput = $$.id("InputChannel") as HTMLInputElement;
searchinput.addEventListener("keyup", async function () {
  if (searchinput.value.length > 5) {
    userfind(searchinput.value);
  }
});
//#endregion

let channelselect = $$.query("#SelectChannel") as any;
channelselect.addEventListener("change", async function () {
  //#region getting channel id
let streamername = channelselect.options[
channelselect.selectedIndex].value;
  if (streamername != "none") {
    userfind(channelselect.options[channelselect.selectedIndex].value);
  }
});
//#endregion

// large functions

async function userfind(twitchlogin:string) {
   //#region getting channel id
   if (twitchlogin != "none" && twitchlogin != "") {
     $$.log("searching for " + twitchlogin); // en
     errordiv.innerhtml = ""; // clear errors
     let userresp = await $$.api(
       `https://api.twitch.tv/helix/users?login=${twitchlogin}`,true
     );
     if (userresp["data"].length == 0) {
      $$.log("user not found");
      return;
     }
     else  {
      twitch.userid = userresp["data"][0]["id"];
      //#endregion
  
      //#region getting gamenames from clips
      let d = new Date();
      let rfcdato = new Date();
      rfcdato.setDate(rfcdato.getDate() - 90); 
      // takes a month worth of clips
      let gameresp = await $$.api(
        `https://api.twitch.tv/helix/clips?broadcaster_id=`+
	`${twitch.userid}&first=100&started_at=${rfcdato.toISOString()}`+
	`&ended_at=${d.toISOString()}`,true
      );
      if (gameresp["data"].length != 0) {
        $$.log(twitchlogin + " is searchable!");
        var gameids = new Set(); 
	// sets can only hold uniq values
        for (let index = 0; index < gameresp["data"].length; index++) {
          gameids.add(gameresp["data"][index]["game_id"]);
        }
        //#endregion
    
        //#region getting gameids from gamenames
        let httpcall = "https://api.twitch.tv/helix/games?"; 
	// cannot handle more then 100 ids at one time
        let index = 0;
        gameids.forEach((gameid) => {
          //$$.log(gameid);
          if (index == 0) {selectchannel
            httpcall = httpcall + "id=" + gameid;
          } else {
            httpcall = httpcall + "&id=" + gameid;
          }
          index++;
        });
        //#endregion
    
	//#region getting games from selected channel and placing it on
	//website.
        let selectgameresp = await $$.api(httpcall,true);
        // getting select box
        let selectboxg = $$.id("SelectGame") as HTMLSelectElement;
    
        while (selectboxg.firstChild) {
          // remove old data
          selectboxg.firstChild.remove();
        }
        // updating game select box with game name and ids
        let optionnone = $$.make("option");
        optionnone.setAttribute("value", "none");
        optionnone.append($.createTextNode("any game id"));
        selectboxg.appendChild(optionnone);
        for (let index = 0; index < selectgameresp["data"].length; 
	index++) {
          let gameid = selectgameresp["data"][index]["id"];
          let gamename = selectgameresp["data"][index]["name"];
    
          let optionsg = $$.make("option");
          optionsg.setAttribute("value", gameid);
          optionsg.append($.createTextNode(gamename));
          selectboxg.appendChild(optionsg);
        }
        selectboxg.disabled = false;
        //#endregion
      }
     }
  }
}

//#region sorts clips from the response and then prints it into the
//textareas on the page

// sorts clips out from specified values
async function clipsorter(clips: Response, game_id: string, 
			  viewcount: number) {
  //#region sorting clip response data by viewcount + game_id + tests if
  //they're in correct order by date.
  var arrclips = Array();
  let duration = 0;
  let j = 0;
  for (let i = 0; i < clips["data"]["length"]; i++) {
    var clip = clips["data"][i];
    if (game_id == "none") {
      if (clip["view_count"] > viewcount) {
        // get clip with correct amount of views
        arrclips[j] = clips["data"][i];
        duration = duration + clip["duration"]; 
	// gets the full duration of all the queried clips
        j++;
      }
    } else {
      if (clip["game_id"] == game_id) {
        // gets the game with the fitting game id
        // does work
        if (clip["view_count"] > viewcount) {
          // get clip with correct amount of views
          arrclips[j] = clips["data"][i];
          duration = duration + clip["duration"]; 
	  // gets the full duration of all the queried clips
          j++;
        }
      }
    }
  }

  // even though the api normally gives you the clips in the right order
  // (sometimes), this is for those few times it doesnt

  // date sorting

  let datemsec = Array();
  for (let index = 0; index < arrclips.length; index++) {
    datemsec[index] = Date.parse(`${arrclips[index]["created_at"]}`);
  }
  datemsec.sort(function (a, b) {
    // correctly sorted array, in parsed date
    return a - b; // sort the larger value
  });
  let datesort = Array();
  for (let index = 0; index < datemsec.length; index++) {
    let d = new Date(datemsec[index]);
    let s = d.toISOString();
    let a = s.split(".000"); 
    // for some reason makes extra milisecond values that the twichapi
    // does not have
    datesort[index] = a[0] + a[1]; 
    // makes correctly sorted date in isodate format
  }

  let sortcliped = Array();
  for (let index = 0; index < datesort.length; index++) {
    //$$.log(datesort[index]);
    for (let index2 = 0; index2 < arrclips.length; index2++) {
      //$$.log(arrclips[index2]["created_at"].indexof(datesort[index]));
      if (arrclips[index2]["created_at"].indexOf(datesort[index]) == 0) {
        sortcliped[index] = arrclips[index2];
        continue; // stops loop when clip was found
      } 
    }
  }
  $$.log(sortcliped);

  if (config.HIGHLIGHT_SORTING == "datereverse") {
    sortcliped.reverse();
  }
  else if (config.HIGHLIGHT_SORTING == "random") {
    for (var i = sortcliped.length - 1; i > 0; i--) {
      var b = Math.floor(Math.random() * (i + 1));
      var temp = sortcliped[i];
      sortcliped[i] = sortcliped[b];
      sortcliped[b] = temp;
  }
  }
  //#endregion

  //#region set in data
  let textnode = document.createTextNode(
    `‣ found: ${sortcliped.length} clips`+
    `, thats ${toTime(duration)} of content!`
  );
  let insertp = $$.make("p") as HTMLParagraphElement;
  insertp.appendChild(textnode);
  let datap = $$.query("#DataP") as HTMLParagraphElement;
  datap.textContent =
	"you did it! good job, heres the data from the" 
	+"query(s) you did ヾ(•ω•`)o";
  let datadiv = $$.query("#DataDiv") as HTMLDivElement;
  datadiv.appendChild(insertp);
  //#endregion

  //#region set in links
  let textareadiv = $$.query("#Linksarea") as HTMLDivElement;

  let clipcredit = new Set(); // holds credit for clips

  let x = 0;
  duration = 0;

  // making description
  let text = ""; // initialzes vars for getting duration
  let beforedesc = await 
  $$.txt(config.HIGHLIGHTER_BEFORE_TIMESTAMPS) as string;
  text = text + beforedesc + "\n\n"; // adds the description
  // locale version of description
  let localetext = "" as string;
  if (config.LOCALIZE_ON == true) {
    let localebeforedesc = await 
    $$.txt(config.LOCAL_HIGHLIGHTER_BEFORE_TIMESTAMPS) as string;
    localetext = localetext + localebeforedesc + "\n\n";
  }

  textareadiv.innerHTML = ""; // removes all previous links
  for (let i = 0; i < sortcliped.length; i++) {
    // duration getter, + highlight description maker
    if (i == 0) {
      text = text + `• 0:00 ${sortcliped[i]["title"]}\n`; 
      // makes start chapter for youtube description
      if (config.LOCALIZE_ON == true) {
        localetext = localetext + `• 0:00 ${sortcliped[i]["title"]}\n`;
      }
    } else {
      text = text + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
      if (config.LOCALIZE_ON == true) {
        localetext =
      localetext + `• ${toTime(duration)} ${sortcliped[i]["title"]}\n`;
      }
    }
    duration = duration + sortcliped[i]["duration"];
    clipcredit.add(sortcliped[i]["creator_name"]);

    // link area

    // initializing
    let rowdiv = $$.make("div");
    let button = $$.make("button");
    let a = $$.make("a");
    let p = $$.make("p");

    // set classes
    rowdiv.classList.add("row", "m-2", "ps-0");
    rowdiv.classList.add("linkbg");
    // if (i % 2 == 0) {
    //   // adds a slightly darker background every other link

    // }
    button.classList.add("col-3", "p-1", "btn", "clipbtn");
    button.setAttribute("value", `btn-${i}`);
    button.setAttribute("href", "#iframeplayerlater");
    a.classList.add("col-6", "cliplink"); // uses cool styling
    a.setAttribute("id", `clip-${i}`);
    a.setAttribute("target", "_blank"); // opens in new tab
    a.setAttribute("href", sortcliped[i]["url"]); // sets anchor
    p.classList.add("col-3", "text-center");

    // set text
    button.textContent = "play clip →";
    a.text = ` ‣ clip ${i + 1} - '${sortcliped[i]["title"]}'`; 
    // sets text
    p.append(
      document.createTextNode(
        `${sortcliped[i]["duration"]} sec/s (${toTime(duration)}in all)`
      )
    );

    // append data
    rowdiv.append(button);
    rowdiv.append(a);
    rowdiv.append(p);
    textareadiv.append(rowdiv);
    $$.btnchar(); // re-set all items on page with new events.
  }
  // add event handler for watching clips with button clicks
  let clipbtns = $.querySelectorAll(".clipbtn");
  for (let i = 0; i < clipbtns.length; i++) {
    clipbtns[i].addEventListener(
      "click",
      function (event: any) {
        $$.log(event.target.value);
        let id = event.target.value.split("-");
        $$.log(id);
        let link = $$.id(
          `clip-${id[1]}`
        ) as HTMLAnchorElement;
        $$.log(link);
        IframClipBuilder(link.href);
      },
      true
    );
  }

  //#endregion

  //#region description making
  // make description for would be hightligt
  text = text + "clips by:";
  if (config.LOCALIZE_ON == true) {
    localetext = localetext + "clips by:";
  }
  clipcredit.forEach((element) => {
    // note: clipcredit is a set it only holds unique values
    text = text + ` ${element},`;
    if (config.LOCALIZE_ON == true) {
      localetext = localetext + ` ${element},`;
    }
  });

  let afterdesc = await 
  $$.txt(config.HIGHLIGHTER_AFTER_TIMESTAMPS) as string;
  text = text.slice(0, text.length - 1);
  text = text + "\n\n" + afterdesc;
  // finished description change
  let desc = $$.query("#myInput0") as any;
  desc.textContent = text;
  if (config.LOCALIZE_ON == true) {
    let localafterdesc = await 
    $$.txt(config.LOCAL_HIGHLIGHTER_AFTER_TIMESTAMPS) as any;
    localetext = localetext.slice(0, text.length - 1);
    localetext = localetext + "\n\n" + localafterdesc;

    let localdesc = $$.query(
      "#LocalDescription"
    ) as any;
    localdesc.textContent = localetext;
  }

  //#endregion

  //#region text counters set in
  let charcount = text.length;
  let p = $$.query(`#CharCount0`) as any;
  // needs to be html element
  p.textContent = `${charcount}`;
  if (charcount > 5000) {
    // timestamps likely wont work, and its over the maximum the youtube
	  // description can handle
    p.setAttribute("class", "charared");
  } else if (charcount > 3000) {
    // timestamps may stop working. thumbnails may also lose graphics at
	  // this/a bit under size too
    p.setAttribute("class", "charayellow");
  } else {
    // become green, prime timestamp range.
    p.setAttribute("class", "charagreen");
  }

  if (config.LOCALIZE_ON == true) {
    let charcount = localetext.length;
    let p = $$.query(`#CharCount1`) as any;
    // needs to be html element
    p.textContent = `${charcount}`;
    if (charcount > 5000) {
      // timestamps likely wont work, and its over the maximum the
	    // youtube description can handle
      p.setAttribute("class", "CharaRed");
    } else if (charcount > 3000) {
      // timestamps may stop working. thumbnails may also lose graphics
	    // at this/a bit under size too
      p.setAttribute("class", "CharaYellow");
    } else {
      // become green, Prime Timestamp range.
      p.setAttribute("class", "CharaGreen");
    }
  }
  //#endregion

  // Making Acordian Accessible
  let accorddesc = $$.query("#accordDesc") as HTMLInputElement;
  accorddesc.disabled = false;
  let accordLink = $$.query("#accordLink") as HTMLInputElement;
  accordLink.disabled = false;
  if (config.LOCALIZE_ON == true) {
    let accordLocal = $$.query(
      "#accordLocalDesc"
    ) as HTMLInputElement;
    accordLocal.disabled = false;
  }
}
//#endregion

//#region IframeClipBuilder(IframeId: string) // Accepts Any Link to A
//Twitch Clip
// ran when you click submit. sets an Iframe on the website
function IframClipBuilder(ClipLink: string) {
  let divPlayer = $$.id("IframePlayerLater") as HTMLElement;
  let menuDiv = $$.id("MenuLogoDiv") as HTMLElement;
  let slug = ClipLink.split("/");
  let Iframe = $$.make("iframe");
  Iframe.setAttribute(
    "src",
    `https://clips.twitch.tv/embed?clip=${slug[3]}`+
    `&parent=localhost&autoplay=true&muted=true`
  );
  Iframe.setAttribute("frameborder", "0");
  Iframe.setAttribute("allowfullscreen", "true");
  Iframe.setAttribute("scrolling", "no");
  Iframe.setAttribute("height", "378");
  Iframe.setAttribute("width", "620");
  Iframe.setAttribute("id", "IframeClip");
  menuDiv.innerHTML = ""; // remove logo
  divPlayer.innerHTML = ""; // or old clip
  divPlayer.append(Iframe);

  // download button
  //let downloadbtn = $$.make("button") as HTMLElement;
  divPlayer.scrollIntoView(); // move view upto player
}
//#endregion

// Small functions

//#region toTime function, makes a timestamp that will work in the
//youtube description
// converts the time into minutes and hours from seconds
function toTime(seconds: any) {
  let date = new Date(); 
  // find out why it prints timestamps like "12:12:26" remove the 12 //
  // Fixed
  date.setHours(0, 0, 0); // sets date to 00:00:00
  //$$.log(date);
  date.setSeconds(seconds); // adds secounds making it into a timestamp
  let dateText = date.toString(); 
  // cuts timestamp out // effectively the same that gets printed when
  // you do $$.log(date);
  dateText = dateText.substring(16, 25);
  //$$.log(dateText);
  let arrayD = dateText.split(":");
  //$$.log(arrayD);
  //$$.log(dateText);

  // if first hour value is 0
  if (arrayD[0][0] == "0") {
    //$$.log("in [0][0]");
    // if secound hour value is 0
    if (arrayD[0][1]) {
      //$$.log("in [0][1]");
      // if first minute value is 0
      if (arrayD[1][0] == "0") {
        //$$.log("in [1][0]");
        // if second minute value is 0
        if (arrayD[1][1] == "0") {
          //$$.log("in [1][1]");
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

//#region ErrorMsg() Makes an error message taking MSG, SystemMsg, Color
//of Warning
function ErrorMsg(Msg: string, systemMsg: any, color: string) {
  let H4 = $$.make("h4");
  let p = $$.make("p");
  H4.classList.add(`${color}`);
  p.classList.add(`${color}`);
  H4.innerHTML = Msg;
  p.innerText = systemMsg;
  errordiv.append(H4);
  errordiv.append(p);
}
//#endregion
