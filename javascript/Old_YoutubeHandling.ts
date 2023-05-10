
// gets settings file embeded by PHP
let TextATags = $$.id("Tags") as HTMLElement;
let HashTagsP = $$.id("Hashtags") as HTMLElement;

var auth = $$.query(".authUpload") as HTMLInputElement;

let Tags: Array<string>;
let HashTags: string;
let localization: string;
//#region  Test if Data is Useable

if (config.YOUTUBE_CLIENT_ID == null || config.YOUTUBE_CLIENT_ID == "") {
  $$.log(
    "Could Not get Youtube ClientId, You will not be able to Connect to Youtube"
  );
  auth.disabled = true;
}

if (config.YOUTUBE_APIKEY == null || config.YOUTUBE_APIKEY == "") {
  $$.log(
    "Could Not get Youtube ApiKey, you will not be able to Connect to Youtube"
  );
  auth.disabled = true;
}

if (config.PLUGINNAME == null || config.PLUGINNAME == "") {
  $$.log(
    "You didnt write the plugin name for your Google project in the settings, The Connect to Youtube button May or May Not work?"
  );
  auth.disabled = true;
}

// Non "Bad" Errors Aka Self Fixable
if (TextATags != null) {
  Tags = TextATags.innerHTML.split("\n");
} else {
  Tags = Array();
}
if (HashTagsP != null) {
  HashTags = HashTagsP.innerHTML;
} else {
  HashTags = "";
}

if (config.LOCALIZE_ON != null || config.LOCALIZE_ON != "") {
  // @ts-expect-error
  localization = config.LOCALIZE_ON;
} else {
  localization = "";
}

//#endregion
let localizationDesc = ""; // also show localized descripton alongside general one.
let localizationTitle = ""; // make an input field for Localzied title

var arrayIds = Array();
var arrayVidname = Array();
var optionValue = 0;
var gapi: any;

// ALL the text areas on the page.
let StartTextareas: any = $$.query_all(
  ".Charcounts"
) as NodeListOf<HTMLTextAreaElement>;


/** the youtube connection also needs to be updated for security reasons */
// or so it says

// YOUTUBE API HANDLING

// Retriving Website data to upload onto youtube

//#region Authbtn + collection of Data for Desc Update

auth.addEventListener(
  "click",
  function (event) {
    authAllowDescChange().then(loadClientChannel()).then(GetVideoIds); // calls Get video Ids to get vid ids
    // call to get channel name + profile picture
  },
  true
);

var Send = $$.query_all(".Send") as NodeListOf<HTMLInputElement>;
for (let i = 0; i < Send.length; i++) {
  Send[i].addEventListener(
    "click",
    function (event: any) {
      if(StartTextareas != null) {
        //console.log(event.target.value);
        StartTextareas[event.target.value].select();
        StartTextareas[event.target.value].setSelectionRange(0, 99999);
        var select = $$.query(".SelectId") as HTMLInputElement;
  
        // updates desc
        GitPushDescription(
          StartTextareas[event.target.value].value,
          select.value,
          arrayIds,
          arrayVidname,
          event.target.value
        );
      }
      else {
        console.log("did not find any acceptable Textareas");
      }
    },
    true
  );
}
//#endregion

// Youtube connection and updating

//#region Youtube Auth Functions
function authAllowDescChange() {
  return gapi.auth2
    .getAuthInstance()
    .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
    .then(
      function () {
        $$.log("Sign-in successful");
      },
      function (err: any) {
        console.error("Error signing in", err);
      }
    );
}

function loadClientChannel() {
  gapi.client.setApiKey(config.YOUTUBE_APIKEY);
  return gapi.client
    .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
    .then(
      function () {
        $$.log("GAPI client loaded for API");
      },
      function (err: any) {
        console.error("Error loading GAPI client for API", err);
      }
    );
}
//#endregion

//#region Get Videos for The Select Box
// Make sure the client is loaded and sign-in is complete before calling this method.
function GetVideoIds() {
  return gapi.client.youtube.search
    .list({
      part: ["snippet"],
      forMine: true,
      maxResults: 10,
      order: "date",
      type: ["video"],
    })
    .then(
      function (response: any) {
        // Handle the results here (response.result has the parsed body).
        var arrayR = response; // response is an array!! but for some reason it doesnt let me dig into it like a normal array
        for (let index: any = 0; index < arrayR.result.items.length; index++) {
          arrayIds[index] =
            arrayR["result"]["items"][`${index}`]["id"]["videoId"];
          arrayVidname[index] =
            arrayR["result"]["items"][`${index}`]["snippet"]["title"];

          let option = $$.make("option") as HTMLOptionElement;
          option.appendChild(document.createTextNode(`${arrayVidname[index]}`));
          option.setAttribute("value", index);
          let Selectbox = $$.query(
            ".SelectId"
          ) as HTMLInputElement;
          Selectbox.appendChild(option);
          let selectid = $$.id(
            "selectId"
          ) as HTMLOptionElement;
          selectid.disabled = false;
        }
      },
      function (err: string) {
        console.error("Execute error", err);
        alert("You havent selected a video, or logged in");
      }
    );
}
//#endregion

//#region Push Description To Youtube Video
// Make sure the client is loaded and sign-in is complete before calling this method.
function GitPushDescription(
  selectText,
  SelectValue,
  arrayIds,
  arrayVidname,
  target
) {
  $$.log(arrayVidname[SelectValue]);
  $$.log(SelectValue);
  let Title = "";
  if (HashTags != "") {
    Title = arrayVidname[SelectValue] + " " + HashTags;
  } else {
    Title = arrayVidname[SelectValue];
  }
  if (Tags.length < 0) {
    // if no tags are precent
    Tags.push("VOD");
  }
  if (localization != "") {
    let res = $$.id(`LocaleDesc-${target}`) as HTMLElement;
    let res2 = $$.id(
      `LocaleDescTitle-${target}`
    ) as HTMLInputElement;
    let LocalDesc = res.innerHTML;
    let LocalTitle = res2.value;
    if (LocalTitle == "") {
      alert(
        "you have to write a title for the localized version! (U.U )...zzz"
      );
    }
    if (LocalDesc.indexOf("<") > -1 || LocalDesc.indexOf(">") > -1) {
      alert(
        "your description contains an iligal character! like: '<', '>' try removing them! ( ´･･)ﾉ(._.`)"
      );
    }
    if (LocalDesc)
      if (LocalTitle != "" && HashTags != "") {
        LocalTitle = LocalTitle + " " + HashTags;
      } else {
        return gapi.client.youtube.videos
          .update({
            part: ["snippet", "snippet,status,localizations"],
            resource: {
              // Body basiclly?
              id: `${arrayIds[SelectValue]}`, // video id
              localizations: {
                da: {
                  description: LocalDesc,
                  title: LocalTitle,
                },
              },
              snippet: {
                defaultLanguage: "en",
                categoryId: "22", // not sure what this does. Note: removing it causes problems
                tags: Tags, // adds users tags onto the video.
                title: `${Title}`,
                description: `${selectText}`,
              },
            },
          })
          .then(
            function (response: Response) {
              // Handle the results here (response.result has the parsed body).
              $$.log("Response", response);
              // show success by the yt button
              // or show error
            },
            function (err: any) {
              console.error("Execute error", err);
            }
          );
      }
  } else {
    return gapi.client.youtube.videos
      .update({
        part: ["snippet"],
        resource: {
          // Body basiclly?
          id: `${arrayIds[SelectValue]}`, // video id
          snippet: {
            categoryId: "22", // not sure what this does. Note: removing it causes problems
            tags: Tags, // adds users tags onto the video.
            title: `${Title}`,
            description: `${selectText}`,
          },
        },
      })
      .then(
        function (response: Response) {
          // Handle the results here (response.result has the parsed body).
          $$.log("Response", response);
          // show success by the yt button
          // or show error
        },
        function (err: any) {
          console.error("Execute error", err);
        }
      );
  }
}
//#endregion

//#region GapiLoad with our YTClient ID
gapi.load("client:auth2", function () {
  if (

    config.YOUTUBE_CLIENT_ID != "" &&
  
    config.PLUGINNAME != "" &&

    config.YOUTUBE_CLIENT_ID != null &&

    config.PLUGINNAME != null &&

    config.YOUTUBE_CLIENT_ID != undefined &&

    config.PLUGINNAME != undefined
  ) {

    gapi.auth2.init({ client_id: config.YOUTUBE_CLIENT_ID, plugin_name: config.PLUGINNAME });
  }
});
//#endregion