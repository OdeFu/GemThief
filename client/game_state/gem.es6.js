"use strict";

GemThief.Gem = {
	/**
	 * Create a new gem.
	 * @returns {GemThief.Gem}
	 */
	instantiate: function (params) {
		params.char = "*";
		params.color = "orange";
		params.priority = GemThief.Entity.ITEM;

		return GemThief.Entity.instantiate(params);
	}
};
