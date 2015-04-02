"use strict";

Meteor.methods({
	playerMove: function (dirKey) {
		check(dirKey, Number);

		if (this.userId) {
			const dungeon = _getDungeon(this.userId);

			const playerMove = _movePlayer(dirKey, dungeon, this.userId);
			if (playerMove.blocked) {
				return playerMove;
			}

			dungeon.dwarf.act();
			playerMove.dwarf_x = dungeon.dwarf.x;
			playerMove.dwarf_y = dungeon.dwarf.y;
			playerMove.gameOver = playerMove.player_x === dungeon.dwarf.x && playerMove.player_y === dungeon.dwarf.y;

			GemThief.DungeonData.saveDwarfData(this.userId, dungeon.dwarf);

			return playerMove;
		}

		return null;
	}
});

function _movePlayer(dirKey, dungeon, userId) {
	const dir = ROT.DIRS[8][dirKey];
	const newX = dungeon.player.x + dir[0];
	const newY = dungeon.player.y + dir[1];

	const ret = {};
	const tile = dungeon.map.getTile(newX, newY);
	if (tile.isBlocking()) {
		ret.blocked = true;
	}
	else {
		dungeon.player.x = newX;
		dungeon.player.y = newY;

		ret.player_x = newX;
		ret.player_y = newY;

		GemThief.DungeonData.savePlayerData(userId, dungeon.player);
		GemThief.PlayerData.addMove(dungeon.map.level);

		const gems = dungeon.gems;
		if (_foundGem(gems, dungeon.player).length > 0) {
			GemThief.DungeonData.saveGemData(userId, gems);
			GemThief.PlayerData.addGem();
			ret.gem = true;
		}
	}
	return ret;
}

function _getDungeon(userId) {
	if (Meteor.isClient) {
		return GemThief.Game.state.dungeon;
	}

	const entityData = GemThief.DungeonData.getData(userId);
	const game = GemThief.Games.getGame(userId);
	game.config = DWARF_CONFIG;
	ROT.RNG.setSeed(game.seed);
	return GemThief.Dungeon.instantiate(entityData, game);
}

function _foundGem(gems, loc) {
	return _.remove(gems, function (gem) {
		return gem.x === loc.x && gem.y === loc.y;
	});
}
