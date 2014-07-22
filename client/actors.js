
createPlayer = function (x, y)
{
	"use strict";

	// Create the player actor
	var player = createEntity(x, y, "@", "#ff0");

	// Private methods
	var checkBox = function ()
	{
		"use strict";

		var box = Game.getBox(player.getX(), player.getY());
		if (!box)
		{
			alert("There is no box here!");
		}
		else if (box.containsAnanas())
		{
			Game.gameOver(true);
			window.removeEventListener("keydown", this);
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

		if (code === 13 || code === 32)
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

		if (!Game.getMap().isEmpty(newX, newY))
		{
			/* Cannot move in this direction */
			return;
		}

		player.setX(newX);
		player.setY(newY);

		window.removeEventListener("keydown", player);
		Game.getEngine().unlock();
	};

	var act = function ()
	{
		"use strict";

		Game.getEngine().lock();

		/* Wait for user input, do stuff when the user hits a key */
		window.addEventListener("keydown", player);
	};

	player.handleEvent = handleEvent;
	player.act = act;
	return player;
};

createPedro = function (x, y)
{
	"use strict";

	// Create the Pedro actor
	var pedro = createEntity(x, y, "P", "red");

	// Public methods
	var act = function ()
	{
		var x = Game.getPlayer().getX();
		var y = Game.getPlayer().getY();

		var passableCallback = function (x, y)
		{
			return Game.getMap().isEmpty(x, y);
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

		if (path.length <= 1)
		{
			Game.gameOver(false);
		}
		else
		{
			pedro.setX(path[0][0]);
			pedro.setY(path[0][1]);
		}
	};

	pedro.act = act;
	return pedro;
};
