Package.describe({
	                 name: "map",
	                 version: "0.0.2"
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals", "oaalto:rot", "stevezhu:lodash", "mongo"]);
	api.addFiles(["map_digger.es6.js", "create_dungeon.es6.js", "dwarf_start_locations.es6.js"]);
});

