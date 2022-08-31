<?php 
include "includes/html/HtmlDoc.php";
include "includes/settings.php";
?>
<body>
    <main class="container background">
        <div class="m-5 p-5 mt-0">

        
    <?php  
    echo "<h3> $Timestamp_path has been cleared </h3>";
    if (file_exists($_SESSION['$Timestam'])) {
        // clear Timestamps from the clear timestamp button
        file_put_contents($_SESSION['$Timestam'], "");
    }
    ?>
    <p>You can close H.O.T down now,</p>
    </div>
    </main>  
</body>

</html>