"use strict";

const NUM_LIGHT_LOCATIONS = 5;

GemThief.Map = {
	/**
	 * Create a map level.
	 *
	 * @param params
	 *  - width: the width of the map, required
	 *  - height: the height of the map, required
	 *  - level: the level depth of the map, defaults to 1
	 */
	instantiate: function (params) {
		check(params.width, Number);
		check(params.height, Number);

		const map = Object.create(GemThief.Map);
		map.tiles = [];
		map.level = params.level || 1;
		map.stairs = [];
		map.lightLocations = [];
		map.width = params.width;
		map.height = params.height;

		map.getSomeTiles = getSomeTiles.bind(map);
		map.getTile = getTile.bind(map);
		map.isEmpty = isEmpty.bind(map);
		map.isBlocking = isBlocking.bind(map);
		map.findEmptyTile = findEmptyTile.bind(map);
		map.calculateVisibleTiles = calculateVisibleTiles.bind(map);
		map.moveEntity = moveEntity.bind(map);
		map.getStairsUp = getStairsUp.bind(map);

		// Dig the level
		_dig(map);
		_generateLightingData(map);
		_createStairs(map);

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

function getStairsUp() {
	return _.find(this.stairs, function findUpStairs(stair) {
		return !stair.down;
	});
}

// Private methods


function _createStairs(map) {
	const upTile = map.findEmptyTile();
	map.stairs[0] = GemThief.Stairs.instantiate({ x: upTile.x, y: upTile.y, down: false });
	upTile.addEntity(map.stairs[0]);

	const downTile = map.findEmptyTile();
	map.stairs[1] = GemThief.Stairs.instantiate({ x: downTile.x, y: downTile.y, down: true });
	downTile.addEntity(map.stairs[1]);
}

function _dig(map) {
	const digger = new ROT.Map.Digger(map.width, map.height, map.params);

	function digCallback(x, y, value) {
		const tile = GemThief.Tile.instantiate({ x: x, y: y });
		const wall = value === 1;
		if (wall) {
			tile.addEntity(GemThief.Wall.instantiate({ x: x, y: y }));
		}

		map.tiles.push(tile);
	}

	digger.create(digCallback.bind(this));
}

function _generateLightingData(map) {
	function lightPass(x, y) {
		return !map.isBlocking(x, y);
	}

	const fov = new ROT.FOV.PreciseShadowcasting(lightPass, { topology: 4 });

	function reflectivityCallback(x, y) {
		const tile = map.getTile(x, y);
		return tile.isEmpty() ? 0.3 : 0;
	}

	const lighting = new ROT.Lighting(reflectivityCallback, { range: 12, passes: 2 });
	lighting.setFOV(fov);

	const lightColor = [200, 200, 0];

	_initializeLightLocations(map);
	map.lightLocations.forEach(function setLight(light){
		lighting.setLight(light.x, light.y, lightColor);
	});

	function lightingCallback(x, y, color) {
		const tile = map.getTile(x, y);
		tile.color = color;
	}

	lighting.compute(lightingCallback);
}

function _initializeLightLocations(map) {
	_.times(NUM_LIGHT_LOCATIONS, function createLightLocation() {
		map.lightLocations.push(map.findEmptyTile());
	});
}

function _getAllEmptyTiles(map) {
	return _.filter(map.tiles, function tileFilter(tile) {
		return tile.isEmpty();
	});
}
