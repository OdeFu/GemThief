let idCounter = 0;

State = {
	/**
	 * Create a new state. You should provide implementations for the abstract methods; act, enter and exit.
	 * @param options Supported options are the name, scheduler and act, enter and exit methods.
	 * @returns {{}}
	 */
	instantiate: function (options) {
		"use strict";

		const state = {};
		state.id = idCounter++;
		state.name = options.name || "State_" + state.id;
		state.schedulerClass = options.scheduler || ROT.Scheduler.Simple;
		state.scheduler = new state.schedulerClass();
		state.engine = new ROT.Engine(state.scheduler);
		return state;
	}
};
