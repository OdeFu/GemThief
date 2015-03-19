"use strict";

GemThief.AI.Sleepy = {
	instantiate: function (dwarf, map, params) {
		const AI = GemThief.AI.instantiate(dwarf, map, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createSleepyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createSleepyTrackingAI(dwarf, map, params) {
	const AI = GemThief.AI.instantiate(dwarf, map, params);

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Sleepy.instantiate(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
}
