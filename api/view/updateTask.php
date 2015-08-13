<?php

include '../config/config.php';
include 'echoJson.php';
include '../model/Todo.php';

/*
 * UPDATE
 * + success -> 1
 * + error   -> 0
 */

if (isset($_GET['id']) && isset($_GET['content']) && isset($_GET['status'])) {
    $id = $_GET['id'];
    $content = $_GET['content'];
    $status = $_GET['status'];
    $todo = new Todo($conn);

    if ($todo->updateTask($id, $content, $status)) {
        echo '1';
    }
    else {
        echo '0';
    }
} else {
    echo '0';
}
