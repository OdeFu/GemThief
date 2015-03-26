"use strict";

GemThief.Dungeon = {
	instantiate: function (mapData, params) {
		const dungeon = Object.create(GemThief.Dungeon);
		dungeon.config = params.config;
		dungeon.map = GemThief.Map.instantiate(mapData, params);
		dungeon.player = _createPlayer(mapData, dungeon.map);
		dungeon.gems = _createGems(mapData, dungeon.map);
		dungeon.dwarves = _createDwarves(mapData, dungeon);

		dungeon.getGem = getGem.bind(dungeon);
		dungeon.removeGem = removeGem.bind(dungeon);

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

function _createPlayer(mapData, map) {
	const playerLoc = _findLocationsFor(GemThief.Digger.PLAYER, mapData)[0];
	const player = GemThief.Player.instantiate({ x: playerLoc.x, y: playerLoc.y });
	const tile = map.getTile(playerLoc.x, playerLoc.y);
	tile.addEntity(player);
	return player;
}

function _createGems(mapData, map) {
	const gems = [];
	const gemLocations = _findLocationsFor(GemThief.Digger.GEM, mapData);
	_.each(gemLocations, function (gemTile) {
		const gem = GemThief.Gem.instantiate({ x: gemTile.x, y: gemTile.y });
		const tile = map.getTile(gemTile.x, gemTile.y);
		tile.addEntity(gem);
		gems.push(gem);
	});
	return gems;
}

function _createDwarves(mapData, dungeon) {
	const dwarves = [];
	const dwarfLocations = _findLocationsFor(GemThief.Digger.DWARF, mapData);
	_.each(dwarfLocations, function (dwarfLoc) {
		const dwarf = _createDwarf(dwarfLoc, dungeon);
		dwarves.push(dwarf);
	});
	return dwarves;
}

function _createDwarf(dwarfLoc, dungeon) {
	const dwarfConfigs = dungeon.config.dwarves.slice(0);
	dwarfConfigs.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	const data = dwarfConfigs[dungeon.map.level - 1];
	data.x = dwarfLoc.x;
	data.y = dwarfLoc.y;

	const dwarf = GemThief.Dwarf.instantiate(data);
	dwarf.setAI(GemThief.DWARF_AIS[data.name](dwarf, dungeon, data));
	const tile = dungeon.map.getTile(dwarfLoc.x, dwarfLoc.y);
	tile.addEntity(dwarf);

	return dwarf;
}

function _findLocationsFor(type, mapData) {
	return _.filter(mapData, function (tile) {
		return tile.value === type;
	});
}
