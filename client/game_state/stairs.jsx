"use strict";

GemThief.Stairs = {
	type: "GemThief.Stairs",

	instantiate: function (params) {
		check(params.down, Boolean);

		params.char = params.down ? ">" : "<";
		params.color = "brown";
		params.dungeonChar = true;
		params.priority = GemThief.Entity.FLOOR;
		params.type = GemThief.Stairs.type;

		const stairs = GemThief.Entity.instantiate(params);
		stairs.down = params.down;
		return stairs;
	}
};
