"use strict";

let idCounter = 0;

GemThief.State = {
	/**
	 * Create a new state. You should provide implementations for the abstract methods; act, enter and exit.
	 * @param params Supported options are the name, scheduler and act, enter and exit methods.
	 * @returns {GemThief.State}
	 */
	instantiate: function (params) {
		const state = Object.create(GemThief.State);
		state.id = idCounter++;
		state.name = params.name || "State_" + state.id;
		state.schedulerClass = params.scheduler || ROT.Scheduler.Simple;
		state.scheduler = new state.schedulerClass();
		state.engine = new ROT.Engine(state.scheduler);
		state.params = params;
		return state;
	}
};
