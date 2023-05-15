<!DOCTYPE html>
<html lang="en">
<head>
    <?php include "includes/html/HtmlDoc.php";?>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Comfortaa&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
    <link href="CSS+SCSS/bootstrap/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="CSS+SCSS/style.css" type="text/css">
    <link rel="shortcut icon" href="img\HOT_Icon.ico"/>
    <title>H.O.T -> Clear Timestamps 💿</title>
</head>
<?php 
//include "includes/settings.php";
?>
<body>
    <main class="container background">
        <div class="m-5 p-5 mt-0">    
    <?php  
    echo "<h3>"; echo $_POST["filepath"]; echo "has been cleared </h3>";
    if (file_exists($_POST["filepath"])) {
        // clear Timestamps from the clear timestamp button
        file_put_contents($_POST["filepath"], "");
    }
    ?>
    <p>You can close H.O.T down now <img class="imgIcon" src="img\HOT_Icon.png"></p>
    </div>
    <?php include "includes\html\Footer.php" ?>
    </main>  
</body>

</html>