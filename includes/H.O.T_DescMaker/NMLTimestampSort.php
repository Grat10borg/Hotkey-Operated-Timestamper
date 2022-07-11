<?php
$Catch = false;
foreach ($arrayText as $line) {
    //echo $line;
    if (preg_match("/EVENT:START.*/i", $line)) {
        continue;
    }
    if (preg_match("/EVENT:STOP.*/i", $line)) { // every time stream or recording stops, 
        // if arrays arent empty save array
        if (isset($StreamArray)) {
            if (count($StreamArray) != 0) {
                array_unshift($StreamArray, "‣ 0:00 Start"); // Places 0:00 start infront of array, this makes sure youtube makes timestamps into Chapters.. the 0:00 is needed for this
                $MultiStreamArray[] = $StreamArray; // adds to multi array for printing later
            }
        }
        if (isset($RecordArray)) {
            if (count($RecordArray) != 0) {
                array_unshift($RecordArray, "‣ 0:00 Start"); // Places 0:00 start infront of array, this makes sure youtube makes timestamps into Chapters.. the 0:00 is needed for this
                $MultiRecordArray[] = $RecordArray; // adds to multi array for printing later
            }
        }

        // empty arrays
            $StreamArray = array();
            $RecordArray = array();   
        continue;
    }
    if (preg_match("/EVENT:SCENE.*/i", $line)) {
        $lineScene = explode(" ", $line);
        $lineNewScene = $lineScene[3];
        $Catch = true;
        continue;
    }
    if ($Catch == true) { // Get scene Shift timestamps
        if (PetscopCut($line) != "0:00") {
            if (preg_match("/\d:\d\d:\d\d\s.*/i", $line)) {
                if (preg_match("/\d:\d\d:\d\d\sRecord.*/i", $line)) {
                    $line2 = PetscopCut($line);
                    $line2 = "‣ {$line2} {$lineNewScene}";
                    $RecordArray[] = $line2;
                    $Catch = false;
                }
                if (preg_match("/\d:\d\d:\d\d\sStream.*/i", $line)) {
                    $line2 = PetscopCut($line);
                    $line2 = "‣ {$line2} {$lineNewScene}";
                    $StreamArray[] = $line2;
                    $Catch = false;
                }
                continue;
            }
        }
    }
    // if not empty timestamp
    elseif (preg_match("/0:00:00.*/i", $line) == 0) {   // empty out enter keys
        str_replace("\n", "", $line);
        if (preg_match("/\d:\d\d:\d\d\sRecord.*/i", $line)) {

            $line = NewClipMaker($line, $ClipOffset);
            $line = PetscopCut($line);
            $line = "• {$line} Clip"; // change with actual clip names, hopefully imported from twitch!
            $RecordArray[] = $line;
        }
        if (preg_match("/\d:\d\d:\d\d\sStream.*/i", $line)) {
            $line = NewClipMaker($line,$ClipOffset);
            $line = PetscopCut($line);
            $line = "• {$line} Clip";
            $StreamArray[] = $line;
        } else { // nothing inportent would be left after this, likely only the enter key presses
            continue;
        }
    }
}
