"use strict";

Meteor.methods({
	playerMove: function (dirKey) {
		check(dirKey, Number);

		const ret = {};

		if (this.userId) {
			const player = GemThief.DungeonData.getPlayerData(this.userId);
			const game = GemThief.Games.getGame(this.userId);
			const map = GemThief.Digger.dig(game)

			const dir = ROT.DIRS[8][dirKey];
			const newX = player.x + dir[0];
			const newY = player.y + dir[1];

			if (map.isBlocking(newX, newY)) {
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
				if (_foundGem(gems, player)) {
					GemThief.PlayerData.addGem();
					ret.gem = true;
				}
			}
		}

		return ret;
	},

	dwarfMove: function (dir) {
		check(dir, Number);

		if (this.userId) {
			const entityData = GemThief.DungeonData.getEntityData(this.userId);
			const game = GemThief.Games.getGame(this.userId);
			const map = GemThief.Map.instantiate(entityData, game);

		}
	}
});

function _foundGem(gems, loc) {
	return _.remove(gems, function (gem) {
		return gem.x === loc.x && gem.y === loc.y;
	});
}
