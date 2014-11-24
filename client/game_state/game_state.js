GameState = function (params)
{
	return createGameState(params);
};

var createGameState = function (params)
{
	"use strict";

	check(params.seed, Number);
	check(params.config, Object);
	check(params.level, Number);

	// Private fields
	var _map;
	var _playerStats = new PlayerStats();

	ROT.RNG.setSeed(params.seed);

	// Private methods
	var draw = function ()
	{
		Game.getDisplay().clear();

		_map.draw(Game.getDisplay());
	};

	var initEngine = function ()
	{
		state.getScheduler().add(state, true);
		state.getScheduler().add(_map.getPlayer(), true);

		for (var i = 0; i < state.getMap().getDwarves().length; i++)
		{
			state.getScheduler().add(state.getMap().getDwarves()[i], true);
		}

		state.getEngine().start();
	};

	var options = {};
	options.name = "GameState";
	options.scheduler = ROT.Scheduler.Simple;

	options.act = function ()
	{
		draw();
	};

	options.enter = function ()
	{
		params.width = 80;
		params.height = 23;
		_map = createMap(params);

		initEngine();
	};

	options.exit = function ()
	{
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
