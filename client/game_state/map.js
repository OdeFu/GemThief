/**
 * Create a map level.
 *
 * @param options Used options are width, height and those taken by the Digger
 */
createMap = function (options)
{
	"use strict";

	check(options.width, Number);
	check(options.height, Number);

	// Private fields
	var _tiles = [];
	var _player;
	var _gems;
	var _pedro;
	var _width = options.width;
	var _height = options.height;

	// Private methods
	var dig = function ()
	{
		"use strict";

		var digger = new ROT.Map.Digger(_width, _height, options);

		var digCallback = function (x, y, value)
		{
			var tile = createTile(x, y);
			var wall = value === 1;
			if (wall)
			{
				tile.addEntity(new Wall({ x: x, y: y }));
			}

			_tiles.push(tile);
		};
		digger.create(digCallback.bind(this));
	};

	var createEntities = function ()
	{
		"use strict";

		_gems = generateGems();

		var tile = findEmptyTile();
		_player = createPlayer(tile.getX(), tile.getY());
		tile.addEntity(_player);

		tile = findEmptyTile();
		_pedro = createPedro(tile.getX(), tile.getY());
		tile.addEntity(_pedro);
	};

	var generateGems = function ()
	{
		"use strict";

		var gems = [];
		for (var i = 0; i < 10; i++)
		{
			var tile = findEmptyTile();
			var gem = createGem({ x: tile.getX(), y: tile.getY() });
			tile.addEntity(gem);
			gems.push(gem);
		}
		return gems;
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

	var getPedro = function ()
	{
		return _pedro;
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

	var draw = function (display)
	{
		"use strict";

		for (var i = 0; i < _tiles.length; i++)
		{
			display.draw(_tiles[i].getX(), _tiles[i].getY() + 1, _tiles[i].getDungeonChar(),
				_tiles[i].getHiddenForegroundColor(), _tiles[i].getBackgroundColor());
		}

		var visibleTiles = calculateVisibleTiles();
		for (i = 0; i < visibleTiles.length; i++)
		{
			display.draw(visibleTiles[i].getX(), visibleTiles[i].getY() + 1, visibleTiles[i].getChar(),
				visibleTiles[i].getForegroundColor(), visibleTiles[i].getBackgroundColor());
		}

		Game.drawTextRight(_height + 1, "Gems Found: " + Game.getState().getPlayerStats().gems);
	};

	var findEmptyTile = function ()
	{
		"use strict";

		var empties = getAllEmptyTiles();
		var index = Math.floor(ROT.RNG.getUniform() * empties.length);
		return empties[index];
	};

	var calculateVisibleTiles = function ()
	{
		"use strict";

		var tiles = [];
		var fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(_player.getX(), _player.getY(), 10, function (x, y, r, visibility)
		{
			var tile = getTile(x, y);
			tile.setSeen(true);
			tiles.push(tile);
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

	// Create the actual map object
	var map = {};
	map.getTiles = getTiles;
	map.getTile = getTile;
	map.draw = draw;
	map.isEmpty = isEmpty;
	map.isBlocking = isBlocking;
	map.findEmptyTile = findEmptyTile;
	map.calculateVisibleTiles = calculateVisibleTiles;
	map.getPlayer = getPlayer;
	map.getPedro = getPedro;
	map.getGems = getGems;
	map.getGem = getGem;
	map.removeGem = removeGem;
	map.moveEntity = moveEntity;

	// Dig the level
	dig();
	createEntities();

	return map;
};
