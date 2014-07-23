createPlayerEntity = function (x, y)
{
	"use strict";

	// Private methods
	var checkGem = function ()
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
		else
		{
			Game.getState().getMap().setMessage("There is no gem here!");
		}
	};

	// Public methods
	var handleEvent = function (event)
	{
		"use strict";

		// Process user input

		var keyMap = {};
		keyMap[38] = 0;
		keyMap[33] = 1;
		keyMap[39] = 2;
		keyMap[34] = 3;
		keyMap[40] = 4;
		keyMap[35] = 5;
		keyMap[37] = 6;
		keyMap[36] = 7;

		var code = event.keyCode;

		if (code === ROT.VK_RETURN || code === ROT.VK_SPACE)
		{
			checkGem();
			return;
		}

		if (!(code in keyMap))
		{
			return;
		}

		var dir = ROT.DIRS[8][keyMap[code]];
		var newX = player.getX() + dir[0];
		var newY = player.getY() + dir[1];

		if (Game.getState().getMap().isBlocking(newX, newY))
		{
			/* Cannot move in this direction */
			return;
		}

		Game.getState().getMap().moveEntity(player, newX, newY);
		Game.getState().getPlayerStats().moves += 1;

		window.removeEventListener("keydown", player);
		Game.getState().getEngine().unlock();
	};

	var act = function ()
	{
		"use strict";

		Game.getState().getEngine().lock();

		/* Wait for user input, do stuff when the user hits a key */
		window.addEventListener("keydown", player);
	};

	// Create the player actor
	var player = createEntity({ x: x, y: y, char: "@", color: "#ff0" });
	player.handleEvent = handleEvent;
	player.act = act;
	return player;
};
