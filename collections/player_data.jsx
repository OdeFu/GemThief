PlayerData = new Meteor.Collection("player_data");

Meteor.methods(
{
	update: function (data)
	{
		"use strict";

		check(data.gems, Number);
		check(data.moves, [Number]);
		check(data.won, Boolean);
		//check(data.gold, Number);

		const score = calculateScore(data);
		data.score = score;

		if (this.userId)
		{
			const userData = PlayerData.findOne({ userId: this.userId });
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
				const newUserData =
				{
					userId: this.userId,
					gold: data.gold,
					best_score: score,
					total_score: score,
					created: new Date().getTime()
				};
				PlayerData.insert(newUserData);
			}
		}

		return data;
	}
});

function calculateScore(data)
{
	"use strict";

	const gemsScore = data.gems * 100;
	const moveScore = _.map(data.moves, (moves, level) => moves * level);

	// You get nothing if you lost
	return Math.round(gemsScore + moveScore) * data.won;
}
