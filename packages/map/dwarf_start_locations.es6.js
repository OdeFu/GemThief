"use strict";

GemThief.Location = {};

GemThief.Location.getRandomStartLocation = function (mapData) {
	return GemThief.Digger.findEmptyTile(mapData);
};

GemThief.Location.getDarkStartLocation = function (mapData) {
	function darkTiles(tile) {
		return !tile.color;
	}

	return GemThief.Digger.getSomeTiles(mapData, darkTiles).random();
};

GemThief.Location.getLightStartLocation = function (mapData) {
	function lightTiles(tile) {
		return tile.color;
	}

	return GemThief.Digger.getSomeTiles(mapData, lightTiles).random();
};

GemThief.Location.getBrightLightStartLocation = function (mapData) {
	return GemThief.Digger.getLightLocations(mapData).random();
};

GemThief.DWARF_START_LOCATIONS = {};
GemThief.DWARF_START_LOCATIONS["randomStartLocation"] = GemThief.Location.getRandomStartLocation;
GemThief.DWARF_START_LOCATIONS["darkStartLocation"] = GemThief.Location.getDarkStartLocation;
GemThief.DWARF_START_LOCATIONS["lightStartLocation"] = GemThief.Location.getLightStartLocation;
GemThief.DWARF_START_LOCATIONS["brightLightStartLocation"] = GemThief.Location.getBrightLightStartLocation;
