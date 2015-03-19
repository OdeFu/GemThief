"use strict";

GemThief.AI.Doc = {
	instantiate: function (dwarf, map, params) {
		const AI = GemThief.AI.instantiate(dwarf, map, params);
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
				AI.changeToTrackingAI(createDocTrackingAI);
			}
		}

		return idleAI;
	}
};

function createDocTrackingAI(dwarf, map, params) {
	const AI = GemThief.AI.instantiate(dwarf, map, params);

	function lostCallback() {
		dwarf.setAI(createDocGuardAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
}

function createDocGuardAI(dwarf, map, params) {
	const AI = GemThief.AI.instantiate(dwarf, map, params);
	const path = AI.getShortestPathToStairs();

	function guardAI() {
		AI.movePath(path);

		if (AI.spottedPlayer(params.guardAIConfig.radius)) {
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	}

	return guardAI;
}
