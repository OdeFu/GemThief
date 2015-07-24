Package.describe({
	name: "dungeon",
	version: "0.0.1", // Brief, one-line summary of the package.
	summary: "", // URL to the Git repository containing the source code for this package.
	git: "", // By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: "README.md"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.1");

	api.use(["globals", "entity", "grigio:babel@0.1.6"]);

	api.addFiles([
		"lib/map/digger/map_digger.es6.js",
		"lib/map/map.es6.js",
		"lib/map/map_feature_types.es6.js",
		"lib/map/tile.es6.js",
		"lib/dungeon.es6.js",
		"lib/dungeon_data.es6.js",
		"lib/dwarf_start_locations.es6.js",
		"lib/path.es6.js"
	]);
});

Package.onTest(function (api) {
	api.use("tinytest");
	api.use("dungeon");
	api.addFiles("dungeon-tests.js");
});
