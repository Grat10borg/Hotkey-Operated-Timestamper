<?php
$BeforeDesc_p = "Texts\BeforeTimestamps.txt";
$AfterDesc_p = "Texts\AfterTimestamps.txt";
$LocalBeforeDesc_p = "Texts\LocaleBeforeTimestamps.txt";
$LocalAfterDesc_p = "Texts\LocaleAfterTimestamps.txt";
$History_p = "Texts\HistoryChannels.txt";
$Tag_p = "Texts\Tags.txt";

if (isset($_SESSION) == false) {
    session_start();
}
else {
    session_destroy();
}

// reads file as a string instead of an array
if(file_exists("Texts\Settings.txt")) {
    $SettingsTxt = file_get_contents("Texts\Settings.txt");
    $Settings = preg_split('/"/', $SettingsTxt);
    
    // All settings should be on UN-Evens
    $TwitchApiKey = $Settings[1];
    $StreamerLogin = $Settings[3];
    $YTClientID = $Settings[5];
    $YTAPIKey = $Settings[7];
    $ClipsOffset = $Settings[9]; // if fail defaults back to -26, only used for local timestamps as of writing
    $Timestamp_path = $Settings[11];
    $PluginName = $Settings[13];
    $Hashtags = $Settings[15];
    $Localazation = $Settings[17];
}
else {
   echo $error = "Fatal ERROR could not find Settings.txt at Texts\Settings.txt";
}

// testing if filepaths returns okay, and if set values are okay

if (file_exists($BeforeDesc_p)) {
    $BeforeDesc = file($BeforeDesc_p);
} else {
    $error = "File Not Found.. file at $BeforeDesc_p was not found";
}
if (file_exists($LocalBeforeDesc_p)) {
    $LocalBeforeDesc = file($LocalBeforeDesc_p);
} else {
    $error = "File Not Found.. file at $LocalBeforeDesc_p was not found";
}
if (file_exists($AfterDesc_p)) {
    $AfterDesc = file($AfterDesc_p);
} else {
    $error = "File Not Found.. file at $AfterDesc_p was not found";
}
if (file_exists($LocalAfterDesc_p)) {
    $LocalAfterDesc = file($LocalAfterDesc_p);
} else {
    $error = "File Not Found.. file at $LocalAfterDesc_p was not found";
}
if (file_exists($History_p)) {
    $History = file($History_p);
} else {
    $error = "File Not Found.. file at $History_p was not found";
}
if (file_exists($Tag_p)) {
    $Tag = file($Tag_p);
} else {
    $error = "File Not Found.. file at $Tag_p was not found";
}
