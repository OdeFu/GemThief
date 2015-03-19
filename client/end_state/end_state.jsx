"use strict";

GemThief.EndState = {
	instantiate: function (params) {
		"use strict";

		check(params.won, Boolean);
		check(params.score, Number);
		check(params.gems, Number);

		params.name = "GemThief.EndState";

		const state = GemThief.State.instantiate(params);
		state.handleEvent = handleEvent.bind(state);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		return state;
	}
};

// Public methods

function handleEvent(event) {
	check(event.keyCode, Number);

	// Process user input
	if (event.keyCode === ROT.VK_RETURN) {
		window.removeEventListener("keydown", this);
		Meteor.call("newGame", function newGameCallback(error, game) {
			GemThief.Game.changeState(GemThief.GameState.instantiate(game));
		});
	}
}

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

// Private methods

function _draw(state) {
	GemThief.Game.display.clear();

	const text = state.won ? "You managed to escape with the loot!" : "You got caught by the dwarves!";
	GemThief.Game.drawTextCentered(5, text);
	GemThief.Game.drawTextCentered(6, "Gems Looted: " + state.params.gems);
	GemThief.Game.drawTextCentered(7, "Score: " + state.params.score);
	GemThief.Game.drawTextCentered(9, "%b{gray}New GemThief.Game");
}

function _initEngine(state) {
	state.scheduler.add(state, true);
	state.engine.start();
}
