Package.describe({
	                 name: 'globals', version: '0.0.1', summary: 'Define the global namespace for GemThief.'
                 });

Package.onUse(function (api) {
	api.versionsFrom('WINDOWS-PREVIEW@0.3.0');
	api.addFiles('globals.js');
	api.export("GemThief");
});
