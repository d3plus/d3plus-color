var color = require("../../build/d3plus-color"),
    tape = require("tape");

tape("color lightening", function(test){
  test.equal("#cf5252", color.lighter("#440000"));
  test.equal("#52cf52", color.lighter("#004400"));
  test.equal("#5252cf", color.lighter("#000044"));
  test.end();
});
