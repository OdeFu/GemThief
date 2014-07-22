EndState = function (won)
{
	return createEndState(won);
};

var createEndState = function (won)
{
	"use strict";

	// Private fields
	var _won = won;

	// Private methods
	var draw = function ()
	{
		"use strict";

		Game.getDisplay().clear();

		var text = _won ? "You won!" : "You lost!";
		Game.drawTextCentered(5, text);
		Game.drawTextCentered(8, "%b{gray}New Game");
	};

	var initEngine = function ()
	{
		"use strict";

		state.getScheduler().add(state, true);

		state.getEngine().start();
	};

	// Public methods
	var handleEvent = function (event)
	{
		"use strict";

		// Process user input
		if (event.keyCode === ROT.VK_RETURN)
		{
			window.removeEventListener("keydown", state);
			Game.changeState(GameState);
		}
	};

	var options = {};
	options.name = "EndState";
	options.act = function ()
	{
		draw();

		state.getEngine().lock();
		window.addEventListener("keydown", state);
	};
	options.enter = function ()
	{
		initEngine();
	};
	options.exit = function ()
	{
		state.getEngine().lock();
		state.getScheduler().clear();
	};

	var state = createState(options);
	state.handleEvent = handleEvent;
	return state;
};