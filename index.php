<?php
function AddArrTextArea($Array, $id)
{
    echo "<textarea hidden id='$id'>"; // this is hidden from view
    foreach ($Array as $line) {
        echo $line;
    }
    echo "</textarea>";
}

include "includes/html/HtmlDoc.php"; // makes the DoctypeHtml, also sets in version num in title 
include "includes/settings.php"; // general vars things you can change is imported here, like the file root for the txt!

// actual sorting of timestamps here
if (file_exists($Timestamp_path)) { // if there is a file at the end of the file path
    $arrayText = file($Timestamp_path); // retrive the
    if ($arrayText != array()) {
        // Javascript
        AddArrTextArea($arrayText, "TimestampTxt"); // Timestamp Txt javascript 
        AddArrTextArea($begindesc, "DescTxt"); // Adds basic description
        AddArrTextArea($intros, "IntroTxt");    // Import of intro txt
        AddArrTextArea($socialLinks, "SocialTxt"); // social media txt 
        AddArrTextArea($Credits, "CreditsTxt"); // credits for songs bg and such

        // Old Php method
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
            <?php include "includes/html/Navbar.php" ?>
            <!-- Top bar -->
        </div>
        <div class="row">
            <!-- Side bar -->
            <div class="col-2 m-3 sidebar" id="SideBar">
                <?php // include "includes/H.O.T_DescMaker/SidebarStreamDirect.php"; ?>
            </div>
            <div class="col">
                <div class="row-10 m-3 mt-5 pt-5 justify-content-around">
                    <!-- contains the huge images in the middle of the screen plus the Data bar and the Options bar -->
                    <?php include "includes/H.O.T_DescMaker/HtmlTopDescriptionData.php"; ?>
                    <div>
                        <div class="form-floating my-3 border-bottom border-secondary pb-5" id="DescriptionAreaDiv">
                            <!-- printer of the Clip and descptions in the Textareas -->
                            <?php // include "includes/H.O.T_DescMaker/HtmlTimestampInport.php"; ?>      
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <!-- inporting of Javascript -->
    <script src="https://apis.google.com/js/api.js"></script> <!-- Gets stuff for the Google api aka the youtube api -->
    <script src="CSS+SCSS/bootstrap/js/bootstrap.js"></script>
    <script src="javascript/scripts/TimestampSort.js"></script>
    <script src="javascript/scripts/script.js"></script> <!-- General small stuff, like copy, select buttons -->
    <script src="javascript/scripts/YoutubeApiHandler.js"></script>
    <!-- <script src="javascript/TwitchApiHandler.js"></script> -->
</body>

</html>