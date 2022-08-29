                <div class="m-3 d-flex justify-content-center">
                    <img src="img\TwitchIcon.png" alt="">
                </div>
                <h3 class="text-center">Hotkey, Operated, Timestamper <?php echo $version; ?></h3>
                <?php if (isset($error)) {
                    echo "<h4 class='-2 text-danger text-center fs-3'>Error `(*>﹏<*)′</h4>";
                    echo "<h5 class='m-3 text-danger text-center'>$error</h5>";
                } ?>
                <p>H.O.T is a Vod timestamper i designed to work along with the <a target="blank" href="https://obsproject.com/forum/resources/infowriter.345/">Stream-Writer plugin for OBS.</a></p>
                <p>it cuts down all the timestamps into the smallest amount of characters,</p>
                <p class="mb-5">and formats it into your desciption!</p>
                <div class="container row border-bottom border-secondary pb-5">
                    <div class="col me-4">
                        <h4 class="text-center"># Options</h4>
                        <div class="row">
                            <button class="btn py-2 my-2" id="TwitchClip">Sync to Twitch</button>
                            <p class="col" hidden id="TwitchMsg"></p>
                        </div>
                        <div class="row">
                            <button class="btn-danger py-2 btn my-2 authUpload">Connect Youtube!</button>
                        </div>
                        <div class="row">
                            <select disabled class="py-3 SelectId" name="SelectId" id="selectId"></select>
                        </div>
                    </div>
                    <div class="col  ms-4">
                        <div class="col me-4">
                            <h4 class="text-center"># Data!</h4>
                            <p id="Stats">Found Number Streams, and Number Recordings</p>
                            <form class="row" action="clear.php" method="get">
                                <p>• currently getting timestamps from: <?php echo $Timestamp_path ?></p>
                                <input class="py-2 Clear btn TimestampClear" type="submit" value="Clear Timestamps?" />
                            </form>
                        </div>
                    </div>

                </div>