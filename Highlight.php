<?php
include "includes/html/HtmlDoc.php";
include "includes/settings.php";
?>

<body>
    <div id="access_token"></div> <!-- data is inputted then removed, not best practice -->
    <main class="container background px-5">
        <div class="row">
            <!-- Top bar -->
            <?php include "includes/html/Navbar.php" ?>
        </div>
        <div class="row">
            <!-- Side bar -->
            <div class="col-3 m-3 sidebar">
                <div class="row m-3">
                    <h5 class="Error text-center" id="user_data"></h5> <!-- Error print -->
                </div>
                <form id="HighlighForm">
                    <div class="row m-2">
                        <a class="btn authbutton mb-2" href="https://id.twitch.tv/oauth2/authorize?client_id=hozgh446gdilj5knsrsxxz8tahr3koz&amp;redirect_uri=https%3A%2F%2Fbarrycarlyon.github.io%2Ftwitch_misc%2Fauthentication%2Fimplicit_auth%2F&amp;response_type=token&amp;scope=user:read:email" id="authorize_email">Connect Twitch <img class="imgIcon" src="img/TwitchIconsmol.png"></a>
                    </div>
                    <div class="row m-2">
                        <label for="SelectGame" class="text-secondary">Channel</label>
                        <select name="SelectChannel" id="SelectChannel" disabled class="form-select form-select-sm my-2" aria-label=".form-select-sm example">
                            <!-- <option selected>Choose a Channel via Memory</option> -->
                            <?php
                            sort($History); // sorts channels alphabeticelly 
                            foreach ($History as $Channels) {
                                echo "<option class='SelectOption' value='$Channels'>$Channels</option>";
                            }
                            ?>
                        </select>
                    </div>
                    <div class="row m-2">
                        <label for="SelectGame" class="text-secondary">Catagory</label>
                        <select name="SelectGame" id="SelectGame" disabled class="form-select form-select-sm my-2" aria-label=".form-select-sm example">
                            <option selected>Choose a Catagory</option>
                            <!-- Data inputted from typescript when user has selected a channel -->
                        </select>
                    </div>
                    <div class="row m-2">
                        <label for="date" class="text-secondary my-2">Your start date</label>
                        <input type="date" name="date">
                    </div>
                    <div class="row m-2">
                        <label class="text-secondary my-2" for="endDate">your end date (default: today)</label>
                        <input type="date" name="endDate" value="<?php echo date("o-m-d") ?>">
                    </div>
                    <div class="row m-2">
                        <label for="viewcount" class="text-secondary my-2">minimal viewcount</label>
                        <input type="text" name="viewcount">
                    </div>
                    <div class="row m-2">
                        <input id="Submit" class="my-3 btn HighSubmit" type="submit" value="Make Request">
                    </div>


                    <!-- <div class="row m-2 mt-5">
                        <p>manual overide here at some point</p>
                    </div>
                    <div class="row m-2">
                        <input class="form-control m-2 p-1" id="broadcastId" value="Under">
                    </div>
                    <div class="row m-2">
                        <input class="form-control m-2 p-1" name="gameId" value="Construction">

                    </div> -->
                </form>
            </div>
            <div class="col">
                <div class="row-* m-3 mt-5 pt-5 justify-content-around">
                    <!-- content -->
                    <!-- contains the huge images in the middle of the screen plus the Data bar and the Options bar -->
                    <?php include "includes/H.O.T_HighLighter/LogoVersion.php" ?>
                    <h4># Data!</h4>
                    <div id="DataDiv">
                        <!-- Data is set in when the Api is called  -->
                        <p class="text-center" id="DataP">please run a query to get date here!! (. ❛ ᴗ ❛.)</p>
                    </div>

                    <div class="accordion mt-4" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingOne">
                                <button id="accordLink" disabled class="accordion-button btn collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                                    # Clip links
                                </button>
                            </h2>
                            <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                                <div id="Linksarea" class="accordion-body d-flex row">
                                    <h4># Found Clip Links</h4>
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <button id="accordDesc" disabled class="btn accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    # Suggested Description
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <div class="d-flex justify-content-between">
                                        <h4># Suggested Description</h4>
                                        <p id="CharCount0"></p>
                                    </div>
                                    <!-- H.O.T makes a description for the highlight vid here -->
                                    <textarea class="d-flex Textarea form-control" id="myInput0"></textarea>
                                    <div class="d-flex justify-content-left my-3">
                                        <button class='btn button mx-1 Select' value='0'>Select text <img src='img\TwitchIconsmol.png' class='imgIcon'></button>
                                        <button class='btn button mx-1 Copy' value='0'>Copy text<img src='img\TwitchIconsmol.png' class='imgIcon'></button>
                                    </div>
                                    <div class="d-flex justify-content-between">
                                        <button class="btn button m-2 authUpload">Connect Youtube!</button>
                                        <select disabled class="col-5 my-1 SelectId" name="SelectId" id="selectId"></select>
                                        <button class='btn button mx-1 Send' value='0' id='authbtn'>Update YT Vid <img src='img\Youtube.png' class='imgIcon'></button>
                                    </div>
                                    <!-- Add copy paste and youtube button -->
                                </div>
                            </div>
                        </div>
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingThree">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                    # Misc
                                </button>
                            </h2>
                            <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <p>"hi" :)</p>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        </div>
    </main>
</body>
<script src="javascript/scripts/script.js"></script>
<script src="https://apis.google.com/js/api.js"></script>
<script src="javascript/scripts/YoutubeApiHandler.js"></script>
<script src="javascript/scripts/TwitchApiHandler.js"></script>
<script src="CSS+SCSS/bootstrap/js/bootstrap.js"></script>

</html>