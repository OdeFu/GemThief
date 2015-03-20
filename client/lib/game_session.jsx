"use strict";

/**
 * This might be a little silly object for now, but if there's a need to add more functionality for this later, having
 * a ready abstraction helps.
 *
 * @type {{get: Function, set: Function}}
 */
GemThief.GameSession = {
	get: function (key) {
		return Session.get(key);
	},

	set: function (key, value) {
		Session.set(key, value);
	}
};
