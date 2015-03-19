Stairs = {
	type: "Stairs",

	instantiate: function (params) {
		"use strict";

		check(params.down, Boolean);

		params.char = params.down ? ">" : "<";
		params.color = "brown";
		params.dungeonChar = true;
		params.priority = Entity.FLOOR;
		params.type = Stairs.type;

		const stairs = Entity.instantiate(params);
		stairs.down = params.down;
		return stairs;
	}
};
