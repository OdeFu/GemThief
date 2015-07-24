"use strict";

Meteor.publish("games", function publishGames() {
	return this.userId ? GemThief.Games.find({ userId: this.userId }) : null;
});

Meteor.methods({
	newGame: function () {
		const game = createNewGame();

		if (this.userId) {
			GemThief.Games.upsert({ userId: this.userId }, { $set: _.extend(_.omit(game, "config"), { created: new Date() })});
		}

		return game;
	},

	continueGame: function () {
		const game = createNewGame();

		if (this.userId) {
			const curGame = GemThief.Games.findOne({ userId: this.userId });
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
			const curGame = GemThief.Games.findOne({ userId: this.userId });
			if (curGame) {
				game.seed = curGame.seed;
				game.level = checkNextLevel(nextLevel, curGame);
			}

			const data = {
				level: game.level,
				updated: new Date()
			};
			GemThief.Games.upsert({ userId: this.userId }, { $set: data }, function (error) {
				console.log(error.reason);
			});
		}

		return game;
	}
});

function createNewGame() {
	const game = {
		seed: Date.now(),
		level: 1,
		config: DWARF_CONFIG,
		width: 80,
		height: 23,
		numGems: 10,
		numLightLocations: 5
	};
	return game;
}

function checkNextLevel(nextLevel, curGame) {
	const ok = Math.abs(nextLevel - curGame.level) === 1;
	return ok ? nextLevel : curGame.level;
}
