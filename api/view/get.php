<?php
include '../config/config.php';
include 'echoJson.php';
include '../model/Todo.php';

$todo = new Todo($conn);

$list = $todo->getAll();

listTodo($list);