"use strict";

GemThief.PlayerData.currentData = function () {
	const userData = GemThief.PlayerData.findOne({ userId: Meteor.userId() });
	return {
		gems: userData.gems,
		moves: userData.moves
	};
};
