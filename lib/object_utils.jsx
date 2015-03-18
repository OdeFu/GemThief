ObjectUtils = {
	addConstantProperty: function (to, name, value) {
		Object.defineProperty(to, name, {
			value: value,
			writable: false,
			configurable: false,
			enumerable: true
		})
	}
};
