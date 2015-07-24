Package.describe({
	name: "ai",
	version: "0.0.1", // Brief, one-line summary of the package.
	summary: "", // URL to the Git repository containing the source code for this package.
	git: "", // By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: "README.md"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.1");

	api.use(["globals", "entity", "dungeon", "grigio:babel@0.1.6"]);

	api.addFiles([
		"lib/ai.es6.js",
		"lib/bashful_ai.es6.js",
		"lib/doc_ai.es6.js",
		"lib/dopey_ai.es6.js",
		"lib/grumpy_ai.es6.js",
		"lib/happy_ai.es6.js",
		"lib/sleepy_ai.es6.js",
		"lib/sneezy_ai.es6.js",
		"dwarf_ais.es6.js"
	]);
});

Package.onTest(function (api) {
	api.use("tinytest");
	api.use("ai");
	api.addFiles("ai-tests.js");
});
