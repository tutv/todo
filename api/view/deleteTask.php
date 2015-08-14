<?php

include '../config/config.php';
include 'echoJson.php';
include '../model/Todo.php';

if (isset($_GET['id'])) {
    $id = $_GET['id'];
    $todo = new Todo($conn);
    if ($id != 'completed') {
        echoResult($todo->deleteTask($id));
    } else {
        echoResult($todo->deleteCompletedTask());
    }
} else {
    echoResult(false);
}

function echoResult($result) {
    if ($result) {
        echo '1';
    } else {
        echo '0';
    }
}