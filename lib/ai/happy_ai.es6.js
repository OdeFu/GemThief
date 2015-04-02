"use strict";

GemThief.AI.Happy = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = GemThief.AI.instantiate(dwarf, dungeon, params);
		const path = [];

		function idleAI() {
			if (path.length === 0) {
				path.push(...GemThief.Path.generatePath(dungeon.map, dwarf.toPoint(),
				dungeon.map.findEmptyTile().toPoint()));
			}

			AI.movePath(path);

			if (AI.catchedPlayer()) {
				return;
			}

			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createHappyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createHappyTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function tellJoke() {
		const joke = params.jokes.random();
		Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "\"" + joke + "\"");
	}

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Happy.instantiate(dwarf, dungeon, params));
	}

	function stoppedCallback() {
		tellJoke();
	}

	return AI.getTrackingAI(lostCallback, stoppedCallback);
}
