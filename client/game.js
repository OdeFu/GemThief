createGame = function ()
{
	"use strict";

	// Private fields
	var _display;
	var _state;

	// Public methods
	var init = function ()
	{
		var container = document.getElementById("main");
		if (ROT.isSupported)
		{
			_display = new ROT.Display();
			container.appendChild(_display.getContainer());

			changeState(StartState);
		}
		else
		{
			container.textContent = "Your browser is not supported!";
		}
	};

	var changeState = function (newState, params)
	{
		if (_state)
		{
			_state.exit();
		}

		_state = new newState(params);
		_state.enter();
	};

	var gameOver = function ()
	{
		Meteor.call("update", _state.getPlayerStats(), function (error, data)
		{
			changeState(EndState, data);
		});
	};

	var moveToLevel = function (nextLevel)
	{
		if (nextLevel === 0)
		{
			// We exited the mine
			_state.getPlayerStats().won = true;
			gameOver();
		}
		else
		{
			Meteor.call("loadLevel", nextLevel, function (error, game)
			{
				changeState(GameState, game);
			});
		}
	};

	var drawTextCentered = function (y, text)
	{
		var textSize = ROT.Text.measure(text);
		var x = _display.getOptions().width * 0.5 - textSize.width * 0.5;
		_display.drawText(x, y, text);
	};

	var drawTextRight = function (y, text)
	{
		var textSize = ROT.Text.measure(text);
		var x = _display.getOptions().width - textSize.width;
		_display.drawText(x, y, text);
	};

	var getDisplay = function ()
	{
		return _display;
	};

	var getState = function ()
	{
		return _state;
	};

	var game = {};
	game.gameOver = gameOver;
	game.init = init;
	game.getDisplay = getDisplay;
	game.getState = getState;
	game.drawTextCentered = drawTextCentered;
	game.drawTextRight = drawTextRight;
	game.changeState = changeState;
	game.moveToLevel = moveToLevel;
	return game;
};



