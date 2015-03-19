"use strict";

GemThief.Game = {
	init: function () {
		const container = document.getElementById("main");
		if (ROT.isSupported) {
			this.display = new ROT.Display();
			container.appendChild(this.display.getContainer());

			this.changeState(StartState.instantiate());
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
			this.changeState(EndState.instantiate(data));
		});
	},

	moveToLevel: function (nextLevel) {
		if (nextLevel === 0) {
			// We exited the mine
			this.state.playerStats.won = true;
			this.gameOver();
		}
		else {
			Meteor.call("loadLevel", nextLevel, function loadLevelCallback(error, game) {
				this.changeState(GameState.instantiate(game));
			});
		}
	},

	drawTextCentered: function (y, text) {
		const textSize = ROT.Text.measure(text);
		const x = this.display.getOptions().width * 0.5 - textSize.width * 0.5;
		this.display.drawText(x, y, text);
	},

	drawTextRight: function (y, text) {
		const textSize = ROT.Text.measure(text);
		const x = this.display.getOptions().width - textSize.width;
		this.display.drawText(x, y, text);
	}
};
