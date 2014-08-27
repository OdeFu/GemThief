StartState = function ()
{
	return createStartState();
};

var createStartState = function ()
{
	"use strict";

	// Private methods
	var draw = function ()
	{
		"use strict";

		Game.getDisplay().clear();
		Game.drawTextCentered(5, "%c{red}G %c{green}E %c{blue}M");
		Game.drawTextCentered(6, "%c{magenta}T %c{aqua}H %c{coral}I %c{fuchsia}E %c{indigo}F");
		Game.drawTextCentered(8, "%b{gray}Press Enter");
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
			Meteor.call("newGame", function (error, game)
			{
				Game.changeState(GameState, game);
			});
		}
	};

	var options = {};
	options.name = "StartState";

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
