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

		AI.move(Game.getState().getMap().getPlayer().toPoint());

		AI.catchedPlayer();
	};
	return trackingAI;
};
