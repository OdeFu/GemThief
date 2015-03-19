createDopeyIdleAI = function (dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);
	const path = [];

	function idleAI() {
		const pathChange = ROT.RNG.getPercentage() < params.idleAIConfig.pathChangeChance;
		if (pathChange) {
			path.splice(0, path.length);
		}

		if (path.length === 0) {
			path.push(...GemThief.Path.generatePath(dwarf.toPoint(), map.findEmptyTile().toPoint()));
		}

		AI.movePath(path);

		if (AI.catchedPlayer()) {
			return;
		}

		if (AI.spottedPlayer()) {
			AI.changeToTrackingAI(createDopeyTrackingAI);
		}
	}

	return idleAI;
};

function createDopeyTrackingAI(dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);

	function lostCallback() {
		dwarf.setAI(createDopeyIdleAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
}
