var color = require("../../build/d3plus-color"),
    tape = require("tape");

tape("text color for dark backgrounds", function(test){
  test.equal(color.defaults.light, color.contrast("#000"));
  test.equal(color.defaults.light, color.contrast("#777"));
  test.equal(color.defaults.light, color.contrast("#c00"));
  test.equal(color.defaults.light, color.contrast("#0b0"));
  test.equal(color.defaults.light, color.contrast("#00f"));
  test.equal(color.defaults.light, color.contrast("#880"));
  test.equal(color.defaults.light, color.contrast("#0aa"));
  test.equal(color.defaults.light, color.contrast("#c0c"));
  test.end();
});

tape("text color for light backgrounds", function(test){
  test.equal(color.defaults.dark, color.contrast("#fff"));
  test.equal(color.defaults.dark, color.contrast("#888"));
  test.equal(color.defaults.dark, color.contrast("#fcc"));
  test.equal(color.defaults.dark, color.contrast("#8c8"));
  test.equal(color.defaults.dark, color.contrast("#990"));
  test.equal(color.defaults.dark, color.contrast("#0bb"));
  test.equal(color.defaults.dark, color.contrast("#fcf"));
  test.end();
});
