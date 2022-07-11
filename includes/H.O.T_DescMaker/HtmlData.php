<div class="mb-5">
<h4 class=""># Data!</h4>
<p>I Found: <?php if (isset($MultiStreamArray)) {
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
</div>
