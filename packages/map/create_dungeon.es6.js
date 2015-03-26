"use strict";

GemThief.DungeonData = new Mongo.Collection("dungeon");

Meteor.methods({
	createDungeon: function (params) {
		check(params, {
			seed: Number,
			config: Object,
			level: Number,
			numGems: Number,
			width: Number,
			height: Number,
			numLightLocations: Number
		});

		if (this.userId) {
			ROT.RNG.setSeed(params.seed);

			const mapData = GemThief.Digger.dig(params);

			_createPlayer(mapData);
			_createDwarf(mapData, params);
			_createGems(mapData, params.numGems);

			GemThief.DungeonData.upsert({ userId: this.userId }, { data: mapData, userId: this.userId });
		}
	}
});


function _createPlayer(mapData) {
	const stairs = _findStairsUp(mapData);
	stairs.value = GemThief.Digger.PLAYER;
}

function _createGems(mapData, numGems) {
	_.times(numGems, function createGem() {
		const tile = GemThief.Digger.findEmptyTile(mapData);
		tile.value = GemThief.Digger.GEM;
	});
}

function _createDwarf(mapData, params) {
	const dwarves = params.config.dwarves.slice(0);
	dwarves.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	const data = dwarves[params.level - 1];

	const tile = GemThief.DWARF_START_LOCATIONS[data.startLocation](mapData);
	tile.value = GemThief.Digger.DWARF;
}

function _findStairsUp(mapData) {
	return _.find(mapData, function findStairs(tile) {
		return tile.value === GemThief.Digger.UP;
	});
}
