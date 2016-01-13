import {default as defaults} from "./defaults";
import {rgb} from "d3-color";

function getColor(k, u) {
  return k in u ? u[k] : defaults[k];
}

/**
    @module {Function} contrast
    @name "d3plus.color.contrast(c[, u])"
    @desc A set of default color values used when assigning colors based on data.
    @param {String} c A valid CSS color string.
    @param {Object} [u = d3plus.color.defaults] An object containing overrides of the default colors.
    @returns {String}
*/
export default function(c, u) {
  if (u === void 0) { u = {}; }
  c = rgb(c);
  var yiq = (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
  return yiq >= 128 ? getColor("dark", u) : getColor("light", u);
}
