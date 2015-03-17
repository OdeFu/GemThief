var idCounter = 0;

/**
 * Create a new state. You should provide implementations for the abstract methods; act, enter and exit.
 * @param options Supported options are the name, scheduler and act, enter and exit methods.
 * @returns {{}}
 */
createState = function (options)
{
	"use strict";

	// Private fields
	var _id = idCounter++;
	var _name = options.name || "State_" + _id;
	var _schedulerClass = options.scheduler || ROT.Scheduler.Simple;
	var _scheduler = new _schedulerClass();
	var _engine = new ROT.Engine(_scheduler);

	// Public methods
	function getId()
	{
		return _id;
	}

	function getName()
	{
		return _name;
	}

	function getEngine()
	{
		return _engine;
	}

	function getScheduler()
	{
		return _scheduler;
	}

	// Abstract methods
	function act()
	{
	}

	function enter()
	{
	}

	function exit()
	{
	}

	var state = {};
	state.getId = getId;
	state.getName = getName;
	state.getEngine = getEngine;
	state.getScheduler = getScheduler;
	state.act = options.act || act;
	state.enter = options.enter || enter;
	state.exit = options.exit || exit;
	return state;
};
