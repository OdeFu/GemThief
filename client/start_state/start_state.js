StartState = function ()
{
	this.name = "StartState";
};
StartState.extend(State);

StartState.prototype.draw = function ()
{
	Game.display.clear();
	Game.drawTextCentered(5, "%c{red}G %c{green}E %c{blue}M");
	Game.drawTextCentered(6, "%c{magenta}T %c{aqua}H %c{coral}I %c{fuchsia}E %c{indigo}F");
	Game.drawTextCentered(8, "%b{gray}Press Enter");
};

StartState.prototype.initEngine = function ()
{
	this.scheduler.add(this, true);
	this.engine.start();
};

// Public methods
StartState.prototype.handleEvent = function (event)
{
	// Process user input
	if (event.keyCode === ROT.VK_RETURN)
	{
		window.removeEventListener("keydown", this);
		Meteor.call("newGame", function (error, game)
		{
			Game.changeState(GameState, game);
		});
	}
};

StartState.prototype.act = function ()
{
	this.draw();
	this.engine.lock();
	
	window.addEventListener("keydown", state);
};

StartState.prototype.enter = function ()
{
	this.initEngine();
};

StartState.prototype.exit = function ()
{
	this.engine.lock();
	this.scheduler.clear();
};
