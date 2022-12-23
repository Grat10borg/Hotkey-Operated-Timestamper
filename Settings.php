<!DOCTYPE html>
<html lang="en">
<head>
    <?php include "includes/html/HtmlDoc.php";?>
    <link rel="shortcut icon" href="img\Icons\GearCuteIcon.png"/>
    <title>H.O.T: Settings ⚙</title>
</head>
<?php
include "includes/ArrayMaker.php";
include "includes/settings.php";
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
            <h3>Settings <img class="imgIcon" src="img\Icons\GearCuteIcon.png"></h3>
            <p>you can also edit the texts at .\Hotkey-Operated-Timestamper\Texts!! ヾ(•ω•`)o</p>
            <?php
            if (isset($_POST["BeforeDesc"]) && isset($_POST["AfterDesc"]) && isset($_POST["History"]) && isset($_POST["Tags"]) && isset($_POST["LocalBeforeTimestamps"]) && isset($_POST["LocalAfterTimestamps"])) {
                file_put_contents($BeforeDesc_p, ""); // Clear TXT First
                file_put_contents($AfterDesc_p, ""); // Clear TXT First
                file_put_contents($History_p, ""); // Clear TXT First
                file_put_contents($Tag_p, "");
                file_put_contents($LocalBeforeDesc_p, "");
                file_put_contents($LocalAfterDesc_p, "");
                $ret = file_put_contents($BeforeDesc_p, $_POST["BeforeDesc"], LOCK_EX); // Add New Text
                $ret2 = file_put_contents($AfterDesc_p, $_POST["AfterDesc"], LOCK_EX); // Add New Text
                $ret3 = file_put_contents($History_p, $_POST["History"], LOCK_EX); // Add New Text
                $ret4 = file_put_contents($Tag_p, $_POST["Tags"], LOCK_EX); // Add New Text
                $ret5 = file_put_contents($LocalBeforeDesc_p, $_POST["LocalBeforeTimestamps"], LOCK_EX);
                $ret6 = file_put_contents($LocalAfterDesc_p, $_POST["LocalAfterTimestamps"], LOCK_EX);
                if ($ret === false && $ret2 === false && $ret3 === false && $ret4 === false) {
                    die("Error writing Description Texts");
                } else {
                    echo "<h2 class='m-5'>Success Making New Description Texts! </h2>";
                }
            } else {
                echo "<h2 class='m-5'>No Description Data to Process </h2>";
            }
            if (isset($_POST['TwitchKey']) && isset($_POST['StreamerUserName']) && isset($_POST['YoutubeClientID']) && isset($_POST['YoutubeApiKey']) && isset($_POST['ClipOffset']) && isset($_POST['TimestampPath']) && isset($_POST["PluginName"]) && isset($_POST["Localazation"])) {
                $data = "Remember the qoutes! if you plan on doing this hacker style. also dont remove this text" . "\n" . '[TwitchApiKey] "' .  $_POST['TwitchKey'] . '",' . "\n" .
                    '[StreamerUserName] "' . $_POST['StreamerUserName'] . '",' . "\n" .
                    '[YoutubeClientID] "' . $_POST['YoutubeClientID'] . '",' . "\n" .
                    '[YoutubeApiKey] "' . $_POST['YoutubeApiKey'] . '",' . "\n" .
                    '[ClipOffset] "' . $_POST['ClipOffset'] . '",' . "\n" .
                    '[TimestampPath] "' . $_POST['TimestampPath'] . '",' . "\n" .
                    '[PluginName] "' . $_POST['PluginName'] . '",' . "\n" .
                    '[Hashtags] "' . $_POST['Hashtags'] . '",' . "\n" .
                    '[Localized] "' . $_POST["Localazation"] . '",' . "\n";
                file_put_contents("Texts/Settings.txt", ""); // Clear TXT First
                $ret = file_put_contents("Texts/Settings.txt", $data, LOCK_EX); // Add New Text
                if ($ret === false) {
                    die('There was an error writing this file');
                } else {
                    echo "<h2 class='m-5'>Success Making New Settings! </h2>";
                }
            } else {
                echo "<h2 class='m-5'>No Settings.txt Data to Process </h2>";
            }
            ?>

            <div class="accordion" id="accordionExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="TextMisc">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" , data-bs-target="#TextMiscDiv" aria-expanded="false" , aria-controls="TextMiscDiv">
                           <img class="imgIcon" src="img\Icons\TimestampTXTIcon.png"> | Description Texts!
                        </button>
                    </h2>
                    <div id="TextMiscDiv" class="accordion-collapse collapse" aria-labelledby="TextMisc" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <form class="container" id="TextForm" action="Settings.php" method="POST">
                                <div class="row m-3">
                                    <p id="">Before Timestamps (TopText)</p>
                                    <textarea name="BeforeDesc" class="d-flex Textarea form-control"><?php
                                                                                                        if (isset($BeforeDesc)) {
                                                                                                            foreach ($BeforeDesc as $string) {
                                                                                                                echo $string;
                                                                                                            }}?></textarea>
                                    <p class="mt-3">After Timestamps (BottomText)</p>
                                    <textarea name="AfterDesc" class="d-flex Textarea form-control"><?php
                                                                                                    if (isset($AfterDesc)) {
                                                                                                        foreach ($AfterDesc as $string) {
                                                                                                            echo $string;
                                                                                                        }}?></textarea>

                                    <p class="mt-3">Highlighter History Channels (separate with <kbd>Enter</kbd>)</p>
                                    <textarea name="History" class="d-flex Textarea form-control"><?php
                                                                                                    if (isset($History)) {
                                                                                                        foreach ($History as $string) {
                                                                                                            echo $string;
                                                                                                        }}?></textarea>
                                    <p class="mt-3">Description Tags (separate with <kbd>Enter</kbd>)</p>
                                    <textarea name="Tags" class="d-flex Textarea form-control"><?php
                                                                                                if (isset($Tag)) {
                                                                                                    foreach ($Tag as $string) {
                                                                                                        echo $string;
                                                                                                    }}?></textarea>
                                    <p class="mt-3">Localized Before Timestamps! (TopText)</p>
                                    <textarea name="LocalBeforeTimestamps" class="d-flex Textarea form-control"><?php
                                                                                                                if (isset($LocalBeforeDesc)) {
                                                                                                                    foreach ($LocalBeforeDesc as $string) {
                                                                                                                        echo $string;
                                                                                                                    }}?></textarea>
                                    <p class="mt-3">Localized After Timestamps! (BottomText)</p>
                                    <textarea name="LocalAfterTimestamps" class="d-flex Textarea form-control"><?php
                                                                                                                if (isset($LocalAfterDesc)) {
                                                                                                                    foreach ($LocalAfterDesc as $string) {
                                                                                                                        echo $string;
                                                                                                                    }}?></textarea>
                                </div>
                                <input class="mx-3 HighSubmit btn" type="submit" name="submit" value="Save Data">
                            </form>
                        </div>
                    </div>
                </div>
                <div class="accordion-item">
                    <h2 class="accordion-header" id="Settings">
                        <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#CollapSettings" aria-expanded="false" aria-controls="CollapSettings">
                            <img class="imgIcon" src="img\Icons\TimestampTXT2Icon.png"> |  Settings.txt
                        </button>
                    </h2>
                    <div id="CollapSettings" class="accordion-collapse collapse" aria-labelledby="Settings" data-bs-parent="#accordionExample">
                        <div class="accordion-body">
                            <form class="container" id="Settingform" action="Settings.php" method="POST">
                                <div class="row m-3">
                                    <p id="TwitchKeyP"><img class="imgIcon" src="img\Icons\TwitchIcon.png"> - Your Twitch APP AccessToken </p>
                                    <?php
                                    if (isset($TwitchApiKey)) {
                                        echo "<input value='$TwitchApiKey' class='form-control p-3' placeholder='Something like: bss6p3k7o39u8bv6y3hotdi1dszdlw' name='TwitchKey' type='text' id='TwitchKeyIn'/>";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='Something like: bss6p3k7o39u8bv6y3hotdi1dszdlw' name='TwitchKey' type='text' id='TwitchKeyIn'/>";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\TwitchIcon.png"> - Your Twitch Username</p>
                                    <?php
                                    if (isset($StreamerLogin)) {
                                        echo "<input value='$StreamerLogin' class='form-control p-3' placeholder='The Name in Your Url: marinemammalrescue' name='StreamerUserName' type='text' id='TwitchLoginIn'/>";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='The Name in Your Url: marinemammalrescue' name='StreamerUserName' type='text' id='TwitchLoginIn'/>";
                                    }
                                    ?>

                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\YouTubeIcon.png"> - Your Youtube ClientId</p>
                                    <?php
                                    if (isset($YTClientID)) {
                                        echo "<input value='$YTClientID' class='form-control p-3' placeholder='<Longstring of Random Letters>.apps.googleusercontent.com' name='YoutubeClientID' type='text' id='YTClientIn' />";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='<Longstring of Random Letters>.apps.googleusercontent.com' name='YoutubeClientID' type='text' id='YTClientIn' />";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\YouTubeIcon.png"> - Your Youtube AccessToken</p>
                                    <?php
                                    if (isset($YTAPIKey)) {
                                        echo "<input value='$YTAPIKey' class='form-control p-3' placeholder='Something like: AIzaSyCq512yjXdQLtdUV3n7CzdIe78oDufRovU'  name='YoutubeApiKey' type='text' id='YTKeyIn' />";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='Something like: AIzaSyCq512yjXdQLtdUV3n7CzdIe78oDufRovU'  name='YoutubeApiKey' type='text' id='YTKeyIn' />";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\YouTubeIcon.png"> - Your Google Cloud Console Project Name</p>
                                    <?php
                                    if (isset($PluginName)) {
                                        echo "<input value='$PluginName' class='form-control p-3' placeholder='Hotkey Operated Timestamper' name='PluginName' type='text' id='YTPluginIn'/>";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='Hotkey Operated Timestamper' name='PluginName' type='text' id='YTPluginIn'/>";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p id="ClipOffsetP"><img class="imgIcon" src="img\Icons\TextDocIcon.png"> - Your ClipOffset</p>
                                    <?php
                                    if (isset($ClipsOffset)) {
                                        echo "<input value='$ClipsOffset' class='form-control p-3' placeholder='26' name='ClipOffset' type='text' id='ClipOffsetIn' />";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='26' name='ClipOffset' type='text' id='ClipOffsetIn' />";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\TimestampTXTIcon.png"> - Your Timestamp.txt file path</p>
                                    <?php
                                    if (isset($Timestamp_path)) {
                                        echo "<input value='$Timestamp_path' class='form-control p-3' placeholder='..\Folder\Timestamp.txt' name='TimestampPath' type='text' id='TimeSPathIn'/>";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='..\Folder\Timestamp.txt' name='TimestampPath' type='text' id='TimeSPathIn'/>";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\YouTubeIcon.png"> - Your Hashtags/Text after Vod Title</p>
                                    <?php
                                    if (isset($Hashtags)) {
                                        echo "<input value='$Hashtags' class='form-control p-3' placeholder='VOD' name='Hashtags' type='text' id='HashtagsIn'/>";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='VOD' name='Hashtags' type='text' id='HashtagsIn'/>";
                                    }
                                    ?>
                                </div>
                                <div class="row m-3">
                                    <p><img class="imgIcon" src="img\Icons\YouTubeIcon.png"> - Localazation Description Key</p>
                                    <?php
                                    if (isset($Localazation)) {
                                        echo "<input value='$Localazation' class='form-control p-3' placeholder='en' name='Localazation' type='text' id='LocalazationIn'/>";
                                    } else {
                                        echo "<input class='form-control p-3' placeholder='VOD' name='Localazation' type='text' id='LocalazationIn'/>";
                                    }
                                    ?>
                                </div>
                                <input class="mx-3 HighSubmit btn" type="submit" name="submit" value="Save Data">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <?php include "includes\html\Footer.php" ?>
    </main>

    <!-- Used to test if API keys are valid and to place Old settings into Setting Menu -->
    <script src="javascript\Settings.js"></script>
    <script src="CSS+SCSS/bootstrap/js/bootstrap.js"></script>
</body>

</html>