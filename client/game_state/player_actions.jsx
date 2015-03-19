"use strict";

function createMoveAction(dirKey) {
	function checkGem(player) {
		const gem = GemThief.Game.state.map.getGem(player.x, player.y);
		if (gem) {
			GemThief.Game.state.map.setMessage("You picked up a gem.", 1);
			GemThief.Game.state.playerStats.gems += 1;
			GemThief.Game.state.map.removeGem(gem);
		}
	}

	function moveAction() {
		const player = GemThief.Game.state.map.player;
		const dir = ROT.DIRS[8][dirKey];
		const newX = player.x + dir[0];
		const newY = player.y + dir[1];

		if (GemThief.Game.state.map.isBlocking(newX, newY)) {
			/* Cannot move in this direction */
			return;
		}

		GemThief.Game.state.map.moveEntity(player, newX, newY);

		checkGem(player);

		const prevMoves = GemThief.Game.state.playerStats.moves[GemThief.Game.state.map.level];
		GemThief.Game.state.playerStats.moves[GemThief.Game.state.map.level] = prevMoves ? prevMoves + 1 : 1;
	}

	return moveAction;
}

function createClimbStairsAction(down) {
	function climbStairsAction() {
		const player = GemThief.Game.state.map.player;
		const tile = GemThief.Game.state.map.getTile(player.x, player.y);
		const entity = tile.getEntity(GemThief.Entity.FLOOR);
		if (entity.type === GemThief.Stairs.type) {
			if (entity.down === down) {
				const nextLevel = GemThief.Game.state.map.level + (down ? 1 : -1);
				GemThief.Game.moveToLevel(nextLevel);
			}
			else {
				GemThief.Game.state.map.setMessage("You cannot climb " + (down ? "down" : "up") + " these stairs.");
			}
		}
		else {
			GemThief.Game.state.map.setMessage("There are no stairs here.");
		}
	}

	return climbStairsAction;
}

GemThief.PlayerActions = [];

// Movement
GemThief.PlayerActions[ROT.VK_UP] = createMoveAction(0);
GemThief.PlayerActions[ROT.VK_PAGE_UP] = createMoveAction(1);
GemThief.PlayerActions[ROT.VK_RIGHT] = createMoveAction(2);
GemThief.PlayerActions[ROT.VK_PAGE_DOWN] = createMoveAction(3);
GemThief.PlayerActions[ROT.VK_DOWN] = createMoveAction(4);
GemThief.PlayerActions[ROT.VK_END] = createMoveAction(5);
GemThief.PlayerActions[ROT.VK_LEFT] = createMoveAction(6);
GemThief.PlayerActions[ROT.VK_HOME] = createMoveAction(7);

// GemThief.Stairs
GemThief.PlayerActions[ROT.VK_LESS_THAN] = createClimbStairsAction(false);
GemThief.PlayerActions[ROT.VK_GREATER_THAN] = createClimbStairsAction(true);
