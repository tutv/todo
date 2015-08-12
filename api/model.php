<?php

class Todo {
    private $conn;

    function __construct($conn) {
        $this->conn = $conn;
    }

    function delete() {

    }

    function store($content) {
        $sql = "INSERT INTO task (content) VALUES ('$content')";

        $todo = "";

        if ($this->conn->query($sql) === TRUE) {
            $id = mysqli_insert_id($this->conn);

            $todo = $this->get($id);
        }

        return $todo;
    }

    function get($id) {
        $sql = "SELECT * FROM task WHERE id = $id";

        $result = $this->conn->query($sql);

        $todo = [];

        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $todo = [
                    "id" => $row["id"],
                    "content" => $row["content"],
                    "status" => $row["status"]
                ];
            }
        }

        return $todo;
    }

    function getAll() {
        $sql = "SELECT * FROM task";

        $result = $this->conn->query($sql);

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

        return $list;
    }
}