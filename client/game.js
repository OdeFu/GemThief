Game =
{
	display: null,
	map: {},
	player: null,
	engine: null,
	ananas: null,
	pedro: null
};

Game.init = function ()
{
	this.display = new ROT.Display();
	document.body.appendChild(this.display.getContainer());

	this._generateMap();
	this._drawWholeMap();

	var scheduler = new ROT.Scheduler.Simple();
	scheduler.add(this.player, true);
	scheduler.add(this.pedro, true);
	this.engine = new ROT.Engine(scheduler);
	this.engine.start();
};

Game._generateMap = function ()
{
	var digger = new ROT.Map.Digger();
	var freeCells = [];

	var digCallback = function (x, y, value)
	{
		if (value)
		{
			/* Do not store walls */
			return;
		}

		var key = x + "," + y;
		this.map[key] = ".";
		freeCells.push(key);
	};
	digger.create(digCallback.bind(this));

	this._generateBoxes(freeCells);
	this.player = this._createActor(Player, freeCells);
	this.pedro = this._createActor(Pedro, freeCells);
};

Game._drawWholeMap = function ()
{
	for (var key in this.map)
	{
		if (this.map.hasOwnProperty(key))
		{
			var parts = key.split(",");
			var x = parseInt(parts[0]);
			var y = parseInt(parts[1]);
			this.display.draw(x, y, this.map[key]);
		}
	}

	this.player.draw();
	this.pedro.draw();
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
