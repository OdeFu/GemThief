"use strict";

GemThief.PlayerData.addGem = function () {
	Meteor.call("addGem", function addGemCallback(error) {
		if (error) {
			console.log(error.reason);
		}
	});
};

GemThief.PlayerData.addMove = function (level) {
	Meteor.call("addMove", level, function addMoveCallback (error) {
		if (error) {
			console.log(error.reason);
		}
	});
};
