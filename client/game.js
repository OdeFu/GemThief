createGame = function ()
{
	"use strict";

	// Private fields
	var display;
	var map;
	var player;
	var engine;
	var boxes;
	var pedro;

	// Private methods
	var draw = function ()
	{
		"use strict";

		display.clear();

		var visibleTiles = map.calculateVisibleTiles();

		map.draw(display, visibleTiles);

		var visibleEntities = getVisibleEntities(visibleTiles);
		for (var i = 0; i < visibleEntities.length; i++)
		{
			visibleEntities[i].draw(display);
		}

		player.draw(display);
	};

	var getVisibleEntities = function (visibleTiles)
	{
		"use strict";

		var entities = [];
		for (var i = 0; i < boxes.length; i++)
		{
			if (isVisible(boxes[i], visibleTiles))
			{
				entities.push(boxes[i]);
			}
		}

		if (isVisible(pedro, visibleTiles))
		{
			entities.push(pedro);
		}

		return entities;
	};

	var isVisible = function (entity, visibleTiles)
	{
		"use strict";

		for (var i = 0; i < visibleTiles.length; i++)
		{
			if (visibleTiles[i].getX() === entity.getX() && visibleTiles[i].getY() === entity.getY())
			{
				return true;
			}
		}
		return false;
	};

	var generateBoxes = function ()
	{
		"use strict";

		var boxes = [];
		for (var i = 0; i < 10; i++)
		{
			var tile = map.findEmptyTile();
			boxes.push(createBox(tile.getX(), tile.getY(), i === 0));
		}
		return boxes;
	};

	// Public methods
	var init = function ()
	{
		"use strict";

		display = new ROT.Display();
		document.body.appendChild(display.getContainer());

		map = createMap({ width: 80, height: 25, seed: new Date().now });

		var tile = map.findEmptyTile();
		player = createPlayer(tile.getX(), tile.getY());

		tile = map.findEmptyTile();
		pedro = createPedro(tile.getX(), tile.getY());

		boxes = generateBoxes();

		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this, true);
		scheduler.add(player, true);
		scheduler.add(pedro, true);

		engine = new ROT.Engine(scheduler);
		engine.start();
	};

	var getBox = function (x, y)
	{
		"use strict";

		for (var i = 0; i < boxes.length; i++)
		{
			if (boxes[i].getX() === x && boxes[i].getY() === y)
			{
				return boxes[i];
			}
		}
		return null;
	};

	var act = function ()
	{
		"use strict";

		draw();
	};

	var gameOver = function (won)
	{
		"use strict";

		engine.lock();

		if (won)
		{
			alert("Hooray! You found the ananas and won this game.");
		}
		else
		{
			alert("Game Over - you were captured by Pedro!");
		}
	};

	var getPlayer = function () { return player; };
	var getMap = function () { return map; };
	var getDisplay = function () { return display; };
	var getEngine = function () { return engine; };
	var getBoxes = function () { return boxes; };
	var getPedro = function () { return pedro; };

	var game = {};
	game.gameOver = gameOver;
	game.act = act;
	game.getBox = getBox;
	game.init = init;
	game.getPlayer = getPlayer;
	game.getPedro = getPedro;
	game.getMap = getMap;
	game.getDisplay = getDisplay;
	game.getEngine = getEngine;
	game.getBoxes = getBoxes;
	return game;
};



