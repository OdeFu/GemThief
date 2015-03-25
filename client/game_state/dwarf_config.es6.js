"use strict";

GemThief.DWARF_AIS = {};
GemThief.DWARF_AIS["Doc"] = GemThief.AI.Doc.instantiate;
GemThief.DWARF_AIS["Grumpy"] = GemThief.AI.Grumpy.instantiate;
GemThief.DWARF_AIS["Happy"] = GemThief.AI.Happy.instantiate;
GemThief.DWARF_AIS["Sleepy"] = GemThief.AI.Sleepy.instantiate;
GemThief.DWARF_AIS["Dopey"] = GemThief.AI.Dopey.instantiate;
GemThief.DWARF_AIS["Bashful"] = GemThief.AI.Bashful.instantiate;
GemThief.DWARF_AIS["Sneezy"] = GemThief.AI.Sneezy.instantiate;

GemThief.DWARF_START_LOCATIONS = {};
GemThief.DWARF_START_LOCATIONS["randomStartLocation"] = GemThief.Location.getRandomStartLocation;
GemThief.DWARF_START_LOCATIONS["darkStartLocation"] = GemThief.Location.getDarkStartLocation;
GemThief.DWARF_START_LOCATIONS["lightStartLocation"] = GemThief.Location.getLightStartLocation;
GemThief.DWARF_START_LOCATIONS["brightLightStartLocation"] = GemThief.Location.getBrightLightStartLocation;
