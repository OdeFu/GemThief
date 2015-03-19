"use strict";

const Games = new Meteor.Collection("games");

const DWARF_CONFIG = EJSON.parse(Assets.getText("dwarf_config.json"));

Meteor.methods({
	newGame: function () {
		const game = createNewGame();

		if (this.userId) {
			const curGame = Games.findOne({userId: this.userId});
			if (curGame) {
				curGame.seed = game.seed;
				curGame.level = game.level;
				curGame.updated = new Date().getTime();
				Games.upsert(curGame);
			}
			else {
				const newGame = {
					seed: game.seed, level: game.level, userId: this.userId, created: new Date().getTime()
				};
				Games.insert(newGame);
			}
		}

		return game;
	},

	loadLevel: function (nextLevel) {
		const game = createNewGame();
		game.level = nextLevel;

		if (this.userId) {
			const curGame = Games.findOne({userId: this.userId});
			if (curGame) {
				game.seed = curGame.seed;
				game.level = checkNextLevel(nextLevel, curGame);

				curGame.level = game.level;
				curGame.updated = new Date().getTime();
				Games.upsert(curGame);
			}
		}

		return game;
	}
});

function createNewGame() {
	const game = {
		seed: new Date().getTime(), level: 1, config: DWARF_CONFIG
	};
	return game;
}

function checkNextLevel(nextLevel, curGame) {
	const ok = Math.abs(nextLevel - curGame.level) === 1;
	return ok ? nextLevel : curGame.level;
}
