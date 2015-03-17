Stairs = function (params)
{
	"use strict";

	return createStairs(params);
};

Stairs.type = "Stairs";

var createStairs = function (params)
{
	"use strict";

	check(params.down, Boolean);

	// Public methods
	function isDown()
	{
		return params.down;
	}

	params.char = params.down ? ">" : "<";
	params.color = "brown";
	params.dungeonChar = true;
	params.priority = Entity.FLOOR;
	params.type = Stairs.type;

	var stairs = createEntity(params);
	stairs.isDown = isDown;
	return stairs;
};
