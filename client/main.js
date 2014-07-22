Game = {};

Meteor.startup(function()
{
    Game = createGame();
	Game.init();
});

