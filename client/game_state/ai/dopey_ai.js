createDopeyIdleAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);
	var path = [];

	var idleAI = function ()
	{
		"use strict";

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
	};
	return idleAI;
};

var createDopeyTrackingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createDopeyIdleAI(dwarf, map, params));
	};

	return AI.getTrackingAI(lostCallback);
};
