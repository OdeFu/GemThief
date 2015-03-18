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

	var map = {};
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
	var tile = this.getTile(x, y);
	return tile && tile.isEmpty();
}

function isBlocking(x, y) {
	var tile = this.getTile(x, y);
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

	var visibleTiles = this.calculateVisibleTiles();
	visibleTiles.forEach(function drawTiles(tile) {
		display.draw(tile.x, tile.y + 1, tile.getChar(), tile.getForegroundColor(), tile.getBackgroundColor());
	});

	display.drawText(0, this.height + 1, "Mine Level: " + this.level);
	Game.drawTextRight(this.height + 1, "Gems Found: " + Game.state.playerStats.gems);
}

function findEmptyTile() {
	var empties = _getAllEmptyTiles(this);
	return empties.random();
}

function calculateVisibleTiles() {
	var tiles = [];

	function lightPass(x, y) {
		return !this.isBlocking(x, y);
	}

	var fov = new ROT.FOV.PreciseShadowcasting(lightPass.bind(this));
	fov.compute(this.player.x, this.player.y, 2, function fovCallback(x, y) {
		var tile = this.getTile(x, y);
		tile.seen = true;
		tiles.push(tile);
	}.bind(this));

	// Do another pass for tiles that have light
	fov.compute(this.player.x, this.player.y, 20, function fovCallback(x, y) {
		var tile = this.getTile(x, y);
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
	var index = this.gems.indexOf(gem);
	if (index >= 0) {
		this.gems.splice(index, 1);
		var tile = this.getTile(gem.x, gem.y);
		tile.removeEntity(gem);
	}
}

function moveEntity(entity, newX, newY) {
	var oldTile = this.getTile(entity.x, entity.y);
	oldTile.removeEntity(entity);

	var newTile = this.getTile(newX, newY);
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
	var tile = map.findEmptyTile();
	map.player = Player.instantiate(tile.toPoint());
	tile.addEntity(map.player);
}

function _createDwarf(map) {
	var dwarves = map.params.config.dwarves.slice(0);
	dwarves.sort(function dwarfSort(dwarf1, dwarf2) {
		return dwarf1.level - dwarf2.level;
	});
	var data = dwarves[map.level - 1];

	var tile = DWARF_START_LOCATIONS[data.startLocation](map);
	data.x = tile.x;
	data.y = tile.y;

	var dwarf = Dwarf.instantiate(data);
	dwarf.setAI(DWARF_AIS[data.idleAI](dwarf, map, data));
	tile.addEntity(dwarf);
	map.dwarves.push(dwarf);
}

function _createGems(map) {
	for (var i = 0; i < map.numGems; i++) {
		var tile = map.findEmptyTile();
		var gem = Gem.instantiate(tile.toPoint());
		tile.addEntity(gem);
		map.gems.push(gem);
	}
}

function _createStairs(map) {
	// always create stairs going up where the player is
	var tile = map.getTile(map.player.x, map.player.y);
	map.stairs[0] = Stairs.instantiate({ x: map.player.x, y: map.player.y, down: false });
	tile.addEntity(map.stairs[0]);

	var downTile = map.findEmptyTile();
	map.stairs[1] = Stairs.instantiate({ x: downTile.x, y: downTile.y, down: true });
	downTile.addEntity(map.stairs[1]);
}

function _dig(map) {
	var digger = new ROT.Map.Digger(map.width, map.height, map.params);

	function digCallback(x, y, value) {
		var tile = Tile.instantiate({ x: x, y: y });
		var wall = value === 1;
		if (wall) {
			tile.addEntity(Wall.instantiate({ x: x, y: y }));
		}

		map.tiles.push(tile);
	}

	digger.create(digCallback.bind(this));
}

function _generateLightingData(map) {
	function lightPass(x, y) {
		return !map.isBlocking(x, y);
	}

	var fov = new ROT.FOV.PreciseShadowcasting(lightPass, { topology: 4 });

	function reflectivityCallback(x, y) {
		var tile = map.getTile(x, y);
		return tile.isEmpty() ? 0.3 : 0;
	}

	var lighting = new ROT.Lighting(reflectivityCallback, { range: 12, passes: 2 });
	lighting.setFOV(fov);

	var lightColor = [200, 200, 0];

	_initializeLightLocations(map);
	map.lightLocations.forEach(function setLight(light){
		lighting.setLight(light.x, light.y, lightColor);
	});

	function lightingCallback(x, y, color) {
		var tile = map.getTile(x, y);
		tile.color = color;
	}

	lighting.compute(lightingCallback);
}

function _initializeLightLocations(map) {
	for (var i = 0; i < 5; i++) {
		map.lightLocations.push(map.findEmptyTile());
	}
}

function _getAllEmptyTiles(map) {
	return _.filter(map.tiles, function tileFilter(tile) {
		return tile.isEmpty();
	});
}
