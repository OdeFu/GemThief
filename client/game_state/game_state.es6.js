"use strict";

GemThief.GameState = {
	instantiate: function (dungeon) {
		_rebindDungeonFunctions(dungeon);

		const state = GemThief.State.instantiate({ name: "GemThief.GameState", scheduler: ROT.Scheduler.Simple });
		state.dungeon = dungeon;
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
	// 	dwarf.setAI(GemThief.DWARF_AIS[data.name](dwarf, dungeon, data));

	this.mapDisplay = GemThief.Map.Display.instantiate(this.dungeon.map, GemThief.Game.display);

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

function _rebindDungeonFunctions(dungeon) {
	GemThief.Dungeon.bind(dungeon);
	GemThief.Map.bind(dungeon.map);
	GemThief.Player.bind(dungeon.player);

	_.each(dungeon.dwarves, function bindDwarves (dwarf) {
		GemThief.Dwarf.bind(dwarf);
	});
}
