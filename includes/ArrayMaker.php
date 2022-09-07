<?php 
function AddArrTextArea($Array, $id)
{
    echo "<textarea hidden id='$id'>"; // this is hidden from view
    foreach ($Array as $line) {
        echo $line;
    }
    echo "</textarea>";
}
function AddP($Text, $id) {
echo "<p hidden id='$id'>$Text</p>";
}
?>