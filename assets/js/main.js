$(document).ready(function () {
    // Get list task
    $.ajax({
        url: "api/view/get.php",
        method: "GET",
        dataType: "json",
        success: function (list) {
            console.log(list);
            for (var i=0; i<list.length; i++) {
                var task = list[i];
                console.log(task);
                addTodoHTML(task.id, task.content, task.status);
            }
        },
        error: function () {
            alert("Something went wrong!");
        }
    });

    //Toggle check all
	$("#toggle-all").on("click", ".check", function () {
		$(this).toggleClass("check");
		$(this).toggleClass("uncheck");

        checkCompleteAll(0);
        showAllTask();
		uncheckAll();
	});

	$("#toggle-all").on("click", ".uncheck", function () {
		$(this).toggleClass("check");
		$(this).toggleClass("uncheck");

        checkCompleteAll(1);
        showAllTask();
		checkAll();
	});


	//Check complete/incomplete task
	$("#todo-list").on("click", "li .check", function () {
		var liTask = $(this).parents("li");
        toggleCompleteTask(liTask);
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
                    url: "api/view/add.php",
                    method: "GET",
                    data: {content: todo},
                    dataType: "json",
                    success: function (json) {
                        console.log(json);
                        if (json.result) {
                            var task = json.todo;
                            addTodoHTML(task.id, task.content, 0);

                            newTodo.val("");
                            newTodo.focus();
                        } else {
                            alert("False!");
                        }

                    },
                    error: function () {
                        alert("Something went wrong!");
                    }
                });
			}
		}
	});

    //Show filter task
    $("#filters li").on('click', function (e) {
        e.preventDefault();

        var li = $(this);
        $("#filters li").removeClass('active');
        li.addClass('active');
        var filter = li.attr('data-filter');

        if (filter == 'all') {
            showAllTask();
        } else if (filter == 'active') {
            showActiveTask();
        } else {
            showCompleteTask();
        }
    });

});

function checkCompleteAll(action) {
    $.ajax({
        url: "api/view/checkCompleteAll.php",
        method: "GET",
        dataType: "text",
        data: {action: action},
        success: function (data) {
            if (data == '1') {
                console.log("Check/Uncheck complete all success!");
            } else {
                console.log("Check/Uncheck complete all failed!");
            }
        },
        error: function () {
            alert("Something went wrong!");
        }
    });
}

function toggleCompleteTask(liTask) {
    var id = liTask.attr('data-id');
    var label = liTask.find('label');
    var content = label.text();

    var status = 0;
    if (liTask.hasClass('complete')) {
        console.log("Incomplete!");

    } else {
        console.log("Complete!");
        status = 1;
    }

    var dataUpdate = {id: id, content: content, status: status};
    $.ajax({
        url: "api/view/updateTask.php",
        method: "GET",
        dataType: "text",
        data: dataUpdate,
        success: function (data) {
            if (data == "1") {
                console.log("Update success!");
            } else {
                alert("Update failed!");
            }
        },
        error: function () {
            alert("Something went wrong!");
        }

    });

    liTask.toggleClass("complete");
    updateFooter();
}

function addTodoHTML(id, content, status) {
    var addClass = "class='complete'";
    if (status == "0" || status == 0) {
        addClass = "";
    }
    var taskHTML = "<li data-id='" + id + "' " + addClass +  " >"
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
    updateFooter();
}

function uncheckAll() {
	$("#todo-list li").removeClass("complete");
    updateFooter();
}

function isCompleteAll() {
    var listTask = $("#todo-list li");
    listTask.each(function () {
        if (!$(this).hasClass('complete')) {
            return false;
        }
    });

    return true;
}

function updateFooter() {
    var listTask = $("#todo-list li");
    var countTask = listTask.length;
    if (countTask == 0) {
        $("#footer").addClass("hidden");
    } else {
        $("#footer").removeClass("hidden");
    }

    var countIncomplete = 0;
    listTask.each(function () {
       if (!$(this).hasClass('complete')) {
           countIncomplete++;
       }
    });

    if (countIncomplete == 0) {
        var toggleAll = $("#toggle-all > div");
        toggleAll.addClass("check");
        toggleAll.removeClass("uncheck");
    } else {
        var toggleAll = $("#toggle-all > div");
        toggleAll.addClass("uncheck");
        toggleAll.removeClass("check");
    }

    $("#todo-count strong").text(countIncomplete);
}

function showAllTask() {
    $("#todo-list li").show();
}

function showActiveTask() {
    var listTask = $("#todo-list li");
    listTask.each(function () {
        if (!$(this).hasClass('complete')) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function showCompleteTask() {
    var listTask = $("#todo-list li");
    listTask.each(function () {
        if ($(this).hasClass('complete')) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}