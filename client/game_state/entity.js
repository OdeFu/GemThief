Entity = {
	FLOOR: 0, ITEM: 1, ENTITY: 2, WALL: 3
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
createEntity = function (params) {
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
	function getX() {
		return _x;
	}

	function getY() {
		return _y;
	}

	function setX(x) {
		_x = x;
	}

	function setY(y) {
		_y = y;
	}

	function getChar() {
		return _char;
	}

	function getColor() {
		return _color;
	}

	function getPriority() {
		return _priority;
	}

	function draw(display) {
		display.draw(_x, _y, _char, _color);
	}

	function isBlocking() {
		return _blocks;
	}

	function isDungeonChar() {
		return _dungeonChar;
	}

	function getType() {
		return _type;
	}

	function toPoint() {
		return {x: _x, y: _y};
	}

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
