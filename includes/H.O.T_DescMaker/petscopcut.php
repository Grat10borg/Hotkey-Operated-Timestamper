<?php
// Cuts out zeros for better use of characters, since youtube has a max desc character limit
  function PetscopCut($line)
  {
      $lineA = explode(" ", $line);
      $DigitA = explode(":", $lineA[0]);
      if ($DigitA[0] == 0) { // 16:09
          if (preg_match("/0\d/i", $DigitA[1])) {  // 4:04
              if (preg_match("/00/i", $DigitA[1])) { // 0:08
                  $DigitA[1] = str_replace("00", "0", $DigitA[1]);
                  $TimestampFinal[] = $DigitA[1];
                  $TimestampFinal[] = $DigitA[2];
                  $line = implode(":", $TimestampFinal);
                  return $line;
              }
              $DigitA[1] = str_replace("0", "", $DigitA[1]);
              $TimestampFinal = array();
              $TimestampFinal[] = $DigitA[1];
              $TimestampFinal[] = $DigitA[2];
              $line = implode(":", $TimestampFinal);
              return $line;
          }
          $DigitB[0] = $DigitA[1];
          $DigitB[1] = $DigitA[2];
          $line = implode(":", $DigitB);
          return $line;
      } else {
          $line = explode(" ", $line);
          
          return $line[0];
      }
  }
?>