createAI = function (dwarf, map, params) {
	"use strict";

	let lastSeenPlayerPosition = map.player.toPoint();
	let turnsSinceLastSeen = 0;

	function catchedPlayer() {
		const playerPos = map.player.toPoint();
		if (playerPos.x === dwarf.x && playerPos.y === dwarf.y) {
			GemThief.Game.state.engine.lock();
			GemThief.Game.gameOver();
			return true;
		}
		return false;
	}

	function getVisiblePlayerPosition(radius) {
		const playerPos = map.player.toPoint();
		const seenTiles = GemThief.Path.getSeenTiles(dwarf.toPoint(), radius);
		return _.find(seenTiles, tile => tile.x === playerPos.x && tile.y === playerPos.y);
	}

	function getShortestPathToStairs() {
		const stairs = map.stairs;
		const paths = _.map(stairs, stair => GemThief.Path.generatePath(dwarf.toPoint(), stair.toPoint())).sort(function sortPaths(p1, p2) {
			return p1.length - p2.length;
		});
		return paths[0];
	}

	function spottedPlayer(radius) {
		radius = radius || params.idleAIConfig.radius;
		return getVisiblePlayerPosition(radius) != null;
	}

	function changeToTrackingAI(ai) {
		map.setMessage(params.idleAIConfig.noticeMessage);
		dwarf.setAI(ai(dwarf, map, params));
	}

	function move(to) {
		const path = GemThief.Path.generatePath(dwarf.toPoint(), to);
		if (path.length > 0) {
			map.moveEntity(dwarf, path[0][0], path[0][1]);
		}
		return path.length > 0;
	}

	function movePath(path) {
		if (path.length > 0) {
			const step = path.splice(0, 1)[0];
			map.moveEntity(dwarf, step[0], step[1]);
		}
	}

	function getTrackingAI(lostCallback, stoppedCallback) {
		function trackingAI() {
			if (params.trackingAIConfig.chanceToStop) {
				const stop = ROT.RNG.getPercentage() < params.trackingAIConfig.chanceToStop;
				if (stop) {
					if (params.trackingAIConfig.stopMessage) {
						map.setMessage(params.trackingAIConfig.stopMessage, 1);
					}

					if (stoppedCallback) {
						stoppedCallback();
					}
					return;
				}
			}

			move(lastSeenPlayerPosition);

			if (catchedPlayer()) {
				return;
			}

			const playerPos = getVisiblePlayerPosition(params.trackingAIConfig.radius);
			lastSeenPlayerPosition = playerPos || lastSeenPlayerPosition;

			if (playerPos === null) {
				turnsSinceLastSeen++;
			}

			if (turnsSinceLastSeen > params.trackingAIConfig.turnsUntilLost && lostCallback) {
				lostCallback();
			}
		}

		return trackingAI;
	}

	const AI = {};
	AI.getShortestPathToStairs = getShortestPathToStairs;
	AI.getVisiblePlayerPosition = getVisiblePlayerPosition;
	AI.catchedPlayer = catchedPlayer;
	AI.spottedPlayer = spottedPlayer;
	AI.changeToTrackingAI = changeToTrackingAI;
	AI.move = move;
	AI.movePath = movePath;
	AI.getTrackingAI = getTrackingAI;
	return AI;
};
