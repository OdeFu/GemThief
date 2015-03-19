Path = {
	generatePath: function (from, to, topology) {
		"use strict";

		topology = topology || 4;

		function passableCallback(x, y) {
			return !Game.state.map.isBlocking(x, y);
		}

		const astar = new ROT.Path.AStar(to.x, to.y, passableCallback, { topology: topology });
		const path = [];

		function pathCallback(x, y) {
			path.push([x, y]);
		}

		astar.compute(from.x, from.y, pathCallback);

		// Remove starting position
		path.shift();
		return path;
	},

	getSeenTiles: function (from, radius) {
		"use strict";

		const tiles = [];
		const fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(from.x, from.y, radius, function fovCallback(x, y, r, visibility) {
			const tile = Game.state.map.getTile(x, y);
			tiles.push(tile);
		});

		return tiles;
	},

	runFOV: function (from, radius, callback) {
		"use strict";

		const fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(from.x, from.y, radius, function fovCallback(x, y, r, visibility) {
			callback(x, y, r, visibility);
		});
	},

	getFOV: function (from, radius) {
		"use strict";

		const tiles = [];
		const fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(from.x, from.y, radius, function fovCallback(x, y, r, visibility) {
			tiles.push({ x, y });
		});
		return tiles;
	}
};

function lightPass(x, y) {
	return !Game.state.map.isBlocking(x, y);
}
