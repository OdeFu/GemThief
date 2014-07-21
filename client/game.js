Game =
{
	display: null,
	map: null,
	player: null,
	engine: null,
	ananas: null,
	pedro: null
};

Game.init = function ()
{
	"use strict";

	this.display = new ROT.Display();
	document.body.appendChild(this.display.getContainer());

	this.map = createMap({ width: 80, height: 25, seed: new Date().now });

	var scheduler = new ROT.Scheduler.Simple();
	scheduler.add(this.player, true);
	scheduler.add(this.pedro, true);
	this.engine = new ROT.Engine(scheduler);
	this.engine.start();
};

Game.draw = function ()
{
	"use strict";

	this.map.draw(this.display);
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

Game._generateMap = function ()
{


	this._generateBoxes(freeCells);
	this.player = this._createActor(Player, freeCells);
	this.pedro = this._createActor(Pedro, freeCells);
};

Game._generateBoxes = function (freeCells)
{
	for (var i = 0; i < 10; i++)
	{
		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
		var key = freeCells.splice(index, 1)[0];
		this.map[key] = "*";

		if (!i)
		{
			/* The first box contains the ananas */
			this.ananas = key;
		}
	}
};

Game._createActor = function (what, freeCells)
{
	var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	var key = freeCells.splice(index, 1)[0];
	var parts = key.split(",");
	var x = parseInt(parts[0]);
	var y = parseInt(parts[1]);
	return new what(x, y);
};
