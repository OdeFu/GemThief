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
	scheduler.add(this.player, true);
	scheduler.add(this.pedro, true);
	this.engine = new ROT.Engine(scheduler);
	this.engine.start();

	this.draw();
};

Game.draw = function ()
{
	"use strict";

	this.map.draw(this.display);
	this._drawBoxes();
	this.player.draw(this.display);
	this.pedro.draw(this.display);
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

