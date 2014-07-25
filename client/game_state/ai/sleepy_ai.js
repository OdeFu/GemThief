createSleepyIdleAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var idleAI = function ()
	{
		"use strict";

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createSleepyTrackingAI);
		}
	};
	return idleAI;
};

var createSleepyTrackingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createSleepyIdleAI(dwarf, map, params));
	};

	return AI.getTrackingAI(lostCallback);
};
