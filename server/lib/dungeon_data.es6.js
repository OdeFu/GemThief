"use strict";

GemThief.DungeonData.getData = function (userId) {
	return this.findOne({ userId: userId });
};

GemThief.DungeonData.getPlayerData = function (userId) {
	return this.findOne({ userId: userId }, { fields: { "player": 1 }});
};

GemThief.DungeonData.getDwarfData = function (userId) {
	return this.findOne({ userId: userId }, { fields: { "dwarf": 1 }});
};

GemThief.DungeonData.getGemData = function (userId) {
	return this.findOne({ userId: userId }, { fields: { "gems": 1 }});
};

GemThief.DungeonData.savePlayerData = function (userId, playerData) {
	this.update({ userId: userId }, { $set: { player: playerData }});
};

GemThief.DungeonData.saveDwarfData = function (userId, dwarfData) {
	this.update({ userId: userId }, { $set: { dwarf: dwarfData }});
};

GemThief.DungeonData.saveGemData = function (userId, gemData) {
	this.update({ userId: userId }, { $set: { gems: gemData }});
};
