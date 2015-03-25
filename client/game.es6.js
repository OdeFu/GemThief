"use strict";

GemThief.Game = {
	init: function (newPlayer) {
		const container = document.getElementById("main");
		if (ROT.isSupported) {
			if (container.hasChildNodes()) {
				container.removeAll();
			}
			GemThief.Display.init(container);

			this.changeState(GemThief.StartState.instantiate(newPlayer));
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
