Package.describe({
	                 name: "entities",
	                 version: "0.0.2"
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals"]);
	api.addFiles(["entity.es6.js", "stairs.es6.js", "tile.es6.js", "map_features.es6.js"]);
});
