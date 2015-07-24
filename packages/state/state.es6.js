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
