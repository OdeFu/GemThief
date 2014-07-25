createAI = function (dwarf, map, params)
{
	"use strict";

	var _dwarf = dwarf;
	var _map = map;
	var _params = params;

	var _lastSeenPlayerPosition = _map.getPlayer().toPoint();
	var _turnsSinceLastSeen = 0;

	var catchedPlayer = function ()
	{
		"use strict";

		var playerPos = _map.getPlayer().toPoint();
		if (playerPos.x === _dwarf.getX() && playerPos.y === _dwarf.getY())
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
		var playerPos = _map.getPlayer().toPoint();
		Path.runFOV(_dwarf.toPoint(), radius, function (x, y, r, visibility)
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

		var shortestPath = [_dwarf.getX(), _dwarf.getY()];
		var closestDistance = Number.MAX_VALUE;
		var stairs = _map.getStairs();
		for (var i = 0; i < stairs.length; i++)
		{
			var path = Path.generatePath(_dwarf.toPoint(), stairs[i].toPoint());
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
		radius = radius || _params.idleAIConfig.radius;
		return getVisiblePlayerPosition(radius) != null;
	};

	var changeToTrackingAI = function (ai)
	{
		_map.setMessage(_params.idleAIConfig.noticeMessage);
		_dwarf.setAI(ai(_dwarf, _map, _params));
	};

	var move = function (to)
	{
		"use strict";

		var path = Path.generatePath(_dwarf.toPoint(), to);
		if (path.length > 0)
		{
			_map.moveEntity(_dwarf, path[0][0], path[0][1]);
		}
		return path.length > 0;
	};

	var movePath = function (path)
	{
		"use strict";

		if (path.length > 0)
		{
			var step = path.splice(0, 1)[0];
			_map.moveEntity(_dwarf, step[0], step[1]);
		}
	};

	var getTrackingAI = function (lostCallback, stoppedCallback)
	{
		var trackingAI = function ()
		{
			"use strict";

			if (_params.trackingAIConfig.chanceToStop)
			{
				var stop = ROT.RNG.getPercentage() < _params.trackingAIConfig.chanceToStop;
				if (stop)
				{
					if (_params.trackingAIConfig.stopMessage)
					{
						_map.setMessage(_params.trackingAIConfig.stopMessage, 1);
					}

					if (stoppedCallback)
					{
						stoppedCallback();
					}
					return;
				}
			}

			move(_lastSeenPlayerPosition);

			if (catchedPlayer())
			{
				return;
			}

			var playerPos = getVisiblePlayerPosition(_params.trackingAIConfig.radius);
			_lastSeenPlayerPosition = playerPos || _lastSeenPlayerPosition;

			if (playerPos == null)
			{
				_turnsSinceLastSeen++;
			}

			if (_turnsSinceLastSeen > _params.trackingAIConfig.turnsUntilLost && lostCallback)
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
