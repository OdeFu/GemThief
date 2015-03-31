"use strict";

GemThief.AI.Sleepy = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createSleepyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createSleepyTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Sleepy.instantiate(dwarf, dungeon, params));
	}

	return AI.getTrackingAI(lostCallback);
}
