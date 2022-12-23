<!DOCTYPE html>
<html lang="en">
<head>
    <?php include "includes/html/HtmlDoc.php";?>
    <link rel="shortcut icon" href="img\HOT_Icon.ico"/>
    <title>H.O.T -> Clear Timestamps 💿</title>
</head>
<?php 
include "includes/settings.php";
?>
<body>
    <main class="container background">
        <div class="m-5 p-5 mt-0">    
    <?php  
    echo "<h3> $Timestamp_path has been cleared </h3>";
    if (file_exists($Timestamp_path)) {
        // clear Timestamps from the clear timestamp button
        file_put_contents($Timestamp_path, "");
    }
    ?>
    <p>You can close H.O.T down now <img class="imgIcon" src="img\HOT_Icon.png"></p>
    </div>
    <?php include "includes\html\Footer.php" ?>
    </main>  
</body>

</html>