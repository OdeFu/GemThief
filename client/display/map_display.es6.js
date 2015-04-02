"use strict";

const DEFAULT_MESSAGE_LIFE = 3;

GemThief.Map.Display = {
	instantiate: function (map) {
		const mapDisplay = Object.create(GemThief.Map.Display);
		mapDisplay.map = map;

		mapDisplay.draw = draw.bind(mapDisplay);
		return mapDisplay;
	}
};

function draw(params) {
	if (this.message) {
		GemThief.Display.drawText(0, 0, this.message);
		this.messageLife--;
		if (this.messageLife === 0) {
			this.message = null;
		}
	}

	const visibleTiles = this.map.calculateVisibleTiles(params.location);
	visibleTiles.forEach(function drawTiles(tile) {
		GemThief.Display.draw(tile.x, tile.y + 1, tile.getChar(), tile.getForegroundColor(), tile.getBackgroundColor());
	});

	GemThief.Display.drawText(0, this.map.height + 1, "Mine Level: " + this.map.level);
	GemThief.Display.drawTextRight(this.map.height + 1, "Gems Found: " + params.gems);
}

Meteor.startup(function meteorStartup() {
	Messenger.addListener(GemThief.Messages.DISPLAY_MESSAGE, _setMessage);
});

function _setMessage(msg, messageLife) {
	this.message = msg;
	this.messageLife = messageLife || DEFAULT_MESSAGE_LIFE;
}
