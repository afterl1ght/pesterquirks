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

//Lock copy button's position if the webpage is overscaled which hinders the button
function lockButtonPosition() {
	var lock = "button-copy-lock";
	$(".copy").removeClass(lock);

	var buttonHeight = $(".copy").outerHeight();
	var topToButtonBottom = $(".copy").offset().top + buttonHeight;
	var formHeight = $("form").outerHeight();

	/*If the resulting subtraction is lesser than button's height, the button may have been hidden by the scaling*/
	if (formHeight - topToButtonBottom < buttonHeight) {
		//Locks the button by defining premade .button-copy-lock class on it
		$(".copy").addClass(lock);
	} else {
		$(".copy").removeClass(lock);
	}
}

//Check if button is still in "Copied!" state
var isNotifyingUser = false;
//Runs everytime the user clicks the copy button
function notifyCopy() {
	$(".copy").text("COPIED");
	setTimeout(() => {
		$(".copy").text("COPY RESULT");
		isNotifyingUser = false;
	}, 1500);
}

//Create a list of available characters.
$.getJSON(
	"https://api.github.com/repos/afterl1ght/pesterquirks/contents/res/quirks/",
	loadAvailableQuirks
).fail(() =>
	$.getJSON(
		"available.json",
		loadAvailableQuirks
	).fail(() =>
		alert(
			"Unable to load list of characters at this time! Please try again later."
		)
	)
);

//Bind events
$(window).on("load", loaded);
$(document).ready(() => {
	//Main events
	$(".tinput").on("input", onInput);
	$("#copy").click(() => {
		$(".toutput").select();
		document.getElementById("textoutput").setSelectionRange(0, 41300);
		document.execCommand("copy");
		window.getSelection().removeAllRanges();
		document.getSelection().empty();
		if (!isNotifyingUser) {
			isNotifyingUser = true;
			notifyCopy();
		}
	});

	//Side UI-related events
	//Lock button when orientation changes, albeit uncomfortable on mobile devices with scaled resolution. They would have to turn on Desktop view for that.
	lockButtonPosition(); //Trigger this first in case
	$(window).on("resize orientationChange", lockButtonPosition);
});
