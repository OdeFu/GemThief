GameState = function ()
{
	return createGameState();
};

var createGameState = function ()
{
	"use strict";

	// Private fields
	var _map;

	// Private methods
	var draw = function ()
	{
		"use strict";

		Game.getDisplay().clear();

		_map.draw(Game.getDisplay());
	};

	var initEngine = function ()
	{
		state.getScheduler().add(state, true);
		state.getScheduler().add(_map.getPlayer(), true);
		state.getScheduler().add(_map.getPedro(), true);

		state.getEngine().start();
	};

	var options = {};
	options.name = "GameState";
	options.scheduler = ROT.Scheduler.Simple;
	options.act = function ()
	{
		"use strict";

		draw();
	};
	options.enter = function ()
	{
		"use strict";

		_map = createMap({ width: 80, height: 25, seed: new Date().now });

		initEngine();
	};
	options.exit = function ()
	{
		"use strict";

		state.getEngine().lock();
		state.getScheduler().clear();
	};

	// Public methods
	var getMap = function () { return _map; };

	var state = createState(options);
	state.getMap = getMap;

	return state;
}