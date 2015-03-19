"use strict";

GemThief.AI.Grumpy = {
	instantiate: function (dwarf, map, params) {
		const AI = GemThief.AI.instantiate(dwarf, map, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createGrumpyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createGrumpyTrackingAI(dwarf, map, params) {
	const AI = GemThief.AI.instantiate(dwarf, map, params);

	function trackingAI() {
		AI.move(map.player.toPoint());

		AI.catchedPlayer();
	}

	return trackingAI;
}
