<?php

function addTodo($result, $todo) {
    echo json_encode([
       'result' => $result,
        'todo' => $todo
    ]);
}

function listTodo($list) {
    echo json_encode($list);
}