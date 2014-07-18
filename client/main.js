
Meteor.startup(function()
{
    Game.init();
});

var Game =
{
    display: null,
    map: {},
	player: null
};

Game.init = function ()
{
    this.display = new ROT.Display();
    document.body.appendChild(this.display.getContainer());

    this._generateMap();
    this._drawWholeMap();
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

	this._createPlayer(freeCells);
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
};

Game._createPlayer = function (freeCells)
{
	var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	var key = freeCells.splice(index, 1)[0];
	var parts = key.split(",");
	var x = parseInt(parts[0]);
	var y = parseInt(parts[1]);
	this.player = new Player(x, y);
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
