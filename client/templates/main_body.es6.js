"use strict";

Template.mainBody.helpers({
	supported: function () {
		return ROT.isSupported;
	}
});
