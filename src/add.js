import {hsl} from "d3-color";

/**
    @module {Function} add
    @name "d3plus.color.add(c1, c2[, o1, o2])"
    @desc Adds two colors together.
    @param {String} c1 The first color, a valid CSS color string.
    @param {String} c2 The second color, also a valid CSS color string.
    @param {String} [o1 = 1] Value from 0 to 1 of the first color's opacity.
    @param {String} [o2 = 1] Value from 0 to 1 of the first color's opacity.
    @returns {String}
*/
export default function(c1, c2, o1, o2) {
  if (o1 === void 0) { o1 = 1; }
  if (o2 === void 0) { o2 = 1; }
  c1 = hsl(c1);
  c2 = hsl(c2);
  var d = Math.abs(c2.h * o2 - c1.h * o1);
  if (d > 180) { d = d - 360; }
  var h = (Math.min(c1.h, c2.h) + d / 2) % 360,
      s = c1.s + (c2.s * o2 - c1.s * o1) / 2,
      l = c1.l + (c2.l * o2 - c1.l * o1) / 2;
      // a = o1 + (o2 - o1) / 2;
  if (h < 0) { h = 360 + h; }
  return hsl("hsl(" + [h, s * 100 + "%", l * 100 + "%"].join(",") + ")").toString();
  // return hsl("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")").toString();
}
