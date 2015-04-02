Package.describe({
	name: "globals",
	version: "0.0.3",
	summary: "Define the global namespace for GemThief."
});

Package.onUse(function (api) {
	api.versionsFrom("1.1");
	api.addFiles(["globals.js", "object_utils.es6.js"]);
	api.export("GemThief");
	api.export("ObjectUtils");
});
