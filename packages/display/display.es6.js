"use strict";

GemThief.Display = {
	init: function (container) {
		this.display = new ROT.Display();
		container.appendChild(this.display.getContainer());
	},

	draw: function (x, y, c, foreColor, backColor) {
		this.display.draw(x, y, c, foreColor, backColor);
	},

	drawText: function (x, y, text) {
		this.display.drawText(x, y, text);
	},

	drawTextCentered: function (y, text) {
		const textSize = ROT.Text.measure(text);
		const x = this.display.getOptions().width * 0.5 - textSize.width * 0.5;
		this.display.drawText(x, y, text);
	},

	drawTextRight: function (y, text) {
		const textSize = ROT.Text.measure(text);
		const x = this.display.getOptions().width - textSize.width;
		this.display.drawText(x, y, text);
	},

	clear: function () {
		this.display.clear();
	}
};
