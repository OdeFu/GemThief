createGame = function ()
{
	"use strict";

	// Private fields
	var _display;
	var _state;

	// Public methods
	var init = function ()
	{
		"use strict";

		_display = new ROT.Display();
		document.body.appendChild(_display.getContainer());

		changeState(StartState);
	};

	var changeState = function (newState, params)
	{
		"use strict";

		if (_state)
		{
			_state.exit();
		}

		_state = new newState(params);
		_state.enter();
	};

	var gameOver = function (won)
	{
		changeState(EndState, won);
	};

	var drawTextCentered = function (y, text)
	{
		"use strict";

		var textSize = ROT.Text.measure(text);
		var x = _display.getOptions().width * 0.5 - textSize.width * 0.5;
		_display.drawText(x, y, text);
	};

	var getDisplay = function () { return _display; };
	var getState = function () { return _state; };

	var game = {};
	game.gameOver = gameOver;
	game.init = init;
	game.getDisplay = getDisplay;
	game.getState = getState;
	game.drawTextCentered = drawTextCentered;
	game.changeState = changeState;
	return game;
};



