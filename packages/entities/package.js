Package.describe({
	                 name: "entities",
	                 version: "0.0.2"
                 });

Package.onUse(function (api) {
	api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals"]);
	
});
