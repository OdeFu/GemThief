"use strict";

GemThief.Location = {};

GemThief.Location.getRandomStartLocation = function (mapData) {
	return mapData.findEmptyTile();
};

GemThief.Location.getDarkStartLocation = function (mapData) {
	function darkTiles(tile) {
		return !tile.color;
	}

	return mapData.getSomeTiles(darkTiles).random();
};

GemThief.Location.getLightStartLocation = function (mapData) {
	function lightTiles(tile) {
		return tile.color;
	}

	return mapData.getSomeTiles(lightTiles).random();
};

GemThief.Location.getBrightLightStartLocation = function (mapData) {
	return mapData.getLightLocations().random();
};

GemThief.DWARF_START_LOCATIONS = {};
GemThief.DWARF_START_LOCATIONS["randomStartLocation"] = GemThief.Location.getRandomStartLocation;
GemThief.DWARF_START_LOCATIONS["darkStartLocation"] = GemThief.Location.getDarkStartLocation;
GemThief.DWARF_START_LOCATIONS["lightStartLocation"] = GemThief.Location.getLightStartLocation;
GemThief.DWARF_START_LOCATIONS["brightLightStartLocation"] = GemThief.Location.getBrightLightStartLocation;
