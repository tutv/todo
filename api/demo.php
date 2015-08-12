<?php
include "config.php";
include "echoJson.php";
include "model.php";

$sql = "SELECT * FROM task";

$result = $conn->query($sql);

$list = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $todo = [
            "id" => $row["id"],
            "content" => $row["content"],
            "status" => $row["status"]
        ];

        array_push($list, $todo);
    }
}

print_r($list);