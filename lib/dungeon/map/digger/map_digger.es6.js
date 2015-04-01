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
			tiles.push({ x, y, value });
		}

		digger.create(digCallback);

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
		check(tiles.params.height, Number);
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
