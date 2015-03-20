Package.describe({
	                 name: "entities",
	                 version: "0.0.1",
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals"]);
	api.addFiles(["entity.jsx", "stairs.jsx", "tile.jsx", "map_features.jsx"]);
});
