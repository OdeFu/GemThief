createGrumpyIdleAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function idleAI()
	{
		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createGrumpyTrackingAI);
		}
	}
	return idleAI;
};

var createGrumpyTrackingAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function trackingAI()
	{
		AI.move(map.getPlayer().toPoint());

		AI.catchedPlayer();
	}
	return trackingAI;
};
