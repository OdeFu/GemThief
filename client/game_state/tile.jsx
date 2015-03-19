Tile = {
	/**
	 * Creates a new tile.
	 *
	 * @param params
	 * - x: the x-coordinate, defaults to 0
	 * - y: the y-coordinate, defaults to 0
	 * @returns {{}} a new tile object
	 */
	instantiate: function (params) {
		"use strict";

		const tile = {};
		tile.x = params.x || 0;
		tile.y = params.y || 0;
		tile.seen = false; // Initially unseen
		tile.entities = [];

		tile.isBlocking = isBlocking.bind(tile);
		tile.getChar = getChar.bind(tile);
		tile.getForegroundColor = getForegroundColor.bind(tile);
		tile.getBackgroundColor = getBackgroundColor.bind(tile);

		tile.addEntity = addEntity.bind(tile);
		tile.removeEntity = removeEntity.bind(tile);
		tile.isEmpty = isEmpty.bind(tile);
		tile.getHighestEntity = getHighestEntity.bind(tile);
		tile.getEntity = getEntity.bind(tile);
		tile.toPoint = toPoint.bind(tile);

		// Initialize the tile
		tile.addEntity(FloorEntity.instantiate(tile.toPoint()));

		return tile;
	}
};

// Public methods

function isEmpty() {
	return this.entities.length === 1;
}

function isBlocking() {
	return this.getHighestEntity().blocks;
}

function getForegroundColor() {
	const entityColor = ROT.Color.fromString(this.getHighestEntity().color);
	const ambientLight = [100, 100, 100];
	const defaultLight = ambientLight.slice(0);
	const light = this.color ? ROT.Color.add(defaultLight, this.color) : defaultLight;
	const finalColor = ROT.Color.multiply(entityColor, light);
	return ROT.Color.toRGB(finalColor);
}

function getBackgroundColor() {
	return "black";
}

function getChar() {
	return this.seen ? this.getHighestEntity().char : " ";
}

function addEntity(entity) {
	this.entities[entity.priority] = entity;
}

function removeEntity(entity) {
	this.entities[entity.priority] = null;
}

function getHighestEntity() {
	return _.findLast(this.entities, function lastIndex(entity) {
		return entity != null;
	});
}

function getEntity(index) {
	return this.entities[index];
}

function toPoint() {
	return { x: this.x, y: this.y };
}

FloorEntity = {
	instantiate: function (params) {
		"use strict";

		params.char = '.';
		params.dungeonChar = true;
		params.priority = Entity.FLOOR;
		return Entity.instantiate(params);
	}
};

Wall = {
	instantiate: function (params) {
		"use strict";

		params.char = "#";
		params.color = "#888888";
		params.blocks = true;
		params.dungeonChar = true;
		params.priority = Entity.WALL;
		return Entity.instantiate(params);
	}
};
