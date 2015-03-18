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

	// Private fields
	var _tiles = [];
	var _player;
	var _gems = [];
	var _dwarves = [];
	var _stairs = [];
	var _width = params.width;
	var _height = params.height;
	var _message = "";
	var _messageLife;
	var _level = params.level || 1;
	var _numGems = params.numGems || 10;
	var _lightLocations = [];

	// Private methods
	function dig() {
		var digger = new ROT.Map.Digger(_width, _height, params);

		function digCallback(x, y, value) {
			var tile = createTile({x: x, y: y});
			var wall = value === 1;
			if (wall) {
				tile.addEntity(new Wall({x: x, y: y}));
			}

			_tiles.push(tile);
		}

		digger.create(digCallback.bind(this));
	}

	function generateLightingData() {
		var fov = new ROT.FOV.PreciseShadowcasting(lightPass, {topology: 4});

		function reflectivityCallback(x, y) {
			var tile = getTile(x, y);
			return tile.isEmpty() ? 0.3 : 0;
		}

		var lighting = new ROT.Lighting(reflectivityCallback, {range: 12, passes: 2});
		lighting.setFOV(fov);

		var lightColor = [200, 200, 0];

		initializeLightLocations();
		for (var i = 0; i < _lightLocations.length; i++) {
			lighting.setLight(_lightLocations[i].getX(), _lightLocations[i].getY(), lightColor);
		}

		function lightingCallback(x, y, color) {
			var tile = getTile(x, y);
			tile.setColor(color);
		}

		lighting.compute(lightingCallback);
	}

	function initializeLightLocations() {
		for (var i = 0; i < 5; i++) {
			_lightLocations.push(findEmptyTile());
		}
	}

	function createEntities() {
		createGems();

		createPlayer();

		createDwarf();

		createStairs();
	}

	function createPlayer() {
		var tile = findEmptyTile();
		_player = new Player(tile.toPoint());
		tile.addEntity(_player);
	}

	function createDwarf() {
		var dwarves = params.config.dwarves.slice(0);
		dwarves.sort(function dwarfSort(dwarf1, dwarf2) {
			return dwarf1.level - dwarf2.level;
		});
		var data = dwarves[_level - 1];

		var tile = DWARF_START_LOCATIONS[data.startLocation](map);
		data.x = tile.getX();
		data.y = tile.getY();

		var dwarf = new Dwarf(data);
		dwarf.setAI(DWARF_AIS[data.idleAI](dwarf, map, data));
		tile.addEntity(dwarf);
		_dwarves.push(dwarf);
	}

	function createGems() {
		for (var i = 0; i < _numGems; i++) {
			var tile = findEmptyTile();
			var gem = createGem(tile.toPoint());
			tile.addEntity(gem);
			_gems.push(gem);
		}
	}

	function createStairs() {
		// always create stairs going up where the player is
		var tile = getTile(_player.getX(), _player.getY());
		_stairs[0] = new Stairs({x: _player.getX(), y: _player.getY(), down: false});
		tile.addEntity(_stairs[0]);

		var downTile = findEmptyTile();
		_stairs[1] = new Stairs({x: downTile.getX(), y: downTile.getY(), down: true});
		downTile.addEntity(_stairs[1]);
	}

	function getAllEmptyTiles() {
		var empties = [];
		for (var i = 0; i < _tiles.length; i++) {
			if (_tiles[i].isEmpty()) {
				empties.push(_tiles[i]);
			}
		}
		return empties;
	}

	function lightPass(x, y) {
		return !isBlocking(x, y);
	}

	// Public methods
	function getTiles() {
		return _tiles;
	}

	function getSomeTiles(func) {
		var selectedTiles = [];

		for (var i = 0; i < _tiles.length; i++) {
			if (func(_tiles[i])) {
				selectedTiles.push(_tiles[i]);
			}
		}
		return selectedTiles;
	}

	function getTile(x, y) {
		return _tiles[params.height * x + y];
	}

	function getPlayer() {
		return _player;
	}

	function getGems() {
		return _gems;
	}

	function getDwarves() {
		return _dwarves;
	}

	function isEmpty(x, y) {
		var tile = getTile(x, y);
		return tile && tile.isEmpty();
	}

	function isBlocking(x, y) {
		var tile = getTile(x, y);
		return tile && tile.isBlocking();
	}

	function setMessage(msg, messageLife) {
		_message = msg;
		_messageLife = messageLife || 3;
	}

	function draw(display) {
		if (_message) {
			display.drawText(0, 0, _message);
			_messageLife--;
			if (_messageLife === 0) {
				_message = null;
			}
		}

		var visibleTiles = calculateVisibleTiles();
		for (var i = 0; i < visibleTiles.length; i++) {
			display.draw(visibleTiles[i].getX(), visibleTiles[i].getY() + 1, visibleTiles[i].getChar(),
			visibleTiles[i].getForegroundColor(), visibleTiles[i].getBackgroundColor());
		}

		display.drawText(0, _height + 1, "Mine Level: " + _level);
		Game.drawTextRight(_height + 1, "Gems Found: " + Game.state.playerStats.gems);
	}

	function findEmptyTile() {
		var empties = getAllEmptyTiles();
		return empties.random();
	}

	function calculateVisibleTiles() {
		var tiles = [];
		var fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(_player.getX(), _player.getY(), 2, function fovCallback(x, y, r, visibility) {
			var tile = getTile(x, y);
			tile.setSeen(true);
			tiles.push(tile);
		});

		// Do another pass for tiles that have light
		fov.compute(_player.getX(), _player.getY(), 20, function fovCallback(x, y, r, visibility) {
			var tile = getTile(x, y);
			if (tile.getColor()) {
				tile.setSeen(true);
				tiles.push(tile);
			}
		});

		return tiles;
	}

	function getGem(x, y) {
		for (var i = 0; i < _gems.length; i++) {
			if (_gems[i].getX() === x && _gems[i].getY() === y) {
				return _gems[i];
			}
		}
		return null;
	}

	function removeGem(gem) {
		var index = _gems.indexOf(gem);
		if (index >= 0) {
			_gems.splice(index, 1);
			var tile = getTile(gem.getX(), gem.getY());
			tile.removeEntity(gem);
		}
	}

	function moveEntity(entity, newX, newY) {
		var oldTile = getTile(entity.getX(), entity.getY());
		oldTile.removeEntity(entity);

		var newTile = getTile(newX, newY);
		newTile.addEntity(entity);

		entity.setX(newX);
		entity.setY(newY);
	}

	function getLevel() {
		return _level;
	}

	function getStairs() {
		return _stairs;
	}

	function getLightLocations() {
		return _lightLocations;
	}

	// Create the actual map object
	var map = {};
	map.getTiles = getTiles;
	map.getSomeTiles = getSomeTiles;
	map.getTile = getTile;
	map.draw = draw;
	map.isEmpty = isEmpty;
	map.isBlocking = isBlocking;
	map.findEmptyTile = findEmptyTile;
	map.calculateVisibleTiles = calculateVisibleTiles;
	map.getPlayer = getPlayer;
	map.getGems = getGems;
	map.getGem = getGem;
	map.removeGem = removeGem;
	map.getDwarves = getDwarves;
	map.moveEntity = moveEntity;
	map.setMessage = setMessage;
	map.getLevel = getLevel;
	map.getStairs = getStairs;
	map.getLightLocations = getLightLocations;

	// Dig the level
	dig();
	generateLightingData();
	createEntities();

	return map;
};
