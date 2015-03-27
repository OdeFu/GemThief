"use strict";

GemThief.Games.getGame = function (userId) {
	return this.findOne({ userId: userId });
};
