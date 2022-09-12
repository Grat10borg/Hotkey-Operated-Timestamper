"use strict";
var ApiValid;
let Errors = false;
let ClipOffset = document.getElementById("ClipOffsetIn");
ClipOffset.addEventListener("keyup", function (event) {
    if (isFinite(parseInt(ClipOffset.value)) == false) {
        let ClipOffsetP = document.getElementById("ClipOffsetP");
        ClipOffsetP.innerHTML = "ClipOffset was Not a number";
        ClipOffsetP.classList.add("CharaRed");
        Errors = true;
    }
});
let TwitchKey = document.getElementById("TwitchKeyIn");
TwitchKey.addEventListener("keyup", async function (event) {
    ApiValid = false;
    await TestApikey(TwitchKey.value);
    if (ApiValid == false) {
        let TwitchKeyP = document.getElementById("TwitchKeyP");
        TwitchKeyP.innerHTML = "TwitchKey was Not valid";
        TwitchKeyP.classList.add("CharaRed");
        Errors = true;
    }
});
async function TestApikey(Key) {
    console.log(Key);
    await fetch("https://id.twitch.tv/oauth2/validate", {
        headers: {
            Authorization: "Bearer " + Key,
        },
    })
        .then((resp) => resp.json())
        .then((resp) => {
        if (resp.status) {
            if (resp.status == 401) {
                console.log("This token is invalid ... " + resp.message);
                ApiValid = false;
                return 0;
            }
            console.log("Unexpected output with a status");
            ApiValid = false;
            return 0;
        }
        if (resp.client_id) {
            console.log("Token Validated Sucessfully");
            ApiValid = true;
            return 1;
        }
        console.log("unexpected Output");
        ApiValid = false;
        return 0;
    })
        .catch((err) => {
        console.log(err);
        ApiValid = false;
        return 0;
    });
}
