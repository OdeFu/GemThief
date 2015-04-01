"use strict";

GemThief.Path = {
	generatePath: function (map, from, to, topology) {
		topology = topology || 4;

		const astar = new ROT.Path.AStar(to.x, to.y, lightPass.bind(map), { topology: topology });
		const path = [];

		function pathCallback(x, y) {
			path.push([x, y]);
		}

		astar.compute(from.x, from.y, pathCallback);

		// Remove starting position
		path.shift();
		return path;
	},

	getSeenTiles: function (map, from, radius) {
		const tiles = [];
		const fov = new ROT.FOV.PreciseShadowcasting(lightPass.bind(map));
		fov.compute(from.x, from.y, radius, function fovCallback(x, y) {
			tiles.push(map.getTile(x, y));
		});

		return tiles;
	}
};

/**
 * This function should be bound to the map object.
 *
 * @param x
 * @param y
 * @returns {boolean}
 */
function lightPass(x, y) {
	return !this.isBlocking(x, y);
}
