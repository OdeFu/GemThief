Game = function ()
{
};

Game.prototype.init = function ()
{
	var container = document.getElementById("main");
	if (ROT.isSupported)
	{
		this.display = new ROT.Display();
		container.appendChild(this.display.getContainer());

		changeState(StartState);
	}
	else
	{
		container.textContent = "Your browser is not supported!";
	}
};

Game.prototype.changeState = function (newState, params)
{
	if (this.state)
	{
		this.state.exit();
	}

	this.state = new newState(params);
	this.state.enter();
};

Game.prototype.gameOver = function ()
{
	Meteor.call("update", this.state.getPlayerStats(), function (error, data)
	{
		changeState(EndState, data);
	});
};

Game.prototype.moveToLevel = function (nextLevel)
{
	if (nextLevel === 0)
	{
		// We exited the mine
		this.state.getPlayerStats().won = true;
		gameOver();
	}
	else
	{
		Meteor.call("loadLevel", nextLevel, function (error, game)
		{
			changeState(GameState, game);
		});
	}
};

Game.prototype.drawTextCentered = function (y, text)
{
	var textSize = ROT.Text.measure(text);
	var x = this.display.getOptions().width * 0.5 - textSize.width * 0.5;
	this.display.drawText(x, y, text);
};

Game.prototype.drawTextRight = function (y, text)
{
	var textSize = ROT.Text.measure(text);
	var x = this.display.getOptions().width - textSize.width;
	this.display.drawText(x, y, text);
};


