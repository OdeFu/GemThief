/**
 * Creates a new tile.
 *
 * @param x x-coordinate of the tile, defaults to 0
 * @param y y-coordinate of the tile, defaults to 0
 * @returns {{}} a new tile object
 */
createTile = function (x, y)
{
	"use strict";

	// Private fields
	var _x = x || 0;
	var _y = y || 0;
	var _seen = false; // Initially unseen
	var _entities = [new TileEntity({ x: _x, y: _y })];

	// Public methods
	var getX = function () { return _x; };
	var getY = function () { return _y; };
	var isEmpty = function () { return _entities.length === 1; };
	var isBlocking = function () { return _entities[0].isBlocking(); };
	var getForegroundColor = function () { return _entities[0].getColor(); };
	var getHiddenForegroundColor = function () { return "#606060"; };
	var getBackgroundColor = function () { return "black"; };
	var isSeen = function () { return _seen; };
	var setSeen = function (seen) { _seen = seen; };

	var getChar = function ()
	{
		return _seen ? _entities[0].getChar() : " ";
	};

  var getDungeonChar = function ()
  {
    if (_seen)
    {
      for (var i = 0; i < _entities.length; i++)
      {
        if (_entities[i].isDungeonChar())
        {
          return _entities[i].getChar();
        }
      }
    }
    return " ";
  };

	var addEntity = function (entity)
	{
		_entities.unshift(entity);
	};

	var removeEntity = function (entity)
	{
		var index = _entities.indexOf(entity);
		if (index >= 0)
		{
			_entities.splice(index, 1);
		}
	};

	// Create the actual tile
	var tile = {};
	tile.getX = getX;
	tile.getY = getY;
	tile.isBlocking = isBlocking;
	tile.getChar = getChar;
	tile.getForegroundColor = getForegroundColor;
	tile.getHiddenForegroundColor = getHiddenForegroundColor;
	tile.getBackgroundColor = getBackgroundColor;
	tile.isSeen = isSeen;
	tile.setSeen = setSeen;
	tile.addEntity = addEntity;
	tile.removeEntity = removeEntity;
	tile.isEmpty = isEmpty;
  tile.getDungeonChar = getDungeonChar;
	return tile;
};

TileEntity = function (params)
{
	return createTileEntity(params);
};

var createTileEntity = function (params)
{
	"use strict";

	params.char = '.';
  params.dungeonChar = true;
	return createEntity(params);
};

Wall = function (params)
{
	return createWall(params);
};

var createWall = function (params)
{
	"use strict";

	params.char = "#";
	params.color = "#888888";
	params.blocks = true;
  params.dungeonChar = true;
	return createEntity(params);
};