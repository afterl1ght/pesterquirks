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
$(".tinput").on("input", onInput);
