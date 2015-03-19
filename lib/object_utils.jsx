ObjectUtils = {
	addConstantProperty: function (to, name, value) {
		"use strict";

		Object.defineProperty(to, name, {
			value: value,
			writable: false,
			configurable: false,
			enumerable: true
		})
	}
};
