"use strict";

Meteor.startup(function startup() {
	// Check we're already logged in
	if (Meteor.user()) {
		GemThief.Game.init(false);
	}
});

