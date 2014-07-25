createHappyIdleAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);
	var path = [];

	var idleAI = function ()
	{
		"use strict";

		if (path.length === 0)
		{
			path = Path.generatePath(dwarf.toPoint(), map.findEmptyTile().toPoint());
		}

		AI.movePath(path);

		if (AI.catchedPlayer())
		{
			return;
		}

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createHappyTrackingAI);
		}
	};
	return idleAI;
};

var createHappyTrackingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var tellJoke = function ()
	{
		"use strict";
		var joke = params.jokes.random();
		map.setMessage("\"" + joke + "\"");
	};

	var lostCallback = function ()
	{
		dwarf.setAI(createHappyIdleAI(dwarf, map, params));
	};

	var stoppedCallback = function ()
	{
		tellJoke();
	};

	return AI.getTrackingAI(lostCallback, stoppedCallback);
};

