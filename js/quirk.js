//quirk.js
/*Initial variables*/

var quirks = {};
var chosen = "";
var preview = "I'm just a preview!";

var cmds = {};

/*Functions*/

/*Some germane functions to comprehend quirk instructions written accordingly from the keys*/
var proceed = {
	//preview <text> - Changes preview text. Should always be placed on top of the instruction file.
	//color <hex> - Changes text color (for cosmetic purpose)
	preview: (__, _) => {
		var text = preview;
		//Load default color and then format preview. If color command is defined in the instruction file, change its color.
		proceed["color"]("ffffff");
		$.each(cmds, (_, v) => {
			text = process(text, v, false);
		});
		$(".preview").text(text);
		return _;
	},
	color: (color, _) => {
		var colordata = { color: `#${color.replace("#", "")}` };
		$(".preview").css(colordata);
		$(".toutput").css(colordata);
		return _;
	},
	//prefix (text-before-input)
	prefix: (arg, input) => {
		return arg + input;
	},
	//suffix (text-after-input)
	suffix: (arg, input) => {
		return input + arg;
	},
	//cap [letter] - Capitalises things
	cap: (arg, input) => {
		arg = arg || "/./g";
		var result = input.replace(toRegex(arg), (match) => match.toUpperCase());
		return result;
	},
	//replace (searchTerm) (textToReplace|command)
	replace: (arg, input) => {
		/*Use makeCommandInfo to split the two only arguments here (searchTerm, textToReplace|command)*/
		var search = makeCommandInfo(arg);
		//search.cmd = the regex keyword
		//search.args = the text to replace the matching results or the command
		if (search.args in proceed) {
			//If supporting commands are found, execute it.
			input = proceed[search.args](search.cmd, input);
		} else {
			input = input.replace(toRegex(search.cmd), search.args);
		}
		//available commands: cap
		return input;
	}
};

/*Auxiliary functions*/

function reformat(pathName) {
	var r1 = pathName.replace(/[-]/g, " ");
	var r2 = r1.replace(/(\.).+/gi, "");
	return r2.toUpperCase();
}

function addOptions(_, content) {
	$.get(
		`res/quirks/${content.name}`,
		function (v) {
			quirks[content.name] = v;
			var pathName = reformat(content.name);
			var option = `<div class="charOption"><a onclick="choose('${content.name}'); onInput()">${pathName}</a></div>`;
			$(".charselContent").append(option);
		}
	);
}

function loadAvailableQuirks(quirks) {
	$.each(quirks, addOptions);
}

function choose(quirkPath) {
	$(".text").text(reformat(quirkPath));
	chosen = quirkPath;

	/*Split commands for processing*/
	cmds = quirks[chosen].split("\n");

	/*Change preview*/
	proceed["preview"]();
}

function makeCommandInfo(value) {
	var mcmd = value.match(/[^\s]+/) || [""];
	var marg = value.match(/(?<=\s).+/) || [""];
	return {
		cmd: mcmd[0],
		args: marg[0]
	};
}

/*Process commands*/
function process(input, ivalue, isLoaded) {
	var cmdinf = makeCommandInfo(ivalue);

	/*check this is the process is in loaded state*/
	var caseLoaded = cmdinf.cmd.match(/^preview|color/) == null;
	/*failsafe*/
	if (cmdinf.cmd in proceed) {
		if ((caseLoaded && isLoaded) || !isLoaded) {
			/*if this is executed after the quirk has been loaded (isLoaded), it only means the user has started typing things in the box, and we want to generate the result in real time, so let's do that
			if this is executed while preparing quirk (!isLoaded), find preview commands and return its argument for processing as we do not want these command to run per text input*/
			if (!caseLoaded && cmdinf.cmd != "color") {
				input = cmdinf.args;
			} else {
				input = proceed[cmdinf.cmd](cmdinf.args, input);
			}
		}
	} else {
		/*If the command is not found in the instruction file, it's a prefix by default*/
		input = ivalue + input;
	}
	return input;
}

/*Generate quirks using instruction files*/
function parseQuirk(input, cmds) {
	$.each(cmds, (_, v) => {
		input = process(input, v, true);
	});
	return input;
}

//Convert string to regex
function toRegex(str) {
	var searchfor = str.match(/(?<!\\)(?<=\/)(.*?)+(?=\/)/) || [""];
	var flags = str.replace(`/${searchfor[0]}/`, "");
	return new RegExp(searchfor[0], flags);
}
