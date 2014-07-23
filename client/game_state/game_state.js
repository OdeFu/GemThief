GameState = function (params)
{
	return createGameState(params);
};

var createGameState = function (params)
{
	"use strict";

	check(params.seed, Number);

	// Private fields
	var _map;
	var _playerStats = new PlayerStats();

	ROT.RNG.setSeed(params.seed);

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

		_map = createMap({ width: 80, height: 23 });

		initEngine();
	};

	options.exit = function ()
	{
		"use strict";

		state.getEngine().lock();
		state.getScheduler().clear();
	};

	// Public methods
	var getMap = function ()
	{
		return _map;
	};

	var getPlayerStats = function ()
	{
		return _playerStats;
	};

	var state = createState(options);
	state.getMap = getMap;
	state.getPlayerStats = getPlayerStats;
	return state;
}
