EndState = {
	instantiate: function (params) {
		"use strict";

		check(params.won, Boolean);
		check(params.score, Number);
		check(params.gems, Number);

		var state = Object.create(State.instantiate({ name: "EndState" }));
		state.handleEvent = handleEvent.bind(state);
		state.act = act.bind(state);
		state.enter = enter.bind(state);
		state.exit = exit.bind(state);
		state.won = params.won;
		return state;
	}
};

// Private methods

function draw(state) {
	"use strict";

	Game.display.clear();

	var text = state.won ? "You managed to escape with the loot!" : "You got caught by the dwarves!";
	Game.drawTextCentered(5, text);
	Game.drawTextCentered(6, "Gems Looted: " + params.gems);
	Game.drawTextCentered(7, "Score: " + params.score);
	Game.drawTextCentered(9, "%b{gray}New Game");
}

function initEngine(state) {
	"use strict";

	state.scheduler.add(state, true);
	state.engine.start();
}

// Public methods
function handleEvent(event) {
	"use strict";

	check(event.keyCode, Number);

	// Process user input
	if (event.keyCode === ROT.VK_RETURN) {
		window.removeEventListener("keydown", this);
		Meteor.call("newGame", function newGameCallback(error, game) {
			Game.changeState(GameState.instantiate(game));
		});
	}
}

function act() {
	"use strict";

	draw(this);

	this.engine.lock();
	window.addEventListener("keydown", this);
}

function enter() {
	"use strict";

	initEngine(this);
}

function exit() {
	"use strict";

	this.engine.lock();
	this.scheduler.clear();
}

