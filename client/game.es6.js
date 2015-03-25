"use strict";

GemThief.Game = {
	init: function (newPlayer) {
		const container = document.getElementById("main");
		if (container.hasChildNodes()) {
			container.removeAll();
		}
		GemThief.Display.init(container);

		const method = newPlayer ? "newGame" : "continueGame";
		Meteor.call(method, function newGameCallback(error, game) {
			GemThief.Game.changeState(GemThief.GameState.instantiate(game));
		});
	},

	changeState: function (newState) {
		if (this.state) {
			this.state.exit();
		}

		this.state = newState;
		this.state.enter();
	},

	gameOver: function (won) {
		Meteor.call("update", won, function updateCallback(error, data) {
			this.changeState(GemThief.EndState.instantiate(data));
		}.bind(this));
	},

	moveToLevel: function (nextLevel) {
		if (nextLevel === 0) {
			// We exited the mine
			this.gameOver(true);
		}
		else {
			Meteor.call("loadLevel", nextLevel, function loadLevelCallback(error, game) {
				this.changeState(GemThief.GameState.instantiate(game));
			}.bind(this));
		}
	}
};
