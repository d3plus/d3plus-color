var tape = require("tape"),
    Color = require("../../src/Color.js"),
    defaults = require("../../src/defaults.js");

tape("hex parsing", function(test){
  test.equal("#000000", new Color("#000000").hex());
  test.equal("#cc0000", new Color("#cc0000").hex());
  test.equal("#000088", new Color("#000088").hex());
  test.end();
});

tape("rgb parsing", function(test){
  test.equal("#ff0000", new Color("rgb(255, 0, 0)").hex());
  test.equal("#00ff00", new Color("rgb(0, 255, 0)").hex());
  test.equal("#0000ff", new Color("rgb(0, 0, 255)").hex());
  test.end();
});

tape("hsl parsing", function(test){
  test.equal("#ff0000", new Color("hsl(0, 100%, 50%)").hex());
  test.equal("#00ff00", new Color("hsl(120, 100%, 50%)").hex());
  test.equal("#0000ff", new Color("hsl(240, 100%, 50%)").hex());
  test.end();
});

// tape("opacity parsing", function(test){
//   test.equal(0.5, new Color("rgba(255,0,0,0.5)").opacity());
//   test.equal(0.5, new Color("hsla(0,0%,0%,0.5)").opacity());
//   test.end();
// });

tape("parsing null values to grey", function(test){
  test.equal(defaults.missing, new Color(null).hex());
  test.equal(defaults.missing, new Color(undefined).hex());
  test.end();
});

tape("parsing booleans to red/green", function(test){
  test.equal(defaults.on, new Color(true).hex(), "true");
  test.equal(defaults.off, new Color(false).hex(), "false");
  test.end();
});

tape("mapping non-color values to a color scale", function(test){
  var range = defaults.scale.range();
  test.equal(range[0], new Color("Alpha").hex());
  test.equal(range[1], new Color("Beta").hex());
  test.equal(range[2], new Color(45).hex());
  test.equal(range[3], new Color(85.235).hex());
  test.end();
});

tape("darkening colors to be visible on white", function(test){
  test.equal("#cf1717", new Color("#ffaaaa").legible().hex());
  test.equal("#17cf17", new Color("#ccffcc").legible().hex());
  test.equal("#1717cf", new Color("#ccccff").legible().hex());
  test.end();
});

tape("color lightening", function(test){
  test.equal("#cf5252", new Color("#440000").lighter().hex());
  test.equal("#52cf52", new Color("#004400").lighter().hex());
  test.equal("#5252cf", new Color("#000044").lighter().hex());
  test.end();
});

tape("text color for dark backgrounds", function(test){
  test.equal(defaults.light, new Color("#000").text().hex());
  test.equal(defaults.light, new Color("#777").text().hex());
  test.equal(defaults.light, new Color("#c00").text().hex());
  test.equal(defaults.light, new Color("#0b0").text().hex());
  test.equal(defaults.light, new Color("#00f").text().hex());
  test.equal(defaults.light, new Color("#880").text().hex());
  test.equal(defaults.light, new Color("#0aa").text().hex());
  test.equal(defaults.light, new Color("#c0c").text().hex());
  test.end();
});

tape("text color for light backgrounds", function(test){
  test.equal(defaults.dark, new Color("#fff").text().hex());
  test.equal(defaults.dark, new Color("#888").text().hex());
  test.equal(defaults.dark, new Color("#fcc").text().hex());
  test.equal(defaults.dark, new Color("#8c8").text().hex());
  test.equal(defaults.dark, new Color("#990").text().hex());
  test.equal(defaults.dark, new Color("#0bb").text().hex());
  test.equal(defaults.dark, new Color("#fcf").text().hex());
  test.end();
});

tape("color addition", function(test){
  test.equal("#ff8000", new Color("#ff0000").add("#ffff00").hex());
  test.equal("#00ff80", new Color("#ffff00").add("#0000ff").hex());
  test.equal("#ff00ff", new Color("#0000ff").add("#ff0000").hex());
  test.equal("#ff8000", new Color("#ffff00").add("#ff0000").hex());
  test.equal("#00ff80", new Color("#0000ff").add("#ffff00").hex());
  test.equal("#ff00ff", new Color("#ff0000").add("#0000ff").hex());
  test.end();

});

tape("color subtraction", function(test){
  test.equal("#feff00", new Color("#ff8000").subtract("#ff0000").hex());
  test.equal("#0100ff", new Color("#00ff80").subtract("#ffff00").hex());
  test.equal("#ff0000", new Color("#ff00ff").subtract("#0000ff").hex());
  test.equal("#ff0100", new Color("#ff8000").subtract("#ffff00").hex());
  test.equal("#feff00", new Color("#00ff80").subtract("#0000ff").hex());
  test.equal("#0000ff", new Color("#ff00ff").subtract("#ff0000").hex());
  test.end();
});
