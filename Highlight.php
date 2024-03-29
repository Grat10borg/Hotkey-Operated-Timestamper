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
    <title>H.O.T: Highlighter 🎬</title>
</head>
<?php
//include "includes/settings.php";
//include "includes/ArrayMaker.php";
?>
<body>
    <!-- <div class="fixed-bottom">
        <div class="align-self-end">
            <p class="text-light">H.O.T Radio placement here!</p>
        </div>
    </div> -->
    <div id="access_token"></div> <!-- data is inputted then removed, not best practice -->
    <main class="container background">
        <div class="row">
            <!-- Top bar -->
            <?php include "includes/html/Navbar.php" ?>
        </div>
        <div class="row">
            <!-- Side bar -->
            <div class="relativ col-3 ms-3 mt-3 rounded-top d-flex justify-content-center sidebar">
                <form class="" id="HighlighForm">
                    <div class="row p-2 m-2 mt-3 rounded">
                        <label for="SelectGame">Channel</label>
                        <!-- import of quick search channels from javascript -->
                        <div class="d-flex">
                        <input checked type="radio" id="useHistory" name="Search" value="useHistory" class="me-3">
                        <select name="SelectChannel" id="SelectChannel" class="form-select form-select-sm my-2" aria-label=".form-select-sm example"></select>
                        </div>
                        <div class="d-flex">
                        <input type="radio" id="useSearch" name="Search" value="useSearch" class="me-3">
                        <input disabled type="text"  name="InputChannel" id="InputChannel"  class="form-control form-control-sm my-2" aria-label=".form-select-sm example">
                        </div>
                    </div>
                    <div class="row p-2 m-2 mt-3 rounded">
                        <label for="SelectGame" class="">Catagory</label>
                        <select name="SelectGame" id="SelectGame" disabled class="form-select form-select-sm my-2" aria-label=".form-select-sm example">
                            <option selected>Choose a Catagory</option>
                            <!-- Data inputted from typescript when user has selected a channel -->
                        </select>
                    </div>
                    <div class="row p-2 m-2 mt-3 rounded">
                        <label for="date" class="my-2">Your start date</label>
                        <input type="date" name="date" class="form-control form-control-sm">
                    </div>
                    <div class="row p-2 m-2 mt-3 rounded">
                        <label class="m-2" for="endDate">your end date (def: today)</label>
                        <input type="date" class="form-control form-control-sm" aria-label=".form-control-sm example" name="endDate" value="<?php echo date("o-m-d") ?>">
                    </div>
                    <div class="row p-2 m-2 mt-3 rounded">
                        <label for="viewcount" class="my-2">minimal viewcount</label>
                        <input class="form-control form-control-sm" type="text" name="viewcount">
                    </div>
                    <div class="row p-2 m-2 mt-3 rounded">
                        <input id="Submit" class="my-3 btn HighSubmit" type="submit" value="Make Request">
                    </div>
                </form>
            </div>

            <div class="col">
                <div class="row-* mb-3 mt-5 pt-5 justify-content-around border-bottom border-secondary pb-2">
                    <!-- content -->
                    <!-- contains the huge images in the middle of the screen plus the Data bar and the Options bar -->
                    <!-- Logo and text gets removed for an iframe for clip viewing -->
                    <div class="justify-content-center d-flex m-2" id="IframePlayerLater"></div>
                    <div id="MenuLogoDiv">
                        <div class="justify-content-center d-flex m-3">
                            <img class="imgHOTLogo" src="img/H.O.T Mascot Wink.png">
                        </div>
                        <div class="justify-content-center d-flex">
                            <div>
                                <h3 class="text-center">Highlight Oriented Timestamper <?php echo $version; ?></h3>
                                <div id="ErrorDiv"></div>
                                <p>Highlight Oriented Timestamper was made to help me with collecton and sorting of clips!
                                <p class="mb-5">it'll Query the clips that fit your parameters and make a description for a YT vid!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="border-bottom border-secondary pb-2" id="DataDiv">
                        <h4># Data!</h4>
                        <!-- Data is set in when the Api is called  -->
                        <p class="text-center" id="DataP">please run a query to get date here!! (. ❛ ᴗ ❛.)</p>
                        <h4 class=""># Highlighter Settings & Hints!</h4>
                        <div class="accordion mb-3" id="accordionSettings">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingSettings">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSettings" aria-expanded="false" aria-controls="collapseSettings">
                                        <img class="me-2 imgIcon" src="img\Icons\GearCuteIcon.png"> | H.O.T: Highlighter Settings + Hints!
                                    </button>
                                </h2>
                                <div id="collapseSettings" class="accordion-collapse collapse" aria-labelledby="headingSettings" data-bs-parent="#accordionSettings">
                                    <div class="accordion-body">
                                        <div class="container">
                                            <h3># Settings</h3>
                                            <p class="mb-2">you can change your settings <a href="Settings.php">Here</a></p>
                                            <div class="btn TimestampClear m-1 mb-4" id="ShowSettings">
                                                <span><img class="imgIcon me-2" src="img/Icons/LockedIcon.png" id="ShowPrivateIcon">Show private settings?</span>
                                            </div>
                                            <div class="row align-items-top">
                                                <div class="col m-auto">
                                                    <div>
                                                        <p><img class="imgIcon" src="img\Icons\TwitchIcon.png"> | Your Twitch APP AccessToken </p>
                                                        <input id="TwitchAccessToken" disabled class='form-control p-3' type='password'/>
                                                        <p class="text-secondary mt-2" id="AccessTokenTime"></p>
                                                    </div>
                                                </div>
                                                <div class="col m-auto d-flex justify-content-center">
                                                    <div>
                                                        <p class="pt-2">Quick Search Channels</p>
                                                        <?php
                                                        if (isset($History)) {
                                                            echo "<textarea disabled class'form-control p-3'>";
                                                            foreach ($History as $string) {
                                                                echo $string;
                                                                echo "\n";
                                                            }
                                                            echo "</textarea>";
                                                        } else {
                                                            echo "<textarea disabled class'form-control p-3'></textarea>";
                                                        }
                                                        ?>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr>
                                            <h3># Hints! <img class="imgIcon" src="img/HOT_Icon.png" alt="H.O.T small Icon"></h3>
                                            <br>
                                            <div>
                                                <h5>Quick Download Clip Script!</h5>
                                                <input disabled type="text" class="form-control form-control-sm" value='javascript:window.open(document.getElementsByTagName("video")[0].src)'>
                                                <p>put this as a bookmark and click on it when on Twitch's clip page!</p>
                                            </div>
                                            <br>
                                            <div>
                                                <h5>Quick Testing H.O.T Highlighter!</h5>
                                                <p>if you select a channel, and then press <kbd>Make Request</kbd>, then H.O.T assumes the rest of the parameters</p>
                                                <p>it'll get clips of up to 90 days ago, with a maximum amount of clips being 100</p>
                                            </div>
                                            <br>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="accordion mt-4">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button id="accordLink" disabled class="accordion-button btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    <img class="me-2 imgIcon" src="img\Icons\TimestampTXT2Icon.png"> | # Clip links
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div>
                                    <div id="Linksarea" class="accordion-body d-flex row">
                                        <!-- sets in links through javascript -->
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <button id="accordDesc" disabled class="btn accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <img class="me-2 imgIcon" src="img\Icons\TextDocIcon.png"> | # Suggested Description
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <div class="d-flex justify-content-between">
                                        <h4> # Suggested Description</h4>
                                        <p id="CharCount0"></p>
                                    </div>
                                    <!-- H.O.T makes a description for the highlight vid here -->
                                    <textarea class="d-flex Textarea form-control Charcounts" id="myInput0"></textarea>
                                    <div class="d-flex justify-content-left my-3">
                                        <button class='btn button mx-1 Select' value='0'>Select text</button>
                                        <button class='btn button mx-1 Copy' value='0'>Copy text</button>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn button m-2 authUpload">Connect Youtube!</button>
                                        <select disabled class="col-5 my-1 SelectId" name="SelectId" id="selectId"></select>
                                        <button class='btn button mx-1 Send' value='0' id='authbtn'>Update YT Vid</button>
                                    </div>
                                    <!-- Add copy paste and youtube button -->
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                                <button id="accordLocalDesc" disabled class="btn accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    <img class="me-2 imgIcon" src="img\Icons\TextDocIcon.png"> | # Local Suggested Description
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <div class="d-flex justify-content-between">
                                        <h4># Local Suggested Description</h4>
                                        <p id="CharCount1"></p>
                                    </div>
                                    <!-- H.O.T makes a description for the highlight vid here -->
                                    <textarea class="d-flex Textarea form-control Charcounts" id="LocalDescription"></textarea>
                                    <div class="d-flex justify-content-left my-3">
                                        <button disabled class='btn button mx-1 Select' value='0'>Select text</button>
                                        <button disabled class='btn button mx-1 Copy' value='0'>Copy text</button>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button disabled class="btn button m-2 authUpload">Connect Youtube!</button>
                                        <select disabled class="col-5 my-1 SelectId" name="SelectId" id="selectId"></select>
                                        <button disabled class='btn button mx-1 Send' value='0' id='authbtn'>Update YT Vid</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </div>
        <div class="row">
            <a class="ms-3 col-3 sidebar btn HighSubmit" id="ScrollTop">To Top ↑</a>
        </div>
        </div>
        <?php include "includes\html\Footer.php" ?>
    </main>
    <script src="https://embed.twitch.tv/embed/v1.js"></script>
    <script src="https://apis.google.com/js/api.js"></script>
    <script src="javascript/dom.js"></script>
    <script src="config.js"></script>
    <script src="javascript/Highlighter.js"></script>
    <script src="CSS+SCSS/bootstrap/js/bootstrap.js"></script>
</body>

</html>
