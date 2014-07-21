Game =
{
	display: null,
	map: null,
	player: null,
	engine: null,
	boxes: null,
	pedro: null
};

Game.init = function ()
{
	"use strict";

	this.display = new ROT.Display();
	document.body.appendChild(this.display.getContainer());

	this.map = createMap({ width: 80, height: 25, seed: new Date().now });

	var tile = this.map.findEmptyTile();
	this.player = createPlayer(tile.getX(), tile.getY());

	tile = this.map.findEmptyTile();
	this.pedro = createPedro(tile.getX(), tile.getY());

	this.boxes = this._generateBoxes();

	var scheduler = new ROT.Scheduler.Simple();
	scheduler.add(this, true);
	scheduler.add(this.player, true);
	scheduler.add(this.pedro, true);

	this.engine = new ROT.Engine(scheduler);
	this.engine.start();
};

Game.getBox = function (x, y)
{
	"use strict";

	for (var i = 0; i < this.boxes.length; i++)
	{
		if (this.boxes[i].getX() === x && this.boxes[i].getY() === y)
		{
			return this.boxes[i];
		}
	}
	return null;
};

Game.act = function ()
{
	"use strict";

	this._draw();
};

Game._draw = function ()
{
	"use strict";

	var visibleTiles = this.map.calculateVisibleTiles();

	this.map.draw(this.display, visibleTiles);

	var visibleEntities = this._getVisibleEntities(visibleTiles);
	for (var i = 0; i < visibleEntities.length; i++)
	{
		visibleEntities[i].draw(this.display);
	}

	this.player.draw(this.display);
};

Game._getVisibleEntities = function (visibleTiles)
{
	"use strict";

	var entities = [];
	for (var i = 0; i < this.boxes.length; i++)
	{
		if (this._isVisible(this.boxes[i], visibleTiles))
		{
			entities.push(this.boxes[i]);
		}
	}

	if (this._isVisible(this.pedro, visibleTiles))
	{
		entities.push(this.pedro);
	}

	return entities;
};

Game._isVisible = function (entity, visibleTiles)
{
	"use strict";

	for (var i = 0; i < visibleTiles.length; i++)
	{
		if (visibleTiles[i].getX() === entity.getX() && visibleTiles[i].getY() === entity.getY())
		{
			return true;
		}
	}
	return false;
};

Game._drawBoxes = function ()
{
	"use strict";

	for (var i = 0; i < this.boxes.length; i++)
	{
		this.boxes[i].draw(this.display);
	}
};

Game.gameOver = function (won)
{
	"use strict";

	Game.engine.lock();

	if (won)
	{
		alert("Hooray! You found the ananas and won this game.");
	}
	else
	{
		alert("Game Over - you were captured by Pedro!");
	}
};

Game._generateBoxes = function ()
{
	"use strict";

	var boxes = [];
	for (var i = 0; i < 10; i++)
	{
		var tile = this.map.findEmptyTile();
		boxes.push(createBox(tile.getX(), tile.getY(), i === 0));
	}
	return boxes;
};

