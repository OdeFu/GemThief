Player = function (params) {
	return createPlayer(params);
};

function createPlayer(params) {
	"use strict";

	// Public methods
	function handleEvent(event) {
		// Process user input
		var action = PlayerActions[event.keyCode];
		if (action) {
			action();

			window.removeEventListener("keypress", player);
			window.removeEventListener("keydown", player);
			Game.getState().getEngine().unlock();
		}
	}

	function act() {
		Game.getState().getEngine().lock();

		// Wait for user input, do stuff when the user hits a key
		window.addEventListener("keypress", player);
		window.addEventListener("keydown", player);
	}

	// Create the player actor
	params.priority = Entity.ENTITY;
	params.char = "@";
	params.color = "white";

	var player = createEntity(params);
	player.handleEvent = handleEvent;
	player.act = act;
	return player;
}
