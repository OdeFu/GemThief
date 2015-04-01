Package.describe({
	name: "dungeon",
	version: "0.0.1"
});

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals", "oaalto:rot", "entities", "stevezhu:lodash", "map", "dwarf-ai"]);
	api.addFiles(["dungeon.es6.js", "map.es6.js", "path.es6.js", "map_display.es6.js"]);
});
