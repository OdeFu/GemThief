createDocIdleAI = function (dwarf, map, params)
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
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	};
	return idleAI;
};

var createDocTrackingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createDocGuardAI(dwarf, map, params));
	};

	return AI.getTrackingAI(lostCallback);
};

var createDocGuardAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);
	var path = AI.getShortestPathToStairs();

	var guardAI = function ()
	{
		"use strict";

		AI.movePath(path);

		if (AI.spottedPlayer(params.guardAIConfig.radius))
		{
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	};
	return guardAI;
};
