"use strict";

class Entity {
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
	 */
	constructor(params) {
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.char = params.char || ' ';
		this.color = params.color || "white";
		this.blocks = params.blocks || false;
		this.dungeonChar = params.dungeonChar || false;
		this.priority = params.priority || 0;
		this.type = params.type || "<unknown>";
		this.params = params;
	}

	toPoint() {
		return { x: this.x, y: this.y };
	}
}

GemThief.Entity = Entity;

GemThief.addConstantProperty(GemThief.Entity, "FLOOR", 0);
GemThief.addConstantProperty(GemThief.Entity, "ITEM", 1);
GemThief.addConstantProperty(GemThief.Entity, "ENTITY", 2);
GemThief.addConstantProperty(GemThief.Entity, "WALL", 3);
