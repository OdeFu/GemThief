"use strict";

GemThief.AI.Sneezy = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createSneezyTrackingAI);
			}
		}

		return idleAI;
	}
};

function createSneezyTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Sneezy.instantiate(dwarf, dungeon, params));
	}

	function stoppedCallback() {
		dwarf.setAI(createSneezingAI(dwarf, dungeon, params));
	}

	return AI.getTrackingAI(lostCallback, stoppedCallback);
}

function createSneezingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);
	let sneezeDuration = ROT.RNG.getUniformInt(1, params.sneezingAIConfig.maxDuration);

	function sneezingAI() {
		sneezeDuration--;

		if (sneezeDuration === 0) {
			GemThief.Game.state.mapDisplay.setMessage("Sneezy recovers from the sneeze.");
			const playerPos = AI.getVisiblePlayerPosition();
			dwarf.setAI(playerPos === null ? GemThief.AI.Sneezy.instantiate(dwarf, dungeon, params) :
				createSneezyTrackingAI(dwarf, dungeon, params));
		}
	}

	return sneezingAI;
}
