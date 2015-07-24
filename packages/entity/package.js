Package.describe({
	name: "entity",
	version: "0.0.1", // Brief, one-line summary of the package.
	summary: "", // URL to the Git repository containing the source code for this package.
	git: "", // By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: "README.md"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.1");
	api.use(["globals", "grigio:babel"]);
	api.addFiles([
		"lib/dwarves.es6.js",
		"lib/entity.es6.js",
		"lib/gem.es6.js",
		"lib/map_features.es6.js",
		"lib/player.es6.js",
		"lib/stairs.es6.js",
		"lib/tile.es6.js"
	]);
});

Package.onTest(function (api) {
	api.use("tinytest");
	api.use("entity");
	api.addFiles("entity-tests.js");
});
