var color = require("../../build/d3plus-color"),
    tape = require("tape");

tape("color addition", function(test){
  test.equal("#ff8000", color.add("#ff0000", "#ffff00"));
  test.equal("#00ff80", color.add("#ffff00", "#0000ff"));
  test.equal("#ff00ff", color.add("#0000ff", "#ff0000"));
  test.equal("#ff8000", color.add("#ffff00", "#ff0000"));
  test.equal("#00ff80", color.add("#0000ff", "#ffff00"));
  test.equal("#ff00ff", color.add("#ff0000", "#0000ff"));
  test.end();
});
