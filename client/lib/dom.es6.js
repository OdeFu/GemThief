"use strict";

Element.prototype.removeAll = function () {
	while (this.firstChild) {
		this.removeChild(this.firstChild);
	}
	return this;
};
