createDocIdleAI = function (dwarf, params)
{
	var path = [];
	var AI = createAI(dwarf, params);

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

		if (AI.catchedPlayer())
		{
			return;
		}

		if (AI.spottedPlayer(params.idleAIConfig.radius))
		{
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	};
	return idleAI;
};

var createDocTrackingAI = function (dwarf, params)
{
	var lastSeenPlayerPosition = Game.getState().getMap().getPlayer().toPoint();
	var turnsSinceLastSeen = 0;
	var AI = createAI(dwarf, params);

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

		if (AI.catchedPlayer())
		{
			return;
		}

		var playerPos = AI.getVisiblePlayerPosition(params.trackingAIConfig.radius);
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
	var AI = createAI(dwarf, params);
	var path = AI.getShortestPathToStairs();

	var guardAI = function ()
	{
		"use strict";

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			Game.getState().getMap().moveEntity(dwarf, step[0], step[1]);
		}

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createDocTrackingAI);
		}
	};
	return guardAI;
};
