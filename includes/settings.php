<?php 
$BeforeDesc_p = "Texts\BeforeTimestamps.txt";
$AfterDesc_p = "Texts\AfterTimestamps.txt";

$History_p = "Texts\HistoryChannels.txt";
$_SESSION['$Timestam'] = "Texts\Timestamps.txt"; // makes for desc maker to work, and for it to be able to clear it again
$Timestamp_path = $_SESSION['$Timestam']; // if timestamps exist is tested later

// testing if filepaths returns okay, and if set values are okay

if(file_exists($BeforeDesc_p)) {$BeforeDesc = file($BeforeDesc_p);}
else { $error="File Not Found.. file at $BeforeDesc_p was not found";}
if(file_exists($AfterDesc_p)) {$AfterDesc = file($AfterDesc_p);}
else { $error="File Not Found.. file at $AfterDesc_p was not found";}
if(file_exists($History_p)) {$History = file($History_p);}
else { $error="File Not Found.. file at $History_p was not found";}
?>