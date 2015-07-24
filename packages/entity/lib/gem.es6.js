"use strict";

class Gem extends GemThief.Entity {
	/**
	 * Create a new gem.
	 */
	constructor(params) {
		params.char = "*";
		params.color = "orange";
		params.priority = GemThief.Entity.ITEM;

		super(params);
	}
}

GemThief.Gem = Gem;
