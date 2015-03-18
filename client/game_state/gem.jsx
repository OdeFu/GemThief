/**
 * Create a new gem.
 * @returns {*}
 */
Gem = {
	instantiate: function (params) {
		"use strict";

		params.char = "*";
		params.color = "orange";
		params.priority = Entity.ITEM;

		return Entity.instantiate(params);
	}
};
