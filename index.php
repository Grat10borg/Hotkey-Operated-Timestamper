<?php include "includes/html/HtmlDoc.php";  // makes the DoctypeHtml, also sets in version num in title  
?>

<body>
    <?php
    include "includes/settings.php"; // general vars things you can change is imported here, like the file root for the txt!
    include "includes/ArrayMaker.php";


    if (file_exists($Timestamp_path)) { // if there is a file at the end of the file path
        $arrayText = file($Timestamp_path); // retrive the
        if ($arrayText != array()) {
            // Javascript
            AddArrTextArea($arrayText, "TimestampTxt"); // Timestamp Txt javascript 
        } else {
            $error = "File Found. File was empty though.. file at $Timestamp_path did not have content";
        }
        #region Testing if values arent Null
        if ($BeforeDesc != "") {
            AddArrTextArea($BeforeDesc, "BeforeDesc");
        } // Text placed before any timestamps
        if ($AfterDesc != "") {
            AddArrTextArea($AfterDesc, "AfterDesc");
        } // Text placed after any timestamps.
        if ($Tag != "") {
            AddArrTextArea($Tag, "Tags");
        }
        if ($Localazation != "") {
            AddP($Localazation, "Local");
            if ($LocalAfterDesc != "") {
                AddArrTextArea($LocalAfterDesc, "LocalAfterDesc");
            }
            if ($LocalBeforeDesc != "") {
                AddArrTextArea($LocalBeforeDesc, "LocalBeforeDesc");
            }
        }
        // Api keys, Settings 
        if ($TwitchApiKey != "") {
            AddP($TwitchApiKey, "TwitchKey");
        }
        if ($StreamerLogin != "") {
            AddP($StreamerLogin, "TwitchLogin");
        }
        if ($YTClientID != "") {
            AddP($YTClientID, "YTClient");
        }
        if ($YTAPIKey != "") {
            AddP($YTAPIKey, "YTKey");
        }
        if ($PluginName != "") {
            AddP($PluginName, "YTPluginName");
        }
        if ($ClipsOffset != "") {
            AddP($ClipsOffset, "ClipOffset");
        }
        if ($Hashtags != "") {
            AddP($Hashtags, "Hashtags");
        }
        #endregion
    } else {
        $error = "Failed to find Txt at file path. please check if its spelt 100% correctly \n $Timestamp_path";
    }
    ?>
    <main class="container background">
        <div class="row">
            <?php include "includes/html/Navbar.php" ?>
            <!-- Top bar -->
        </div>
        <div class="row">
            <!-- Side bar -->
            <div class="col-2 ms-3 mt-3 sidebar justify-content-center rounded-top" id="SideBar"></div>
            <div class="col mt-3 maindatabar">
                <div class="row-10 m-3 mt-5 pt-5 justify-content-around">
                    <!-- contains the huge images in the middle of the screen plus the Data bar and the Options bar -->
                    <?php include "includes/H.O.T_DescMaker/HtmlTopDescriptionData.php"; ?>
                </div>
                <div>
                    <!-- printer of the Clip and descptions in the Textareas -->
                    <div class="form-floating my-3 border-bottom border-secondary pb-5" id="DescriptionAreaDiv"></div>
                </div>
            </div>
        </div>
        <!-- Second row -->
        <div class="row">
            <a class="ms-3 col-2 sidebar btn HighSubmit" id="ScrollTop">To Top ↑</a>
        </div>

        <?php include "includes\html\Footer.php" ?>
    </main>
    <!-- inporting of Javascript -->
    <script src="https://apis.google.com/js/api.js"></script>
    <script src="CSS+SCSS/bootstrap/js/bootstrap.js"></script>
    <script src="javascript/TimestampSort.js"></script>
    <script src="javascript/script+Youtube.js"></script>
</body>

</html>