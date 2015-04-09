"use strict";

Meteor.methods({
	playerMove: function (dirKey) {
		check(dirKey, Number);

		if (this.userId) {
			const dungeon = _getDungeon(this.userId);

			if (_movePlayer(dirKey, dungeon, this.userId)) {
				dungeon.dwarf.act();

				if (dungeon.player.x === dungeon.dwarf.x && dungeon.player.y === dungeon.dwarf.y) {
					Messenger.broadcast(GemThief.Messages.GAME_OVER, false);
					return;
				}

				GemThief.DungeonData.saveDwarfData(this.userId, dungeon.dwarf);
			}
		}
	}
});

function _movePlayer(dirKey, dungeon, userId) {
	const dir = ROT.DIRS[8][dirKey];
	const newX = dungeon.player.x + dir[0];
	const newY = dungeon.player.y + dir[1];

	const tile = dungeon.map.getTile(newX, newY);
	if (!tile.isBlocking()) {
		dungeon.map.moveEntity(dungeon.player, newX, newY);

		GemThief.DungeonData.savePlayerData(userId, dungeon.player);
		if (Meteor.isServer) {
			GemThief.PlayerData.addMove(dungeon.map.level);
		}

		const gem = tile.getEntity(GemThief.Entity.ITEM);
		if (gem && dungeon.removeGem(gem).length > 0) {
			GemThief.DungeonData.saveGemData(userId, dungeon.gems);
			if (Meteor.isServer) {
				GemThief.PlayerData.addGem();
			}
			Messenger.broadcast(GemThief.Messages.DISPLAY_MESSAGE, "You picked up a gem.", 1);
		}
		return true;
	}
	return false;
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
