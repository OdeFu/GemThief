/**
 * Creates a new tile.
 *
 * @param x x-coordinate of the tile
 * @param y y-coordinate of the tile
 * @param wall boolean marking is this tile a wall or not
 * @returns {{}} a new tile object
 */
createTile = function (x, y, wall)
{
	"use strict";

	// Private fields
	var _x = x;
	var _y = y;
	var _wall = wall;
	var _seen = false; // Initially unseen

	// Public methods
	var getX = function () { return _x; };
	var getY = function () { return _y; };
	var isWall = function () { return _wall; };
	var getForegroundColor = function () { return _wall ? "#888888" : "#ffffff"; };
	var getHiddenForegroundColor = function () { return "#606060"; };
	var getBackgroundColor = function () { return "black"; };
	var isSeen = function () { return _seen; };
	var setSeen = function (seen) { _seen = seen; };

	var getChar = function ()
	{
		if (_seen)
		{
			return _wall ? "#" : ".";
		}
		return " ";
	};

	// Create the actual tile
	var tile = {};
	tile.getX = getX;
	tile.getY = getY;
	tile.isWall = isWall;
	tile.getChar = getChar;
	tile.getForegroundColor = getForegroundColor;
	tile.getHiddenForegroundColor = getHiddenForegroundColor;
	tile.getBackgroundColor = getBackgroundColor;
	tile.isSeen = isSeen;
	tile.setSeen = setSeen;
	return tile;
};