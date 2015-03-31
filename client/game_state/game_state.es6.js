"use strict";

GemThief.GameState = {
	instantiate: function (params) {
		const state = GemThief.State.instantiate({
			name: "GemThief.GameState",
			scheduler: ROT.Scheduler.Simple
		});
		state.params = params;
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		state.createDungeon = createDungeon.bind(state);

		state.autorun = Tracker.autorun(function dungeonCreated() {
			var map = GemThief.DungeonData.findOne({ userId: Meteor.userId() });
			if (map) {
				state.createDungeon(map.data);
			}
		});

		return state;
	}
};

// Public methods

function act() {
	_draw(this);
}

function createDungeon(entityData) {
	this.dungeon = GemThief.Dungeon.instantiate(entityData, this.params);
	this.mapDisplay = GemThief.Map.Display.instantiate(this.dungeon.map, GemThief.Game.display);
}

function enter() {
	_initEngine(this);
}

function exit() {
	this.autorun.stop();
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
	state.scheduler.add(state.dungeon.player, true);
	state.scheduler.add(state.dungeon.dwarf, true);
	state.engine.start();
}
