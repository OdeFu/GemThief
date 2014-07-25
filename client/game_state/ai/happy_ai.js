createHappyIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);
	var path = [];

	var idleAI = function ()
	{
		"use strict";

		if (path.length === 0)
		{
			path = Path.generatePath(dwarf.toPoint(), Game.getState().getMap().findEmptyTile().toPoint());
		}

		AI.movePath(path);

		if (AI.catchedPlayer())
		{
			return;
		}

		if (AI.spottedPlayer(params.idleAIConfig.radius))
		{
			AI.changeToTrackingAI(createHappyTrackingAI);
		}
	};
	return idleAI;
};

var createHappyTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var tellJoke = function ()
	{
		"use strict";
		var joke = Math.floor(ROT.RNG.getUniform() * params.jokes.length);
		Game.getState().getMap().setMessage("\"" + joke + "\"");
	};

	var lostCallback = function ()
	{
		dwarf.setAI(createHappyIdleAI(dwarf, params));
	};

	var stoppedCallback = function ()
	{
		tellJoke();
	};

	return AI.getTrackingAI(lostCallback, stoppedCallback);
};

