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

	// Public methods
	var getX = function () { return _x; };
	var getY = function () { return _y; };
	var isWall = function () { return _wall; };
	var getChar = function () { return _wall ? "#" : "."; };
	var getForegroundColor = function () { return _wall ? "gray" : "white"; };
	var getBackgroundColor = function () { return "black"; };

	// Create the actual tile
	var tile = {};
	tile.getX = getX;
	tile.getY = getY;
	tile.isWall = isWall;
	tile.getChar = getChar;
	tile.getForegroundColor = getForegroundColor;
	tile.getBackgroundColor = getBackgroundColor;
	return tile;
};