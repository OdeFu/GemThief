createBashfulIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var idleAI = function ()
	{
		"use strict";

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createScaredAI);
		}
	};
	return idleAI;
};

var createScaredAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);
	var turnsScared = 2 + Math.floor(ROT.RNG.getUniform() * 3); // 2 - 4

	var scaredAI = function ()
	{
		"use strict";

		if (turnsScared > 0)
		{
			var pos = dwarf.toPoint();
			var playerPos = Game.getState().getMap().getPlayer().toPoint();
			var dirX = pos.x - playerPos.x >= 0 ? 1 : -1;
			var dirY = pos.y - playerPos.y >= 0 ? 1 : -1;

			if (AI.move({ x: pos.x + dirX, y: pos.y + dirY }))
			{
				Game.getState().getMap().setMessage("Bashful screams in terror as he runs away from you.", 1);
			}
			else
			{
				Game.getState().getMap().setMessage("Bashful screams in terror as he tries runs away from you and collides with a wall.",
				1);
			}

			turnsScared--;

			if (turnsScared === 0)
			{
				Game.getState().getMap().setMessage("Bashful collects his courage and turns towards you.");
				dwarf.setAI(createBashfulTrackingAI(dwarf, params));
			}
		}

	};
	return scaredAI;
};

var createBashfulTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);
	var lostCallback = function ()
	{
		dwarf.setAI(createBashfulIdleAI(dwarf, params));
	};

	return AI.getTrackingAI(lostCallback);
};
