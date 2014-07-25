/**
 * Create a map level.
 *
 * @param options
 *  - width: the width of the map, required
 *  - height: the height of the map, required
 *  - level: the level depth of the map, defaults to 1
 *  - numGems: the number of gems to be generated, defaults to 10
 */
createMap = function (options)
{
	"use strict";

	check(options.width, Number);
	check(options.height, Number);

	// Private fields
	var _tiles = [];
	var _player;
	var _gems = [];
	var _dwarves = [];
	var _stairs = [];
	var _width = options.width;
	var _height = options.height;
	var _message = "";
	var _messageLife;
	var _level = options.level || 1;
	var _numGems = options.numGems || 10;
	var _lightLocations = [];

	// Private methods
	var dig = function ()
	{
		"use strict";

		var digger = new ROT.Map.Digger(_width, _height, options);

		var digCallback = function (x, y, value)
		{
			var tile = createTile({ x: x, y: y });
			var wall = value === 1;
			if (wall)
			{
				tile.addEntity(new Wall({ x: x, y: y }));
			}

			_tiles.push(tile);
		};
		digger.create(digCallback.bind(this));
	};

	var generateLightingData = function ()
	{
		"use strict";

		var fov = new ROT.FOV.PreciseShadowcasting(lightPass, { topology: 4 });

		var reflectivityCallback = function (x, y)
		{
			var tile = getTile(x, y);
			return tile.isEmpty() ? 0.3 : 0;
		};

		var lighting = new ROT.Lighting(reflectivityCallback, { range: 12, passes: 2 });
		lighting.setFOV(fov);

		var lightColor = [200, 200, 0];

		initializeLightLocations();
		for (var i = 0; i < _lightLocations.length; i++)
		{
			lighting.setLight(_lightLocations[i].getX(), _lightLocations[i].getY(), lightColor);
		}

		var lightingCallback = function (x, y, color)
		{
			var tile = getTile(x, y);
			tile.setColor(color);
		};
		lighting.compute(lightingCallback);
	};

	var initializeLightLocations = function ()
	{
		"use strict";

		for (var i = 0; i < 5; i++)
		{
			_lightLocations.push(findEmptyTile());
		}
	};

	var createEntities = function ()
	{
		"use strict";

		createGems();

		createPlayer();

		createDwarves();

		createStairs();
	};

	var createPlayer = function ()
	{
		"use strict";

		var tile = findEmptyTile();
		_player = new Player(tile.toPoint());
		tile.addEntity(_player);
	};

	var createDwarves = function ()
	{
		"use strict";

		// Copy the array
		var dwarves = Game.getState().getConfig().dwarves.slice(0);
		dwarves.sort(function (dwarf1, dwarf2)
		{
			return dwarf2.weight - dwarf1.weight;
		});

		var num = _level < dwarves.length ? _level : dwarves.length;
		for (var i = 0; i < num; i++)
		{
			var index = getNextDwarfIndex(dwarves);
			var data = dwarves.splice(index, 1)[0];
			createDwarf(data);
		}
	};

	var getNextDwarfIndex = function (dwarves)
	{
		"use strict";

		if (dwarves.length === 1)
		{
			return 0;
		}

		for (var i = 0; i < dwarves.length; i++)
		{
			var selected = ROT.RNG.getPercentage() < dwarves[i].weight;
			if (selected)
			{
				return i;
			}
		}
		return -1;
	};

	var createDwarf = function (data)
	{
		"use strict";

		var tile = DWARF_START_LOCATIONS[data.startLocation](map);
		data.x = tile.getX();
		data.y = tile.getY();
		var dwarf = new Dwarf(data);
		dwarf.setAI(DWARF_AIS[data.idleAI](dwarf, map, data));
		tile.addEntity(dwarf);
		_dwarves.push(dwarf);

		console.log("Created dwarf: " + dwarf.getName());
	};

	var createGems = function ()
	{
		"use strict";

		for (var i = 0; i < _numGems; i++)
		{
			var tile = findEmptyTile();
			var gem = createGem(tile.toPoint());
			tile.addEntity(gem);
			_gems.push(gem);
		}
	};

	var createStairs = function ()
	{
		"use strict";

		// always create stairs going up where the player is
		var tile = getTile(_player.getX(), _player.getY());
		_stairs[0] = new Stairs({ x: _player.getX(), y: _player.getY(), down: false });
		tile.addEntity(_stairs[0]);

		var downTile = findEmptyTile();
		_stairs[1] = new Stairs({ x: downTile.getX(), y: downTile.getY(), down: true });
		downTile.addEntity(_stairs[1]);
	};

	var getAllEmptyTiles = function ()
	{
		"use strict";

		var empties = [];
		for (var i = 0; i < _tiles.length; i++)
		{
			if (_tiles[i].isEmpty())
			{
				empties.push(_tiles[i]);
			}
		}
		return empties;
	};

	var lightPass = function (x, y)
	{
		return !isBlocking(x, y);
	};

	// Public methods
	var getTiles = function ()
	{
		return _tiles;
	};

	var getSomeTiles = function (func)
	{
		"use strict";

		var selectedTiles = [];

		for (var i = 0; i < _tiles.length; i++)
		{
			if (func(_tiles[i]))
			{
				selectedTiles.push(_tiles[i]);
			}
		}
		return selectedTiles;
	};

	var getTile = function (x, y)
	{
		return _tiles[options.height * x + y];
	};

	var getPlayer = function ()
	{
		return _player;
	};

	var getGems = function ()
	{
		return _gems;
	};

	var getDwarves = function ()
	{
		return _dwarves;
	};

	var isEmpty = function (x, y)
	{
		"use strict";

		var tile = getTile(x, y);
		return tile && tile.isEmpty();
	};

	var isBlocking = function (x, y)
	{
		"use strict";

		var tile = getTile(x, y);
		return tile && tile.isBlocking();
	};

	var setMessage = function (msg, messageLife)
	{
		_message = msg;
		_messageLife = messageLife || 3;
	};

	var draw = function (display)
	{
		"use strict";

		if (_message)
		{
			display.drawText(0, 0, _message);
			_messageLife--;
			if (_messageLife === 0)
			{
				_message = null;
			}
		}

		var visibleTiles = calculateVisibleTiles();
		for (var i = 0; i < visibleTiles.length; i++)
		{
			display.draw(visibleTiles[i].getX(), visibleTiles[i].getY() + 1, visibleTiles[i].getChar(),
				visibleTiles[i].getForegroundColor(), visibleTiles[i].getBackgroundColor());
		}

		display.drawText(0, _height + 1, "Mine Level: " + _level);
		Game.drawTextRight(_height + 1, "Gems Found: " + Game.getState().getPlayerStats().gems);
	};

	var findEmptyTile = function ()
	{
		"use strict";

		var empties = getAllEmptyTiles();
		return empties.random();
	};

	var calculateVisibleTiles = function ()
	{
		"use strict";

		var tiles = [];
		var fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(_player.getX(), _player.getY(), 2, function (x, y, r, visibility)
		{
			var tile = getTile(x, y);
			tile.setSeen(true);
			tiles.push(tile);
		});

		// Do another pass for tiles that have light
		fov.compute(_player.getX(), _player.getY(), 20, function (x, y, r, visibility)
		{
			var tile = getTile(x, y);
			if (tile.getColor())
			{
				tile.setSeen(true);
				tiles.push(tile);
			}
		});

		return tiles;
	};

	var getGem = function (x, y)
	{
		"use strict";

		for (var i = 0; i < _gems.length; i++)
		{
			if (_gems[i].getX() === x && _gems[i].getY() === y)
			{
				return _gems[i];
			}
		}
		return null;
	};

	var removeGem = function (gem)
	{
		"use strict";

		var index = _gems.indexOf(gem);
		if (index >= 0)
		{
			_gems.splice(index, 1);
			var tile = getTile(gem.getX(), gem.getY());
			tile.removeEntity(gem);
		}
	};

	var moveEntity = function (entity, newX, newY)
	{
		"use strict";

		var oldTile = getTile(entity.getX(), entity.getY());
		oldTile.removeEntity(entity);

		var newTile = getTile(newX, newY);
		newTile.addEntity(entity);

		entity.setX(newX);
		entity.setY(newY);
	};

	var getLevel = function ()
	{
		return _level;
	};

	var getStairs = function ()
	{
		return _stairs;
	};

	var getLightLocations = function ()
	{
		return _lightLocations;
	};

	// Create the actual map object
	var map = {};
	map.getTiles = getTiles;
	map.getSomeTiles = getSomeTiles;
	map.getTile = getTile;
	map.draw = draw;
	map.isEmpty = isEmpty;
	map.isBlocking = isBlocking;
	map.findEmptyTile = findEmptyTile;
	map.calculateVisibleTiles = calculateVisibleTiles;
	map.getPlayer = getPlayer;
	map.getGems = getGems;
	map.getGem = getGem;
	map.removeGem = removeGem;
	map.getDwarves = getDwarves;
	map.moveEntity = moveEntity;
	map.setMessage = setMessage;
	map.getLevel = getLevel;
	map.getStairs = getStairs;
	map.getLightLocations = getLightLocations;

	// Dig the level
	dig();
	generateLightingData();
	createEntities();

	return map;
};
