/**
 * Create a new gem.
 * @returns {*}
 */
createGem = function (params)
{
	"use strict";

	params.char = "*";
	params.color = "orange";
	params.priority = Entity.ITEM;

	return createEntity(params);
};
