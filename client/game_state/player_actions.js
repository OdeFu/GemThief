var createMoveAction = function (dirKey)
{
	"use strict";

	var checkGem = function (player)
	{
		"use strict";

		var gem = Game.getState().getMap().getGem(player.getX(), player.getY());
		if (gem)
		{
			Game.getState().getMap().setMessage("You picked up a gem.");
			Game.getState().getPlayerStats().gems += 1;
			Game.getState().getMap().removeGem(gem);
		}
	};

	var moveAction = function ()
	{
		"use strict";

		var player = Game.getState().getMap().getPlayer();
		var dir = ROT.DIRS[8][dirKey];
		var newX = player.getX() + dir[0];
		var newY = player.getY() + dir[1];

		if (Game.getState().getMap().isBlocking(newX, newY))
		{
			/* Cannot move in this direction */
			return;
		}

		Game.getState().getMap().moveEntity(player, newX, newY);

		checkGem(player);

		var prevMoves = Game.getState().getPlayerStats().moves[Game.getState().getMap().getLevel()];
		Game.getState().getPlayerStats().moves[Game.getState().getMap().getLevel()] = prevMoves ? prevMoves + 1 : 1;
	};
	return moveAction;
};

var createClimbStairsAction = function (down)
{
	"use strict";

	var climbStairsAction = function ()
	{
		"use strict";

		var player = Game.getState().getMap().getPlayer();
		var tile = Game.getState().getMap().getTile(player.getX(), player.getY());
		var entity = tile.getEntity(Entity.FLOOR);
		if (entity.getType() === Stairs.type)
		{
			if (entity.isDown() === down)
			{
				var nextLevel = Game.getState().getMap().getLevel() + (down ? 1 : -1);
				Game.moveToLevel(nextLevel);
			}
			else
			{
				Game.getState().getMap().setMessage("You cannot climb " + (down ? "down" : "up") + " these stairs.");
			}
		}
		else
		{
			Game.getState().getMap().setMessage("There are no stairs here.");
		}
	};
	return climbStairsAction;
};

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
