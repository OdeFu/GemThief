createBashfulIdleAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function idleAI()
	{
		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createScaredAI);
		}
	}
	return idleAI;
};

var createScaredAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);
	var turnsScared = ROT.RNG.getUniformInt(2, params.scaredAIConfig.maxDuration);

	function scaredAI()
	{
		if (turnsScared > 0)
		{
			var pos = dwarf.toPoint();
			var playerPos = map.getPlayer().toPoint();
			var dirX = pos.x - playerPos.x >= 0 ? 1 : -1;
			var dirY = pos.y - playerPos.y >= 0 ? 1 : -1;

			if (AI.move({ x: pos.x + dirX, y: pos.y + dirY }))
			{
				map.setMessage("Bashful screams in terror as he runs away from you.", 1);
			}
			else
			{
				map.setMessage("Bashful screams in terror as he tries runs away from you and collides with a wall.", 1);
			}

			turnsScared--;

			if (turnsScared === 0)
			{
				map.setMessage("Bashful collects his courage and turns towards you.");
				dwarf.setAI(createBashfulTrackingAI(dwarf, map, params));
			}
		}

	}
	return scaredAI;
};

var createBashfulTrackingAI = function (dwarf, map, params)
{
	"use strict";

	var AI = createAI(dwarf, map, params);

	function lostCallback()
	{
		dwarf.setAI(createBashfulIdleAI(dwarf, map, params));
	}

	return AI.getTrackingAI(lostCallback);
};
