"use strict";

GemThief.Dwarf = {
	/**
	 * Creates a new dwarf.
	 * @param params
	 * - name: The name of the dwarf, must be one from the DWARF_NAMES array, required
	 */
	instantiate: function (params) {
		check(params.name, String);
		check(params.color, String);

		params.char = "P";
		params.priority = GemThief.Entity.ENTITY;

		const dwarf = GemThief.Entity.instantiate(params);
		dwarf.name = params.name;
		return dwarf;
	},

	bind: function (dwarf) {
		dwarf.setAI = setAI.bind(dwarf);
	}
};

// Public methods

function setAI(ai) {
	this.act = ai;
}
