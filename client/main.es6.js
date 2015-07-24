"use strict";

Meteor.startup(function startup() {
	Meteor.subscribe("games");

	// Check we're already logged in
	if (Meteor.user()) {
		GemThief.Game = new GemThief.GameClass(false);
	}
});

