createSneezyIdleAI = function (dwarf, params)
{
	var path = [];

	var idleAI = function ()
	{
		"use strict";

		if (path.length === 0)
		{
			path = Path.generatePath(dwarf.toPoint(), Game.getState().getMap().findEmptyTile().toPoint());
		}

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			Game.getState().getMap().moveEntity(dwarf, step[0], step[1]);
		}

		if (catchedPlayer(dwarf.toPoint()))
		{
			return;
		}

		var spottedPlayer = getVisiblePlayerPosition(dwarf.toPoint(), params.idleAIConfig.radius) != null;
		if (spottedPlayer)
		{
			Game.getState().getMap().setMessage(dwarf.getName() + " noticed you!");
			dwarf.setAI(createDocTrackingAI(dwarf, params));
		}
	};
	return idleAI;
};

var createDocTrackingAI = function (dwarf, params)
{
	var lastSeenPlayerPosition = Game.getState().getMap().getPlayer().toPoint();
	var turnsSinceLastSeen = 0;

	var trackingAI = function ()
	{
		"use strict";
		var stop = ROT.RNG.getPercentage() < params.trackingAIConfig.chanceToStop;
		if (stop)
		{
			Game.getState().getMap().setMessage("Doc stops and starts muttering something to himself.", 1);
			return;
		}

		var path = Path.generatePath(dwarf.toPoint(), lastSeenPlayerPosition);
		if (path.length > 0)
		{
			Game.getState().getMap().moveEntity(dwarf, path[0][0], path[0][1]);
		}

		if (catchedPlayer(dwarf.toPoint()))
		{
			return;
		}

		var playerPos = getVisiblePlayerPosition(dwarf.toPoint(), params.trackingAIConfig.radius);
		lastSeenPlayerPosition = playerPos || lastSeenPlayerPosition;

		if (playerPos == null)
		{
			turnsSinceLastSeen++;
		}

		if (turnsSinceLastSeen > params.trackingAIConfig.turnsUntilLost)
		{
			dwarf.setAI(createDocGuardAI(dwarf, params));
		}
	};
	return trackingAI;
};

var createDocGuardAI = function (dwarf, params)
{
	var path = getShortestPathToStairs(dwarf.toPoint());

	var guardAI = function ()
	{
		"use strict";

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			Game.getState().getMap().moveEntity(dwarf, step[0], step[1]);
		}

		var spottedPlayer = getVisiblePlayerPosition(dwarf.toPoint(), params.guardAIConfig.radius) != null;
		if (spottedPlayer)
		{
			dwarf.setAI(createDocTrackingAI(dwarf, params));
		}
	};
	return guardAI;
};

var catchedPlayer = function (pos)
{
	"use strict";

	var playerPos = Game.getState().getMap().getPlayer().toPoint();
	if (playerPos.x === pos.x && playerPos.y === pos.y)
	{
		Game.getState().getEngine().lock();
		Game.gameOver();
		return true;
	}
	return false;
};

var getVisiblePlayerPosition = function (from, radius)
{
	"use strict";

	var spottedPlayer = false;
	var playerPos = Game.getState().getMap().getPlayer().toPoint();
	Path.runFOV(from, radius, function (x, y, r, visibility)
	{
		if (playerPos.x === x && playerPos.y === y)
		{
			spottedPlayer = true;
		}
	});
	return spottedPlayer ? playerPos : null;
};

var getShortestPathToStairs = function (pos)
{
	"use strict";

	var shortestPath = [pos.x, pos.y];
	var closestDistance = Number.MAX_VALUE;
	var stairs = Game.getState().getMap().getStairs();
	for (var i = 0; i < stairs.length; i++)
	{
		var path = Path.generatePath(pos, stairs[i].toPoint());
		if (path.length < closestDistance)
		{
			shortestPath = path;
			closestDistance = path.length;
		}
	}
	return shortestPath;
};
