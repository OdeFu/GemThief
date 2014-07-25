getRandomStartLocation = function (map)
{
	return map.findEmptyTile();
};

getDarkStartLocation = function (map)
{
	"use strict";

	var darkTiles = function (tile)
	{
		return !tile.getColor();
	};
	return map.getSomeTiles(darkTiles).random();
};

getLightStartLocation = function (map)
{
	"use strict";

	var lightTiles = function (tile)
	{
		return tile.getColor();
	};
	return map.getSomeTiles(lightTiles).random();
};

getBrightLightStartLocation = function (map)
{
	return map.getLightLocations().random();
};
