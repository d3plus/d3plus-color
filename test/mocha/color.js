var assert = require("assert"),
    Color = require("../../src/color.js"),
    defaults = require("../../src/defaults.js");

describe("Color", function(){

  // Tests pertaining to the construction of new Color objects.
  describe("constructor", function(){

    // Tests normal hex parsing (pass-through).
    describe("hex parsing", function(){
      for (let hex of ["#000000", "#cc0000", "#00ff00", "#000088"])
        it(hex, function(){
          assert.strictEqual(hex, new Color(hex).hex());
        });
    });

    // Tests rgb parsing.
    describe("rgb parsing", function(){

      var d = ["rgb(255,0,0)", "rgb(0,255,0)", "rgb(0,0,255)"],
          l = ["#ff0000", "#00ff00", "#0000ff"];
      d.forEach(function(rgb, i){
        it(rgb, function(){
          assert.strictEqual(l[i], new Color(rgb).hex());
        });
      });

    });

    // Tests hsl parsing.
    describe("hsl parsing", function(){

      var d = ["hsl(0,100%,50%)", "hsl(120,100%,50%)", "hsl(240,100%,50%)"],
          l = ["#ff0000", "#00ff00", "#0000ff"];
      d.forEach(function(hsl, i){
        it(hsl, function(){
          assert.strictEqual(l[i], new Color(hsl).hex());
        });
      });

    });

    // Tests opacity parsing.
    describe("opacity parsing", function(){

      for (let color of ["rgba(255,0,0,0.5)", "hsla(0,0%,0%,0.5)"])
        it(color, function(){
          assert.strictEqual(0.5, new Color(color).opacity());
        });

    });

    // Tests for missing values.
    describe("missing value parsing", function(){
      for (let hex of [null, undefined])
        it(hex, function(){
          assert.strictEqual(defaults.missing, new Color(hex).hex());
        });
    });

    // Tests true/false booleans.
    describe("boolean parsing", function(){
      it("true", function(){
        assert.strictEqual(defaults.on, new Color(true).hex());
      });
      it("false", function(){
        assert.strictEqual(defaults.off, new Color(false).hex());
      });
    });

    // Tests mapping strings and numbers to the default color scale.
    describe("mapping to color scale", function(){
      var scale = defaults.scale.range(),
          values = ["Alpha", "Beta", 45, 85];
      values.forEach(function(value, i){
        it(value, function(){
          assert.strictEqual(scale[i], new Color(value).hex());
        });
      });
    });

  });

  // Tests for the color legible function.
  describe("legible", function(){

    var d = ["#ffaaaa", "#ccffcc", "#ccccff"],
        l = ["#cf1717", "#17cf17", "#1717cf"];
    d.forEach(function(hex, i){
      it(hex, function(){
        assert.strictEqual(l[i], new Color(hex).legible().hex());
      });
    });

  });

  // Tests for the color lightening function.
  describe("lighter", function(){

    var d = ["#440000", "#004400", "#000044"],
        l = ["#cf5252", "#52cf52", "#5252cf"];
    d.forEach(function(hex, i){
      it(hex, function(){
        assert.strictEqual(l[i], new Color(hex).lighter().hex());
      });
    });

  });

  // Tests pertaining to the text color function. Each color should return
  // either white or black, depending on the "darkness" of the color.
  describe("text", function(){

    // Tests that specific colors are dark enough to return white.
    describe("dark colors", function(){
      for (let hex of ["#000", "#777", "#c00", "#0b0", "#00f", "#880", "#0aa", "#c0c"]) {
        it(hex, function(){
          assert.strictEqual(defaults.light, new Color(hex).text().hex());
        });
      }
    });

    // Tests that specific colors are light enough to return black.
    describe("light colors", function(){
      for (let hex of ["#fff", "#888", "#fcc", "#8c8", "#990", "#0bb", "#fcf"]) {
        it(hex, function(){
          assert.strictEqual(defaults.dark, new Color(hex).text().hex());
        });
      }
    });

  });

  // Tests pertaining to the color validation function.
  describe("validate", function(){

    describe("valid colors", function(){
      for (let color of ["#000", "#000000", "black", "#f00", "#ff0000", "rgb(255,0,0)", "red", "hsl(0, 100%, 50%)"]) {
        it(color, function(){
          assert.strictEqual(true, new Color(color).validate());
        });
      }
    });

    describe("invalid colors", function(){
      for (let color of ["Text", 45, true, false, null, undefined]) {
        it(color, function(){
          assert.strictEqual(false, new Color(color).validate());
        });
      }
    });

  });

  // Tests for the color add function.
  describe("addition", function(){

    var c1 = ["#ff0000", "#ffff00", "#0000ff", "#ffff00", "#0000ff", "#ff0000"],
        c2 = ["#ffff00", "#0000ff", "#ff0000", "#ff0000", "#ffff00", "#0000ff"],
        rs = ["#ff8000", "#00ff80", "#ff00ff", "#ff8000", "#00ff80", "#ff00ff"];
    c1.forEach(function(c, i){
      it(c + " + " + c2[i], function(){
        assert.strictEqual(rs[i], new Color(c).add(c2[i]).hex());
      });
    });

  });

  // Tests for the color substract function.
  describe("subtraction", function(){

    var c1 = ["#ff8000", "#00ff80", "#ff00ff", "#ff8000", "#00ff80", "#ff00ff"],
        c2 = ["#ff0000", "#ffff00", "#0000ff", "#ffff00", "#0000ff", "#ff0000"],
        rs = ["#feff00", "#0100ff", "#ff0000", "#ff0100", "#feff00", "#0000ff"];
    c1.forEach(function(c, i){
      it(c + " - " + c2[i], function(){
        assert.strictEqual(rs[i], new Color(c).subtract(c2[i]).hex());
      });
    });

  });

});
