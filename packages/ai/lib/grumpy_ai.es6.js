"use strict";

GemThief.AI.Grumpy = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createGrumpyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createGrumpyTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function trackingAI() {
		AI.move(dungeon.player.toPoint());

		AI.catchedPlayer();
	}

	return trackingAI;
}
