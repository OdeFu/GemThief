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

	// Private methods
	var dig = function ()
	{
		"use strict";

		var digger = new ROT.Map.Digger(options.width, options.height, options);

		var digCallback = function (x, y, value)
		{
			var wall = value === 1;
			var tile = createTile(x, y, wall);

			_tiles.push(tile);
		};
		digger.create(digCallback.bind(this));
	};

	var getAllEmptyTiles = function ()
	{
		"use strict";

		var empties = [];
		for (var i = 0; i < _tiles.length; i++)
		{
			if (!_tiles[i].isWall())
			{
				empties.push(_tiles[i]);
			}
		}
		return empties;
	};

	// Public methods
	var getTiles = function () { return _tiles; };
	var getTile = function (x, y) {	return _tiles[options.width * x + y]; };
	var isEmpty = function (x, y) {	return !getTile(x, y).isWall; };

	var draw = function (display)
	{
		"use strict";

		for (var i = 0; i < _tiles.length; i++)
		{
			display.draw(_tiles[i].getX(), _tiles[i].getY(), _tiles[i].getChar(), _tiles[i].getForegroundColor(), _tiles[i].getBackgroundColor());
		}
	};

	var findEmptyTile = function ()
	{
		"use strict";

		var empties = getAllEmptyTiles();
		var index = Math.floor(ROT.RNG.getUniform() * empties.length);
		return empties[index];
	};

	// Create the actual map object
	var map = {};
	map.getTiles = getTiles;
	map.getTile = getTile;
	map.draw = draw;
	map.isEmpty = isEmpty;
	map.findEmptyTile = findEmptyTile;

	dig();

	return map;
};
