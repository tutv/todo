var base_apiURL = "api/view/";

function notify(text, type) {
    var n = noty({
        text        : text,
        type        : type,
        dismissQueue: true,
        closeWith   : ['click', 'backdrop', 'hover', 'button'],
        modal       : false,
        layout      : 'topLeft',
        theme       : 'relax',
        maxVisible  : 10,
        timeout: 5000,
        animation: {
            open: 'animated bounceInLeft', // Animate.css class names
            close: 'animated bounceOutLeft', // Animate.css class names
            easing: 'swing', // unavailable - no need
            speed: 500 // unavailable - no need
        }
    });
}

function somethingWWrong() {
    notify("<i class='fa fa-exclamation'></i> Some thing went wrong", 'warning');
}

$(document).ready(function () {
    // Get list task
    $.ajax({
        url: base_apiURL + "getTasks.php",
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
            somethingWWrong();
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
                    url: base_apiURL + "addTask.php",
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
                            notify("<i class='fa fa-times'></i> Add task failed!", 'error');
                        }

                    },
                    error: function () {
                        somethingWWrong();
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

    $("#todo-list").on('click', ".destroy", function () {
        console.log("Checked!");
        var liTask = $(this).parents("li");
        var id = liTask.attr('data-id');
        $.ajax({
            url: base_apiURL + "deleteTask.php",
            method: "GET",
            dataType: "text",
            data: {id: id},
            success: function (data) {
                if (data == "1") {
                    console.log("Delete task success!");
                    liTask.remove();
                } else {
                    alert("Delete task failed!");
                }
            },
            error: function () {
                somethingWWrong();
            }
        });
    });

    $("#clear-completed").on('click', function (e) {
        e.preventDefault();
        $.ajax({
            url: base_apiURL + "deleteTask.php",
            method: "GET",
            dataType: "text",
            data: {id: 'completed'},
            success: function (data) {
                if (data == "1") {
                    console.log("Delete completed task success!");
                    notify("<i class='fa fa-check'></i> Delete completed task success!", 'success');
                    delelteCompletedTask();
                } else {
                    notify("<i class='fa fa-check'></i> Delete completed task failed!", 'error');
                }
            },
            error: function () {
                somethingWWrong();
            }
        });
    });

});

function delelteCompletedTask() {
    $("#todo-list li").each(function () {
        if ($(this).hasClass('complete')) {
            $(this).remove();
        }
    });
    updateFooter();
}

function checkCompleteAll(action) {
    var noty = '';
    if (action != 0) {
        noty += 'Check';
    } else {
        noty += 'Uncheck';
    }

    noty += ' complete all task ';

    $.ajax({
        url: base_apiURL + "checkCompleteAll.php",
        method: "GET",
        dataType: "text",
        data: {action: action},
        success: function (data) {
            if (data == '1') {
                notify("<i class='fa fa-check'></i> " + noty + 'success!', 'success');
            } else {
                notify("<i class='fa fa-times'></i> " + noty + 'failed!', 'error');
            }
        },
        error: function () {
            somethingWWrong();
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
        url: base_apiURL + "updateTask.php",
        method: "GET",
        dataType: "text",
        data: dataUpdate,
        success: function (data) {
            if (data == "1") {
                console.log("Update success!");
            } else {
                notify("<i class='fa fa-times'></i> Update failed", 'error');
            }
        },
        error: function () {
            somethingWWrong();
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
    var toggleAll = $("#toggle-all > div");
    if (countTask == 0) {
        $("#footer").addClass("hidden");
        console.log("There is no task!");

        // Fix bus <-----

        console.log(toggleAll);
        toggleAll.removeClass('check');
        toggleAll.addClass('uncheck');

    } else {
        $("#footer").removeClass("hidden");
    }

    var countIncomplete = 0;
    listTask.each(function () {
       if (!$(this).hasClass('complete')) {
           countIncomplete++;
       }
    });

    if (countIncomplete == 0 && countTask != 0) {
        toggleAll.addClass("check");
        toggleAll.removeClass("uncheck");
    } else {
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