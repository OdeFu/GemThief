"use strict";

class Player extends GemThief.Entity {
	constructor(params) {
		params.priority = GemThief.Entity.ENTITY;
		params.char = "@";
		params.color = "white";

		super(params);
	}
}

GemThief.Player = Player;
