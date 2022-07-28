var YclientId = "738406360954-727ohtsje2p1se0vngbosd5oot1e601l.apps.googleusercontent.com";
var YApiKey = "AIzaSyCq512yjXdQLtdUV3n7CzKIe78oDufRovU";

var arrayIds = Array();
var arrayVidname = Array();
var optionValue = 0;
var gapi: any;

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

// Make sure the client is loaded and sign-in is complete before calling this method.
// unused for now, add a way to run an auth button without needing to log in twice
function GetProfileData() {
    return gapi.client.youtube.channels.list({
        "part": [ 
            "snippet,contentDetails,statistics"
        ],
        "mine": true // Your Channel
    })
        .then(function (response: Response) {

           var array = response; // response is an array!! but for some reason it doesnt let me dig into it like a normal array
           console.log("all data")
           console.log(array["result"]["items"]["0"]); // use ["snippet"] too to get to general data
           var desc = array["result"]["items"]["0"]["snippet"]["description"]; // get desc of channel
           var country =  array["result"]["items"]["0"]["snippet"]["country"]; // gets the country the channel is from
           var title =  array["result"]["items"]["0"]["snippet"]["title"]; // gets the name of the channel

           console.log("description of channel");
           console.log(desc);
           console.log("The Country");
           console.log(country);
           console.log("Title of channel");
           console.log(title);
        },
            function (err:string) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "738406360954-727ohtsje2p1se0vngbosd5oot1e601l.apps.googleusercontent.com" });
});
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
                console.log("Response", response);
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

                // console.log(option);
                // console.log(Selectbox);
                console.log(arrayIds);
                console.log(arrayVidname);
            },
            function(err:string) { console.error("Execute error", err);
                                alert("You havent selected a video, or logged in") });
}

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

gapi.load("client:auth2", function() {
    gapi.auth2.init({ client_id: YclientId });
});