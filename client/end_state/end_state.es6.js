"use strict";

class EndState extends GemThief.State {
	constructor(params) {
		check(params.won, Boolean);
		check(params.score, Number);
		check(params.gems, Number);

		params.name = "GemThief.EndState";

		super(params);

		this.won = params.won;
		this.gems = params.gems;
		this.score = params.score;
	}

	handleEvent(event) {
		check(event.keyCode, Number);

		// Process user input
		if (event.keyCode === ROT.VK_RETURN) {
			window.removeEventListener("keydown", this);
			Meteor.call("newGame", function newGameCallback(error, game) {
				GemThief.Game.changeState(GemThief.GameState.instantiate(game));
			});
		}
	}

	act() {
		draw(this);

		this.engine.lock();
		window.addEventListener("keydown", this);
	}

	enter() {
		initEngine(this);
	}

	exit() {
		this.engine.lock();
		this.scheduler.clear();
	}
}

GemThief.EndState = EndState;

/*
GemThief.EndState = {
	instantiate: function (params) {
		check(params.won, Boolean);
		check(params.score, Number);
		check(params.gems, Number);

		params.name = "GemThief.EndState";

		const state = GemThief.State.instantiate(params);
		state.won = params.won;
		state.gems = params.gems;
		state.score = params.score;

		state.handleEvent = handleEvent.bind(state);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		return state;
	}
};
*/

// Private methods

function draw(state) {
	GemThief.Display.clear();

	const text = state.won ? "You managed to escape with the loot!" : "You got caught by the dwarves!";
	GemThief.Display.drawTextCentered(5, text);
	GemThief.Display.drawTextCentered(6, "Gems Looted: " + state.gems);
	GemThief.Display.drawTextCentered(7, "Score: " + state.score);
	GemThief.Display.drawTextCentered(9, "%b{gray}New Game");
}

function initEngine(state) {
	state.scheduler.add(state, true);
	state.engine.start();
}
