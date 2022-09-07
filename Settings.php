<?php
include "includes/ArrayMaker.php";
include "includes/settings.php";
include "includes/html/HtmlDoc.php";
?>

<body>
    <main class="container background">
        <div class="row">
            <?php include "includes/html/Navbar.php";
            // Settings For Javascript
            if (file_exists("Texts\Settings.txt")) {
                AddP($TwitchApiKey, "TwitchKey");
                AddP($StreamerLogin, "TwitchLogin");
                AddP($YTClientID, "YTClient");
                AddP($YTAPIKey, "YTKey");
                AddP($ClipsOffset, "ClipOffset");
                AddP($Timestamp_path, "TimeSPath");
            }
            ?>
        </div>
        <div class="m-5 p-5 mt-0">
            <h3>Settings</h3>
            <form action="Settings.php" method="POST">
                <input name="TwitchKey" type="text" id="TwitchKeyIn"/>
                <input name="StreamerUserName" type="text" id="TwitchLoginIn" />
                <input name="YoutubeClientID" type="text" id="YTClientIn"/>
                <input name="YoutubeApiKey" type="text" id="YTKeyIn" />
                <input name="ClipOffset" type="text" id="ClipOffsetIn"/>
                <input name="TimestampPath" type="text" id="TimeSPathIn"/>
                <input type="submit" name="submit" value="Save Data">
            </form>
            <?php
            if (isset($_POST['TwitchKey']) && isset($_POST['StreamerUserName']) && isset($_POST['YoutubeClientID']) && isset($_POST['YoutubeApiKey']) && isset($_POST['ClipOffset']) && isset($_POST['TimestampPath'])) {
                $data = "Remember the qoutes! if you plan on doing this hacker style. also dont remove this text" . "\n" . '[TwitchApiKey] "' .  $_POST['TwitchKey'] . '",' . "\n" .
                    '[StreamerUserName] "' . $_POST['StreamerUserName'] . '",' . "\n" .
                    '[YoutubeClientID] "' . $_POST['YoutubeClientID'] . '",' . "\n" .
                    '[YoutubeApiKey] "' . $_POST['YoutubeApiKey'] . '",' . "\n" .
                    '[ClipOffset] "' . $_POST['ClipOffset'] . '",' . "\n" .
                    '[TimestampPath] "' . $_POST['TimestampPath'] . '",' . "\n";
                file_put_contents("Settings.txt", ""); // Clear TXT First
                $ret = file_put_contents("Settings.txt", $data, FILE_APPEND | LOCK_EX); // Add New Text
                if ($ret === false) {
                    die('There was an error writing this file');
                } else {
                    echo "Success Making New Settings!";
                }
            } else {
                die('no post data to process');
            }
            ?>
        </div>
    </main>
    <!-- Used to test if API keys are valid and to place Old settings into Setting Menu -->
    <script src="javascript\Settings.js"></script>
</body>

</html>