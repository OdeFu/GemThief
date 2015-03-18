createAI = function (dwarf, map, params) {
	"use strict";

	var lastSeenPlayerPosition = map.getPlayer().toPoint();
	var turnsSinceLastSeen = 0;

	function catchedPlayer() {
		var playerPos = map.getPlayer().toPoint();
		if (playerPos.x === dwarf.getX() && playerPos.y === dwarf.getY()) {
			Game.state.engine.lock();
			Game.gameOver();
			return true;
		}
		return false;
	}

	function getVisiblePlayerPosition(radius) {
		var spottedPlayer = false;
		var playerPos = map.getPlayer().toPoint();
		Path.runFOV(dwarf.toPoint(), radius, function fovCallback(x, y) {
			if (playerPos.x === x && playerPos.y === y) {
				spottedPlayer = true;
			}
		});
		return spottedPlayer ? playerPos : null;
	}

	function getShortestPathToStairs() {
		var shortestPath = [dwarf.getX(), dwarf.getY()];
		var closestDistance = Number.MAX_VALUE;
		var stairs = map.getStairs();
		for (var i = 0; i < stairs.length; i++) {
			var path = Path.generatePath(dwarf.toPoint(), stairs[i].toPoint());
			if (path.length < closestDistance) {
				shortestPath = path;
				closestDistance = path.length;
			}
		}
		return shortestPath;
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
		var path = Path.generatePath(dwarf.toPoint(), to);
		if (path.length > 0) {
			map.moveEntity(dwarf, path[0][0], path[0][1]);
		}
		return path.length > 0;
	}

	function movePath(path) {
		if (path.length > 0) {
			var step = path.splice(0, 1)[0];
			map.moveEntity(dwarf, step[0], step[1]);
		}
	}

	function getTrackingAI(lostCallback, stoppedCallback) {
		function trackingAI() {
			if (params.trackingAIConfig.chanceToStop) {
				var stop = ROT.RNG.getPercentage() < params.trackingAIConfig.chanceToStop;
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

			var playerPos = getVisiblePlayerPosition(params.trackingAIConfig.radius);
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

	var AI = {};
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
