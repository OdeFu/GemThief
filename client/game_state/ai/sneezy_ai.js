createSneezyIdleAI = function (dwarf, map, params) {
	"use strict";

	var AI = createAI(dwarf, map, params);

	function idleAI() {
		if (AI.spottedPlayer()) {
			AI.changeToTrackingAI(createSneezyTrackingAI);
		}
	}

	return idleAI;
};

function createSneezyTrackingAI(dwarf, map, params) {
	"use strict";

	var AI = createAI(dwarf, map, params);

	function lostCallback() {
		dwarf.setAI(createSleepyIdleAI(dwarf, map, params));
	}

	function stoppedCallback() {
		dwarf.setAI(createSneezingAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback, stoppedCallback);
}

function createSneezingAI(dwarf, map, params) {
	"use strict";

	var AI = createAI(dwarf, map, params);
	var sneezeDuration = ROT.RNG.getUniformInt(1, params.sneezingAIConfig.maxDuration);

	function sneezingAI() {
		sneezeDuration--;

		if (sneezeDuration === 0) {
			map.setMessage("Sneezy recovers from the sneeze.");
			var playerPos = AI.getVisiblePlayerPosition();
			dwarf.setAI(playerPos === null ? createSneezyIdleAI(dwarf, map, params) :
			createSneezyTrackingAI(dwarf, map, params));
		}
	}

	return sneezingAI;
}
