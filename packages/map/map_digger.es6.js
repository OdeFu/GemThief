"use strict";

GemThief.Digger = {
	/**
	 * Dig a single level of a dungeon or a map.
	 *
	 * @param width the width of the map
	 * @param height the height of the map
	 * @returns {Array} An array of objects(x, y, value, color) describing the map layout
	 */
	dig: function (params) {
		const digger = new ROT.Map.Digger(params.width, params.height);
		const tiles = [];
		tiles.params = params;

		function digCallback(x, y, value) {
			tiles.push({
				x,
				y,
				value
			});
		}

		digger.create(digCallback);

		_createStairs(tiles);
		_generateLightingData(tiles);

		return tiles;
	},

	findEmptyTile: function (tiles) {
		const empties = this.getAllEmptyTiles(tiles);
		return empties.random();
	},

	getAllEmptyTiles: function (tiles) {
		return _.filter(tiles, function tileFilter(tile) {
			return tile.value === GemThief.Digger.FLOOR;
		});
	},

	getTile: function (x, y, tiles) {
		return tiles[tiles.params.height * x + y];
	},

	getSomeTiles: function (tiles, func) {
		return _.filter(tiles, function someTilesFilter(tile) {
			return func(tile);
		});
	},

	getLightLocations: function (tiles) {
		return _.filter(tiles, function tileFilter(tile) {
			return tile.value === GemThief.Digger.LIGHT;
		});
	}
};

GemThief.addConstantProperty(GemThief.Digger, "FLOOR", 0);
GemThief.addConstantProperty(GemThief.Digger, "WALL", 1);
GemThief.addConstantProperty(GemThief.Digger, "UP", 2);
GemThief.addConstantProperty(GemThief.Digger, "DOWN", 3);
GemThief.addConstantProperty(GemThief.Digger, "LIGHT", 4);
GemThief.addConstantProperty(GemThief.Digger, "PLAYER", 5);
GemThief.addConstantProperty(GemThief.Digger, "DWARF", 6);
GemThief.addConstantProperty(GemThief.Digger, "GEM", 7);

function _createStairs(tiles) {
	const upTile = GemThief.Digger.findEmptyTile(tiles);
	upTile.value = GemThief.Digger.UP;

	const downTile = GemThief.Digger.findEmptyTile(tiles);
	downTile.value = GemThief.Digger.DOWN;
}

function _generateLightingData(tiles) {
	function isEmpty(x, y) {
		const tile = GemThief.Digger.getTile(x, y, tiles);
		if (tile) {
			return tile.value === GemThief.Digger.FLOOR;
		}
		// TODO: Fix this
		console.log("No tile found at", x, ",", y);
		return true;
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

	const lightLocations = _createLightLocations(tiles);
	lightLocations.forEach(function setLight(light) {
		lighting.setLight(light.x, light.y, lightColor);
	});

	function lightingCallback(x, y, color) {
		const tile = GemThief.Digger.getTile(x, y, tiles);
		tile.color = color;
	}

	lighting.compute(lightingCallback);
}

function _createLightLocations(tiles) {
	const lightLocations = [];
	_.times(tiles.params.numLightLocations, function createLightLocation() {
		const tile = GemThief.Digger.findEmptyTile(tiles);
		tiles.value = GemThief.Digger.LIGHT;
		lightLocations.push(tile);
	});
	return lightLocations;
}
