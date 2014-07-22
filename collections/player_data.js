PlayerData = new Meteor.Collection("player_data");

Meteor.methods(
{
	update: function (data)
	{
		"use strict";

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
		}
		else
		{
			userData =
			{
				userId: this.userId,
				gold: data.gold,
				best_score: score,
				total_score: score,
				created: new Date().getTime()
			};
		}
		PlayerData.upsert(userData);

		return score;
	}
});

var calculateScore = function (data)
{
	"use strict";

	var ananasScore = data.ananas * 1000;
  var moveScore = data.moves * data.distance;

  // TODO: Add level multiplier

	return Math.round(ananasScore + moveScore);
};