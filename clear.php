<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>cleared</title>
</head>

<body>

    <?php  
    include "includes/settings.php";
    echo "<body>";
    $t = $Timestamp_path;
    echo "$t has been cleared ";
    if (file_exists($_SESSION['$Timestam'])) {
        // clear Timestamps from the clear timestamp button
        file_put_contents($_SESSION['$Timestam'], "");
    }
    ?>
</body>

</html>