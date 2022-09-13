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
            <p class="m-2 pt-4">Note: Stuff like the text before or after timestamps can be edited in "Hotkey-Operated-Timestamper\Texts\" AfterTimestamps.txt or BeforeTimestamps.txt</p>
            <p class="m-2 pt-4 pb-4">Note2: The sugested channels used for the Higlighter can also be edited in the Texts Folder!</p>
            <form class="container" id="Settingform" action="Settings.php" method="POST">
                <div class="row m-3">
                    <p id="TwitchKeyP">Your Twitch APP AccessToken</p>
                    <?php
                    if (isset($TwitchApiKey)) {
                        echo "<input value='$TwitchApiKey' class='form-control p-3' placeholder='Something like: bss6p3k7o39u8bv6y3hotdi1dszdlw' name='TwitchKey' type='text' id='TwitchKeyIn'/>";
                    } else {
                        echo "<input class='form-control p-3' placeholder='Something like: bss6p3k7o39u8bv6y3hotdi1dszdlw' name='TwitchKey' type='text' id='TwitchKeyIn'/>";
                    }
                    ?>
                </div>
                <div class="row m-3">
                    <p>Your Twitch Username</p>
                    <?php
                    if (isset($StreamerLogin)) {
                        echo "<input value='$StreamerLogin' class='form-control p-3' placeholder='The Name in Your Url: marinemammalrescue' name='StreamerUserName' type='text' id='TwitchLoginIn'/>";
                    } else {
                        echo "<input class='form-control p-3' placeholder='The Name in Your Url: marinemammalrescue' name='StreamerUserName' type='text' id='TwitchLoginIn'/>";
                    }
                    ?>

                </div>
                <div class="row m-3">
                    <p>Your Youtube ClientId</p>
                    <?php
                    if (isset($YTClientID)) {
                        echo "<input value='$YTClientID' class='form-control p-3' placeholder='<Longstring of Random Letters>.apps.googleusercontent.com' name='YoutubeClientID' type='text' id='YTClientIn' />";
                    } else {
                        echo "<input class='form-control p-3' placeholder='<Longstring of Random Letters>.apps.googleusercontent.com' name='YoutubeClientID' type='text' id='YTClientIn' />";
                    }
                    ?>
                </div>
                <div class="row m-3">
                    <p>Your Youtube AccessToken</p>
                    <?php
                    if (isset($YTAPIKey)) {
                        echo "<input value='$YTAPIKey' class='form-control p-3' placeholder='Something like: AIzaSyCq512yjXdQLtdUV3n7CzdIe78oDufRovU'  name='YoutubeApiKey' type='text' id='YTKeyIn' />";
                    } else {
                        echo "<input class='form-control p-3' placeholder='Something like: AIzaSyCq512yjXdQLtdUV3n7CzdIe78oDufRovU'  name='YoutubeApiKey' type='text' id='YTKeyIn' />";
                    }
                    ?>
                </div>
                <div class="row m-3">
                    <p id="ClipOffsetP">Your ClipOffset</p>
                    <?php
                    if (isset($ClipsOffset)) {
                        echo "<input value='$ClipsOffset' class='form-control p-3' placeholder='26' name='ClipOffset' type='text' id='ClipOffsetIn' />";
                    } else {
                        echo "<input class='form-control p-3' placeholder='26' name='ClipOffset' type='text' id='ClipOffsetIn' />";
                    }
                    ?>

                </div>
                <div class="row m-3">
                    <p>Your Timestamp.txt file path</p>
                    <?php
                    if (isset($Timestamp_path)) {
                        echo "<input value='$Timestamp_path' class='form-control p-3' placeholder='..\Folder\Timestamp.txt' name='TimestampPath' type='text' id='TimeSPathIn'/>";
                    } else {
                        echo "<input class='form-control p-3' placeholder='..\Folder\Timestamp.txt' name='TimestampPath' type='text' id='TimeSPathIn'/>";
                    }
                    ?>
                </div>
                <input class="mx-3 HighSubmit btn" type="submit" name="submit" value="Save Data">
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
                $ret = file_put_contents("Texts/Settings.txt", $data, LOCK_EX); // Add New Text
                if ($ret === false) {
                    die('There was an error writing this file');
                } else {
                    echo "<h2 class='m-5'>Success Making New Settings! </h2>";
                }
            } else {
                // bit aggrasive naming huh PHP?
                die('no post data to process');
            }
            ?>
        </div>
    </main>
    <!-- Used to test if API keys are valid and to place Old settings into Setting Menu -->
    <script src="javascript\Settings.js"></script>
</body>

</html>