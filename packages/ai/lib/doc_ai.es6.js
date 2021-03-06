"use strict";

GemThief.AI.Doc = {
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
				AI.changeToTrackingAI(createDocTrackingAI);
			}
		}

		return idleAI;
	}
};

function createDocTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function lostCallback() {
		dwarf.setAI(createDocGuardAI(dwarf, dungeon, params));
	}

	return AI.getTrackingAI(lostCallback);
}

function createDocGuardAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);
	const path = AI.getShortestPathToStairs();

	function guardAI() {
		AI.movePath(path);

		if (AI.spottedPlayer(params.guardAIConfig.radius)) {
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	}

	return guardAI;
}
