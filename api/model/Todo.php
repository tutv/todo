<?php

class Todo {
    private $conn;

    function __construct($conn) {
        $this->conn = $conn;
    }

    /*
     * DESTROY
     */

    function delete() {

    }

    /*
     * UPDATE
     * @return true/false
     */

    function updateTask($id, $content = null, $status = -1) {
        if (!$this->idAvaiable($id)) {
            return false;
        }

        $id = $this->protecting_injection($id);
        $content = $this->protecting_injection($content);
        $status = $this->protecting_injection($status);

        /* SQL Query */
        $sql = 'UPDATE task SET ';
        $comma = '';
        if ($content != null) {
            $sql .= "content='$content'";
            $comma = ',';
        }
        if ($status != -1) {
            if ($status == false || $status == 0) {
                $status = 0;
            } else {
                $status = 1;
            }

            $sql .= $comma . "status='$status'";
        }
        $sql .= " WHERE id='$id'";

        if ($this->conn->query($sql) === true) {
            return true;
        }

        return false;
    }

    function checkCompleteAll($status = 0) {
        $listTask = $this->getAll();
        foreach ($listTask as $task) {
            $id = $task['id'];
            if (!$this->updateTask($id, null, $status)) {
                return false;
            }
        }

        return true;
    }

    /*
     * INSERT
     */

    function store($content) {
        $content = $this->protecting_injection($content);
        $sql = "INSERT INTO task (content) VALUES ('$content')";

        $todo = "";

        if ($this->conn->query($sql) === true) {
            $id = mysqli_insert_id($this->conn);

            $todo = $this->get($id);
        }

        return $todo;
    }


    /*
     * SELECT
     */
    function get($id) {
        $this->protecting_injection($id);
        $sql = "SELECT * FROM task WHERE id = '$id'";
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

    function idAvaiable($id) {
        $task = $this->get($id);
        if ($task != []) {
            return true;
        }

        return false;
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

    /*
     * PROTECT
     */

    function protecting_injection($content) {
        $content = mysql_real_escape_string($content);
        $content = htmlspecialchars($content);
        return $content;
    }
}