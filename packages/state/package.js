Package.describe({
	name: "state",
	version: "0.0.1", // Brief, one-line summary of the package.
	summary: "", // URL to the Git repository containing the source code for this package.
	git: "", // By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: "README.md"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@1.1");
	api.use(["globals", "grigio:babel@0.1.6"]);
	api.addFiles("state.es6.js");
});

Package.onTest(function (api) {
	api.use("tinytest");
	api.use("state");
	api.addFiles("state-tests.js");
});
