/**
 * Creates a new tile.
 *
 * @param params
 * - x: the x-coordinate, defaults to 0
 * - y: the y-coordinate, defaults to 0
 * @returns {{}} a new tile object
 */
createTile = function (params)
{
	"use strict";

	// Private fields
	var _x = params.x || 0;
	var _y = params.y || 0;
	var _seen = false; // Initially unseen
	var _entities = [];

	// Private methods
	var getHighestEntity = function ()
	{
		"use strict";

		for (var i = _entities.length - 1; i >= 0; i--)
		{
			if (_entities[i])
			{
				return _entities[i];
			}
		}
		return null;
	};

	// Public methods
	var getX = function ()
	{
		return _x;
	};

	var getY = function ()
	{
		return _y;
	};

	var isEmpty = function ()
	{
		return _entities.length === 1;
	};

	var isBlocking = function ()
	{
		return getHighestEntity().isBlocking();
	};

	var getForegroundColor = function ()
	{
		return getHighestEntity().getColor();
	};

	var getHiddenForegroundColor = function ()
	{
		return "#606060";
	};

	var getBackgroundColor = function ()
	{
		return "black";
	};

	var isSeen = function ()
	{
		return _seen;
	};

	var setSeen = function (seen)
	{
		_seen = seen;
	};

	var getChar = function ()
	{
		return _seen ? getHighestEntity().getChar() : " ";
	};

	var getDungeonChar = function ()
	{
		if (_seen)
		{
			for (var i = _entities.length - 1; i >= 0; i--)
			{
				if (_entities[i] && _entities[i].isDungeonChar())
				{
					return _entities[i].getChar();
				}
			}
		}
		return " ";
	};

	var addEntity = function (entity)
	{
		_entities[entity.getPriority()] = entity;
	};

	var removeEntity = function (entity)
	{
		_entities[entity.getPriority()] = null;
	};

	// Create the actual tile
	var tile = {};
	tile.getX = getX;
	tile.getY = getY;
	tile.isBlocking = isBlocking;
	tile.getChar = getChar;
	tile.getForegroundColor = getForegroundColor;
	tile.getHiddenForegroundColor = getHiddenForegroundColor;
	tile.getBackgroundColor = getBackgroundColor;
	tile.isSeen = isSeen;
	tile.setSeen = setSeen;
	tile.addEntity = addEntity;
	tile.removeEntity = removeEntity;
	tile.isEmpty = isEmpty;
	tile.getDungeonChar = getDungeonChar;


	tile.addEntity(new FloorEntity({ x: _x, y: _y }));

	return tile;
};

FloorEntity = function (params)
{
	return createFloorEntity(params);
};

var createFloorEntity = function (params)
{
	"use strict";

	params.char = '.';
	params.dungeonChar = true;
	params.priority = Entity.FLOOR;
	return createEntity(params);
};

Wall = function (params)
{
	return createWall(params);
};

var createWall = function (params)
{
	"use strict";

	params.char = "#";
	params.color = "#888888";
	params.blocks = true;
	params.dungeonChar = true;
	params.priority = Entity.WALL;
	return createEntity(params);
};
