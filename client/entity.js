createEntity = function (x, y, char, color)
{
	"use strict";

	// Private fields
	var _x = x;
	var _y = y;
	var _char = char;
	var _color = color;

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
