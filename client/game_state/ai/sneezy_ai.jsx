"use strict";

GemThief.AI.Sneezy = {
	instantiate: function (dwarf, map, params) {
		const AI = GemThief.AI.instantiate(dwarf, map, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createSneezyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createSneezyTrackingAI(dwarf, map, params) {
	const AI = GemThief.AI.instantiate(dwarf, map, params);

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Sneezy.instantiate(dwarf, map, params));
	}

	function stoppedCallback() {
		dwarf.setAI(createSneezingAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback, stoppedCallback);
}

function createSneezingAI(dwarf, map, params) {
	const AI = GemThief.AI.instantiate(dwarf, map, params);
	let sneezeDuration = ROT.RNG.getUniformInt(1, params.sneezingAIConfig.maxDuration);

	function sneezingAI() {
		sneezeDuration--;

		if (sneezeDuration === 0) {
			map.setMessage("Sneezy recovers from the sneeze.");
			const playerPos = AI.getVisiblePlayerPosition();
			dwarf.setAI(playerPos === null ? GemThief.AI.Sneezy.instantiate(dwarf, map, params) :
				createSneezyTrackingAI(dwarf, map, params));
		}
	}

	return sneezingAI;
}
