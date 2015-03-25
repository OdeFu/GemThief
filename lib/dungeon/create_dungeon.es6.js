"use strict";

Meteor.methods({
	createDungeon: function (params) {
		check(params.seed, Number);
		check(params.config, Object);
		check(params.level, Number);

		ROT.RNG.setSeed(params.seed);

		const map = GemThief.Map.instantiate(params);
		const dungeon = GemThief.Dungeon.instantiate(map, params);

		return dungeon;
	}
});
