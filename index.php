<?php
include "includes/html/HtmlDoc.php"; // makes the DoctypeHtml, also sets in version num in title 
include "includes/settings.php"; // general vars things you can change is imported here, like the file root for the txt!
include "includes/H.O.T_DescMaker/petscopcut.php"; // function: trims down timestamps so it fills less characters
include "includes/H.O.T_DescMaker/NewMakerPlain.php"; // function: minuses timestamps by a specified amount, normal = 26-30ish

// actual sorting of timestamps here
if (file_exists($Timestamp_path)) { // if there is a file at the end of the file path
    $arrayText = file($Timestamp_path); // retrive the
    if ($arrayText != array()) {
        include "includes/H.O.T_DescMaker/NMLTimestampSort.php";
    } // sorts timestamps into record stamps and stream stamps, also removes empty timestamps
    else {
        $error = "File Found. File was empty though.. file at $Timestamp_path did not have content";
    }
} else {
    $error = "Failed to find Txt at file path. please check if its spelt 100% correctly \n $Timestamp_path";
}
?>

<body>
    <main class="container background px-5">
        <div class="row">
            <?php include "includes/html/Navbar.php"?> <!-- Top bar -->
        </div>
        <div class="row">
            <!-- Side bar -->
            <div class="col-2 m-3 sidebar">
                <?php include "includes/H.O.T_DescMaker/SidebarStreamDirect.php"; ?>
            </div>
            <div class="col">
                <div class="row-10 m-3 mt-5 pt-5 justify-content-around">
                    <!-- contains the huge images in the middle of the screen plus the Data bar and the Options bar -->
                    <?php include "includes/H.O.T_DescMaker/HtmlTopDescriptionData.php"; ?>
                    <div>
                        <div class="form-floating my-3">
                            <!-- printer of the Clip and descptions in the Textareas -->
                            <?php include "includes/H.O.T_DescMaker/HtmlTimestampInport.php"; ?>
                        </div>
                    </div>
                </div>
            </div>
            <!-- content -->
        </div>
    </main>
    <!-- inporting of Javascript -->
    <!-- <script>var exports = {};</script> life hack, some javascript versions run into problems with import, this fixes it -->
    <script src="CSS+SCSS/bootstrap/js/bootstrap.js"></script>
    <script src="javascript/scripts/script.js"></script> <!-- General small stuff, like copy, select buttons -->
    <script src="https://apis.google.com/js/api.js"></script> <!-- Gets stuff for the Google api aka the youtube api -->
    <script src="javascript/scripts/YoutubeApiHandler.js"></script>
    <!-- <script src="javascript/TwitchApiHandler.js"></script> -->
</body>

</html>