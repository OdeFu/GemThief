StartState = function () {
	return createStartState();
};

function createStartState() {
	"use strict";

	// Private methods
	function draw() {
		Game.display.clear();
		Game.drawTextCentered(5, "%c{red}G %c{green}E %c{blue}M");
		Game.drawTextCentered(6, "%c{magenta}T %c{aqua}H %c{coral}I %c{fuchsia}E %c{indigo}F");
		Game.drawTextCentered(8, "%b{gray}Press Enter");
	}

	function initEngine() {
		state.getScheduler().add(state, true);

		state.getEngine().start();
	}

	// Public methods
	function handleEvent(event) {
		// Process user input
		if (event.keyCode === ROT.VK_RETURN) {
			window.removeEventListener("keydown", state);
			Meteor.call("newGame", function newGameCallback(error, game) {
				Game.changeState(GameState, game);
			});
		}
	}

	var options = {};
	options.name = "StartState";

	options.act = function act() {
		draw();

		state.getEngine().lock();
		window.addEventListener("keydown", state);
	};

	options.enter = function enter() {
		initEngine();
	};

	options.exit = function exit() {
		state.getEngine().lock();
		state.getScheduler().clear();
	};

	var state = createState(options);
	state.handleEvent = handleEvent;
	return state;
}
