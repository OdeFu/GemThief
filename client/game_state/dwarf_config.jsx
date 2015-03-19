"use strict";

GemThief.DWARF_AIS = {};
GemThief.DWARF_AIS["createDocIdleAI"] = createDocIdleAI;
GemThief.DWARF_AIS["createGrumpyIdleAI"] = createGrumpyIdleAI;
GemThief.DWARF_AIS["createHappyIdleAI"] = createHappyIdleAI;
GemThief.DWARF_AIS["createSneezyIdleAI"] = createSneezyIdleAI;
GemThief.DWARF_AIS["createDopeyIdleAI"] = createDopeyIdleAI;
GemThief.DWARF_AIS["createBashfulIdleAI"] = createBashfulIdleAI;
GemThief.DWARF_AIS["createSleepyIdleAI"] = createSleepyIdleAI;

GemThief.DWARF_START_LOCATIONS = {};
GemThief.DWARF_START_LOCATIONS["randomStartLocation"] = GemThief.Location.getRandomStartLocation;
GemThief.DWARF_START_LOCATIONS["darkStartLocation"] = GemThief.Location.getDarkStartLocation;
GemThief.DWARF_START_LOCATIONS["lightStartLocation"] = GemThief.Location.getLightStartLocation;
GemThief.DWARF_START_LOCATIONS["brightLightStartLocation"] = GemThief.Location.getBrightLightStartLocation;
