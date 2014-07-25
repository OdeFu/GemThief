createSleepyIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

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

var createSleepyTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createSleepyIdleAI(dwarf, params));
	};

	return AI.getTrackingAI(lostCallback);
};
