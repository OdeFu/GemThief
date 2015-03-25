"use strict";

GemThief.Entity = {
	/**
	 * Create a new entity.
	 * @param params object containing the parameters:
	 *  - x: the x-coordinate, defaults to 0
	 *  - y: the y-coordinate, defaults to 0
	 *  - char: the character to be draw, defaults to ' '
	 *  - color: the color used when drawing the char, defaults to 'white'
	 *  - blocks: a flag indicating if this entity is passable
	 *  - priority: higher the number, more like it will be drawn, defaults to 0
	 *  - type: The type string for the entity, defaults to "<unknown>"
	 * @returns {{}}
	 */
	instantiate: function (params) {
		const entity = {};
		entity.x = params.x || 0;
		entity.y = params.y || 0;
		entity.char = params.char || ' ';
		entity.color = params.color || "white";
		entity.blocks = params.blocks || false;
		entity.dungeonChar = params.dungeonChar || false;
		entity.priority = params.priority || 0;
		entity.type = params.type || "<unknown>";
		entity.params = params;

		this.bind(entity);

		return entity;
	},

	bind: function (entity) {
		entity.toPoint = toPoint.bind(entity);
	}
};

GemThief.addConstantProperty(GemThief.Entity, "FLOOR", 0);
GemThief.addConstantProperty(GemThief.Entity, "ITEM", 1);
GemThief.addConstantProperty(GemThief.Entity, "ENTITY", 2);
GemThief.addConstantProperty(GemThief.Entity, "WALL", 3);

// Public methods

function toPoint() {
	return { x: this.x, y: this.y };
}
