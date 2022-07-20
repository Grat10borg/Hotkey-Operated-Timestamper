                <div class="m-3 d-flex justify-content-center">
                    <img src="img\TwitchIcon.png" alt="">
                </div>
                <h3 class="text-center">Hotkey, Operated, Timestamper <?php echo $version; ?></h3>
                <?php if (isset($error)) {
                    echo "<h4 class='-2 text-danger text-center fs-3'>Error `(*>﹏<*)′</h4>";
                    echo "<h5 class='m-3 text-danger text-center'>$error</h5>";
                } ?>
                <p>H.O.T is a Vod timestamper i designed to work along with the <a href="">Stream-Writer plugin for OBS.</a></p>
                <p>it cuts down all the timestamps into the smallest amount of characters,</p>
                <p class="mb-5">and formats it into your desciption!</p>
                <div class="border-bottom border-secondary pb-5">
                    <?php include "includes\H.O.T_DescMaker\HtmlData.php" // imports the foreaches that tell data about the timestamps
                    ?>
                    <h4># Options</h4>
                    <form class="row" action="clear.php" method="get">
                        <input class="m-2 Clear btn TimestampClear" type="submit" value="Clear Timestamps" />
                    </form>
                    <div class="row">
                        <button class="btn-danger btn col-3 m-2 authUpload">Connect Youtube!</button>
                        <select disabled class="col my-1 SelectId" name="SelectId" id="selectId"></select>
                    </div>
                </div>