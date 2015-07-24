"use strict";

GemThief.PlayerData.currentData = function () {
	const userData = GemThief.PlayerData.findOne();
	return {
		gems: userData.gems,
		moves: userData.moves
	};
};
