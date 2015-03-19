const NUM_LIGHT_LOCATIONS = 5;

/**
 * Create a map level.
 *
 * @param params
 *  - width: the width of the map, required
 *  - height: the height of the map, required
 *  - level: the level depth of the map, defaults to 1
 *  - numGems: the number of gems to be generated, defaults to 10
 */
createMap = function (params) {
	"use strict";

	check(params.width, Number);
	check(params.height, Number);

	const map = {};
	map.tiles = [];
	map.player = null;
	map.gems = [];
	map.dwarves = [];
	map.level = params.level || 1;
	map.stairs = [];
	map.lightLocations = [];
	map.width = params.width;
	map.height = params.height;
	map.message = "";
	map.messageLife = 0;
	map.numGems = params.numGems || 10;
	map.params = params;

	map.getSomeTiles = getSomeTiles.bind(map);
	map.getTile = getTile.bind(map);
	map.draw = draw.bind(map);
	map.isEmpty = isEmpty.bind(map);
	map.isBlocking = isBlocking.bind(map);
	map.findEmptyTile = findEmptyTile.bind(map);
	map.calculateVisibleTiles = calculateVisibleTiles.bind(map);
	map.getGem = getGem.bind(map);
	map.removeGem = removeGem.bind(map);
	map.moveEntity = moveEntity.bind(map);
	map.setMessage = setMessage.bind(map);

	// Dig the level
	_dig(map);
	_generateLightingData(map);
	_createEntities(map);

	return map;
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

function setMessage(msg, messageLife) {
	this.message = msg;
	this.messageLife = messageLife || 3;
}

function draw(display) {
	if (this.message) {
		display.drawText(0, 0, this.message);
		this.messageLife--;
		if (this.messageLife === 0) {
			this.message = null;
		}
	}

	const visibleTiles = this.calculateVisibleTiles();
	visibleTiles.forEach(function drawTiles(tile) {
		display.draw(tile.x, tile.y + 1, tile.getChar(), tile.getForegroundColor(), tile.getBackgroundColor());
	});

	display.drawText(0, this.height + 1, "Mine Level: " + this.level);
	GemThief.Game.drawTextRight(this.height + 1, "Gems Found: " + GemThief.Game.state.playerStats.gems);
}

function findEmptyTile() {
	const empties = _getAllEmptyTiles(this);
	return empties.random();
}

function calculateVisibleTiles() {
	const tiles = [];

	function lightPass(x, y) {
		return !this.isBlocking(x, y);
	}

	const fov = new ROT.FOV.PreciseShadowcasting(lightPass.bind(this));
	fov.compute(this.player.x, this.player.y, 2, function fovCallback(x, y) {
		const tile = this.getTile(x, y);
		tile.seen = true;
		tiles.push(tile);
	}.bind(this));

	// Do another pass for tiles that have light
	fov.compute(this.player.x, this.player.y, 20, function fovCallback(x, y) {
		const tile = this.getTile(x, y);
		if (tile.color) {
			tile.seen = true;
			tiles.push(tile);
		}
	}.bind(this));

	return tiles;
}

function getGem(x, y) {
	return _.find(this.gems, function findGem(gem) {
		return gem.x === x && gem.y === y;
	});
}

function removeGem(gem) {
	const index = this.gems.indexOf(gem);
	if (index >= 0) {
		this.gems.splice(index, 1);
		const tile = this.getTile(gem.x, gem.y);
		tile.removeEntity(gem);
	}
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

function _createEntities(map) {
	_createGems(map);

	_createPlayer(map);

	_createDwarf(map);

	_createStairs(map);
}

function _createPlayer(map) {
	const tile = map.findEmptyTile();
	map.player = GemThief.Player.instantiate(tile.toPoint());
	tile.addEntity(map.player);
}

function _createDwarf(map) {
	const dwarves = map.params.config.dwarves.slice(0);
	dwarves.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	const data = dwarves[map.level - 1];

	const tile = DWARF_START_LOCATIONS[data.startLocation](map);
	data.x = tile.x;
	data.y = tile.y;

	const dwarf = GemThief.Dwarf.instantiate(data);
	dwarf.setAI(DWARF_AIS[data.idleAI](dwarf, map, data));
	tile.addEntity(dwarf);
	map.dwarves.push(dwarf);
}

function _createGems(map) {
	"use strict";

	_.times(map.numGems, function createGem() {
		const tile = map.findEmptyTile();
		const gem = GemThief.Gem.instantiate(tile.toPoint());
		tile.addEntity(gem);
		map.gems.push(gem);
	});
}

function _createStairs(map) {
	// always create stairs going up where the player is
	const tile = map.getTile(map.player.x, map.player.y);
	map.stairs[0] = GemThief.Stairs.instantiate({ x: map.player.x, y: map.player.y, down: false });
	tile.addEntity(map.stairs[0]);

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
	"use strict";

	_.times(NUM_LIGHT_LOCATIONS, function createLightLocation() {
		map.lightLocations.push(map.findEmptyTile());
	});
}

function _getAllEmptyTiles(map) {
	return _.filter(map.tiles, function tileFilter(tile) {
		return tile.isEmpty();
	});
}
