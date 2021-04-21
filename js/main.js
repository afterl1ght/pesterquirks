//main.js
var body = document.body;
var bclasslist = body.classList;

//Init
//Add a class to pause cool animated entrance until everything is loaded.
bclasslist.add("hold");

//Run function upon page load.
function loaded() {
	bclasslist.remove("hold");
}

//Runs everytime the user types sth in the tbox
function onInput() {
	/*Process input and commands*/
	var input = $(".tinput").val();
	var result = parseQuirk(input, cmds);
	$(".toutput").text(result);
}

//Create a list of available characters.
$.getJSON(
	"https://api.github.com/repos/afterl1ght/pesterquirks/contents/res/quirks/",
	loadAvailableQuirks
).fail(() =>
	$.getJSON(
		"https://raw.githubusercontent.com/afterl1ght/pesterquirks/main/available.json",
		loadAvailableQuirks
	).fail(() =>
		alert(
			"Unable to load list of characters at this time! Please try again later."
		)
	)
);

//Bind events
$(window).on("load", loaded);
$(document).ready(() => $(".tinput").on("input", onInput));
