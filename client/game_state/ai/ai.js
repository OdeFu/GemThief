createAI = function (dwarf, params)
{
	"use strict";

	var lastSeenPlayerPosition = Game.getState().getMap().getPlayer().toPoint();
	var turnsSinceLastSeen = 0;

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
		Game.getState().getMap().setMessage(params.idleAIConfig.noticeMessage);
		dwarf.setAI(ai(dwarf, params));
	};

	var move = function (to)
	{
		"use strict";

		var path = Path.generatePath(dwarf.toPoint(), to);
		if (path.length > 0)
		{
			Game.getState().getMap().moveEntity(dwarf, path[0][0], path[0][1]);
		}
		return path.length > 0;
	};

	var movePath = function (path)
	{
		"use strict";

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			Game.getState().getMap().moveEntity(dwarf, step[0], step[1]);
		}
	};

	var getTrackingAI = function (lostCallback)
	{
		var trackingAI = function ()
		{
			"use strict";

			if (params.trackingAIConfig.chanceToStop)
			{
				var stop = ROT.RNG.getPercentage() < params.trackingAIConfig.chanceToStop;
				if (stop)
				{
					if (params.trackingAIConfig.stopMessage)
					{
						Game.getState().getMap().setMessage(params.trackingAIConfig.stopMessage, 1);
					}
					return;
				}
			}

			move(lastSeenPlayerPosition);

			if (catchedPlayer())
			{
				return;
			}

			var playerPos = getVisiblePlayerPosition(params.trackingAIConfig.radius);
			lastSeenPlayerPosition = playerPos || lastSeenPlayerPosition;

			if (playerPos == null)
			{
				turnsSinceLastSeen++;
			}

			if (turnsSinceLastSeen > params.trackingAIConfig.turnsUntilLost)
			{
				lostCallback();
			}
		};
		return trackingAI;
	};

	var AI = {};
	AI.getShortestPathToStairs = getShortestPathToStairs;
	AI.getVisiblePlayerPosition = getVisiblePlayerPosition;
	AI.catchedPlayer = catchedPlayer;
	AI.spottedPlayer = spottedPlayer;
	AI.changeToTrackingAI = changeToTrackingAI;
	AI.move = move;
	AI.movePath = movePath;
	AI.getTrackingAI = getTrackingAI;
	return AI;
};
