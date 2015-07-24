Package.describe({
	name: "globals",
	version: "0.0.3",
	summary: "Define the global namespace for GemThief."
});

Package.onUse(function (api) {
	api.versionsFrom("1.1");

	var packages = [
		"meteor-platform",
		"accounts-password",
		"oaalto:rot",
		"ian:accounts-ui-bootstrap-3",
		"twbs:bootstrap",
		"sacha:spin"
	];

	api.use(packages);
	api.imply(packages);

	api.addFiles(["globals.js", "object_utils.es6.js"]);
	api.export("GemThief");
});
