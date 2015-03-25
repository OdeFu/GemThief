"use strict";

GemThief.StartState = {
	instantiate: function (newPlayer) {
		const state = GemThief.State.instantiate({ name: "GemThief.StartState" });
		state.newPlayer = newPlayer;
		state.handleEvent = handleEvent.bind(state);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		return state;
	}
};

// Public methods

function act() {
	_draw(this);

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

function _draw(state) {
	GemThief.Display.clear();
	GemThief.Display.drawTextCentered(5, "%c{red}G %c{green}E %c{blue}M");
	GemThief.Display.drawTextCentered(6, "%c{magenta}T %c{aqua}H %c{coral}I %c{fuchsia}E %c{indigo}F");

	const text = state.newPlayer ? "%b{gray}New Game" : "%b{gray}Continue Game";
	GemThief.Display.drawTextCentered(8, text);
}

function _initEngine(state) {
	state.scheduler.add(state, true);
	state.engine.start();
}
