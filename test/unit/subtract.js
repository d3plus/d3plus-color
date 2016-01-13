var color = require("../../build/d3plus-color"),
    tape = require("tape");

tape("color subtraction", function(test){
  test.equal("#feff00", color.subtract("#ff8000", "#ff0000"));
  test.equal("#0100ff", color.subtract("#00ff80", "#ffff00"));
  test.equal("#ff0000", color.subtract("#ff00ff", "#0000ff"));
  test.equal("#ff0100", color.subtract("#ff8000", "#ffff00"));
  test.equal("#feff00", color.subtract("#00ff80", "#0000ff"));
  test.equal("#0000ff", color.subtract("#ff00ff", "#ff0000"));
  test.end();
});
