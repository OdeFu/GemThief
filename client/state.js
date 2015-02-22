var idCounter = 0;

State = function (options)
{
	"use strict";

	this.id = idCounter++;
	this.name = "State_" + this.id;
	this.scheduler = new ROT.Scheduler.Simple();
	this.engine = new ROT.Engine(this.scheduler);
};

State.prototype.act = function ()
{	
};

State.prototype.enter = function ()
{	
};

State.prototype.exit = function ()
{	
};
