"use strict";

GemThief.DwarfActor = {
	instantiate: function () {
		const actor = Object.create(GemThief.DwarfActor);
		actor.act = act.bind(actor);
		return actor;
	}
};

function act() {
	GemThief.Game.state.engine.lock();

	Meteor.call("dwarfMove", function (error, result) {
		if (error) {
			console.log(error.reason);
			return;
		}
		GemThief.Game.state.engine.unlock();
	});
}
