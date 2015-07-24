"use strict";

class Tile {
	/**
	 * Creates a new tile.
	 *
	 * @param params
	 * - x: the x-coordinate, defaults to 0
	 * - y: the y-coordinate, defaults to 0
	 * - value: is there a wall(1), or no(0)
	 */
	constructor(params) {
		this.x = params.x || 0;
		this.y = params.y || 0;
		this.seen = false; // Initially unseen
		this.entities = [];

		// Initialize the tile
		this.addEntity(new GemThief.FloorEntity(this.toPoint()));
		if (params.value === GemThief.MapFeatures.WALL) {
			this.addEntity(new GemThief.Wall(this.toPoint()));
		}
	}

	isEmpty() {
		return this.entities.length === 1;
	}

	isBlocking() {
		return this.getHighestEntity().blocks;
	}

	getForegroundColor() {
		const entityColor = ROT.Color.fromString(this.getHighestEntity().color);
		const ambientLight = [100, 100, 100];
		const defaultLight = ambientLight.slice(0);
		const light = this.color ? ROT.Color.add(defaultLight, this.color) : defaultLight;
		const finalColor = ROT.Color.multiply(entityColor, light);
		return ROT.Color.toRGB(finalColor);
	}

	getBackgroundColor() {
		return "black";
	}

	getChar() {
		return this.seen ? this.getHighestEntity().char : " ";
	}

	addEntity(entity) {
		this.entities[entity.priority] = entity;
	}

	removeEntity(entity) {
		this.entities[entity.priority] = null;
	}

	getHighestEntity() {
		return _.findLast(this.entities, function lastIndex(entity) {
			return entity != null;
		});
	}

	getEntity(index) {
		return this.entities[index];
	}

	toPoint() {
		return { x: this.x, y: this.y };
	}
}

GemThief.Tile = Tile;
