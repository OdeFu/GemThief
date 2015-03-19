GameState = {
	instantiate: function (params) {
		"use strict";

		check(params.seed, Number);
		check(params.config, Object);
		check(params.level, Number);

		ROT.RNG.setSeed(params.seed);

		params.name = "GameState";
		params.scheduler = ROT.Scheduler.Simple;

		const state = State.instantiate(params);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		state.playerStats = new PlayerStats();
		return state;
	}
};

// Private methods
function draw(state) {
	"use strict";

	GemThief.Game.display.clear();

	state.map.draw(GemThief.Game.display);
}

function initEngine(state) {
	"use strict";

	state.scheduler.add(state, true);
	state.scheduler.add(state.map.player, true);

	state.map.dwarves.forEach(function dwarfLoop(dwarf) {
		state.scheduler.add(dwarf, true)
	});

	state.engine.start();
}

// Public methods
function act() {
	"use strict";

	draw(this);
}

function enter() {
	"use strict";

	this.params.width = 80;
	this.params.height = 23;
	this.map = createMap(this.params);

	initEngine(this);
}

function exit() {
	"use strict";

	this.engine.lock();
	this.scheduler.clear();
}
