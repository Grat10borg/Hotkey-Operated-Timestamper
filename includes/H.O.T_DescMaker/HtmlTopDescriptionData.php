                <div class="m-3 d-flex justify-content-center">
                    <img class="imgHOTLogo" src="img/H.O.T Mascot.png" alt="">
                </div>
                <h3 class="text-center">Hotkey, Operated, Timestamper <?php echo $version; ?></h3>
                <?php if (isset($error)) {
                    echo "<h4 class='-2 text-danger text-center fs-3'>Error `(*>﹏<*)′</h4>";
                    echo "<h5 class='m-3 text-danger text-center'>$error</h5>";
                } ?>
                <div class="justify-content-center d-flex border-bottom border-secondary mb-4">

                    <div>
                        <p>H.O.T is a Vod timestamper i designed to work along with the <a target="blank" href="https://obsproject.com/forum/resources/infowriter.345/">Stream-Writer plugin for OBS.</a></p>
                        <p>it cuts down all the timestamps into the smallest amount of characters,</p>
                        <p class="mb-3">and formats it into your description!</p>
                    </div>
                </div>
                <div class="container row border-bottom border-secondary pb-5">
                    <div class="col me-4">
                        <h4 class="text-center"># Options</h4>
                        <div class="row">
                            <button class="btn py-2 my-2" id="TwitchClip">Use Twitch Clip-stamps instead <img class="imgIcon" src="img\Icons\TwitchIcon.png" alt=""></button>
                            <p class="col" hidden id="TwitchMsg"></p>
                        </div>
                        <div class="row">
                            <button disabled class="btn-danger py-2 btn my-2 authUpload">Connect Youtube! <img class="imgIcon" src="img\Icons\YouTubeIcon.png" alt=""> </button>
                        </div>
                        <div class="row">
                            <select disabled class="py-3 SelectId" name="SelectId" id="selectId"></select>
                        </div>
                    </div>
                    <div class="col  ms-4">
                        <div class="col me-4">
                            <h4 class="text-center"># Data!</h4>
                            <p id="Stats">Found No Streams, and No Recordings</p>
                            <p id="AccessTokenTime"></p>
                            <div class="row">
                                <p id="TimestampPath">• currently getting timestamps from: [...]</p>
                                <div class="py-2">
                                    <a id="Locked" class="py-2 btn TimestampClear"><img id="LockedIcon" class="imgIcon" src="img\Icons\LockedIcon.png"></a>
                                    <!-- <a class="py-2 px-5 Clear btn TimestampClear" href="clear.php">Clear Timestamps? | <img class="imgIcon" src="img\Icons\TimestampTXTIcon.png"></a> -->
                                    <button id="Clear" class="py-2 px-5 Clear btn TimestampClear" disabled>Clear Timestamps? | <img class="imgIcon" src="img\Icons\TimestampTXTIcon.png"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h4 class="m-3"># Description Maker Settings & Hints!</h4>
                    <div class="accordion mb-3" id="accordionExample">
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="headingTwo">
                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                    <img class="me-2 imgIcon" src="img\Icons\GearCuteIcon.png" alt=""> | H.O.T: Description Maker Settings + Hints!
                                </button>
                            </h2>
                            <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
                                <div class="accordion-body">
                                    <h3># Settings</h3>
                                    <p class="mb-5">you can change your settings <a href="Settings.php">Here</a></p>
                                    <div class="container">
                                        <div class="btn TimestampClear m-1 mb-4" id="ShowSettings">
                                            <span><img id="ShowPrivateIcon" class="imgIcon me-2" src="img/Icons/LockedIcon.png">Show private settings?</span>
                                        </div>
                                        <div class="row">
                                            <div class="col m-auto">
                                                <p>Your Twitch APP AccessToken</p>
                                                <?php
                                                if (isset($TwitchApiKey)) {
                                                    echo "<input value='$TwitchApiKey' disabled class='form-control p-3' type='password'/>";
                                                } else {
                                                    echo "<input class='form-control p-3' disabled placeholder='' type='password'/>";
                                                }
                                                ?>
                                            </div>
                                            <div class="col m-auto">
                                                <p>Your Twitch Username</p>
                                                <?php
                                                if (isset($StreamerLogin)) {
                                                    echo "<input value='$StreamerLogin' disabled class='form-control p-3' type='text' />";
                                                } else {
                                                    echo "<input class='form-control p-3' disabled type='text'/>";
                                                }
                                                ?>
                                            </div>
                                        </div>
                                        <div class="row mt-3">
                                            <div class="col">
                                                <p>Your Youtube API key</p>
                                                <?php
                                                if (isset($YTClientID)) {
                                                    echo "<input value='$YTClientID' disabled class='form-control p-3' placeholder='<Longstring of Random Letters>.apps.googleusercontent.com' name='YoutubeClientID' type='password' id='YTClientIn' />";
                                                } else {
                                                    echo "<input class='form-control p-3' placeholder='<Longstring of Random Letters>.apps.googleusercontent.com' name='YoutubeClientID' type='password' id='YTClientIn' />";
                                                }
                                                ?>
                                            </div>
                                            <div class="col">
                                                <p>Your Youtube AccessToken</p>
                                                <?php
                                                if (isset($YTAPIKey)) {
                                                    echo "<input value='$YTAPIKey' disabled class='form-control p-3' placeholder='Something like: AIzaSyCq512yjXdQLtdUV3n7CzdIe78oDufRovU'  name='YoutubeApiKey' type='password' id='YTKeyIn' />";
                                                } else {
                                                    echo "<input class='form-control p-3' placeholder='Something like: AIzaSyCq512yjXdQLtdUV3n7CzdIe78oDufRovU'  name='YoutubeApiKey' type='password' id='YTKeyIn' />";
                                                }
                                                ?>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <p id="ClipOffsetP">Your ClipOffset</p>
                                                <?php
                                                if (isset($ClipsOffset)) {
                                                    echo "<input value='$ClipsOffset' disabled class='form-control p-3' placeholder='26' name='ClipOffset' type='text' id='ClipOffsetIn' />";
                                                } else {
                                                    echo "<input class='form-control p-3' placeholder='26' name='ClipOffset' type='text' id='ClipOffsetIn' />";
                                                }
                                                ?>
                                            </div>
                                            <div class="col">
                                                <p>Your Timestamp.txt file path</p>
                                                <?php
                                                if (isset($Timestamp_path)) {
                                                    echo "<input value='$Timestamp_path' disabled class='form-control p-3' placeholder='..\Folder\Timestamp.txt' name='TimestampPath' type='password' id='TimeSPathIn'/>";
                                                } else {
                                                    echo "<input class='form-control p-3' placeholder='..\Folder\Timestamp.txt' name='TimestampPath' type='password' id='TimeSPathIn'/>";
                                                }
                                                ?>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <p>Your Hashtags after title</p>
                                                <?php
                                                if (isset($Hashtags)) {
                                                    echo "<input value='$Hashtags' disabled class='form-control p-3' placeholder='VOD' name='Hashtags' type='text' id='HashtagsIn'/>";
                                                } else {
                                                    echo "<input class='form-control p-3' placeholder='VOD' name='Hashtags' type='text' id='HashtagsIn'/>";
                                                }
                                                ?>
                                            </div>
                                            <div class="col">
                                                <p>Localazation Description Key</p>
                                                <?php
                                                if (isset($Localazation)) {
                                                    echo "<input value='$Localazation' disabled class='form-control p-3' placeholder='en' name='Localazation' type='text' id='LocalazationIn'/>";
                                                } else {
                                                    echo "<input class='form-control p-3' placeholder='VOD' name='Localazation' type='text' id='LocalazationIn'/>";
                                                }
                                                ?>
                                            </div>
                                        </div>
                                    </div>
                                    <hr>
                                    <div>
                                        <h3># Hints! <img class="imgIcon" src="img/HOT_Icon.png"></h3>
                                        <br>
                                        <div>
                                            <h5>Changing Settings!</h5>
                                            <p>H.O.T uses txt files to make your descriptions, you can either edit them in the files or go to <a href="Settings.php">Settings!</a> and change them there</p>
                                        </div>
                                        <br>
                                        <div>
                                            <h5>Is H.O.T lagging?</h5>
                                            <p>H.O.T could start having trouble loading your timestamps if they're too big! else check the console, and maybe send a bug report to the <a href="https://github.com/Grat10borg/Hotkey-Operated-Timestamper">H.O.T Github!</a></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>