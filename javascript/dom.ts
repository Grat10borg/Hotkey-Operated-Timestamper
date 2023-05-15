
// Shorthand Dom versions
const $ = document;
const $$ = {
dom: document,

// document methods
id: $.getElementById.bind($),
class: $.getElementsByClassName.bind($),
make: $.createElement.bind($),
query: $.querySelector.bind($),
query_all: $.querySelectorAll.bind($),

// custome methods bellow this
txt: fetchTXT.bind($), //async
btnchar: AddBTNCharcounters.bind($),
api_valid: validateTwitchToken.bind($),
api: ApiCall.bind($),

// just here to help me out when working.
log: console.log,
} 

// // Code methods custome
let TwitchClientID: string = ""; // contains the clientID used for api calls.

//#region 

// a little wonky but the response promise did not want to play along..
async function fetchTXT(Url:string) {
  await fetch(Url)
  .then(response => response.text())
  .then((txt) => {    
    //return txt;
    let textarea = $$.make("textarea");
    textarea.textContent = txt;
    textarea.id = Url;
    textarea.hidden = true;
    $.body.append(textarea);
  })
  let text = $$.id(Url).innerHTML;
  $$.id(Url).outerHTML = ""; // remove textarea again
  return text;
}

// should only be ran once everything else is complete.
function AddBTNCharcounters() {
  // ALL the text areas on the page.
  let StartTextareas = $$.query_all(".Charcounts") as NodeListOf<HTMLTextAreaElement>;
  let Select = $$.query_all(".Select") as NodeListOf<HTMLElement>;
  let Copy = $$.query_all(".Copy") as NodeListOf<HTMLElement>;
  let Clear = $$.query(".Clear") as HTMLElement; 
  let ScrollTop = $$.id("ScrollTop") as HTMLElement; 
  let ShowHiddenText = $$.id("ShowSettings") as HTMLDivElement;
  let Locked = $$.id("Locked") as HTMLElement;
  
  // Add Selectbutton Events
  for (let i = 0; i < Select.length; i++) {
  Select[i].addEventListener("click", function (event: any) {
  StartTextareas[event.target.value].select(); /* Select the text field */
  StartTextareas[event.target.value].setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(StartTextareas[event.target.value].value); /* Select the text inside the text field */
  },true);}

  // Add Copybutton Events
  for (let i = 0; i < Copy.length; i++) {
  Copy[i].addEventListener("click", function (event: any) {
  StartTextareas[event.target.value].select(); /* Select the text field */
  StartTextareas[event.target.value].setSelectionRange(0, 99999); /* For mobile devices */
  navigator.clipboard.writeText(StartTextareas[event.target.value].value);/* Copy the text inside the text field */
  },true);}
  
  // Add Character Limitor
  for (let i = 0; i < StartTextareas.length; i++) {
    let p = $$.query(`#CharCount${i}`) as any;
    // pre-event handler values
    p.innerHTML = StartTextareas[i].innerHTML.length;
    if (StartTextareas[i].innerHTML.length > 5000)  p.setAttribute("class", "CharaRed");
    else if (StartTextareas[i].innerHTML.length > 3000) p.setAttribute("class", "CharaYellow");
    else p.setAttribute("class", "CharaGreen");
    StartTextareas[i].addEventListener("keyup", function (event: any) {
    p.textContent = event.target.value.length;
    // ADD test by regex on if it contains Illigal Chars here 
    if (event.target.value.length > 5000) p.setAttribute("class", "CharaRed"); // timestamps likely wont work, and its over the Maximum the youtube description can handle
    else if (event.target.value.length > 3000) p.setAttribute("class", "CharaYellow"); // timestamps may stop working. thumbnails may also lose graphics at this/a bit under size too
    else p.setAttribute("class", "CharaGreen"); // become green, Prime Timestamp range.
    });
  }

  // Add ScrollBtn event
  if(ScrollTop != null) {
    ScrollTop.addEventListener("click", function() {let TopNav = $$.id("TopNav") as HTMLElement; TopNav.scrollIntoView(true);});
  }

  // Add Show HidenText event
  if (ShowHiddenText != null) {
  ShowHiddenText.addEventListener("click", function () {
    $$.id("ShowPrivateIcon").src="img\\Icons\\UnlockedIcon.png";
    let PasswordInputs = $$.query_all('[type="password"]') as NodeListOf<HTMLInputElement>;
    if (PasswordInputs != null) {PasswordInputs.forEach((Input) => {Input.type = "text";});}
  });
  }

  // Add Unlock clearbtn event
  if (Locked != null) {
    Locked.addEventListener("click",function () {
     let Clear = $$.id("Clear") as HTMLButtonElement;
     let LockedIcon = $$.id("LockedIcon") as HTMLImageElement;
     Clear.disabled = false;
     LockedIcon.src = "img\\Icons\\UnlockedIcon.png";
      },true);
  }

  // Add ClearButton event. (desc-maker only)
  if (Clear != null) { // Make btn event for Clearing button, only makes an alert
    Clear.addEventListener("click",function () {window.location.href = "clear.php";},true);
  }
}

// Validates token for Twitch api use.
async function validateTwitchToken() {
  let p = $$.id("AccessTokenTime") as HTMLElement;

  if (config.TWITCH_API_TOKEN != undefined && config.TWITCH_API_TOKEN != "" && config.TWITCH_API_TOKEN != null) {
    await fetch("https://id.twitch.tv/oauth2/validate", {
      headers: {Authorization: "Bearer " + config.TWITCH_API_TOKEN,},}).then((resp) => resp.json()).then((resp) => {
        if (resp.status) {
          if (resp.status == 401) {
            alert("This token ('" +config.TWITCH_API_TOKEN+"') is invalid (" +resp.message +")!");
            console.log("[INVALID TOKEN]: Try making a new token, or setting [TWITCH_ON] to false in the config.js file!");
            let Submitbtn = $$.id("Submit") as HTMLInputElement;
            Submitbtn.disabled = true;
            p.innerHTML = `• Your Token is invalid, try to follow H.O.T wiki for help!.`;
            return 0;
          }
          alert("Unexpected response while validating token, check console for info.. (っ °Д °;)っ");
          $$.log("[Unexpected Token Output]");
          $$.log(resp.status);
          return 0;
        }
        if (resp.client_id) {
          TwitchClientID = resp.client_id; // save clientID for other api calls that need them..
          $$.log("[TOKEN VALIDATED]: Token Validated Sucessfully");
          let Time = new Date(resp.expires_in * 1000);
          let TimeStrDash = Time.toISOString().split("-");
          let TimeStrT = TimeStrDash[2].split("T");
          let TimeString = `${
            parseInt(TimeStrDash[1].substring(1, 2)) - 1
          } Month ${TimeStrT[0]} Days & ${TimeStrT[1].substring(0, 8)} Hours`;
          p.innerHTML = `• Current Token Will Expire In: <br> ${TimeString}.`;
          return 1;
        }
        $$.log("[TOKEN UNEXPECTED OUTCOME] unexpected Output");
        $$.log(resp.status);
        p.innerHTML = `• Your Token returned an unforseen result?. check console for info.`;
        return 0;
      })
      .catch((err) => {
        $$.log(err);
        return 0;
      });
    return 1;
  } else {
    p.innerHTML = `• Could not get you Twitchkey, try looking in config.js`;
    $$.log("H.O.T could not get your TwitchKey, you will not be able to use Clip-Stamps");
    let TwitchClipbtn = $$.id("TwitchClip") as HTMLInputElement;
    if(TwitchClipbtn != null) TwitchClipbtn.disabled = true;
    return 0;
  }
}

// Calls Twitch API or another API if turned on
async function ApiCall(HttpCall: string, Twitch: boolean) {
  if(Twitch == true) {
    const respon = await fetch(`${HttpCall}`, {
      headers: {
        Authorization: "Bearer " + config.TWITCH_API_TOKEN,
        "Client-ID": TwitchClientID,
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
  else { // if not getting from Twitch API
    const respon = await fetch(`${HttpCall}`, {
      headers: {
        // headers here i guess?
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
}

//#endregion