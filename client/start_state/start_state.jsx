StartState = {
	instantiate: function () {
		"use strict";

		const state = State.instantiate({ name: "StartState" });
		state.handleEvent = handleEvent.bind(state);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		return state;
	}
};

// Public methods

function act() {
	draw();

	this.engine.lock();
	window.addEventListener("keydown", this);
}

function enter() {
	initEngine(this);
}

function exit() {
	this.engine.lock();
	this.scheduler.clear();
}

function handleEvent(event) {
	"use strict";

	// Process user input
	if (event.keyCode === ROT.VK_RETURN) {
		window.removeEventListener("keydown", this);

		Meteor.call("newGame", function newGameCallback(error, game) {
			GemThief.Game.changeState(GameState.instantiate(game));
		});
	}
}

// Private methods

function draw() {
	"use strict";

	GemThief.Game.display.clear();
	GemThief.Game.drawTextCentered(5, "%c{red}G %c{green}E %c{blue}M");
	GemThief.Game.drawTextCentered(6, "%c{magenta}T %c{aqua}H %c{coral}I %c{fuchsia}E %c{indigo}F");
	GemThief.Game.drawTextCentered(8, "%b{gray}Press Enter");
}

function initEngine(state) {
	"use strict";

	state.scheduler.add(state, true);
	state.engine.start();
}
