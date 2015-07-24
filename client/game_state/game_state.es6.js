"use strict";

class GameState extends GemThief.State {
	constructor(entityData, params) {
		params.name = "GemThief.GameState";
		params.scheduler = ROT.Scheduler.Simple;
		super(params);

		this.entityData = entityData;
	}

	act() {
		draw(this);
	}

	enter() {
		this.dungeon = GemThief.Dungeon.instantiate(this.entityData, this.params);
		this.mapDisplay = GemThief.Map.Display.instantiate(this.dungeon.map, GemThief.Game.display);
		this.playerActor = GemThief.PlayerActor.instantiate(this.dungeon.player);

		initEngine(this);
	}

	exit() {
		this.engine.lock();
		this.scheduler.clear();
	}
}

GemThief.GameState = GameState;

/*
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
*/

// Private methods

function draw(state) {
	GemThief.Display.clear();

	state.mapDisplay.draw({
		location: state.dungeon.player.toPoint(),
		gems: GemThief.PlayerData.currentData().gems
	});
}

function initEngine(state) {
	state.scheduler.add(state, true);
	state.scheduler.add(state.playerActor, true);
	state.engine.start();
}
