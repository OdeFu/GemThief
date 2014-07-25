createGrumpyIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var idleAI = function ()
	{
		"use strict";

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createGrumpyTrackingAI);
		}
	};
	return idleAI;
};

var createGrumpyTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var trackingAI = function ()
	{
		"use strict";

		var path = Path.generatePath(dwarf.toPoint(), Game.getState().getMap().getPlayer().toPoint());
		if (path.length > 0)
		{
			Game.getState().getMap().moveEntity(dwarf, path[0][0], path[0][1]);
		}

		AI.catchedPlayer(dwarf.toPoint());
	};
	return trackingAI;
};
