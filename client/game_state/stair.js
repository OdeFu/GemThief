Stair = function (params)
{
  "use strict";
  return createStair(params);
};

var createStair = function (params)
{
  "use strict";

  check(params.down, Boolean);

  // Private fields
  var _down = params.down;

  // Public methods
  var isDown = function () { return _down; };

  params.char = _down ? ">" : "<";
  params.color = "brown";
  var stair = createEntity(params);
  stair.isDown = isDown;
  return stair;
};