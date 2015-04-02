"use strict";

GemThief.Stairs = {
	type: "GemThief.Stairs",

	instantiate: function (params) {
		const down = params.value === GemThief.MapFeatures.DOWN;

		params.char = down ? ">" : "<";
		params.color = "brown";
		params.dungeonChar = true;
		params.priority = GemThief.Entity.FLOOR;
		params.type = GemThief.Stairs.type;

		const stairs = GemThief.Entity.instantiate(params);
		stairs.down = down;
		return stairs;
	}
};
