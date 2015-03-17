createDopeyIdleAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);
	var path = [];

	function idleAI()
	{
		var pathChange = ROT.RNG.getPercentage() < params.idleAIConfig.pathChangeChance;
		if (pathChange)
		{
			path = [];
		}

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
			AI.changeToTrackingAI(createDopeyTrackingAI);
		}
	}
	return idleAI;
};

var createDopeyTrackingAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function lostCallback()
	{
		dwarf.setAI(createDopeyIdleAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
};
