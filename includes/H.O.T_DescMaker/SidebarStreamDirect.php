<nav class="navbar">
    <ul class="nav flex-column text-center">
        <li class='nav-item m-3'>
            <a class='navlink me-4' href='#Stream'>▷ Streams </a>
        </li>
        <?php
        if (isset($MultiStreamArray)) {
            $streams = count($MultiStreamArray);
            $i = 0;
            for ($i; $i < $streams; $i++) {
                echo "<li class='nav-item m-3'>";
                $i2 = $i + 1;
                echo "<a class='navlink text-center' href='#Stream-{$i}'>▷ Stream {$i2}</a>";
                echo "</li>";
            }
        } else {
            echo "<li class='nav-item m-3'>";
            echo "<a class='navlink text-center' href='#N/A'>no Streams found</a>";
            echo "</li>";
        }
        echo "<li class='nav-item m-3'>";
        echo "<a class='navlink text-center me-4' href='#Record'>▶ Records</a>";
        echo "</li>";
        if (isset($MultiRecordArray)) {
            $records = count($MultiRecordArray);
            $i = 0;
            for ($i; $i < $records; $i++) {
                echo "<li class='nav-item m-3'>";
                $i2 = $i + 1;
                echo "<a class='navlink text-center' href='#recording-{$i}'>▶ Record {$i2}</a>";
                echo "</li>";
            }
        } else {
            echo "<li class='nav-item m-3'>";
            echo "<a class='navlink text-center' href='#N/A'>no recordings found</a>";
            echo "</li>";
        }
        ?>
    </ul>
</nav>