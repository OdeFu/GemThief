"use strict";

GemThief.GameState = {
	instantiate: function (entityData, params) {
		const state = GemThief.State.instantiate({
			name: "GemThief.GameState",
			scheduler: ROT.Scheduler.Simple
		});
		state.entityData = entityData;
		state.params = params;
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);

		return state;
	}
};

// Public methods

function act() {
	_draw(this);
}

function enter() {
	this.dungeon = GemThief.Dungeon.instantiate(this.entityData, this.params);
	this.mapDisplay = GemThief.Map.Display.instantiate(this.dungeon.map, GemThief.Game.display);

	this.playerActor = GemThief.PlayerActor.instantiate(this.dungeon.player);

	_initEngine(this);
}

function exit() {
	this.engine.lock();
	this.scheduler.clear();
}

// Private methods

function _draw(state) {
	GemThief.Display.clear();

	state.mapDisplay.draw({
		location: state.dungeon.player.toPoint(),
		gems: GemThief.PlayerData.currentData().gems
	});
}

function _initEngine(state) {
	state.scheduler.add(state, true);
	state.scheduler.add(state.playerActor, true);
	state.engine.start();
}
