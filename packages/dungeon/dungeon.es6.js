"use strict";

GemThief.Dungeon = {
	instantiate: function (entityData, params) {
		const dungeon = Object.create(GemThief.Dungeon);
		dungeon.config = params.config;
		dungeon.map = GemThief.Map.instantiate(entityData, params);
		dungeon.player = _createPlayer(entityData.player, dungeon.map);
		dungeon.gems = _createGems(entityData.gems, dungeon.map);
		dungeon.dwarf = _createDwarf(entityData.dwarf, dungeon);

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

function _createPlayer(playerData, map) {
	const player = GemThief.Player.instantiate({ x: playerData.x, y: playerData.y });
	const tile = map.getTile(playerData.x, playerData.y);
	tile.addEntity(player);
	return player;
}

function _createGems(gemsData, map) {
	return _.map(gemsData, function (gemData) {
		const gem = GemThief.Gem.instantiate(gemData);
		const tile = map.getTile(gemData.x, gemData.y);
		tile.addEntity(gem);
		return gem;
	});
}

function _createDwarf(dwarfData, dungeon) {
	const dwarfConfigs = dungeon.config.dwarves.slice(0);
	dwarfConfigs.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	const data = dwarfConfigs[dungeon.map.level - 1];
	data.x = dwarfData.x;
	data.y = dwarfData.y;

	const dwarf = GemThief.Dwarf.instantiate(data);
	dwarf.setAI(GemThief.DWARF_AIS[data.name](dwarf, dungeon, data));
	const tile = dungeon.map.getTile(dwarfData.x, dwarfData.y);
	tile.addEntity(dwarf);

	return dwarf;
}
