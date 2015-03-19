"use strict";

GemThief.StartState = {
	instantiate: function () {
		const state = GemThief.State.instantiate({ name: "GemThief.StartState" });
		state.handleEvent = handleEvent.bind(state);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		return state;
	}
};

// Public methods

function act() {
	_draw();

	this.engine.lock();
	window.addEventListener("keydown", this);
}

function enter() {
	_initEngine(this);
}

function exit() {
	this.engine.lock();
	this.scheduler.clear();
}

function handleEvent(event) {
	// Process user input
	if (event.keyCode === ROT.VK_RETURN) {
		window.removeEventListener("keydown", this);

		Meteor.call("newGame", function newGameCallback(error, game) {
			GemThief.Game.changeState(GemThief.GameState.instantiate(game));
		});
	}
}

// Private methods

function _draw() {
	GemThief.Game.display.clear();
	GemThief.Game.drawTextCentered(5, "%c{red}G %c{green}E %c{blue}M");
	GemThief.Game.drawTextCentered(6, "%c{magenta}T %c{aqua}H %c{coral}I %c{fuchsia}E %c{indigo}F");
	GemThief.Game.drawTextCentered(8, "%b{gray}Press Enter");
}

function _initEngine(state) {
	state.scheduler.add(state, true);
	state.engine.start();
}
