DWARF_NAMES = [ "Doc", "Grumpy", "Happy", "Sleepy", "Bashful", "Sneezy", "Dopey" ];

/**
 * Creates a new dwarf.
 * @param params
 */
createDwarf = function (params)
{
	"use strict";

	check(params.name, String);

	// Private fields
	var _name = params.name;
	var COLORS = [ "orange", "red", "yellow", "brown", "purple", "goldenrod", "green" ];

	// Public methods
	var getName = function ()
	{
		return _name;
	};

	var act = function ()
	{
		var x = Game.getState().getMap().getPlayer().getX();
		var y = Game.getState().getMap().getPlayer().getY();

		var passableCallback = function (x, y)
		{
			return !Game.getState().getMap().isBlocking(x, y);
		};

		var astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
		var path = [];
		var pathCallback = function (x, y)
		{
			path.push([x, y]);
		};

		astar.compute(dwarf.getX(), dwarf.getY(), pathCallback);

		/* Remove Pedro's position */
		path.shift();

		if (path.length > 0)
		{
			Game.getState().getMap().moveEntity(dwarf, path[0][0], path[0][1]);
		}

		if (path.length <= 1)
		{
			Game.getState().getEngine().lock();
			Game.gameOver(false);
		}
	};

	params.char = "d";
	params.color = COLORS[DWARF_NAMES.indexOf(_name)];
	params.priority = Entity.ENTITY;

	var dwarf = createEntity(params);
	dwarf.getName = getName;
	dwarf.act = act;
	return dwarf;
};
