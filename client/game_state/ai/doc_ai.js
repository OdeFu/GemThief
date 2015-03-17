createDocIdleAI = function (dwarf, map, params)
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
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	}
	return idleAI;
};

var createDocTrackingAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function lostCallback()
	{
		dwarf.setAI(createDocGuardAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
};

var createDocGuardAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);
	var path = AI.getShortestPathToStairs();

	function guardAI()
	{
		AI.movePath(path);

		if (AI.spottedPlayer(params.guardAIConfig.radius))
		{
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	}
	return guardAI;
};
