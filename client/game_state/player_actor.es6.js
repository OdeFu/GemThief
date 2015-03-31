"use strict";

GemThief.PlayerActor = {
	instantiate: function (player) {
		const actor = Object.create(GemThief.PlayerActor);
		actor.player = player;

		actor.act = act.bind(actor);
		actor.turnOver = turnOver.bind(actor);

		return actor;
	}
};

// Public methods

function act() {
	GemThief.Game.state.engine.lock();

	// Wait for user input, do stuff when the user hits a key
	window.addEventListener("keypress", _handleEvent);
	window.addEventListener("keydown", _handleEvent);
}

function turnOver() {
	window.removeEventListener("keypress", _handleEvent);
	window.removeEventListener("keydown", _handleEvent);

	GemThief.Game.state.engine.unlock();
}

// Private methods

function _handleEvent(event) {
	// Process user input
	const action = GemThief.PlayerActions[event.keyCode];
	if (action) {
		action();
	}
}

