
Meteor.startup(function()
{
    Game.init();
});

var Game =
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

var Player = function (x, y)
{
	this._x = x;
	this._y = y;
};

Player.prototype.draw = function ()
{
	Game.display.draw(this._x, this._y, "@", "#ff0");
};

Player.prototype.act = function ()
{
	Game.engine.lock();

	/* Wait for user input, do stuff what the user hits a key */
	window.addEventListener("keydown", this);
};

Player.prototype.handleEvent = function (event)
{
	// Process user input

	var keyMap = {};
	keyMap[38] = 0;
	keyMap[33] = 1;
	keyMap[39] = 2;
	keyMap[34] = 3;
	keyMap[40] = 4;
	keyMap[35] = 5;
	keyMap[37] = 6;
	keyMap[36] = 7;

	var code = event.keyCode;

	if (code == 13 || code == 32)
	{
		this._checkBox();
		return;
	}

	if (!(code in keyMap))
	{
		return;
	}

	var dir = ROT.DIRS[8][keyMap[code]];
	var newX = this._x + dir[0];
	var newY = this._y + dir[1];

	var newKey = newX + "," + newY;
	if (!(newKey in Game.map))
	{
		/* Cannot move in this direction */
		return;
	}

	Game.display.draw(this._x, this._y, Game.map[this._x + "," + this._y]);

	this._x = newX;
	this._y = newY;
	this.draw();

	window.removeEventListener("keydown", this);
	Game.engine.unlock();
};

Player.prototype._checkBox = function ()
{
	var key = this._x + "," + this._y;
	if (Game.map[key] != "*")
	{
		alert("There is no box here!");
	}
	else if (key == Game.ananas)
	{
		alert("Hooray! You found an ananas and won this game.");
		Game.engine.lock();
		window.removeEventListener("keydown", this);
	}
	else
	{
		alert("This box is empty.");
	}
};

Player.prototype.getX = function ()
{
	return this._x;
};

Player.prototype.getY = function ()
{
	return this._y;
};

var Pedro = function (x, y)
{
	this._x = x;
	this._y = y;
};

Pedro.prototype.draw = function ()
{
	Game.display.draw(this._x, this._y, "P", "red");
};

Pedro.prototype.act = function ()
{
	var x = Game.player.getX();
	var y = Game.player.getY();

	var passableCallback = function (x, y)
	{
		return x + "," + y in Game.map;
	};

	var astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4});
	var path = [];
	var pathCallback = function (x, y)
	{
		path.push([x, y]);
	};

	astar.compute(this._x, this._y, pathCallback);

	/* Remove Pedro's position */
	path.shift();

	if (path.length == 1)
	{
		Game.engine.lock();
		alert("Game Over - you were captured by Pedro!");
	}
	else
	{
		x = path[0][0];
		y = path[0][1];
		Game.display.draw(this._x, this._y, Game.map[this._x + "," + this._y]);
		this._x = x;
		this._y = y;
		this.draw();
	}
};