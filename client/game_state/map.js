/**
 * Create a map level.
 *
 * @param options Used options are width, height and seed and those taken by the Digger
 */
createMap = function (options)
{
	"use strict";

	// Private fields
	var _tiles = [];
	var _player;
	var _boxes;
	var _pedro;

	// Private methods
	var dig = function ()
	{
		"use strict";

		var digger = new ROT.Map.Digger(options.width, options.height, options);

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

		_boxes = generateBoxes();

		var tile = findEmptyTile();
		_player = createPlayer(tile.getX(), tile.getY());
		tile.addEntity(_player);

		tile = findEmptyTile();
		_pedro = createPedro(tile.getX(), tile.getY());
		tile.addEntity(_pedro);
	};

	var generateBoxes = function ()
	{
		"use strict";

		var boxes = [];
		for (var i = 0; i < 10; i++)
		{
			var tile = findEmptyTile();
			var box = createBox({ x: tile.getX(), y: tile.getY(), ananas: i % 2 === 0 });
			tile.addEntity(box);
			boxes.push(box);
		}
		return boxes;
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
	var getTiles = function () { return _tiles; };
	var getTile = function (x, y) {	return _tiles[options.height * x + y]; };
	var getPlayer = function () { return _player; };
	var getBoxes = function () { return _boxes; };
	var getPedro = function () { return _pedro; };

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
			display.draw(_tiles[i].getX(), _tiles[i].getY(), _tiles[i].getChar(),
				_tiles[i].getHiddenForegroundColor(), _tiles[i].getBackgroundColor());
		}

		var visibleTiles = calculateVisibleTiles();
		for (i = 0; i < visibleTiles.length; i++)
		{
			display.draw(visibleTiles[i].getX(), visibleTiles[i].getY(), visibleTiles[i].getChar(),
				visibleTiles[i].getForegroundColor(), visibleTiles[i].getBackgroundColor());
		}
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
	map.getBoxes = getBoxes;
	map.getBox = getBox;
	map.moveEntity = moveEntity;

	// Dig the level
	dig();
	createEntities();

	return map;
};
