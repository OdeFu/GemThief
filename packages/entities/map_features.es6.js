"use strict";

GemThief.FloorEntity = {
	instantiate: function (params) {
		params.char = '.';
		params.dungeonChar = true;
		params.priority = GemThief.Entity.FLOOR;
		return GemThief.Entity.instantiate(params);
	}
};

GemThief.Wall = {
	instantiate: function (params) {
		params.char = "#";
		params.color = "#888888";
		params.blocks = true;
		params.dungeonChar = true;
		params.priority = GemThief.Entity.WALL;
		return GemThief.Entity.instantiate(params);
	}
};
