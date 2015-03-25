"use strict";

GemThief.PlayerData = new Mongo.Collection("player_data");

Meteor.methods({
	addGem: function () {
		increaseValue({ gems: 1 });
	},

	addMove: function (data) {
		check(data.level, Number);

		// One move is worth the level the player is on
		increaseValue({ moves: data.level });
	},

	/**
	 * Create the initial data for a new player.
	 */
	newPlayer: function () {
		if (this.userId) {
			const userData = GemThief.PlayerData.findOne({ userId: this.userId });
			if (!userData) {
				const newUserData = {
					userId: this.userId,
					best_score: 0,
					total_score: 0,
					gems: 0,
					moves: 0,
					created: new Date().getTime()
				};
				GemThief.PlayerData.insert(newUserData, function (error) {
					console.log(error.reason);
				});
			}
			return userData === null;
		}
		return false;
	},

	gameOver: function (data) {
		check(data.won, Boolean);

		if (this.userId) {
			const userData = GemThief.PlayerData.findOne({ userId: this.userId });
			if (userData) {
				const score = calculateScore(userData, data.won);
				const updateData = {
					score: score,
					total_score: score + userData.total_score
				};
				data.score = score;

				if (userData.best_score < score) {
					updateData.best_score = score;
				}
				updateData.updated = new Date().getTime();

				GemThief.PlayerData.update({ userId: this.userId }, { $set: updateData }, function (error) {
					console.log(error.reason);
				});
			}
		}

		return data;
	}
});

function calculateScore(data, won) {
	const gemsScore = data.gems * 100;

	// You get nothing if you lost
	return Math.round(gemsScore + data.moves) * won;
}

function increaseValue(data) {
	if (this.userId) {
		GemThief.PlayerData.update({ userId: this.userId }, { $inc: data }, function (error) {
			console.log(error.reason);
		});
	}
}
