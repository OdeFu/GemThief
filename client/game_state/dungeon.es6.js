"use strict";

GemThief.Dungeon = {
	/**
	 * Create a dungeon with the given map by adding dynamic entities.
	 */
	instantiate: function (map, params) {
		const dungeon = Object.create(GemThief.Dungeon);
		dungeon.map = map;
		dungeon.player = null;
		dungeon.gems = [];
		dungeon.dwarves = [];
		dungeon.numGems = params.numGems || 10;
		dungeon.config = params.config;

		dungeon.getGem = getGem.bind(dungeon);
		dungeon.removeGem = removeGem.bind(dungeon);

		_createEntities(dungeon);

		return dungeon;
	}
};

function getGem(x, y) {
	return _.find(this.gems, function findGem(gem) {
		return gem.x === x && gem.y === y;
	});
}

function removeGem(gem) {
	const index = this.gems.indexOf(gem);
	if (index >= 0) {
		this.gems.splice(index, 1);
		const tile = this.map.getTile(gem.x, gem.y);
		tile.removeEntity(gem);
	}
}

// Private methods

function _createEntities(dungeon) {
	_createGems(dungeon);

	_createPlayer(dungeon);

	_createDwarf(dungeon);
}

function _createPlayer(dungeon) {
	const stairs = dungeon.map.getStairsUp();
	dungeon.player = GemThief.Player.instantiate(stairs.toPoint());
	const tile = dungeon.map.getTile(stairs.x, stairs.y);
	tile.addEntity(dungeon.player);
}

function _createDwarf(dungeon) {
	const dwarves = dungeon.config.dwarves.slice(0);
	dwarves.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	const data = dwarves[dungeon.map.level - 1];

	const tile = GemThief.DWARF_START_LOCATIONS[data.startLocation](dungeon.map);
	data.x = tile.x;
	data.y = tile.y;

	const dwarf = GemThief.Dwarf.instantiate(data);
	dwarf.setAI(GemThief.DWARF_AIS[data.name](dwarf, dungeon, data));
	tile.addEntity(dwarf);
	dungeon.dwarves.push(dwarf);
}

function _createGems(dungeon) {
	_.times(dungeon.numGems, function createGem() {
		const tile = dungeon.map.findEmptyTile();
		const gem = GemThief.Gem.instantiate(tile.toPoint());
		tile.addEntity(gem);
		dungeon.gems.push(gem);
	});
}
