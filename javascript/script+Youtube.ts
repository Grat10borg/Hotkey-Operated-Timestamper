// gets ID from settings file embeded by PHP
let Pkey = document.getElementById("YTKey") as HTMLElement;
let PClient = document.getElementById("YTClient") as HTMLElement;
let PPluginName = document.getElementById("YTPluginName") as HTMLElement;
var YclientId = PClient.innerHTML;
var YApiKey = Pkey.innerHTML;
let YTPluginName = PPluginName.innerHTML;

var arrayIds = Array();
var arrayVidname = Array();
var optionValue = 0;
var gapi: any;

/** the youtube connection also needs to be updated for security reasons */
// or so it says

// YOUTUBE API HANDLING 

// Retriving Website data to upload onto youtube

//#region Authbtn + collection of Data for Desc Update
var auth = document.querySelector('.authUpload') as HTMLInputElement;
auth.addEventListener('click', function(event) {
    authAllowDescChange().then(loadClientChannel()).then(GetVideoIds); // calls Get video Ids to get vid ids
    // call to get channel name + profile picture
}, true);

var Send = document.querySelectorAll('.Send') as NodeListOf<HTMLInputElement>;
for (let i = 0; i < Send.length; i++) {
    Send[i].addEventListener('click', function(event: any) {
        console.log(event.target.value);
        var num = event.target.value;
        var selectText = document.getElementById(`myInput${num}`) as HTMLInputElement;
        selectText.select();
        selectText.setSelectionRange(0, 99999);

        var select = document.querySelector('.SelectId') as HTMLInputElement;

        // updates desc
        GitPushDescription(selectText.value, select.value, arrayIds, arrayVidname, );
    }, true);
}
//#endregion

// Youtube connection and updating

//#region Youtube Auth Functions
function authAllowDescChange() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
        .then(function() { console.log("Sign-in successful"); },
            function(err: any) { console.error("Error signing in", err); });
}

function loadClientChannel() {
    gapi.client.setApiKey(YApiKey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
            function(err: any) { console.error("Error loading GAPI client for API", err); });
}
//#endregion

//#region Get Videos for The Select Box
// Make sure the client is loaded and sign-in is complete before calling this method.
function GetVideoIds() {
    return gapi.client.youtube.search.list({
            "part": [
                "snippet"
            ],
            "forMine": true,
            "maxResults": 10,
            "order": "date",
            "type": [
                "video"
            ]
        })
        .then(function(response: any) {
                // Handle the results here (response.result has the parsed body).
                var arrayR = response; // response is an array!! but for some reason it doesnt let me dig into it like a normal array
                for (let index: any = 0; index < arrayR.result.items.length; index++) {
                    arrayIds[index] = arrayR["result"]["items"][`${index}`]["id"]["videoId"];
                    arrayVidname[index] = arrayR["result"]["items"][`${index}`]["snippet"]["title"];

                    let option = document.createElement("option") as HTMLOptionElement;
                    option.appendChild(document.createTextNode(`${arrayVidname[index]}`));
                    option.setAttribute("value", index);
                    let Selectbox = document.querySelector('.SelectId') as HTMLInputElement;
                    Selectbox.appendChild(option);
                    let selectid = document.getElementById('selectId') as HTMLOptionElement;
                    selectid.disabled = false;
                }
            },
            function(err:string) { console.error("Execute error", err);
                                alert("You havent selected a video, or logged in") });
}
//#endregion

//#region Push Description To Youtube Video
// Make sure the client is loaded and sign-in is complete before calling this method.
function GitPushDescription(selectText, SelectValue, arrayIds, arrayVidname) {
    console.log(arrayVidname[SelectValue]);
    return gapi.client.youtube.videos.update({
            "part": [
                "snippet"
            ],
            "resource": { // Body basiclly?
                "id": `${arrayIds[SelectValue]}`, // video id
                "snippet": {
                    "title": `${arrayVidname[SelectValue]}`, // Title for update on video, Manditory
                    "description": `${selectText}`, // New description with new timestamps! Manditory
                    "categoryId": "22" // not sure what this does. Note: removing it causes problems
                }
            }
        })
        .then(function(response: Response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response);
                // show success by the yt button
                // or show error 
            },
            function(err: any) { console.error("Execute error", err); });
}
//#endregion

//#region GapiLoad with our YTClient ID
gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: YclientId, plugin_name: YTPluginName});
  });
//#endregion

// Normal Event Handlers

//#region Copy To Clipboard Event
/** Copies specific text areas and makes eventhandler for copy btns */
var Copy = document.querySelectorAll(".Copy");
for (let i = 0; i < Copy.length; i++) {
    Copy[i].addEventListener(
        "click",
        function(event) {
            copyText(event);
        },
        true
    );
}

function copyText(event) : void {
    console.log(event.target.value);
    var num = event.target.value;
    var copyText = document.getElementById(`myInput${num}`) as HTMLInputElement; // HTMLINPUTELEMENT does have the .select() method, the normal HtmlElement doesnt have it

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    alert("Copied the text: " + copyText.value);
}

//#endregion

//#region Select Text Event
// Makes Events for all Select btns and selects the correct text areas
let Select = document.querySelectorAll(".Select");
for (let i = 0; i < Select.length; i++) {
    Select[i].addEventListener(
        "click",
        function(event) {
            SelectText(event);
        },
        true
    );
}

function SelectText(event) : void {
    /* Get the text field */
    console.log(event.target.value);
    var num = event.target.value;
    var selectText = document.getElementById(`myInput${num}`) as HTMLInputElement;

    /* Select the text field */
    selectText.select();
    selectText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(selectText.value);
}
//#endregion

//#region Clear Event
// Make btn event for Clearing button, only makes an alert
const Clear = document.querySelector(".Clear");
Clear?.addEventListener(
    "click",
    function() {
        alert("Clearing Timestamps");
    },
    true
);
//#endregion

//#region Updating Text Length Event
let Textarea = document.querySelectorAll(".Textarea"); // gets array of Textarea elements
for (let i = 0; i < Textarea.length; i++) {
    Textarea[i].addEventListener("keyup", function(event) {
        let Charcount = CalcChars(event);
        let p = document.querySelector(`#CharCount${i}`) as HTMLElement;
        p.textContent = Charcount;
        
        // test by regex on if it contains Illigal Chars

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
        //console.log(p);
    });
}

// make only once. then let the evenhandler do the rest of the work
let StartTextarea:any = document.querySelectorAll(".Textarea");
for (let i = 0; i < StartTextarea.length; i++) {
    let Charcount = StartTextarea[i].value;
    let p = document.querySelector(`#CharCount${i}`) as HTMLElement; // needs to be html element
    p.textContent = Charcount.length;
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
}

function CalcChars(event) : any {
    let string = event.target.value;
    return string.length;
}
//#endregion
