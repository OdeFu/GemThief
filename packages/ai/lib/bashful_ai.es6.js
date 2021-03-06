"use strict";

GemThief.AI.Bashful = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

		function idleAI() {
			if (AI.spottedPlayer()) {
				AI.changeToTrackingAI(createScaredAI);
			}
		}

		return idleAI;
	}
};

function createScaredAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);
	let turnsScared = ROT.RNG.getUniformInt(2, params.scaredAIConfig.maxDuration);

	function scaredAI() {
		if (turnsScared > 0) {
			const pos = dwarf.toPoint();
			const playerPos = dungeon.player.toPoint();
			const dirX = pos.x - playerPos.x >= 0 ? 1 : -1;
			const dirY = pos.y - playerPos.y >= 0 ? 1 : -1;

			if (AI.move({
				x: pos.x + dirX,
				y: pos.y + dirY
			})) {
				Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "Bashful screams in terror as he runs away from you.", 1);
			}
			else {
				Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE,
					"Bashful screams in terror as he tries to run away from you and collides with a wall.", 1);
			}

			turnsScared--;

			if (turnsScared === 0) {
				Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "Bashful collects his courage and turns towards you.", 1);
				dwarf.setAI(createBashfulTrackingAI(dwarf, dungeon, params));
			}
		}

	}

	return scaredAI;
}

function createBashfulTrackingAI(dwarf, dungeon, params) {
	const AI = GemThief.AI.instantiate(dwarf, dungeon, params);

	function lostCallback() {
		dwarf.setAI(GemThief.AI.Bashful.instantiate(dwarf, dungeon, params));
	}

	return AI.getTrackingAI(lostCallback);
}
