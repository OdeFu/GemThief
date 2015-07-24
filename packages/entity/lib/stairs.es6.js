"use strict";

class Stairs extends GemThief.Entity {
	type = "GemThief.Stairs";

	constructor(params) {
		const down = params.value === GemThief.MapFeatures.DOWN;

		params.char = down ? ">" : "<";
		params.color = "brown";
		params.dungeonChar = true;
		params.priority = GemThief.Entity.FLOOR;
		params.type = GemThief.Stairs.type;

		super(params);

		this.down = down;
	}
}

GemThief.Stairs = Stairs;
