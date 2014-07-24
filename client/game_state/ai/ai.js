createAI = function (dwarf, params)
{
	"use strict";

	var catchedPlayer = function ()
	{
		"use strict";

		var playerPos = Game.getState().getMap().getPlayer().toPoint();
		if (playerPos.x === dwarf.getX() && playerPos.y === dwarf.getY())
		{
			Game.getState().getEngine().lock();
			Game.gameOver();
			return true;
		}
		return false;
	};

	var getVisiblePlayerPosition = function (radius)
	{
		"use strict";

		var spottedPlayer = false;
		var playerPos = Game.getState().getMap().getPlayer().toPoint();
		Path.runFOV(dwarf.toPoint(), radius, function (x, y, r, visibility)
		{
			if (playerPos.x === x && playerPos.y === y)
			{
				spottedPlayer = true;
			}
		});
		return spottedPlayer ? playerPos : null;
	};

	var getShortestPathToStairs = function ()
	{
		"use strict";

		var shortestPath = [dwarf.getX(), dwarf.getY()];
		var closestDistance = Number.MAX_VALUE;
		var stairs = Game.getState().getMap().getStairs();
		for (var i = 0; i < stairs.length; i++)
		{
			var path = Path.generatePath(dwarf.toPoint(), stairs[i].toPoint());
			if (path.length < closestDistance)
			{
				shortestPath = path;
				closestDistance = path.length;
			}
		}
		return shortestPath;
	};

	var spottedPlayer = function (radius)
	{
		return getVisiblePlayerPosition(dwarf.toPoint(), radius) != null;
	};

	var changeToTrackingAI = function (ai)
	{
		Game.getState().getMap().setMessage(dwarf.getName() + " noticed you!");
		dwarf.setAI(ai(dwarf, params));
	};

	var AI = {};
	AI.getShortestPathToStairs = getShortestPathToStairs;
	AI.getVisiblePlayerPosition = getVisiblePlayerPosition;
	AI.catchedPlayer = catchedPlayer;
	AI.spottedPlayer = spottedPlayer;
	AI.changeToTrackingAI = changeToTrackingAI;
	return AI;
};
