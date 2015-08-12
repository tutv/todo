$(document).ready(function () {
    $.ajax({
        url: "api/get.php",
        method: "GET",
        dataType: "json",
        success: function (list) {
            console.log(list);
            for (var i=0; i<list.length; i++) {
                var task = list[i];
                console.log(task);
                addTodoHTML(task.id, task.content);
            }
        }
    });

	$("#toggle-all").on("click", ".check", function () {
		$(this).toggleClass("check");
		$(this).toggleClass("uncheck");

		uncheckAll();
		console.log("Uncecked!");
	});

	$("#toggle-all").on("click", ".uncheck", function () {
		$(this).toggleClass("check");
		$(this).toggleClass("uncheck");

		checkAll();
		console.log("Checked!");
	});


	//Check list task
	$("#todo-list").on("click", "li .check", function () {
		var liTask = $(this).parents("li");
		liTask.toggleClass("complete");

		//Remove check box all
		$("#toggle-all .check").addClass("uncheck");
		$("#toggle-all .check").removeClass("check");
	});

	//Hover li -> appear button delete
	$("#todo-list").on("mouseenter mouseleave", "li",
		function (e) {
            if (e.type == "mouseenter") {
                $(this).find(".destroy").css("opacity", 1);
            } else {
                $(this).find(".destroy").css("opacity", 0);
            }
		}
	);


	//Add new todo
	$("#new-todo").keyup(function (e) {
		if (e.keyCode == 13) {
            var newTodo = $(this);
			var todo = newTodo.val();

			if (todo == "") {
				alert("Please fill in the content!");
			} else {
                $.ajax({
                    url: "api/add.php",
                    method: "GET",
                    data: {content: todo},
                    dataType: "json",
                    success: function (json) {
                        console.log(json);
                        if (json.result) {
                            var task = json.todo;
                            addTodoHTML(task.id, task.content);

                            newTodo.val("");
                            newTodo.focus();
                        } else {
                            alert("False!");
                        }

                    },
                    error: function () {

                    }
                });
			}
		}
	});

});

function addTodoHTML(id, content) {
    var taskHTML = "<li data-id='" + id + "'>"
        + "<div class='view'>"
        + "<div class='toogle'>"
        + "<div class='check'><i class='fa fa-check'></i></div>"
        + "</div>"
        + "<label>" + content + "</label>"
        + "<div class='destroy'>"
        + "<i class='fa fa-times table-cell'></i>"
        + "</div>"
        + "</div>"
        + "<input type='text' class='edit' value='" + content + "'>"
        + "</li>";

    $("#todo-list").prepend(taskHTML);
    updateFooter();
}

function checkAll() {
	$("#todo-list li").addClass("complete");
}

function uncheckAll() {
	$("#todo-list li").removeClass("complete");
}

function updateFooter() {
    var countTask = $("#todo-list li").length;
    if (countTask == 0) {
        $("#footer").addClass("hidden");
    } else {
        $("#footer").removeClass("hidden");
    }

}