<div class="mb-5">
    <h4 class=""># Data!</h4>
    <p class="mb-4">• I Found: <?php if (isset($MultiStreamArray)) {
                    echo count($MultiStreamArray);
                } else {
                    echo "NULL";
                }
                echo " streams. and ";
                if (isset($MultiRecordArray)) {
                    echo count($MultiRecordArray);
                } else {
                    echo "NULL";
                }
                echo " recordings!"; ?></p>
                    <p>• currently getting timestamps from:</p>
                    <p>"<?php echo $Timestamp_path?>"</p>
</div>