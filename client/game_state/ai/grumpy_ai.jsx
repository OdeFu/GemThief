createGrumpyIdleAI = function (dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);

	function idleAI() {
		if (AI.spottedPlayer()) {
			AI.changeToTrackingAI(createGrumpyTrackingAI);
		}
	}

	return idleAI;
};

function createGrumpyTrackingAI(dwarf, map, params) {
	"use strict";

	const AI = createAI(dwarf, map, params);

	function trackingAI() {
		AI.move(map.player.toPoint());

		AI.catchedPlayer();
	}

	return trackingAI;
}
