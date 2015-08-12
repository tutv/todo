<?php
include "config.php";
include "echoJson.php";
include "model.php";

$todo = new Todo($conn);

$list = $todo->getAll();

listTodo($list);