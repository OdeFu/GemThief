"use strict";

GemThief.Digger = {
	/**
	 * Dig a single level of a dungeon or a map.
	 *
	 * @param width the width of the map
	 * @param height the height of the map
	 * @returns {GemThief.MapData}
	 */
	dig: function (params) {
		const digger = new ROT.Map.Digger(params.width, params.height);
		const tiles = [];
		tiles.params = params;

		function digCallback(x, y, value) {
			tiles.push({ x, y, value });
		}

		digger.create(digCallback);

		return new GemThief.MapData(tiles);
	}
};
