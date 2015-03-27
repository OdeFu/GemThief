"use strict";

Meteor.methods({
	loadDungeon: function (params) {
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
			const entities = GemThief.DungeonData.getData(this.userId);
			if (entities) {
				return entities;
			}

			ROT.RNG.setSeed(params.seed);

			const mapData = GemThief.Digger.dig(params);

			const newMap = {};
			newMap.stairs = _createStairs(mapData);
			newMap.player = _createPlayer(mapData);
			newMap.dwarf = _createDwarf(mapData, params);
			newMap.gems = _createGems(mapData, params.numGems);
			newMap.lights = _generateLightingData(mapData, params.numLightLocations);

			GemThief.DungeonData.upsert({ userId: this.userId }, {
				data: newMap,
				userId: this.userId
			});

			return newMap;
		}

		return null;
	}
});

function _createPlayer(mapData) {
	return _findStairsUp(mapData);
}

function _createGems(mapData, numGems) {
	return _.times(numGems, function createGem() {
		return GemThief.Digger.findEmptyTile(mapData);
	});
}

function _createDwarf(mapData, params) {
	const dwarves = params.config.dwarves.slice(0);
	dwarves.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	const data = dwarves[params.level - 1];

	return GemThief.DWARF_START_LOCATIONS[data.startLocation](mapData);
}

function _createStairs(mapData) {
	return _.times(2, function createStairs(n) {
		const tile = GemThief.Digger.findEmptyTile(mapData);
		tile.value = n === 0 ? GemThief.Digger.UP : GemThief.Digger.DOWN;
		return tile;
	});
}

function _generateLightingData(mapData, numLightLocations) {
	function isEmpty(x, y) {
		const tile = GemThief.Digger.getTile(x, y, mapData);
		return tile && tile.value !== GemThief.Digger.WALL;
	}

	const fov = new ROT.FOV.PreciseShadowcasting(isEmpty, { topology: 4 });

	function reflectivityCallback(x, y) {
		return isEmpty(x, y) ? 0.3 : 0;
	}

	const lighting = new ROT.Lighting(reflectivityCallback, {
		range: 12,
		passes: 2
	});
	lighting.setFOV(fov);

	const lightColor = [200, 200, 0];

	const lightLocations = _createLightLocations(mapData, numLightLocations);
	lightLocations.forEach(function setLight(light) {
		lighting.setLight(light.x, light.y, lightColor);
	});

	const lightedTiles = [];

	function lightingCallback(x, y, color) {
		const tile = GemThief.Digger.getTile(x, y, mapData);
		tile.color = color;
		lightedTiles.push(tile);
	}

	lighting.compute(lightingCallback);

	return lightedTiles;
}

function _createLightLocations(mapData, numLightLocations) {
	return _.times(numLightLocations, function createLightLocation() {
		const tile = GemThief.Digger.findEmptyTile(mapData);
		tile.value = GemThief.Digger.LIGHT;
		return tile;
	});
}

function _findStairsUp(mapData) {
	return _.find(mapData, function findStairs(tile) {
		return tile.value === GemThief.Digger.UP;
	});
}
