Game = createGame();

Meteor.startup(function ()
{
	Game.init();
});

