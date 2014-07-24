EndState = function (params)
{
	return createEndState(params);
};

var createEndState = function (params)
{
	"use strict";

	check(params.won, Boolean);
	check(params.score, Number);
	check(params.gems, Number);

	// Private fields
	var _won = params.won;
	var _score = params.score;
	var _gems = params.gems;

	// Private methods
	var draw = function ()
	{
		"use strict";

		Game.getDisplay().clear();

		var text = _won ? "You managed to escape with the loot!" : "You got caught by the dwarves!";
		Game.drawTextCentered(5, text);
		Game.drawTextCentered(6, "Gems Looted: " + _gems);
		Game.drawTextCentered(7, "Score: " + _score);
		Game.drawTextCentered(9, "%b{gray}New Game");
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

		check(event.keyCode, Number);

		// Process user input
		if (event.keyCode === ROT.VK_RETURN)
		{
			window.removeEventListener("keydown", state);
			Meteor.call("newGame", function (error, game)
			{
				Game.changeState(GameState, game);
			});
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
