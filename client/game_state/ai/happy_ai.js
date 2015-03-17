createHappyIdleAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);
	var path = [];

	function idleAI()
	{
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
	}
	return idleAI;
};

var createHappyTrackingAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function tellJoke()
	{
		var joke = params.jokes.random();
		map.setMessage("\"" + joke + "\"");
	}

	function lostCallback()
	{
		dwarf.setAI(createHappyIdleAI(dwarf, map, params));
	}

	function stoppedCallback()
	{
		tellJoke();
	}

	return AI.getTrackingAI(lostCallback, stoppedCallback);
};

