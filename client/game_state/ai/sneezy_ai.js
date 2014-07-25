createSneezyIdleAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var idleAI = function ()
	{
		"use strict";

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createSneezyTrackingAI);
		}
	};
	return idleAI;
};

var createSneezyTrackingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createSleepyIdleAI(dwarf, map, params));
	};

	var stoppedCallback = function ()
	{
		dwarf.setAI(createSneezingAI(dwarf, map, params));
	};

	return AI.getTrackingAI(lostCallback, stoppedCallback);
};

var createSneezingAI = function (dwarf, map, params)
{
	var AI = createAI(dwarf, map, params);
	var sneezeDuration = ROT.RNG.getUniformInt(1, params.sneezingAIConfig.maxDuration);

	var sneezingAI = function ()
	{
		"use strict";

		sneezeDuration--;

		if (sneezeDuration === 0)
		{
			map.setMessage("Sneezy recovers from the sneeze.");
			var playerPos = AI.getVisiblePlayerPosition();
			dwarf.setAI(playerPos === null ? createSneezyIdleAI(dwarf, map, params) :
			            createSneezyTrackingAI(dwarf, map, params));
		}
	};
	return sneezingAI;
};
