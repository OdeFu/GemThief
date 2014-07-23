var createMoveAction = function (dirKey)
{
	"use strict";

	var checkGem = function (player)
	{
		"use strict";

		var gem = Game.getState().getMap().getGem(player.getX(), player.getY());
		if (gem)
		{
			window.removeEventListener("keydown", player);
			Game.getState().getMap().setMessage("You picked up a gem.");
			Game.getState().getPlayerStats().gems += 1;
			Game.getState().getMap().removeGem(gem);
			Game.getState().getEngine().unlock();
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

PlayerActions = [];
PlayerActions[38] = createMoveAction(0);
PlayerActions[33] = createMoveAction(1);
PlayerActions[39] = createMoveAction(2);
PlayerActions[34] = createMoveAction(3);
PlayerActions[40] = createMoveAction(4);
PlayerActions[35] = createMoveAction(5);
PlayerActions[37] = createMoveAction(6);
PlayerActions[36] = createMoveAction(7);
