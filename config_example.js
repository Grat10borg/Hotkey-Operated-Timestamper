// !! your config file should be held to the same level of privacy as your passwords !!
// !! DO NOT SHARE YOUR CONFIG FILE ONLINE !!
let config = {
    // turning Infowriter Off is not implimented
    INFOWRITER_ON: true, // infowriter is needed for local timestamps, but you can rely on Clip-stamps instead
    CLIP_OFFSET : 27, // emulates how much Twitch goes back when you press the clip button
    HIGHLIGHTER_CHANNELS: Array("marinemammalrescue", "grat_grot10_berg"), // The channels in the "Channel" Select box, for quick querying for highlights.

    // txt controls..
    DESCRIPTION_MAKER_BEFORE_TIMESTAMPS : "Texts/BeforeTimestamps.txt",
    DESCRIPTION_MAKER_AFTER_TIMESTAMPS : "Texts/AfterTimestamps.txt",
    HIGHLIGHTER_BEFORE_TIMESTAMPS: "Texts/BeforeTimestamps.txt",
    HIGHLIGHTER_AFTER_TIMESTAMPS: "Texts/AfterTimestamps.txt",

    // Local mode & Local txt controls
    LOCALIZE_ON : false,
    LOCALIZE_LANGUAGE: "da", // "da", "gb", "de" // Used in Youtube description uploading.
    LOCAL_DESCRIPTION_MAKER_BEFORE_TIMESTAMPS : "Texts/LocaleBeforeTimestamps.txt",
    LOCAL_DESCRIPTION_MAKER_AFTER_TIMESTAMPS : "Texts/LocaleAfterTimestamps.txt",
    LOCAL_HIGHLIGHTER_BEFORE_TIMESTAMPS: "Texts/LocaleBeforeTimestamps.txt",
    LOCAL_HIGHLIGHTER_AFTER_TIMESTAMPS: "Texts/LocaleAfterTimestamps.txt",

    // Twitch
    TWITCH_ON: true, // turns off ability for some things, including: Clip-stamps & Highlighter
    TWITCH_API_TOKEN : "<YOUR TWITCH TOKEN>",
    TWITCH_LOGIN : "grat_grot10_berg", // Your Twitch name in your channel URL
    TIMESTAMP_PATH : "Texts/Timestamps.txt",


    // Youtube (not used rn)
    // YOUTUBE_ON: false,
    // YOUTUBE_CLIENT_ID: "",
    // YOUTUBE_APIKEY: "",
    // PLUGINNAME : "",


    // Extra configs
    HASHTAGS : Array("#Vtuber", "#VtuberEN", "#Davtuber"),
    // not implimented.
    AUTO_RUN_CLIPSTAMPS: false, // automatically runs clipstamps when you load the page.
}