createSneezyIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

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

var createSneezyTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var lostCallback = function ()
	{
		dwarf.setAI(createSleepyIdleAI(dwarf, params));
	};

	var stoppedCallback = function ()
	{
		dwarf.setAI(createSneezingAI(dwarf, params));
	};

	return AI.getTrackingAI(lostCallback, stoppedCallback);
};

var createSneezingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);
	var sneezeDuration = 1 + Math.floor(ROT.RNG.getUniform() * params.sneezingAIConfig.maxDuration);

	var sneezingAI = function ()
	{
		"use strict";

		sneezeDuration--;

		if (sneezeDuration === 0)
		{
			Game.getState().getMap().setMessage("Sneezy recovers from the sneeze.");
			var playerPos = AI.getVisiblePlayerPosition();
			dwarf.setAI(playerPos === null ? createSneezyIdleAI(dwarf, params) : createSneezyTrackingAI(dwarf, params));
		}
	};
	return sneezingAI;
};
