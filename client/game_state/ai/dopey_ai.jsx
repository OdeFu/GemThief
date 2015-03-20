"use strict";

GemThief.AI.Dopey = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = GemThief.AI.instantiate(dwarf, dungeon, params);
		const path = [];

		function idleAI() {
			const pathChange = ROT.RNG.getPercentage() < params.idleAIConfig.pathChangeChance;
			if (pathChange) {
				path.splice(0, path.length);
			}

			if (path.length === 0) {
				path.push(...GemThief.Path.generatePath(dungeon.map, dwarf.toPoint(), dungeon.map.findEmptyTile().toPoint()));
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
	}
};

function createDopeyTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Dopey.instantiate(dwarf, dungeon, params));
	}

	return AI.getTrackingAI(lostCallback);
}
