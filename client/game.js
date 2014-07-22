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

		_state = createGameState();
		_state.enter();
	};

	var gameOver = function (won)
	{
		"use strict";

		//_engine.lock();

		if (won)
		{
			alert("Hooray! You found the ananas and won this game.");
		}
		else
		{
			alert("Game Over - you were captured by Pedro!");
		}
	};

	var getDisplay = function () { return _display; };
	var getState = function () { return _state; };

	var game = {};
	game.gameOver = gameOver;
	game.init = init;
	game.getDisplay = getDisplay;
	game.getState = getState;
	return game;
};



