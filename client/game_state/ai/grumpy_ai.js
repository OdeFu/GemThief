createGrumpyIdleAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

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

var createGrumpyTrackingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var trackingAI = function ()
	{
		"use strict";

		AI.move(map.getPlayer().toPoint());

		AI.catchedPlayer();
	};
	return trackingAI;
};
