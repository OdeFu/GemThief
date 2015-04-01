"use strict";

GemThief.DungeonData.getData = function (userId) {
	return this.findOne({ userId: userId }).data;
};

GemThief.DungeonData.getPlayerData = function (userId) {
	return this.findOne({ userId: userId }, { fields: { "data.player": 1 }}).data.player;
};

GemThief.DungeonData.getDwarfData = function (userId) {
	return this.findOne({ userId: userId }, { fields: { "data.dwarf": 1 }}).data.dwarf;
};

GemThief.DungeonData.getGemData = function (userId) {
	return this.findOne({ userId: userId }, { fields: { "data.gems": 1 }}).data.gems;
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
