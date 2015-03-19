createHappyIdleAI = function (dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);
	const path = [];

	function idleAI() {
		if (path.length === 0) {
			path.push(...GemThief.Path.generatePath(dwarf.toPoint(), map.findEmptyTile().toPoint()));
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
};

function createHappyTrackingAI(dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);

	function tellJoke() {
		const joke = params.jokes.random();
		map.setMessage("\"" + joke + "\"");
	}

	function lostCallback() {
		dwarf.setAI(createHappyIdleAI(dwarf, map, params));
	}

	function stoppedCallback() {
		tellJoke();
	}

	return AI.getTrackingAI(lostCallback, stoppedCallback);
}
