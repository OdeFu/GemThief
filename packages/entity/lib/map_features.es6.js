"use strict";

class FloorEntity extends GemThief.Entity {
	constructor(params) {
		params.char = '.';
		params.dungeonChar = true;
		params.priority = GemThief.Entity.FLOOR;

		super(params);
	}
}

GemThief.FloorEntity = FloorEntity;

class Wall extends GemThief.Entity {
	constructor(params) {
		params.char = "#";
		params.color = "#888888";
		params.blocks = true;
		params.dungeonChar = true;
		params.priority = GemThief.Entity.WALL;

		super(params);
	}
}

GemThief.Wall = Wall;
