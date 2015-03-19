createSleepyIdleAI = function (dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);

	function idleAI() {
		if (AI.spottedPlayer()) {
			AI.changeToTrackingAI(createSleepyTrackingAI);
		}
	}

	return idleAI;
};

function createSleepyTrackingAI(dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);

	function lostCallback() {
		dwarf.setAI(createSleepyIdleAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
}
