body = document.body;
bclasslist = body.classList;

//Init
//Add a class to pause cool animated entrance until everything is loaded.
bclasslist.add("hold")

//Functions
function addListener(event, func) {
	window.addEventListener(event, func);
}

//Run function upon page load.
function loaded() {
	bclasslist.remove("hold")
}

//Bind events
addListener("load", loaded);