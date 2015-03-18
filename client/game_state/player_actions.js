function createMoveAction(dirKey) {
	"use strict";

	function checkGem(player) {
		var gem = Game.state.map.getGem(player.getX(), player.getY());
		if (gem) {
			Game.state.map.setMessage("You picked up a gem.", 1);
			Game.state.playerStats.gems += 1;
			Game.state.map.removeGem(gem);
		}
	}

	function moveAction() {
		var player = Game.state.map.getPlayer();
		var dir = ROT.DIRS[8][dirKey];
		var newX = player.getX() + dir[0];
		var newY = player.getY() + dir[1];

		if (Game.state.map.isBlocking(newX, newY)) {
			/* Cannot move in this direction */
			return;
		}

		Game.state.map.moveEntity(player, newX, newY);

		checkGem(player);

		var prevMoves = Game.state.playerStats.moves[Game.state.map.getLevel()];
		Game.state.playerStats.moves[Game.state.map.getLevel()] = prevMoves ? prevMoves + 1 : 1;
	}

	return moveAction;
}

function createClimbStairsAction(down) {
	"use strict";

	function climbStairsAction() {
		var player = Game.state.map.getPlayer();
		var tile = Game.state.map.getTile(player.getX(), player.getY());
		var entity = tile.getEntity(Entity.FLOOR);
		if (entity.getType() === Stairs.type) {
			if (entity.isDown() === down) {
				var nextLevel = Game.state.map.getLevel() + (down ? 1 : -1);
				Game.moveToLevel(nextLevel);
			}
			else {
				Game.state.map.setMessage("You cannot climb " + (down ? "down" : "up") + " these stairs.");
			}
		}
		else {
			Game.state.map.setMessage("There are no stairs here.");
		}
	}

	return climbStairsAction;
}

PlayerActions = [];

// Movement
PlayerActions[ROT.VK_UP] = createMoveAction(0);
PlayerActions[ROT.VK_PAGE_UP] = createMoveAction(1);
PlayerActions[ROT.VK_RIGHT] = createMoveAction(2);
PlayerActions[ROT.VK_PAGE_DOWN] = createMoveAction(3);
PlayerActions[ROT.VK_DOWN] = createMoveAction(4);
PlayerActions[ROT.VK_END] = createMoveAction(5);
PlayerActions[ROT.VK_LEFT] = createMoveAction(6);
PlayerActions[ROT.VK_HOME] = createMoveAction(7);

// Stairs
PlayerActions[ROT.VK_LESS_THAN] = createClimbStairsAction(false);
PlayerActions[ROT.VK_GREATER_THAN] = createClimbStairsAction(true);
