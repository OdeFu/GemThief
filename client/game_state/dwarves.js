/**
 * Creates a new dwarf.
 * @param params
 * - name: The name of the dwarf, must be one from the DWARF_NAMES array, required
 */
Dwarf = function (params)
{
	return createDwarf(params);
};

var createDwarf = function (params)
{
	"use strict";

	check(params.name, String);
	check(params.color, String);

	// Private fields

	// Public methods
	var getName = function ()
	{
		return params.name;
	};

	var setAI = function (ai)
	{
		dwarf.act = ai;
	};

	params.char = "P";
	params.priority = Entity.ENTITY;

	var dwarf = createEntity(params);
	dwarf.getName = getName;
	dwarf.setAI = setAI;
	return dwarf;
};
