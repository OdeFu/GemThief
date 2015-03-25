Package.describe({
	                 name: "map",
	                 version: "0.0.2"
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals", "oaalto:rot", "entities", "display", "stevezhu:lodash"]);
	api.addFiles(["map.es6.js", "map_display.es6.js", "path.es6.js"]);
});

