Entity =
{
	FLOOR: 0,
	ITEM: 1,
	ENTITY: 2,
	WALL: 3
};

/**
 * Create a new entity.
 * @param params object containing the parameters:
 *  - x: the x-coordinate, defaults to 0
 *  - y: the y-coordinate, defaults to 0
 *  - char: the character to be draw, defaults to ' '
 *  - color: the color used when drawing the char, defaults to 'white'
 *  - blocks: a flag indicating if this entity is passable
 *  - priority: higher the number, more like it will be drawn, defaults to 0
 *  - type: The type string for the entity, defaults to "<unknown>"
 * @returns {{}}
 */
createEntity = function (params)
{
	"use strict";

	// Private fields
	var _x = params.x || 0;
	var _y = params.y || 0;
	var _char = params.char || ' ';
	var _color = params.color || "white";
	var _blocks = params.blocks || false;
	var _dungeonChar = params.dungeonChar || false;
	var _priority = params.priority || 0;
	var _type = params.type || "<unknown>";

	// Public methods
	var getX = function ()
	{
		return _x;
	};

	var getY = function ()
	{
		return _y;
	};

	var setX = function (x)
	{
		_x = x;
	};

	var setY = function (y)
	{
		_y = y;
	};

	var getChar = function ()
	{
		return _char;
	};

	var getColor = function ()
	{
		return _color;
	};

	var getPriority = function ()
	{
		return _priority;
	}

	var draw = function (display)
	{
		display.draw(_x, _y, _char, _color);
	};

	var isBlocking = function ()
	{
		return _blocks;
	};

	var isDungeonChar = function ()
	{
		return _dungeonChar;
	};

	var getType = function ()
	{
		return _type;
	};

	var toPoint = function ()
	{
		return { x: _x, y: _y };
	};

	var entity = {};
	entity.getX = getX;
	entity.setX = setX;
	entity.setY = setY;
	entity.getY = getY;
	entity.getChar = getChar;
	entity.getColor = getColor;
	entity.draw = draw;
	entity.isBlocking = isBlocking;
	entity.isDungeonChar = isDungeonChar;
	entity.getPriority = getPriority;
	entity.getType = getType;
	entity.toPoint = toPoint;
	return entity;
};
