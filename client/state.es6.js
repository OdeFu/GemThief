"use strict";

let idCounter = 0;

class State {
	/**
	 * Create a new state. You should provide implementations for the abstract methods; act, enter and exit.
	 * @param params Supported options are the name, scheduler and act, enter and exit methods.
	 */
	constructor(params) {
		this.id = idCounter++;
		this.name = params.name || "State_" + this.id;
		this.schedulerClass = params.scheduler || ROT.Scheduler.Simple;
		this.scheduler = new this.schedulerClass();
		this.engine = new ROT.Engine(this.scheduler);
		this.params = params;
	}

	act() {}
	enter() {}
	exit() {}
}

GemThief.State = State;

	/**
	 * Create a new state. You should provide implementations for the abstract methods; act, enter and exit.
	 * @param params Supported options are the name, scheduler and act, enter and exit methods.
	 * @returns {GemThief.State}
	 */
/*
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
*/
