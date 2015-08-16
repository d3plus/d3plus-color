var d3 = {
  array: require("d3-arrays"),
  color: require("d3-color")
};

var settings = require("./defaults.js");

class Color {

  /**
      @param {Color|String|Number|true|false|null|undefined} color
      @param {object} [defaults = src/defaults.js]
  */
  constructor(color, defaults) {

    this.value = color;
    this.defaults = defaults || settings;

    // If the value is null or undefined, set to grey.
    if ([null, undefined].indexOf(color) >= 0) {
      this.color = this.defaults.missing;
    }
    // Else if the value is true, set to green.
    else if (color === true) {
      this.color = this.defaults.on;
    }
    // Else if the value is false, set to red.
    else if (color === false) {
      this.color = this.defaults.off;
    }

    this.d3 = d3.color.color(this.color || color);
    // If the value is not a valid color string, use the color scale.
    if (!this.d3) {
      this.color = this.defaults.scale(color);
      this.d3 = d3.color.color(this.color);
    }
    else if (!this.color) {
      this.color = color;
    }

  }


  /**
      Mixes a second color, returning a new Color object.
      @param {Color} c2 - The color to be mixed in. If it is not a d3plus-color Object, then it will be parsed into one.
      @returns {Color}
  */
  add(c2) {
    if (c2.constructor !== Color) { c2 = new Color(c2); }
    var o1 = this.opacity(), o2 = c2.opacity(), c1 = this.hsl();
    c2 = c2.hsl();
    var d = Math.abs(c2.h * o2 - c1.h * o1);
    if (d > 180) { d = d - 360; }
    var h = (d3.array.min([c1.h, c2.h]) + d / 2) % 360,
        s = c1.s + (c2.s * o2 - c1.s * o1) / 2,
        l = c1.l + (c2.l * o2 - c1.l * o1) / 2;
        // a = o1 + (o2 - o1) / 2;
    if (h < 0) { h = 360 + h; }
    return new Color("hsl(" + [h, s * 100 + "%", l * 100 + "%"].join(",") + ")");
    // return new Color("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")");
  }

  /**
      Returns true if the color is displayable.
      @returns {Boolean}
  */
  displayable() {
    return this.d3.displayable();
  }

  /**
      Returns the hexidecimal value.
      @returns {String}
  */
  hex() {
    return this.toString();
  }

  /** Returns the D3 hsl object. */
  hsl() {
    return d3.color.hsl(this.d3);
  }

  /**
      Darkens the color if it is too light to appear on white.
      @returns {Color}
  */
  legible() {
    var c = this.hsl();
    if (c.l > 0.45) {
      if (c.s > 0.8) { c.s = 0.8; }
      c.l = 0.45;
    }
    return new Color(c.toString());
  }

  /**
      Lightens the color while also reducing the saturation.
      @returns {Color}
  */
  lighter(i) {
    if (!i) { i = 0.5; }
    var c = this.hsl();
    i = (1 - c.l) * i;
    c.l += i; c.s -= i;
    return new Color(c.toString());
  }

  // Parses opacity from original rgba or hsla value.
  opacity() {
    return 1;
    // var c = this.value;
    // if (!c || c.constructor !== String) { return 1; }
    // c = c.replace(RegExp(" ", "g"), "").toLowerCase();
    // if (c.indexOf("hsla(") === 0 || c.indexOf("rgba(") === 0) {
    //   return parseFloat(c.split(")")[0].split(",")[3], 10);
    // }
    // else {
    //   return 1;
    // }
  }

  /** Returns the D3 rgb object. */
  rgb() {
    return this.d3;
  }

  /**
      Subtracts a second color, returning a new Color object.
      @param {Color} c2 - The color to be subtracted out. If it is not a d3plus-color Object, then it will be parsed into one.
      @returns {Color}
  */
  subtract(c2) {
    if (c2.constructor !== Color) { c2 = new Color(c2); }
    var o1 = this.opacity(), o2 = c2.opacity(), c1 = this.hsl();
    c2 = c2.hsl();
    var d = (c2.h * o2 - c1.h * o1);
    if (Math.abs(d) > 180) { d = d - 360; }
    var h = (c1.h - d) % 360,
        s = c1.s - (c2.s * o2 - c1.s * o1) / 2,
        l = c1.l - (c2.l * o2 - c1.l * o1) / 2;
        // a = o1 - (o2 - o1) / 2;
    if (h < 0) { h = 360 + h; }
    return new Color("hsl(" + [h, s * 100 + "%", l * 100 + "%"].join(",") + ")");
    // return new Color("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")");
  }

  /**
      Analyzes the color and determines an appropriate color for text to be placed on top of the color.
      @returns {Color}
  */
  text() {
    var rgb = this.rgb(), r = rgb.r, g = rgb.g, b = rgb.b,
        yiq = (r * 299 + g * 587 + b * 114) / 1000,
        c = yiq >= 128 ? this.defaults.dark : this.defaults.light;
    return new Color(c);
  }

  /**
      Pass-through method for D3 toString function.
      @returns {String}
  */
  toString() {
    return this.d3.toString();
  }

}

module.exports = Color;
