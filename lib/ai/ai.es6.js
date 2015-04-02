"use strict";

GemThief.AI = {
	instantiate: function (dwarf, dungeon, params) {
		const AI = Object.create(GemThief.AI);
		AI.lastSeenPlayerPosition = dungeon.player.toPoint();
		AI.turnsSinceLastSeen = 0;
		AI.dwarf = dwarf;
		AI.dungeon = dungeon;
		AI.params = params;

		AI.getShortestPathToStairs = getShortestPathToStairs.bind(AI);
		AI.getVisiblePlayerPosition = getVisiblePlayerPosition.bind(AI);
		AI.catchedPlayer = catchedPlayer.bind(AI);
		AI.spottedPlayer = spottedPlayer.bind(AI);
		AI.changeToTrackingAI = changeToTrackingAI.bind(AI);
		AI.move = move.bind(AI);
		AI.movePath = movePath.bind(AI);
		AI.getTrackingAI = getTrackingAI.bind(AI);
		return AI;
	}
};

function catchedPlayer() {
	const playerPos = this.dungeon.player.toPoint();
	if (playerPos.x === this.dwarf.x && playerPos.y === this.dwarf.y) {
		Messenger.broadcast(GemThief.Messages.GAME_OVER, false);
		return true;
	}
	return false;
}

function getVisiblePlayerPosition(radius) {
	const playerPos = this.dungeon.player.toPoint();
	const seenTiles = GemThief.Path.getSeenTiles(this.dungeon.map, this.dwarf.toPoint(), radius);
	return _.find(seenTiles, tile => tile.x === playerPos.x && tile.y === playerPos.y);
}

function getShortestPathToStairs() {
	const stairs = this.dungeon.map.stairs;
	const paths = _.map(stairs, function pathToStairs(stair) {
		GemThief.Path.generatePath(this.dungeon.map, this.dwarf.toPoint(), stair.toPoint())
	}).sort(function sortPaths(p1, p2) {
		return p1.length - p2.length;
	});
	return paths[0];
}

function spottedPlayer(radius) {
	radius = radius || this.params.idleAIConfig.radius;
	return this.getVisiblePlayerPosition(radius) != null;
}

function changeToTrackingAI(ai) {
	Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, this.params.idleAIConfig.noticeMessage);
	this.dwarf.setAI(ai(this.dwarf, this.dungeon, this.params));
}

function move(to) {
	const path = GemThief.Path.generatePath(this.dungeon.map, this.dwarf.toPoint(), to);
	if (path.length > 0) {
		this.dungeon.map.moveEntity(this.dwarf, path[0][0], path[0][1]);
	}
	return path.length > 0;
}

function movePath(path) {
	if (path.length > 0) {
		const step = path.splice(0, 1)[0];
		this.dungeon.map.moveEntity(this.dwarf, step[0], step[1]);
	}
}

function getTrackingAI(lostCallback, stoppedCallback) {
	function trackingAI() {
		if (this.params.trackingAIConfig.chanceToStop) {
			const stop = ROT.RNG.getPercentage() < this.params.trackingAIConfig.chanceToStop;
			if (stop) {
				if (this.params.trackingAIConfig.stopMessage) {
					Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, this.params.trackingAIConfig.stopMessage, 1);
				}

				if (stoppedCallback) {
					stoppedCallback();
				}
				return;
			}
		}

		this.move(this.lastSeenPlayerPosition);

		if (this.catchedPlayer()) {
			return;
		}

		const playerPos = this.getVisiblePlayerPosition(this.params.trackingAIConfig.radius);
		this.lastSeenPlayerPosition = playerPos || this.lastSeenPlayerPosition;

		if (playerPos === null) {
			this.turnsSinceLastSeen++;
		}

		if (this.turnsSinceLastSeen > this.params.trackingAIConfig.turnsUntilLost && lostCallback) {
			lostCallback();
		}
	}

	return trackingAI.bind(this);
}
