"use strict";

function createMoveAction(dirKey) {
	function moveAction() {
		Meteor.call("playerMove", dirKey);
	}

	return moveAction;
}

function createClimbStairsAction(down) {
	function climbStairsAction() {
		const player = GemThief.Game.state.dungeon.player;
		const tile = GemThief.Game.state.dungeon.map.getTile(player.x, player.y);
		const entity = tile.getEntity(GemThief.Entity.FLOOR);
		if (entity.type === GemThief.Stairs.type) {
			if (entity.down === down) {
				const nextLevel = GemThief.Game.state.dungeon.map.level + (down ? 1 : -1);
				GemThief.Game.moveToLevel(nextLevel);
			}
			else {
				Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "You cannot climb " + (down ? "down" : "up") +
					" these stairs.");
			}
		}
		else {
			Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "There are no stairs here.");
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
