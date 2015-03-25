"use strict";

const Games = new Mongo.Collection("games");

const DWARF_CONFIG = EJSON.parse(Assets.getText("dwarf_config.json"));

Meteor.methods({
	newGame: function () {
		const game = createNewGame();

		if (this.userId) {
			Games.upsert({ userId: this.userId }, { $set: _.extend(_.omit(game, "config"), { created: new Date() })});
		}

		return game;
	},

	continueGame: function () {
		const game = createNewGame();

		if (this.userId) {
			const curGame = Games.findOne({ userId: this.userId });
			if (curGame) {
				game.seed = curGame.seed;
				game.level = curGame.level;
			}
		}
		return game;
	},

	loadLevel: function (nextLevel) {
		const game = createNewGame();
		game.level = nextLevel;

		if (this.userId) {
			const curGame = Games.findOne({ userId: this.userId });
			if (curGame) {
				game.seed = curGame.seed;
				game.level = checkNextLevel(nextLevel, curGame);
			}

			const data = {
				level: game.level,
				updated: new Date()
			};
			Games.upsert({ userId: this.userId }, { $set: data }, function (error) {
				console.log(error.reason);
			});
		}

		return game;
	}
});

function createNewGame() {
	const game = {
		seed: new Date().getTime(),
		level: 1,
		config: DWARF_CONFIG
	};
	return game;
}

function checkNextLevel(nextLevel, curGame) {
	const ok = Math.abs(nextLevel - curGame.level) === 1;
	return ok ? nextLevel : curGame.level;
}
