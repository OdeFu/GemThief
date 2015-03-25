"use strict";

GemThief.Location = {};

GemThief.Location.getRandomStartLocation = function (map) {
	return map.findEmptyTile();
};

GemThief.Location.getDarkStartLocation = function (map) {
	function darkTiles(tile) {
		return !tile.color;
	}

	return map.getSomeTiles(darkTiles).random();
};

GemThief.Location.getLightStartLocation = function (map) {
	function lightTiles(tile) {
		return tile.color;
	}

	return map.getSomeTiles(lightTiles).random();
};

GemThief.Location.getBrightLightStartLocation = function (map) {
	return map.lightLocations.random();
};
