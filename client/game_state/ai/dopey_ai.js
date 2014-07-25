createDopeyIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);
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
			path = Path.generatePath(dwarf.toPoint(), Game.getState().getMap().findEmptyTile().toPoint());
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

var createDopeyTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createDopeyIdleAI(dwarf, params));
	};

	return AI.getTrackingAI(lostCallback);
};
