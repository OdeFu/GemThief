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
	var _color;

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
		var entityColor = ROT.Color.fromString(getHighestEntity().getColor());
		var ambientLight = [100, 100, 100];
		var light = ambientLight.slice(0);

		if (_color)
		{
			light = ROT.Color.add(light, _color);
		}

		var finalColor = ROT.Color.multiply(entityColor, light);
		return ROT.Color.toRGB(finalColor);
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

	var addEntity = function (entity)
	{
		_entities[entity.getPriority()] = entity;
	};

	var removeEntity = function (entity)
	{
		_entities[entity.getPriority()] = null;
	};

	var getHighestEntity = function ()
	{
		for (var i = _entities.length - 1; i >= 0; i--)
		{
			if (_entities[i])
			{
				return _entities[i];
			}
		}
		return null;
	};

	var getEntity = function (index)
	{
		return _entities[index];
	};

	var setColor = function (color)
	{
		_color = color;
	};

	var getColor = function ()
	{
		return _color;
	};

	var toPoint = function ()
	{
		return { x: _x, y: _y };
	};

	// Create the actual tile
	var tile = {};
	tile.getX = getX;
	tile.getY = getY;
	tile.isBlocking = isBlocking;
	tile.getChar = getChar;
	tile.getForegroundColor = getForegroundColor;
	tile.getBackgroundColor = getBackgroundColor;
	tile.isSeen = isSeen;
	tile.setSeen = setSeen;
	tile.addEntity = addEntity;
	tile.removeEntity = removeEntity;
	tile.isEmpty = isEmpty;
	tile.getHighestEntity = getHighestEntity;
	tile.getEntity = getEntity;
	tile.setColor = setColor;
	tile.getColor = getColor;
	tile.toPoint = toPoint;

	// Initialize the tile
	tile.addEntity(new FloorEntity(tile.toPoint()));

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
