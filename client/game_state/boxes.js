/**
 * Create a new box.
 * @param x coordinate
 * @param y coordinate
 * @param ananas flag indicating if this box contains an ananas
 * @returns {*}
 */
createBox = function (params)
{
	"use strict";

	// Private fields
	var _ananas = params.ananas;

	params.char = "*";
	params.color = "orange";

	// Public methods
	var containsAnanas = function () { return _ananas; };

	var box = createEntity(params);
	box.containsAnanas = containsAnanas;
	return box;
};