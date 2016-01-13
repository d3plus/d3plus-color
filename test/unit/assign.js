var color = require("../../build/d3plus-color"),
    tape = require("tape");

tape("parsing null values to grey", function(test){
  test.equal(color.defaults.missing, color.assign(null), "null");
  test.equal(color.defaults.missing, color.assign(undefined), "undefined");
  test.end();
});

tape("parsing booleans to red/green", function(test){
  test.equal(color.defaults.on, color.assign(true), "true");
  test.equal(color.defaults.off, color.assign(false), "false");
  test.end();
});

tape("mapping non-color values to a color scale", function(test){
  var range = color.defaults.scale.range();
  test.equal(range[0], color.assign("Alpha"));
  test.equal(range[1], color.assign("Beta"));
  test.equal(range[2], color.assign(45));
  test.equal(range[3], color.assign(85.235));
  test.end();
});
