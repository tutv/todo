<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todo";
$charset = "utf8";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

mysqli_set_charset($conn, $charset);