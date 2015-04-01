Package.describe({
	name: "collections",
	version: "0.0.1"
});

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["globals", "mongo"]);
	api.addFiles("collections.js");
});
