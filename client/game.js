createGame = function ()
{
	"use strict";

	// Private fields
	var _display;
	var _map;
	var _player;
	var _engine;
	var _boxes;
	var _pedro;

	// Private methods
	var draw = function ()
	{
		"use strict";

		_display.clear();

		var visibleTiles = _map.calculateVisibleTiles();

		_map.draw(_display, visibleTiles);

		var visibleEntities = getVisibleEntities(visibleTiles);
		for (var i = 0; i < visibleEntities.length; i++)
		{
			visibleEntities[i].draw(_display);
		}

		_player.draw(_display);
	};

	var getVisibleEntities = function (visibleTiles)
	{
		"use strict";

		var entities = [];
		for (var i = 0; i < _boxes.length; i++)
		{
			if (isVisible(_boxes[i], visibleTiles))
			{
				entities.push(_boxes[i]);
			}
		}

		if (isVisible(_pedro, visibleTiles))
		{
			entities.push(_pedro);
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
			var tile = _map.findEmptyTile();
			boxes.push(createBox(tile.getX(), tile.getY(), i === 0));
		}
		return boxes;
	};

	// Public methods
	var init = function ()
	{
		"use strict";

		_display = new ROT.Display();
		document.body.appendChild(_display.getContainer());

		_map = createMap({ width: 80, height: 25, seed: new Date().now });

		var tile = _map.findEmptyTile();
		_player = createPlayer(tile.getX(), tile.getY());

		tile = _map.findEmptyTile();
		_pedro = createPedro(tile.getX(), tile.getY());

		_boxes = generateBoxes();

		var scheduler = new ROT.Scheduler.Simple();
		scheduler.add(this, true);
		scheduler.add(_player, true);
		scheduler.add(_pedro, true);

		_engine = new ROT.Engine(scheduler);
		_engine.start();
	};

	var getBox = function (x, y)
	{
		"use strict";

		for (var i = 0; i < _boxes.length; i++)
		{
			if (_boxes[i].getX() === x && _boxes[i].getY() === y)
			{
				return _boxes[i];
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

		_engine.lock();

		if (won)
		{
			alert("Hooray! You found the ananas and won this game.");
		}
		else
		{
			alert("Game Over - you were captured by Pedro!");
		}
	};

	var getPlayer = function () { return _player; };
	var getMap = function () { return _map; };
	var getDisplay = function () { return _display; };
	var getEngine = function () { return _engine; };
	var getBoxes = function () { return _boxes; };
	var getPedro = function () { return _pedro; };

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



