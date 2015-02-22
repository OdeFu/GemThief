GameState = function (params)
{
	"use strict";

	check(params.seed, Number);
	check(params.config, Object);
	check(params.level, Number);
	
	this.name = "GameState";
	this.playerStats = new PlayerStats();

	ROT.RNG.setSeed(params.seed);
};
GameState.extend(State);

GameState.prototype.draw = function ()
{
	Game.display.clear();

	this.map.draw(Game.display);
};

GameState.prototype.initEngine = function ()
{
	this.scheduler.add(state, true);
	this.scheduler.add(this.map.player, true);

	for (var i = 0; i < this.map.getDwarves().length; i++)
	{
		this.scheduler.add(this.map.getDwarves()[i], true);
	}

	this.engine.start();
};

GameState.prototype.act = function ()
{
	this.draw();
};

GameState.prototype.enter = function ()
{
	params.width = 80;
	params.height = 23;
	this.map = new Map(params);

	this.initEngine();
};

GameState.prototype.exit = function ()
{
	this.engine.lock();
	this.scheduler.clear();
};

