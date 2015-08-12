$(document).ready(function () {
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
	$("#todo-list li .check").on("click", function () {
		var liTask = $(this).parents("li");
		liTask.toggleClass("complete");

		//Remove check box all
		$("#toggle-all .check").addClass("uncheck");
		$("#toggle-all .check").removeClass("check");
	});

	//Hover li -> appear button delete
	$("#todo-list li").hover(
		function (e) {
			$(this).find(".destroy").css("opacity", 1);
		},
		function (e) {
			$(this).find(".destroy").css("opacity", 0);
		}
	);


	//Add new todo
	$("#new-todo").keyup(function (e) {
		if (e.keyCode == 13) {
			var todo = $(this).val();

			if (todo == "") {
				alert("empty");
			} else {

			}
		}
	});

});

function checkAll() {
	$("#todo-list li").addClass("complete");
}

function uncheckAll() {
	$("#todo-list li").removeClass("complete");
}