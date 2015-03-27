"use strict";

GemThief.Map = {
	instantiate: function (mapData, params) {
		const map = Object.create(GemThief.Map);
		map.getSomeTiles = getSomeTiles.bind(map);
		map.getTile = getTile.bind(map);
		map.isEmpty = isEmpty.bind(map);
		map.isBlocking = isBlocking.bind(map);
		map.findEmptyTile = findEmptyTile.bind(map);
		map.calculateVisibleTiles = calculateVisibleTiles.bind(map);
		map.moveEntity = moveEntity.bind(map);

		map.level = params.level || 1;
		map.width = params.width;
		map.height = params.height;
		map.tiles = _createTiles(GemThief.Digger.dig(params));
		map.stairs = _createStairs(mapData.stairs, map);

		_setupLights(mapData.lights, map);

		return map;
	}
};

// Public methods

function getSomeTiles(func) {
	return _.filter(this.tiles, function someTilesFilter(tile) {
		return func(tile);
	});
}

function getTile(x, y) {
	return this.tiles[this.height * x + y];
}

function isEmpty(x, y) {
	const tile = this.getTile(x, y);
	return tile && tile.isEmpty();
}

function isBlocking(x, y) {
	const tile = this.getTile(x, y);
	return tile && tile.isBlocking();
}

function findEmptyTile() {
	const empties = _getAllEmptyTiles(this);
	return empties.random();
}

function calculateVisibleTiles(location) {
	const tiles = [];

	function lightPass(x, y) {
		return !this.isBlocking(x, y);
	}

	const fov = new ROT.FOV.PreciseShadowcasting(lightPass.bind(this));
	fov.compute(location.x, location.y, 2, function fovCallback(x, y) {
		const tile = this.getTile(x, y);
		tile.seen = true;
		tiles.push(tile);
	}.bind(this));

	// Do another pass for tiles that have light
	fov.compute(location.x, location.y, 20, function fovCallback(x, y) {
		const tile = this.getTile(x, y);
		if (tile.color) {
			tile.seen = true;
			tiles.push(tile);
		}
	}.bind(this));

	return tiles;
}

function moveEntity(entity, newX, newY) {
	const oldTile = this.getTile(entity.x, entity.y);
	oldTile.removeEntity(entity);

	const newTile = this.getTile(newX, newY);
	newTile.addEntity(entity);

	entity.x = newX;
	entity.y = newY;
}

// Private methods

function _getAllEmptyTiles(map) {
	return _.filter(map.tiles, function tileFilter(tile) {
		return tile.isEmpty();
	});
}

function _createStairs(data, map) {
	return _.map(data, function createTile (stairData) {
		const stair = GemThief.Stairs.instantiate(stairData);
		const tile = map.getTile(stairData.x, stairData.y);
		tile.addEntity(stair);
		return stair;
	});
}

function _setupLights(lights, map) {
	_.each(lights, function (light) {
		const tile = map.getTile(light.x, light.y);
		tile.color = light.color;
	});
}

function _createTiles(mapData) {
	return _.map(mapData, function createTile(tileData) {
		return GemThief.Tile.instantiate(tileData);
	})
}
