/**
 * Creates a new tile.
 *
 * @param params
 * - x: the x-coordinate, defaults to 0
 * - y: the y-coordinate, defaults to 0
 * @returns {{}} a new tile object
 */
createTile = function (params) {
	"use strict";

	// Private fields
	var _x = params.x || 0;
	var _y = params.y || 0;
	var _seen = false; // Initially unseen
	var _entities = [];
	var _color;

	// Public methods
	function getX() {
		return _x;
	}

	function getY() {
		return _y;
	}

	function isEmpty() {
		return _entities.length === 1;
	}

	function isBlocking() {
		return getHighestEntity().isBlocking();
	}

	function getForegroundColor() {
		var entityColor = ROT.Color.fromString(getHighestEntity().getColor());
		var ambientLight = [100, 100, 100];
		var light = ambientLight.slice(0);

		if (_color) {
			light = ROT.Color.add(light, _color);
		}

		var finalColor = ROT.Color.multiply(entityColor, light);
		return ROT.Color.toRGB(finalColor);
	}

	function getBackgroundColor() {
		return "black";
	}

	function isSeen() {
		return _seen;
	}

	function setSeen(seen) {
		_seen = seen;
	}

	function getChar() {
		return _seen ? getHighestEntity().getChar() : " ";
	}

	function addEntity(entity) {
		_entities[entity.getPriority()] = entity;
	}

	function removeEntity(entity) {
		_entities[entity.getPriority()] = null;
	}

	function getHighestEntity() {
		for (var i = _entities.length - 1; i >= 0; i--) {
			if (_entities[i]) {
				return _entities[i];
			}
		}
		return null;
	}

	function getEntity(index) {
		return _entities[index];
	}

	function setColor(color) {
		_color = color;
	}

	function getColor() {
		return _color;
	}

	function toPoint() {
		return {x: _x, y: _y};
	}

	// Create the actual tile
	var tile = {};
	tile.getX = getX;
	tile.getY = getY;
	tile.isBlocking = isBlocking;
	tile.getChar = getChar;
	tile.getForegroundColor = getForegroundColor;
	tile.getBackgroundColor = getBackgroundColor;
	tile.isSeen = isSeen;
	tile.setSeen = setSeen;
	tile.addEntity = addEntity;
	tile.removeEntity = removeEntity;
	tile.isEmpty = isEmpty;
	tile.getHighestEntity = getHighestEntity;
	tile.getEntity = getEntity;
	tile.setColor = setColor;
	tile.getColor = getColor;
	tile.toPoint = toPoint;

	// Initialize the tile
	tile.addEntity(new FloorEntity(tile.toPoint()));

	return tile;
};

FloorEntity = function (params) {
	return createFloorEntity(params);
};

function createFloorEntity(params) {
	"use strict";

	params.char = '.';
	params.dungeonChar = true;
	params.priority = Entity.FLOOR;
	return createEntity(params);
}

Wall = function (params) {
	return createWall(params);
};

function createWall(params) {
	"use strict";

	params.char = "#";
	params.color = "#888888";
	params.blocks = true;
	params.dungeonChar = true;
	params.priority = Entity.WALL;
	return createEntity(params);
}
