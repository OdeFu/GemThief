"use strict";

GemThief.Path = {
	generatePath: function (from, to, topology) {
		topology = topology || 4;

		function passableCallback(x, y) {
			return !GemThief.Game.state.map.isBlocking(x, y);
		}

		const astar = new ROT.GemThief.Path.AStar(to.x, to.y, passableCallback, { topology: topology });
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
		const tiles = [];
		const fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(from.x, from.y, radius, function fovCallback(x, y) {
			const tile = GemThief.Game.state.map.getTile(x, y);
			tiles.push(tile);
		});

		return tiles;
	},

	runFOV: function (from, radius, callback) {
		const fov = new ROT.FOV.PreciseShadowcasting(lightPass);
		fov.compute(from.x, from.y, radius, function fovCallback(x, y, r, visibility) {
			callback(x, y, r, visibility);
		});
	}
};

function lightPass(x, y) {
	return !GemThief.Game.state.map.isBlocking(x, y);
}
