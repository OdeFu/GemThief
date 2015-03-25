"use strict";

GemThief.GameState = {
	instantiate: function (params) {
		check(params.seed, Number);
		check(params.config, Object);
		check(params.level, Number);

		ROT.RNG.setSeed(params.seed);

		params.name = "GemThief.GameState";
		params.scheduler = ROT.Scheduler.Simple;

		const state = GemThief.State.instantiate(params);
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
	this.params.width = 80;
	this.params.height = 23;
	this.map = GemThief.Map.instantiate(this.params);
	this.mapDisplay = GemThief.Map.Display.instantiate(this.map, GemThief.Game.display);
	this.dungeon = GemThief.Dungeon.instantiate(this.map, this.params);

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
	state.scheduler.add(state.dungeon.player, true);

	state.dungeon.dwarves.forEach(function dwarfLoop(dwarf) {
		state.scheduler.add(dwarf, true)
	});

	state.engine.start();
}
