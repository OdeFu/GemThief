Games = new Meteor.Collection("games");

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
				curGame.updated = new Date().getTime();
				Games.upsert(curGame);
			}
			else
			{
				var newGame =
				{
					seed: game.seed,
					userId: this.userId,
					created: new Date().getTime()
				};
				Games.insert(newGame);
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
		seed: new Date().getTime()
	};
	return game;
};