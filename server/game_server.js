Games = new Meteor.Collection("games");

var DWARF_CONFIG = EJSON.parse(Assets.getText("dwarf_config.json"));

Meteor.methods(
{
	newGame: function ()
	{
		"use strict";

		var game = createNewGame();

		if (this.userId)
		{
			var curGame = Games.findOne({ userId: this.userId });
			if (curGame)
			{
				curGame.seed = game.seed;
				curGame.level = game.level;
				curGame.updated = new Date().getTime();
				Games.upsert(curGame);
			}
			else
			{
				var newGame =
				{
					seed: game.seed,
					level: game.level,
					userId: this.userId,
					created: new Date().getTime()
				};
				Games.insert(newGame);
			}
		}

		game.config = DWARF_CONFIG;
		return game;
	},

	loadLevel: function (nextLevel)
	{
		"use strict";

		var game = createNewGame();
		game.level = nextLevel;

		if (this.userId)
		{
			var curGame = Games.findOne({ userId: this.userId });
			if (curGame)
			{
				game.seed = curGame.seed;
				game.level = checkNextLevel(nextLevel, curGame);

				curGame.level = game.level;
				curGame.updated = new Date().getTime();
				Games.upsert(curGame);
			}
		}

		return game;
	}
});

var createNewGame = function ()
{
	"use strict";

	var game =
	{
		seed: new Date().getTime(),
		level: 1
	};
	return game;
};

var checkNextLevel = function (nextLevel, curGame)
{
	"use strict";

	var ok = Math.abs(nextLevel - curGame.level) === 1;
	return ok ? nextLevel : curGame.level;
};