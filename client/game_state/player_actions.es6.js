"use strict";

function createMoveAction(dirKey) {
	function moveAction() {
		Meteor.call("playerMove", dirKey, function (error, result) {
			if (error) {
				console.log(error.reason);
				return;
			}

			if (result) {
				if (result.gameOver) {
					Messenger.broadcast(GemThief.Messages.GAME_OVER, false);
					return;
				}

				if (!result.blocked) {
					GemThief.Game.state.dungeon.map.moveEntity(GemThief.Game.state.dungeon.player, result.player_x,
						result.player_y);
					GemThief.Game.state.dungeon.map.moveEntity(GemThief.Game.state.dungeon.dwarf, result.dwarf_x,
						result.dwarf_y);

					if (result.gem) {
						Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "You picked up a gem.", 1);
						GemThief.Game.state.dungeon.removeGem({
							x: result.player_x,
							y: result.player_y
						});
					}

					GemThief.Game.state.playerActor.turnOver();
				}
			}
		});
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
