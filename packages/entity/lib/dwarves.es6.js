"use strict";

class Dwarf extends GemThief.Entity {
	/**
	 * Creates a new dwarf.
	 * @param params
	 * - name: The name of the dwarf, must be one from the DWARF_NAMES array, required
	 */
	constructor(params) {
		check(params.name, String);
		check(params.color, String);

		params.char = "D";
		params.priority = GemThief.Entity.ENTITY;

		super(params);

		this.name = params.name;
	}

	setAI(ai) {
		this.act = ai;
	}
}

GemThief.Dwarf = Dwarf;
