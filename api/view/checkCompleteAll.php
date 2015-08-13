<?php

include '../config/config.php';
include 'echoJson.php';
include '../model/Todo.php';

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    $todo = new Todo($conn);
    if ($action != 0 || $action != '0') {
        echoResult($todo->checkCompleteAll(1));
    } else {
        echoResult($todo->checkCompleteAll(0));
    }
} else {
    echoResult($todo->checkCompleteAll(0));
}

function echoResult($result) {
    if ($result) {
        echo '1';
    } else {
        echo '0';
    }
}