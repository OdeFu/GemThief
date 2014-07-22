/**
 * Create a new box.
 * @param x coordinate
 * @param y coordinate
 * @param ananas flag indicating if this box contains an ananas
 * @returns {*}
 */
createBox = function (x, y, ananas)
{
	"use strict";

	// Private fields
	var _ananas = ananas;

	// Public methods
	var containsAnanas = function () { return _ananas; };

	var box = createEntity(x, y, "*", "orange");
	box.containsAnanas = containsAnanas;
	return box;
};