Stairs = function (params)
{
	"use strict";
	return createStairs(params);
};

var createStairs = function (params)
{
	"use strict";

	check(params.down, Boolean);

	// Private fields
	var _down = params.down;

	// Public methods
	var isDown = function ()
	{
		return _down;
	};

	params.char = _down ? ">" : "<";
	params.color = "brown";
	params.dungeonChar = true;

	var stairs = createEntity(params);
	stairs.isDown = isDown;
	return stairs;
};
