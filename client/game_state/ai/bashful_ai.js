createBashfulIdleAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var idleAI = function ()
	{
		"use strict";

		if (AI.spottedPlayer())
		{
			AI.changeToTrackingAI(createScaredAI);
		}
	};
	return idleAI;
};

var createScaredAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var scaredAI = function ()
	{
		"use strict";


	};
	return scaredAI;
};

var createBashfulTrackingAI = function (dwarf, params)
{
	var AI = createAI(dwarf, params);

	var trackingAI = function ()
	{
		"use strict";

		if (AI.catchedPlayer())
		{
			return;
		}
	};
	return trackingAI;
};
