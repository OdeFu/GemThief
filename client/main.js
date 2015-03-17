Game = createGame();

Meteor.startup(function startup()
{
	Game.init();
});

