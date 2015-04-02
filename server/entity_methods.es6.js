"use strict";

Meteor.methods({
	playerMove: function (dirKey) {
		check(dirKey, Number);

		const ret = {};

		if (this.userId) {
			const player = GemThief.DungeonData.getPlayerData(this.userId);
			const game = GemThief.Games.getGame(this.userId);

			ROT.RNG.setSeed(game.seed);
			const tiles = GemThief.Digger.dig(game);

			const dir = ROT.DIRS[8][dirKey];
			const newX = player.x + dir[0];
			const newY = player.y + dir[1];

			const tile = GemThief.Digger.getTile(newX, newY, tiles);
			if (tile.value === GemThief.Digger.WALL) {
				ret.blocked = true;
			}
			else {
				player.x = newX;
				player.y = newY;

				ret.x = newX;
				ret.y = newY;

				GemThief.DungeonData.savePlayerData(this.userId, player);
				GemThief.PlayerData.addMove(game.level);

				const gems = GemThief.DungeonData.getGemData(this.userId);
				if (_foundGem(gems, player).length > 0) {
					GemThief.DungeonData.saveGemData(this.userId, gems);
					GemThief.PlayerData.addGem();
					ret.gem = true;
				}
			}
		}

		return ret;
	},

	dwarfMove: function () {
		if (this.userId) {
			const entityData = GemThief.DungeonData.getData(this.userId);
			const game = GemThief.Games.getGame(this.userId);
			game.config = DWARF_CONFIG;
			const dungeon = GemThief.Dungeon.instantiate(entityData, game);
			dungeon.dwarf.act();

			const ret = dungeon.dwarf.toPoint();

			return ret;
		}
	}
});

function _foundGem(gems, loc) {
	return _.remove(gems, function (gem) {
		return gem.x === loc.x && gem.y === loc.y;
	});
}
