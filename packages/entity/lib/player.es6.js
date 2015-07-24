"use strict";

GemThief.Player = {
	instantiate: function (params) {
		params.priority = GemThief.Entity.ENTITY;
		params.char = "@";
		params.color = "white";

		return GemThief.Entity.instantiate(params);
	}
};
