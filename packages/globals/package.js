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
		"oaalto:rot@0.6.1",
		"ian:accounts-ui-bootstrap-3@1.2.76",
		"twbs:bootstrap@3.3.5",
		"sacha:spin@2.3.1",
		"msavin:mongol@1.1.0"
	];

	api.use(packages);
	api.imply(packages);

	api.addFiles(["globals.js", "object_utils.es6.js", "messages.es6.js"]);
	api.export("GemThief");
});
