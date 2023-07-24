A stream description timestamper and highlight tool. 
it's made to lift the burden of timestamping VODs and clip highlights!

H.O.T was my first javascript project so its code is. Not pretty though it gets the job done,
H.O.T was prototyped in Xampp and PHP's server command

#Description Maker
![Skærmbillede 2022-09-12 132654](https://user-images.githubusercontent.com/109081987/189642151-b2b8acac-aed9-4f45-85db-66cf7b60f087.png)

takes the raw Infowriter timestamp file and sorts it as your description for each stream
pressing clip-stamps while having twitch set up will change out your timestamps with when a twitch clip was taken.

#Highlighter
![Skærmbillede 2022-09-12 132807](https://user-images.githubusercontent.com/109081987/189642371-f4fae3bf-ed3b-4949-b144-2bcd2969120f.png)

the highlighter queries the twitch API and sorts clips into a description for a would be clip highlight video, 
it does not edit them it only makes the description

#Config file
for H.O.T to work you'll need the Infowriter plugin for OBS and twitch tokens / Oauth tokens

the structure of the config file looks like this

```
let config = {
    
    // turning Infowriter Off is not implimented
    
    INFOWRITER_ON: true, // infowriter is needed for local timestamps, but you can rely on Clip-stamps instead
    CLIP_OFFSET : 27, // emulates how much Twitch goes back when you press the clip button
    HIGHLIGHTER_CHANNELS : ["grat_grot10_berg", "marinemammalrescue"],
    HIGHLIGHT_SORTING : "date", // date, datereverse, random

    // txt controls..
    DESCRIPTION_MAKER_BEFORE_TIMESTAMPS : "Texts/BeforeTimestamps.txt",
    DESCRIPTION_MAKER_AFTER_TIMESTAMPS : "Texts/AfterTimestamps.txt",
    HIGHLIGHTER_BEFORE_TIMESTAMPS: "Texts/BeforeTimestamps.txt",
    HIGHLIGHTER_AFTER_TIMESTAMPS: "Texts/AfterTimestamps.txt",

    // Local mode & Local txt controls
    LOCALIZE_ON : true,
    LOCALIZE_LANGUAGE: "da", // "da", "gb", "de" // Used in Youtube description uploading.
    LOCAL_DESCRIPTION_MAKER_BEFORE_TIMESTAMPS : "Texts/LocaleBeforeTimestamps.txt",
    LOCAL_DESCRIPTION_MAKER_AFTER_TIMESTAMPS : "Texts/LocaleAfterTimestamps.txt",
    LOCAL_HIGHLIGHTER_BEFORE_TIMESTAMPS: "Texts/LocaleBeforeTimestamps.txt",
    LOCAL_HIGHLIGHTER_AFTER_TIMESTAMPS: "Texts/LocaleAfterTimestamps.txt",

    // Twitch
    TWITCH_ON: true,
    TWITCH_API_TOKEN : "<your twitch token>",
    TWITCH_LOGIN : "<your twitch username>", // Your Twitch name in your channel URL
    TIMESTAMP_PATH : "Timestamps.txt",


    // Youtube (not used rn)
    YOUTUBE_ON: false,
    YOUTUBE_CLIENT_ID: "<youtube api client id>",
    YOUTUBE_APIKEY: "<youtube api key>",
    PLUGINNAME : "<plugin name in google cloud console>",

    // not implimented.
    // Extra configs
    HASHTAGS : "#Vtuber #VtuberEn #Davtuber", 
    AUTO_RUN_CLIPSTAMPS: false, // automatically runs clipstamps when you load the page.
}

´´´
place the config.ts / config.js inside the scripts folder

//outdated but is still helpful!
For a setup guide please look to the [H.O.T Wiki](https://github.com/Grat10borg/Hotkey-Operated-Timestamper/wiki)
