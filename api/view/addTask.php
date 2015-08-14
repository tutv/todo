<?php
include '../config/config.php';
include 'echoJson.php';
include '../model/Todo.php';

$content = $_GET['content'];

if (isset($content)) {
    $todo = new Todo($conn);
    $task = $todo->store($content);

    if ($task != "") {
        addTodo(true, $task);
    } else {
        addTodo(false, []);
    }
} else {
    addTodo(false, []);
}