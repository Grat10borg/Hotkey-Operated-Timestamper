<?php 
$index = 0;
echo "<h3 id=Stream># Streams</h3>";
if (isset($MultiStreamArray)) {
    foreach (array_reverse($MultiStreamArray) as $Tstamp) {
        if ($index == 0) {
            $Streamcount = "Latest Stream";
        } else {
            $Streamcount = $index + 1;
        } 
        echo "<div class='d-flex'>";
        echo "<p class='col' id=Stream-{$index}># Stream No: {$Streamcount}</p>";
        echo "<p class='col' id='CharCount$index'>test</p>";
        echo "</div>";
  
        echo "<textarea class='m-1 res form-control Textarea' id='myInput$index'>";
        foreach ($begindesc as $desc) {
            echo $desc;
        }
        echo "\n\nHotkey, Operated, Time-stamper (H.O.T) V.$version\n";
        echo "(Clips are Offset by -$ClipOffset)\n";
        foreach ($Tstamp as $Tstamp2) {
            echo "{$Tstamp2}\n";
        }
        echo "\n";
        foreach ($intros as $text) {
            echo $text;
        }
        echo "\n";
        foreach ($socialLinks as $Links) {
            echo $Links;
        }
        echo "\n\n";
        foreach ($Credits as $credit) {
            echo $credit;
        }
        echo "</textarea>";
        echo "<div class='m-4 d-flex justify-content-center'>";
        echo "<button class='button mx-1 Select' value='{$index}'>Select text <img src='img\TwitchIconsmol.png' class='imgIcon'></button>";
        echo "<button class='button mx-1 Copy' value='{$index}'>Copy text<img src='img\TwitchIconsmol.png'class='imgIcon'></button>";
        echo "<button class='button mx-1 Send' value='{$index}' id='authbtn'>Update YT Vid <img src='img\Youtube.png' class='imgIcon'></button>";
        echo "</div>";
        echo "</br>";
        $index++;
    }
} else {
    include "includes\H.O.T_DescMaker\ErrorStream.php";
}
$i = 0;
echo "<h3 id=Record># Recordings</h3>";
if (isset($MultiRecordArray)) {
    foreach (array_reverse($MultiRecordArray) as $RecodStamp) {
        if ($i == 0) {
            $Streamcount = "Latest Recording";
        } else {
            $Streamcount = $i + 1;
        }

        echo "<div class='d-flex'>";
        echo "<p class='col' id=recording-{$i}># recording No: {$Streamcount}</p>";
        echo "<p class='col' id='CharCount$index'>test</p>";
        echo "</div>";
       
        echo "<textarea class='m-1 res form-control Textarea' id='myInput$index'>";
        foreach ($begindesc as $desc) {
            echo $desc;
        }
        echo "\n\nHotkey, Operated, Time-stamper (H.O.T) V.$version\n";
        echo "(Clips are Offset by -$ClipOffset)\n";
        foreach ($RecodStamp as $RecodStamp2) {
            echo "{$RecodStamp2}\n";
        }
        echo "\n";
        foreach ($intros as $text) {
            echo $text;
        }
        echo "\n";
        foreach ($socialLinks as $Links) {
            echo $Links;
        }
        echo "\n\n";
        foreach ($Credits as $credit) {
            echo $credit;
        }
        echo "</textarea>";
        echo "<div class='m-4 d-flex justify-content-center Printerbtns'>";
        echo "<button class='mx-1 Select' value='{$index}'>Select text <a value='{$index}'><img src='img\Youtube.png' class='imgIcon'></a></button>";
        echo "<button class='mx-1 Copy' value='{$index}'>Copy text <img src='img\Youtube.png' class='imgIcon'></button>";
        echo "<button class='mx-1 Send' id='authbtn' value='{$index}'>Update YT Vid <img src='img\Youtube.png' class='imgIcon'></button>";
        echo "</div>";
        echo "</br>";
        $index++;
        $i++;
    }
} else {
   include "includes\H.O.T_DescMaker\ErrorRecord.php";
}
?>