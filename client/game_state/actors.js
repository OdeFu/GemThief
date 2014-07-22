
createPlayer = function (x, y)
{
	"use strict";

	// Private methods
	var checkBox = function ()
	{
		"use strict";

		var box = Game.getState().getMap().getBox(player.getX(), player.getY());
		if (!box)
		{
			alert("There is no box here!");
		}
		else if (box.containsAnanas())
		{
			window.removeEventListener("keydown", player);
			Game.getState().getPlayerStats().ananas += 1;
			Game.getState().getEngine().unlock();
		}
		else
		{
			alert("This box is empty.");
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
			checkBox();
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

createPedro = function (x, y)
{
	"use strict";

	// Public methods
	var act = function ()
	{
		var x = Game.getState().getMap().getPlayer().getX();
		var y = Game.getState().getMap().getPlayer().getY();

		var passableCallback = function (x, y)
		{
			return !Game.getState().getMap().isBlocking(x, y);
		};

		var astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
		var path = [];
		var pathCallback = function (x, y)
		{
			path.push([x, y]);
		};

		astar.compute(pedro.getX(), pedro.getY(), pathCallback);

		/* Remove Pedro's position */
		path.shift();

		Game.getState().getPlayerStats().distance = path.length;

    if (path.length > 0)
    {
      Game.getState().getMap().moveEntity(pedro, path[0][0], path[0][1]);
    }

		if (path.length <= 1)
		{
      Game.getState().getEngine().lock();
			Game.gameOver(false);
		}
	};

	// Create the Pedro actor
	var pedro = createEntity({ x: x, y: y, char: "P", color: "red" });
	pedro.act = act;
	return pedro;
};
