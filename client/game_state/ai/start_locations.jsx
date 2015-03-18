getRandomStartLocation = function (map) {
	return map.findEmptyTile();
};

getDarkStartLocation = function (map) {
	"use strict";

	function darkTiles(tile) {
		return !tile.color;
	}

	return map.getSomeTiles(darkTiles).random();
};

getLightStartLocation = function (map) {
	"use strict";

	function lightTiles(tile) {
		return tile.color;
	}

	return map.getSomeTiles(lightTiles).random();
};

getBrightLightStartLocation = function (map) {
	return map.lightLocations.random();
};
