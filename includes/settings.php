<?php 
$begindesc_p = "Texts/Desc1.txt";
$intros_p = "Texts\Intro.txt";
$socialLinks_p = "Texts/SocialLinks.txt";
$Credits_p = "Texts/Credits.txt";
$History_p = "Texts\HistoryChannels.txt";
$_SESSION['$Timestam'] = "Texts\Timestamps.txt"; // makes for desc maker to work, and for it to be able to clear it again
$Timestamp_path = $_SESSION['$Timestam']; // if timestamps exist is tested later
$ClipOffset = 26; // cannot plus time, only minus do not try -20

// testing if filepaths returns okay, and if set values are okay
if(!is_int($ClipOffset)) {$error="The defined Clip Offset was not an integer.. defaulting back to 26"; $ClipOffset = 26;}
if(file_exists($begindesc_p)) {$begindesc = file($begindesc_p);}
else { $error="File Not Found.. file at $begindesc_p was not found";}
if(file_exists($intros_p)) {$intros = file($intros_p);}
else { $error="File Not Found.. file at $intros_p was not found";}
if(file_exists($socialLinks_p)) {$socialLinks = file($socialLinks_p);}
else { $error="File Not Found.. file at $socialLinks_p was not found";}
if(file_exists($Credits_p)) {$Credits = file($Credits_p);}
else { $error="File Not Found.. file at $Credits_p was not found";}
if(file_exists($History_p)) {$History = file($History_p);}
else { $error="File Not Found.. file at $History_p was not found";}
?>