"use strict";

GemThief.DungeonData.getData = function (userId) {
	const data = this.findOne({ userId: userId });
	return data ? data.data : null;
};

GemThief.DungeonData.getPlayerData = function (userId) {
	const data = this.findOne({ userId: userId }, { fields: { "data.player": 1 }});
	return data ? data.data.player : null;
};

GemThief.DungeonData.getDwarfData = function (userId) {
	const data = this.findOne({ userId: userId }, { fields: { "data.dwarf": 1 }});
	return data ? data.data.dwarf : null;
};

GemThief.DungeonData.getGemData = function (userId) {
	const data = this.findOne({ userId: userId }, { fields: { "data.gems": 1 }});
	return data ? data.data.gems : null;
};

GemThief.DungeonData.savePlayerData = function (userId, playerData) {
	this.update({ userId: userId }, { $set: { "data.player": playerData }});
};

GemThief.DungeonData.saveDwarfData = function (userId, dwarfData) {
	this.update({ userId: userId }, { $set: { "data.dwarf": dwarfData }});
};

GemThief.DungeonData.saveGemData = function (userId, gemData) {
	this.update({ userId: userId }, { $set: { "data.gems": gemData }});
};
