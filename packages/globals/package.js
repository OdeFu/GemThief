Package.describe({
	                 name: "globals",
	                 version: "0.0.2",
	                 summary: "Define the global namespace for GemThief."
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.addFiles(["globals.js", "object_utils.es6.js"]);
	api.export("GemThief");
	api.export("ObjectUtils");
});
