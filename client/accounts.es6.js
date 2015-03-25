"use strict";

Accounts.ui.config({
	passwordSignupFields: "USERNAME_ONLY"
});

Accounts.onLogin(function onLogin() {
	Meteor.call("newPlayer", function newPlayer(error, result) {
		if (error) {
			alert(error.reason);
		}
		else {
			GemThief.Game.init(result);
		}
	});
});
