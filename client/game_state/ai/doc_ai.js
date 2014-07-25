createDocIdleAI = function (dwarf, params)
{
	var path = [];
	var AI = createAI(dwarf, params);

	var idleAI = function ()
	{
		"use strict";

		if (path.length === 0)
		{
			path = Path.generatePath(dwarf.toPoint(), Game.getState().getMap().findEmptyTile().toPoint());
		}

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			Game.getState().getMap().moveEntity(dwarf, step[0], step[1]);
		}

		if (AI.catchedPlayer())
		{
			return;
		}

		if (AI.spottedPlayer(params.idleAIConfig.radius))
		{
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	};
	return idleAI;
};

var createDocTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createDocGuardAI(dwarf, params));
	};

	return AI.getTrackingAI(lostCallback);
};

var createDocGuardAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);
	var path = AI.getShortestPathToStairs();

	var guardAI = function ()
	{
		"use strict";

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			Game.getState().getMap().moveEntity(dwarf, step[0], step[1]);
		}

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	};
	return guardAI;
};
