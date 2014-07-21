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
	dig();

	// Public methods
	var getTiles = function () { return _tiles; };
	var getTile = function (x, y) {	return _tiles[options.width * x + y]; };
	var isEmpty = function (x, y) {	return !getTile(x, y).isWall; };

	var draw = function (display)
	{
		"use strict";

		for (var tile in _tiles)
		{
			display.draw(tile.getX(), tile.getY(), tile.getChar(), tile.getForegroundColor(), tile.getBackgroundColor());
		}
	};

	// Create the actual map object
	var map = {};
	map.getTiles = getTiles;
	map.getTile = getTile;
	map.draw = draw;
	map.isEmpty = isEmpty;
	return map;
};
