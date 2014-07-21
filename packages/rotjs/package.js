Package.describe(
{
	summary: "ROTJS"
});

Package.on_use(function (api)
{
	api.export('ROT');
	api.add_files('rot.js', ['client', 'server']);
});