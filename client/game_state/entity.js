/**
 * Create a new entity.
 * @param x coordinate, defaults to 0
 * @param y coordinate, defaults to 0
 * @param char the character to draw, defaults to ' '
 * @param color the foreground color for the char
 * @returns {{}}
 */
createEntity = function (x, y, char, color)
{
	"use strict";

	// Private fields
	var _x = x || 0;
	var _y = y || 0;
	var _char = char || ' ';
	var _color = color || "black";

	// Private methods

	// Public methods
	var getX = function () { return _x; };
	var getY = function () { return _y; };
	var setX = function (x) { _x = x; };
	var setY = function (y) { _y = y; };
	var getChar = function () { return _char; };
	var getColor = function () { return _color; };
	var draw = function (display) {	display.draw(_x, _y, _char, _color); };

	var entity = {};
	entity.getX = getX;
	entity.setX = setX;
	entity.setY = setY;
	entity.getY = getY;
	entity.getChar = getChar;
	entity.getColor = getColor;
	entity.draw = draw;
	return entity;
};
