GameState = function (params)
{
	return createGameState(params);
};

function createGameState(params)
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
	function draw()
	{
		Game.getDisplay().clear();

		_map.draw(Game.getDisplay());
	}

	function initEngine ()
	{
		state.getScheduler().add(state, true);
		state.getScheduler().add(_map.getPlayer(), true);

		for (var i = 0; i < state.getMap().getDwarves().length; i++)
		{
			state.getScheduler().add(state.getMap().getDwarves()[i], true);
		}

		state.getEngine().start();
	}

	var options = {};
	options.name = "GameState";
	options.scheduler = ROT.Scheduler.Simple;

	options.act = function act()
	{
		draw();
	};

	options.enter = function enter()
	{
		params.width = 80;
		params.height = 23;
		_map = createMap(params);

		initEngine();
	};

	options.exit = function exit()
	{
		state.getEngine().lock();
		state.getScheduler().clear();
	};

	// Public methods
	function getMap()
	{
		return _map;
	}

	function getPlayerStats()
	{
		return _playerStats;
	}

	var state = createState(options);
	state.getMap = getMap;
	state.getPlayerStats = getPlayerStats;
	return state;
}
