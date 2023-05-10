<!DOCTYPE html>
<html lang="en">
<head>
    <?php include "includes/html/HtmlDoc.php";?>
    <link rel="shortcut icon" href="img\HOT_Icon.ico"/>
    <title>H.O.T: Description Maker 📃</title>
</head>
<body>
    <?php
    include "includes/settings.php"; // general vars things you can change is imported here, like the file root for the txt!
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
    <script src="javascript/dom.js"></script>
    <script src="config.js"></script>
    <script src="javascript/TimestampSort.js"></script>
</body>

</html> 