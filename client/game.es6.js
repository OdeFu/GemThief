"use strict";

class Game {
	constructor(newPlayer) {
		check(newPlayer, Boolean);

		const container = document.getElementById("main");
		if (container.hasChildNodes()) {
			container.removeAll();
		}
		GemThief.Display.init(container);

		const method = newPlayer ? "newGame" : "continueGame";
		Meteor.call(method, function newGameCallback(error, game) {
			if (error) {
				console.log(error.reason);
				return;
			}

			Meteor.call("loadDungeon", game, function dungeonCallback(error, result) {
				if (error) {
					console.log(error.reason);
				}
				if (result) {
					Messenger.addListener(GemThief.Messages.GAME_OVER, this.gameOver);
					this.changeState(new GemThief.GameState(result, game));
				}
			}.bind(this));
		}.bind(this));
	}

	changeState(newState) {
		if (this.state) {
			this.state.exit();
		}

		this.state = newState;
		this.state.enter();
	}

	gameOver(won) {
		this.state.engine.lock();

		Meteor.call("update", won, function updateCallback(error, data) {
			this.changeState(new GemThief.EndState(data));
		}.bind(this));
	}

	moveToLevel(nextLevel) {
		if (nextLevel === 0) {
			// We exited the mine
			this.gameOver(true);
		}
		else {
			Meteor.call("loadLevel", nextLevel, function loadLevelCallback(error, game) {
				this.changeState(new GemThief.GameState(game));
			}.bind(this));
		}
	}
}

GemThief.GameClass = Game;
