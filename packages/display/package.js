Package.describe({
	                 name: "display",
	                 version: "0.0.2"
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals", "oaalto:rot"]);
	api.addFiles("display.es6.js");
});
