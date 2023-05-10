"use strict";
let TextATags = $$.id("Tags");
let HashTagsP = $$.id("Hashtags");
var auth = $$.query(".authUpload");
let Tags;
let HashTags;
let localization;
if (config.YOUTUBE_CLIENT_ID == null || config.YOUTUBE_CLIENT_ID == "") {
    $$.log("Could Not get Youtube ClientId, You will not be able to Connect to Youtube");
    auth.disabled = true;
}
if (config.YOUTUBE_APIKEY == null || config.YOUTUBE_APIKEY == "") {
    $$.log("Could Not get Youtube ApiKey, you will not be able to Connect to Youtube");
    auth.disabled = true;
}
if (config.PLUGINNAME == null || config.PLUGINNAME == "") {
    $$.log("You didnt write the plugin name for your Google project in the settings, The Connect to Youtube button May or May Not work?");
    auth.disabled = true;
}
if (TextATags != null) {
    Tags = TextATags.innerHTML.split("\n");
}
else {
    Tags = Array();
}
if (HashTagsP != null) {
    HashTags = HashTagsP.innerHTML;
}
else {
    HashTags = "";
}
if (config.LOCALIZE_ON != null || config.LOCALIZE_ON != "") {
    localization = config.LOCALIZE_ON;
}
else {
    localization = "";
}
let localizationDesc = "";
let localizationTitle = "";
var arrayIds = Array();
var arrayVidname = Array();
var optionValue = 0;
var gapi;
let StartTextareas = $$.query_all(".Charcounts");
auth.addEventListener("click", function (event) {
    authAllowDescChange().then(loadClientChannel()).then(GetVideoIds);
}, true);
var Send = $$.query_all(".Send");
for (let i = 0; i < Send.length; i++) {
    Send[i].addEventListener("click", function (event) {
        if (StartTextareas != null) {
            StartTextareas[event.target.value].select();
            StartTextareas[event.target.value].setSelectionRange(0, 99999);
            var select = $$.query(".SelectId");
            GitPushDescription(StartTextareas[event.target.value].value, select.value, arrayIds, arrayVidname, event.target.value);
        }
        else {
            console.log("did not find any acceptable Textareas");
        }
    }, true);
}
function authAllowDescChange() {
    return gapi.auth2
        .getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
        .then(function () {
        $$.log("Sign-in successful");
    }, function (err) {
        console.error("Error signing in", err);
    });
}
function loadClientChannel() {
    gapi.client.setApiKey(config.YOUTUBE_APIKEY);
    return gapi.client
        .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function () {
        $$.log("GAPI client loaded for API");
    }, function (err) {
        console.error("Error loading GAPI client for API", err);
    });
}
function GetVideoIds() {
    return gapi.client.youtube.search
        .list({
        part: ["snippet"],
        forMine: true,
        maxResults: 10,
        order: "date",
        type: ["video"],
    })
        .then(function (response) {
        var arrayR = response;
        for (let index = 0; index < arrayR.result.items.length; index++) {
            arrayIds[index] =
                arrayR["result"]["items"][`${index}`]["id"]["videoId"];
            arrayVidname[index] =
                arrayR["result"]["items"][`${index}`]["snippet"]["title"];
            let option = $$.make("option");
            option.appendChild(document.createTextNode(`${arrayVidname[index]}`));
            option.setAttribute("value", index);
            let Selectbox = $$.query(".SelectId");
            Selectbox.appendChild(option);
            let selectid = $$.id("selectId");
            selectid.disabled = false;
        }
    }, function (err) {
        console.error("Execute error", err);
        alert("You havent selected a video, or logged in");
    });
}
function GitPushDescription(selectText, SelectValue, arrayIds, arrayVidname, target) {
    $$.log(arrayVidname[SelectValue]);
    $$.log(SelectValue);
    let Title = "";
    if (HashTags != "") {
        Title = arrayVidname[SelectValue] + " " + HashTags;
    }
    else {
        Title = arrayVidname[SelectValue];
    }
    if (Tags.length < 0) {
        Tags.push("VOD");
    }
    if (localization != "") {
        let res = $$.id(`LocaleDesc-${target}`);
        let res2 = $$.id(`LocaleDescTitle-${target}`);
        let LocalDesc = res.innerHTML;
        let LocalTitle = res2.value;
        if (LocalTitle == "") {
            alert("you have to write a title for the localized version! (U.U )...zzz");
        }
        if (LocalDesc.indexOf("<") > -1 || LocalDesc.indexOf(">") > -1) {
            alert("your description contains an iligal character! like: '<', '>' try removing them! ( ´･･)ﾉ(._.`)");
        }
        if (LocalDesc)
            if (LocalTitle != "" && HashTags != "") {
                LocalTitle = LocalTitle + " " + HashTags;
            }
            else {
                return gapi.client.youtube.videos
                    .update({
                    part: ["snippet", "snippet,status,localizations"],
                    resource: {
                        id: `${arrayIds[SelectValue]}`,
                        localizations: {
                            da: {
                                description: LocalDesc,
                                title: LocalTitle,
                            },
                        },
                        snippet: {
                            defaultLanguage: "en",
                            categoryId: "22",
                            tags: Tags,
                            title: `${Title}`,
                            description: `${selectText}`,
                        },
                    },
                })
                    .then(function (response) {
                    $$.log("Response", response);
                }, function (err) {
                    console.error("Execute error", err);
                });
            }
    }
    else {
        return gapi.client.youtube.videos
            .update({
            part: ["snippet"],
            resource: {
                id: `${arrayIds[SelectValue]}`,
                snippet: {
                    categoryId: "22",
                    tags: Tags,
                    title: `${Title}`,
                    description: `${selectText}`,
                },
            },
        })
            .then(function (response) {
            $$.log("Response", response);
        }, function (err) {
            console.error("Execute error", err);
        });
    }
}
gapi.load("client:auth2", function () {
    if (config.YOUTUBE_CLIENT_ID != "" &&
        config.PLUGINNAME != "" &&
        config.YOUTUBE_CLIENT_ID != null &&
        config.PLUGINNAME != null &&
        config.YOUTUBE_CLIENT_ID != undefined &&
        config.PLUGINNAME != undefined) {
        gapi.auth2.init({ client_id: config.YOUTUBE_CLIENT_ID, plugin_name: config.PLUGINNAME });
    }
});
