var d3 = {
  array: require("d3-arrays"),
  color: require("d3-color")
};

var settings = require("./defaults.js");

/**
* D3plus custom Color element.
*
* @class Color
* @constructor
*/
var Color = class {

  constructor(color, defaults) {

    this.value = color;
    this.defaults = defaults || settings;

    // If the color value is null  or undefined, set to grey.
    if ([null, undefined].indexOf(color) >= 0) {
      this.color = this.defaults.missing;
    }
    // Else if the color is true, set to green.
    else if (color === true) {
      this.color = this.defaults.on;
    }
    // Else if the color is false, set to red.
    else if (color === false) {
      this.color = this.defaults.off;
    }
    // Else if the color is not a valid color string, use the color scale.
    else if (!this.validate()) {
      this.color = this.defaults.scale(color);
    }
    else if (!this.color) {
      this.color = color;
    }

  }

  // Mixes a second color, returning a new Color object.
  add(c2) {
    if (c2.constructor !== Color) { c2 = new Color(c2); }
    var o1 = this.opacity(), o2 = c2.opacity(), c1 = this.hsl();
    c2 = c2.hsl();
    var d = Math.abs(c2.h * o2 - c1.h * o1);
    if (d > 180) { d = d - 360; }
    var h = (d3.array.min([c1.h, c2.h]) + d / 2) % 360,
        s = c1.s + (c2.s * o2 - c1.s * o1) / 2,
        l = c1.l + (c2.l * o2 - c1.l * o1) / 2,
        a = o1 + (o2 - o1) / 2;
    if (h < 0) { h = 360 + h; }
    return new Color("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")");
  }

  // Returns the hexidecimal value.
  hex() {
    return this.toString();
  }

  // Returns the D3 hsl object.
  hsl() {
    return this.rgb().hsl();
  }

  // Darkens the color if it is too light to appear on white.
  legible() {
    var c = this.hsl();
    if (c.l > 0.45) {
      if (c.s > 0.8) { c.s = 0.8; }
      c.l = 0.45;
    }
    return new Color(c.toString());
  }

  // Lightens the color while also reducing the saturation.
  lighter(i) {
    if (!i) { i = 0.5; }
    var c = this.hsl();
    i = (1 - c.l) * i;
    c.l += i; c.s -= i;
    return new Color(c.toString());
  }

  // Parses opacity from original rgba or hsla value.
  opacity() {
    var c = this.value;
    if (!c || c.constructor !== String) { return 1; }
    c = c.replace(RegExp(" ", "g"), "").toLowerCase();
    if (c.indexOf("hsla(") === 0 || c.indexOf("rgba(") === 0) {
      return parseFloat(c.split(")")[0].split(",")[3], 10);
    }
    else {
      return 1;
    }
  }

  // Returns the D3 rgb object.
  rgb() {
    return d3.color.rgb(this.color);
  }

  // Subtracts a second color, returning a new Color object.
  subtract(c2) {
    if (c2.constructor !== Color) { c2 = new Color(c2); }
    var o1 = this.opacity(), o2 = c2.opacity(), c1 = this.hsl();
    c2 = c2.hsl();
    var d = (c2.h * o2 - c1.h * o1);
    if (Math.abs(d) > 180) { d = d - 360; }
    var h = (c1.h - d) % 360,
        s = c1.s - (c2.s * o2 - c1.s * o1) / 2,
        l = c1.l - (c2.l * o2 - c1.l * o1) / 2,
        a = o1 - (o2 - o1) / 2;
    if (h < 0) { h = 360 + h; }
    return new Color("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")");
  }

  // Analyzes the color and determines an appropriate color for text to be
  // placed on top of the color.
  text() {
    var rgb = this.rgb(), r = rgb.r, g = rgb.g, b = rgb.b,
        yiq = (r * 299 + g * 587 + b * 114) / 1000,
        c = yiq >= 128 ? this.defaults.dark : this.defaults.light;
    return new Color(c);
  }

  // Pass-through method for D3 toString function.
  toString() {
    return this.rgb().toString();
  }

  // Returns true if the user value is a valid color and not black.
  validate() {

    var color = this.value;
    // Returns true if the variable is not a String.
    if (!color || color.constructor !== String) {
      return false;
    }
    // Removes spaces and capitals if variable is a string.
    else {
      color = color.replace(RegExp(" ", "g"), "").toLowerCase();
    }

    var black;
    if (color.indexOf("hsl") === 0 || color.indexOf("rgb") === 0) {

      var values = color.split("(")[1].split(",").slice(0, 3).map(function(n){
        return parseFloat(n, 10);
      });

      // Checks luminosity if variable is hsl or hsla.
      if (color.indexOf("hsl") === 0) {
        black = values[2] === 0;
        color = "hsl(" + values.join(",") + ")";
        this.color = color;
      }
      // Variable is black if the sum of all 3 rgb color channels is 0.
      else {
        black = d3.array.sum(values) === 0;
        color = "rgb(" + values.join(",") + ")";
        this.color = color;
      }

    }
    else {
      black = ["black", "#000", "#000000"].indexOf(color) >= 0;
    }

    // Compares variable to name and hex versions of black.
    return d3.color.rgb(color).toString() !== "#000000" || black;

  }

};

module.exports = Color;
