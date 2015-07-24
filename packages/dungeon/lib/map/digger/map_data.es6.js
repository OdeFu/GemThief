"use strict";

class MapData {
	constructor(mapData) {
		this.data = mapData;
	}

	findEmptyTile() {
		const empties = this.getAllEmptyTiles(this.data);
		return empties.random();
	}

	getAllEmptyTiles() {
		return _.filter(this.data, function tileFilter(tile) {
			return tile.value === GemThief.MapFeatures.FLOOR;
		});
	}

	getTile(x, y) {
		check(this.data.params.height, Number);
		return this.data[this.data.params.height * x + y];
	}

	getSomeTiles(func) {
		return _.filter(this.data, function someTilesFilter(tile) {
			return func(tile);
		});
	}

	getLightLocations() {
		return _.filter(this.data, function tileFilter(tile) {
			return tile.value === GemThief.MapFeatures.LIGHT;
		});
	}
}

GemThief.MapData = MapData;
