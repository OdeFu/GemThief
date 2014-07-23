PlayerData = new Meteor.Collection("player_data");

Meteor.methods(
{
	update: function (data)
	{
		"use strict";

		check(data.gems, Number);
		check(data.moves, Number);
		//check(data.gold, Number);

		if (!this.userId)
		{
			return 0;
		}

		var score = calculateScore(data);

		var userData = PlayerData.findOne({ userId: this.userId });
		if (userData)
		{
			userData.gold += data.gold;
			if (userData.best_score < score)
			{
				userData.best_score = score;
			}
			userData.total_score += score;
			userData.updated = new Date().getTime();
			PlayerData.upsert(userData);
		}
		else
		{
			var newUserData =
			{
				userId: this.userId,
				gold: data.gold,
				best_score: score,
				total_score: score,
				created: new Date().getTime()
			};
			PlayerData.insert(newUserData);
		}

		data.score = score;
		return data;
	}
});

var calculateScore = function (data)
{
	"use strict";

	var gemsScore = data.gems * 100;
	var moveScore = data.moves;

	// TODO: Add level multiplier

	return Math.round(gemsScore + moveScore);
};
