"use strict";

GemThief.Game = {
	init: function () {
		const container = document.getElementById("main");
		if (ROT.isSupported) {
			GemThief.Display.init(container);

			this.changeState(GemThief.StartState.instantiate());
		}
		else {
			container.textContent = "Your browser is not supported!";
		}
	},

	changeState: function (newState) {
		if (this.state) {
			this.state.exit();
		}

		this.state = newState;
		this.state.enter();
	},

	gameOver: function () {
		Meteor.call("update", this.state.playerStats, function updateCallback(error, data) {
			this.changeState(GemThief.EndState.instantiate(data));
		}.bind(this));
	},

	moveToLevel: function (nextLevel) {
		if (nextLevel === 0) {
			// We exited the mine
			this.state.playerStats.won = true;
			this.gameOver();
		}
		else {
			Meteor.call("loadLevel", nextLevel, function loadLevelCallback(error, game) {
				this.changeState(GemThief.GameState.instantiate(game));
			}.bind(this));
		}
	}
};
