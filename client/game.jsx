createGame = function () {
	"use strict";

	// Private fields
	var _display;
	var _state;

	// Public methods
	function init() {
		var container = document.getElementById("main");
		if (ROT.isSupported) {
			_display = new ROT.Display();
			container.appendChild(_display.getContainer());

			changeState(StartState.instantiate());
		}
		else {
			container.textContent = "Your browser is not supported!";
		}
	}

	function changeState(newState) {
		if (_state) {
			_state.exit();
		}

		_state = newState;
		_state.enter();
	}

	function gameOver() {
		Meteor.call("update", _state.playerStats, function updateCallback(error, data) {
			changeState(EndState.instantiate(data));
		});
	}

	function moveToLevel(nextLevel) {
		if (nextLevel === 0) {
			// We exited the mine
			_state.playerStats.won = true;
			gameOver();
		}
		else {
			Meteor.call("loadLevel", nextLevel, function loadLevelCallback(error, game) {
				changeState(GameState.instantiate(game));
			});
		}
	}

	function drawTextCentered(y, text) {
		var textSize = ROT.Text.measure(text);
		var x = _display.getOptions().width * 0.5 - textSize.width * 0.5;
		_display.drawText(x, y, text);
	}

	function drawTextRight(y, text) {
		var textSize = ROT.Text.measure(text);
		var x = _display.getOptions().width - textSize.width;
		_display.drawText(x, y, text);
	}

	return {
		get display() {
			return _display;
		},

		get state() {
			return _state;
		},

		gameOver:         gameOver,
		init:             init,
		drawTextCentered: drawTextCentered,
		drawTextRight:    drawTextRight,
		changeState:      changeState,
		moveToLevel:      moveToLevel
	};
};


