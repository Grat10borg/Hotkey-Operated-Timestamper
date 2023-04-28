// !! your config file should be held to the same level of privacy as your passwords !!
// !! DO NOT SHARE YOUR CONFIG FILE ONLINE !!

// un-Comment the code, its commented out so typescript doesn't scream

// let config = {
//     // Twitch
//     TWITCH_ON: true,
//     TWITCH_API_TOKEN : "a68qltgaz04wye05eyrbtgnxt21usj",
//     TWITCH_LOGIN : "grat_grot10_berg", // Your Twitch name in your channel URL
//     TIMESTAMP_PATH : "C:\\xampp\\htdocs\\TSQ\\Hotkey-Operated-Timestamper\\Texts\\Timestamps.txt",

//     // Youtube (not used rn)
//     YOUTUBE_ON: false,
//     YOUTUBE_CLIENT_ID: "738406360954-a9r9s4jod084g8ac8gec1vv0p9b419di.apps.googleusercontent.com",
//     YOUTUBE_APIKEY: "AIzaSyCq512yjXdQLtdUV3n7CzKIe78oDufRovU",
//     PLUGINNAME : "Hotkey Operated Timestamper",

//     // Local mode
//     LOCALIZE_ON : true,
//     LOCALIZE_LANGUAGE: "da", // "da", "gb", "de" // Used in Youtube description uploading.

//     // Extra configs
//     CLIP_OFFSET : "27",
//     HASHTAGS : "#Vtuber #VtuberEn #Davtuber"
// }

// Shorthand Dom versions
// const $ = document;
// const $$ = {
// dom: document,

// // document methods
// id: $.getElementById.bind($),
// class: $.getElementsByClassName.bind($),
// make: $.createElement.bind($),
// query: $.querySelector.bind($),
// query_all: $.querySelectorAll.bind($),
// txt: fetchTXT.bind($),

// // just here to help me out when working.
// log: console.log,
// } 

// // a little wonky but the response promise did not want to play along..
// async function fetchTXT(Url:string) {
//   await fetch(Url)
//   .then(response => response.text())
//   .then((txt) => {    
//     //return txt;
//     let textarea = $$.make("textarea");
//     textarea.textContent = txt;
//     textarea.id = Url;
//     textarea.hidden = true;
//     $.body.append(textarea);
//   })
//   let text = $$.id(Url).innerHTML;
//   $$.id(Url).outerHTML = ""; // remove textarea again
//   return text;
// }