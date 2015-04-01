Package.describe({
  name: "dwarf-ai",
  version: "0.0.1"
});

Package.onUse(function(api) {
  api.versionsFrom("WINDOWS-PREVIEW@0.3.0");
	api.use(["grigio:babel", "globals"]);
	api.addFiles(["lib/ai.es6.js", "lib/bashful_ai.es6.js", "lib/doc_ai.es6.js", "lib/dopey_ai.es6.js",
		"lib/grumpy_ai.es6.js", "lib/happy_ai.es6.js", "lib/sleepy_ai.es6.js", "lib/sneezy_ai.es6.js", "dwarf_config.es6.js"]);
});
