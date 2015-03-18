/**
 * Creates a new dwarf.
 * @param params
 * - name: The name of the dwarf, must be one from the DWARF_NAMES array, required
 */
Dwarf = function (params)
{
	return createDwarf(params);
};

function createDwarf(params)
{
	"use strict";

	check(params.name, String);
	check(params.color, String);

	// Private fields

	// Public methods
	function getName()
	{
		return params.name;
	}

	function setAI(ai)
	{
		dwarf.act = ai;
	}

	params.char = "P";
	params.priority = Entity.ENTITY;

	var dwarf = createEntity(params);
	dwarf.getName = getName;
	dwarf.setAI = setAI;
	return dwarf;
}
