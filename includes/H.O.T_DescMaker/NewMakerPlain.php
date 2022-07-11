<?php 
  // Minuses Timestamps by 30 sek like the twitch clipping tool
  function NewClipMaker($line, $ClipOffset)
  {
      // org input: 1:28:06 
      $lineA = explode(" ", $line); //1:28:06
      $lineA = explode(":", $lineA[0]); //1,28,06
      $lineA[2] = $lineA[2] - $ClipOffset; // if small 06 - 26 // if big 30 - 26
      if ($lineA[2] < 0) {  // if smaller than 0 
          if ($lineA[1] != 00) { // if not 00
              $lineA[1] = $lineA[1] - 1; // minus the minute counter 
              $lineA[2] = $lineA[2] + 60; // give the second counter 60 new seks
              if ($lineA[1] < 9) { // if single integer
                  $lineA[1] = "0{$lineA[1]}"; // add zero
              }
              if ($lineA[2] < 9) { // if single integer
                  $lineA[2] = "0{$lineA[2]}"; // add zero
              }
          } elseif ($lineA[0] != 0) { // 1:00:00     
              $lineA[0] = $lineA[0] - 1; // minus the hour
              $lineA[1] = $lineA[1] + 59; // give minute 60 then minus one
              $lineA[2] = $lineA[2] + 60; // give 60 seks
              if ($lineA[1] < 9) {
                  $lineA[1] = "0{$lineA[1]}";
              }
              if ($lineA[2] < 9) {
                  $lineA[2] = "0{$lineA[2]}";
              }
          } else {
              $lineA[2] = "00";
              $line = implode(":", $lineA);           
              return $line;
          }
      } // if was bigger than 0
      if ($lineA[2] < 9) { // if single integer
          $lineA[2] = "0{$lineA[2]}"; // put 0 infront of single integer
      }
      $line = implode(":", $lineA); // re add Colons
      return $line; // return
  }
?>