require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
}

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.arrays = {}));
}(this, function (exports) { 'use strict';

  function length(d) {
    return d.length;
  }

  var min = function(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    }

    else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }

    return a;
  }

  var transpose = function(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = min(matrix, length), transpose = new Array(m); ++i < m;) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n;) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  }

  var zip = function() {
    return transpose(arguments);
  }

  var number = function(x) {
    return x === null ? NaN : +x;
  }

  var variance = function(array, f) {
    var n = array.length,
        m = 0,
        a,
        d,
        s = 0,
        i = -1,
        j = 0;

    if (arguments.length === 1) {
      while (++i < n) {
        if (!isNaN(a = number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }

    else {
      while (++i < n) {
        if (!isNaN(a = number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }

    if (j > 1) return s / (j - 1);
  }

  var values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  }

  var sum = function(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1;

    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = +array[i])) s += a; // Note: zero and null are equivalent.
    }

    else {
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;
    }

    return s;
  }

  var shuffle = function(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }

    var m = i1 - i0,
        t,
        i;

    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0];
      array[m + i0] = array[i + i0];
      array[i + i0] = t;
    }

    return array;
  }

  function scale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }

  var range = function(start, stop, step) {
    if ((n = arguments.length) < 3) {
      step = 1;
      if (n < 2) {
        stop = start;
        start = 0;
      }
    }

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        k = scale(Math.abs(step)),
        range = new Array(n);

    start *= k;
    step *= k;
    while (++i < n) {
      range[i] = (start + i * step) / k;
    }

    return range;
  }


  // R-7 per <http://en.wikipedia.org/wiki/Quantile>
  var quantile = function(values, p) {
    var H = (values.length - 1) * p + 1,
        h = Math.floor(H),
        v = +values[h - 1],
        e = H - h;
    return e ? v + e * (values[h] - v) : v;
  }

  var permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  }

  var pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [p0 = p1, p1 = array[++i]];
    return pairs;
  }

  var nest = function() {
    var keys = [],
        sortKeys = [],
        sortValues,
        rollup,
        nest;

    function map(array, depth) {
      if (depth >= keys.length) return rollup
          ? rollup.call(nest, array) : (sortValues
          ? array.sort(sortValues)
          : array);

      var i = -1,
          n = array.length,
          key = keys[depth++],
          keyValue,
          value,
          valuesByKey = new Map,
          values;

      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(value = array[i]) + "")) {
          values.push(value);
        } else {
          valuesByKey.set(keyValue, [value]);
        }
      }

      valuesByKey.forEach(function(values, key) {
        valuesByKey.set(key, map(values, depth));
      });

      return valuesByKey;
    }

    function entries(map, depth) {
      if (depth >= keys.length) return map;

      var array = new Array(map.size),
          i = -1,
          sortKey = sortKeys[depth++];

      map.forEach(function(value, key) {
        array[++i] = {key: key, values: entries(value, depth)};
      });

      return sortKey
          ? array.sort(function(a, b) { return sortKey(a.key, b.key); })
          : array;
    }

    return nest = {
      map: function(array) { return map(array, 0); },
      entries: function(array) { return entries(map(array, 0), 0); },
      key: function(d) { keys.push(d); return nest; },
      sortKeys: function(order) { sortKeys[keys.length - 1] = order; return nest; },
      sortValues: function(order) { sortValues = order; return nest; },
      rollup: function(f) { rollup = f; return nest; }
    };
  }

  var merge = function(arrays) {
    var n = arrays.length,
        m,
        i = -1,
        j = 0,
        merged,
        array;

    while (++i < n) j += arrays[i].length;
    merged = new Array(j);

    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }

    return merged;
  }

  var ascending = function(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  var median = function(array, f) {
    var numbers = [],
        n = array.length,
        a,
        i = -1;

    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = number(array[i]))) numbers.push(a);
    }

    else {
      while (++i < n) if (!isNaN(a = number(f.call(array, array[i], i)))) numbers.push(a);
    }

    if (numbers.length) return quantile(numbers.sort(ascending), .5);
  }

  var mean = function(array, f) {
    var s = 0,
        n = array.length,
        a,
        i = -1,
        j = n;

    if (arguments.length === 1) {
      while (++i < n) if (!isNaN(a = number(array[i]))) s += a; else --j;
    }

    else {
      while (++i < n) if (!isNaN(a = number(f.call(array, array[i], i)))) s += a; else --j;
    }

    if (j) return s / j;
  }

  var max = function(array, f) {
    var i = -1,
        n = array.length,
        a,
        b;

    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    }

    else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = b; break; }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }

    return a;
  }

  var keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  }

  var extent = function(array, f) {
    var i = -1,
        n = array.length,
        a,
        b,
        c;

    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) { a = c = b; break; }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }

    return [a, c];
  }

  var entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({key: key, value: map[key]});
    return entries;
  }

  var deviation = function() {
    var v = variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  }

  var descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  var bisector = function(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  var ascendingBisect = bisector(ascending);
  exports.bisectRight = ascendingBisect.right;
  exports.bisectLeft = ascendingBisect.left;
  var bisect = exports.bisectRight;

  exports.ascending = ascending;
  exports.bisect = bisect;
  exports.bisector = bisector;
  exports.descending = descending;
  exports.deviation = deviation;
  exports.entries = entries;
  exports.extent = extent;
  exports.keys = keys;
  exports.max = max;
  exports.mean = mean;
  exports.median = median;
  exports.merge = merge;
  exports.min = min;
  exports.nest = nest;
  exports.pairs = pairs;
  exports.permute = permute;
  exports.quantile = quantile;
  exports.range = range;
  exports.shuffle = shuffle;
  exports.sum = sum;
  exports.transpose = transpose;
  exports.values = values;
  exports.variance = variance;
  exports.zip = zip;

}));
},{}],2:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
} else (function() {
  var m = new Map;
  if (m.set(0, 0) !== m) {
    m = m.set;
    Map.prototype.set = function() { m.apply(this, arguments); return this; };
  }
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.color = {}));
}(this, function (exports) { 'use strict';

  function deltaHue(h1, h0) {
    var delta = h1 - h0;
    return delta > 180 || delta < -180
        ? delta - 360 * Math.round(delta / 360)
        : delta;
  }

  function Color() {}

  var reHex3 = /^#([0-9a-f]{3})$/;
  var reHex6 = /^#([0-9a-f]{6})$/;
  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;
  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;
  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  color.prototype = Color.prototype = {
    displayable: function() {
      return this.rgb().displayable();
    },
    toString: function() {
      return this.rgb() + "";
    }
  };

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf))) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? rgb(m[1], m[2], m[3]) // rgb(255,0,0)
        : (m = reRgbPercent.exec(format)) ? rgb(m[1] * 2.55, m[2] * 2.55, m[3] * 2.55) // rgb(100%,0%,0%)
        : (m = reHslPercent.exec(format)) ? hsl(m[1], m[2] * .01, m[3] * .01) // hsl(120,50%,50%)
        : named.has(format) ? rgbn(named.get(format))
        : null;
  }

  function rgbn(n) {
    return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
  }

  var named = (new Map)
      .set("aliceblue", 0xf0f8ff)
      .set("antiquewhite", 0xfaebd7)
      .set("aqua", 0x00ffff)
      .set("aquamarine", 0x7fffd4)
      .set("azure", 0xf0ffff)
      .set("beige", 0xf5f5dc)
      .set("bisque", 0xffe4c4)
      .set("black", 0x000000)
      .set("blanchedalmond", 0xffebcd)
      .set("blue", 0x0000ff)
      .set("blueviolet", 0x8a2be2)
      .set("brown", 0xa52a2a)
      .set("burlywood", 0xdeb887)
      .set("cadetblue", 0x5f9ea0)
      .set("chartreuse", 0x7fff00)
      .set("chocolate", 0xd2691e)
      .set("coral", 0xff7f50)
      .set("cornflowerblue", 0x6495ed)
      .set("cornsilk", 0xfff8dc)
      .set("crimson", 0xdc143c)
      .set("cyan", 0x00ffff)
      .set("darkblue", 0x00008b)
      .set("darkcyan", 0x008b8b)
      .set("darkgoldenrod", 0xb8860b)
      .set("darkgray", 0xa9a9a9)
      .set("darkgreen", 0x006400)
      .set("darkgrey", 0xa9a9a9)
      .set("darkkhaki", 0xbdb76b)
      .set("darkmagenta", 0x8b008b)
      .set("darkolivegreen", 0x556b2f)
      .set("darkorange", 0xff8c00)
      .set("darkorchid", 0x9932cc)
      .set("darkred", 0x8b0000)
      .set("darksalmon", 0xe9967a)
      .set("darkseagreen", 0x8fbc8f)
      .set("darkslateblue", 0x483d8b)
      .set("darkslategray", 0x2f4f4f)
      .set("darkslategrey", 0x2f4f4f)
      .set("darkturquoise", 0x00ced1)
      .set("darkviolet", 0x9400d3)
      .set("deeppink", 0xff1493)
      .set("deepskyblue", 0x00bfff)
      .set("dimgray", 0x696969)
      .set("dimgrey", 0x696969)
      .set("dodgerblue", 0x1e90ff)
      .set("firebrick", 0xb22222)
      .set("floralwhite", 0xfffaf0)
      .set("forestgreen", 0x228b22)
      .set("fuchsia", 0xff00ff)
      .set("gainsboro", 0xdcdcdc)
      .set("ghostwhite", 0xf8f8ff)
      .set("gold", 0xffd700)
      .set("goldenrod", 0xdaa520)
      .set("gray", 0x808080)
      .set("green", 0x008000)
      .set("greenyellow", 0xadff2f)
      .set("grey", 0x808080)
      .set("honeydew", 0xf0fff0)
      .set("hotpink", 0xff69b4)
      .set("indianred", 0xcd5c5c)
      .set("indigo", 0x4b0082)
      .set("ivory", 0xfffff0)
      .set("khaki", 0xf0e68c)
      .set("lavender", 0xe6e6fa)
      .set("lavenderblush", 0xfff0f5)
      .set("lawngreen", 0x7cfc00)
      .set("lemonchiffon", 0xfffacd)
      .set("lightblue", 0xadd8e6)
      .set("lightcoral", 0xf08080)
      .set("lightcyan", 0xe0ffff)
      .set("lightgoldenrodyellow", 0xfafad2)
      .set("lightgray", 0xd3d3d3)
      .set("lightgreen", 0x90ee90)
      .set("lightgrey", 0xd3d3d3)
      .set("lightpink", 0xffb6c1)
      .set("lightsalmon", 0xffa07a)
      .set("lightseagreen", 0x20b2aa)
      .set("lightskyblue", 0x87cefa)
      .set("lightslategray", 0x778899)
      .set("lightslategrey", 0x778899)
      .set("lightsteelblue", 0xb0c4de)
      .set("lightyellow", 0xffffe0)
      .set("lime", 0x00ff00)
      .set("limegreen", 0x32cd32)
      .set("linen", 0xfaf0e6)
      .set("magenta", 0xff00ff)
      .set("maroon", 0x800000)
      .set("mediumaquamarine", 0x66cdaa)
      .set("mediumblue", 0x0000cd)
      .set("mediumorchid", 0xba55d3)
      .set("mediumpurple", 0x9370db)
      .set("mediumseagreen", 0x3cb371)
      .set("mediumslateblue", 0x7b68ee)
      .set("mediumspringgreen", 0x00fa9a)
      .set("mediumturquoise", 0x48d1cc)
      .set("mediumvioletred", 0xc71585)
      .set("midnightblue", 0x191970)
      .set("mintcream", 0xf5fffa)
      .set("mistyrose", 0xffe4e1)
      .set("moccasin", 0xffe4b5)
      .set("navajowhite", 0xffdead)
      .set("navy", 0x000080)
      .set("oldlace", 0xfdf5e6)
      .set("olive", 0x808000)
      .set("olivedrab", 0x6b8e23)
      .set("orange", 0xffa500)
      .set("orangered", 0xff4500)
      .set("orchid", 0xda70d6)
      .set("palegoldenrod", 0xeee8aa)
      .set("palegreen", 0x98fb98)
      .set("paleturquoise", 0xafeeee)
      .set("palevioletred", 0xdb7093)
      .set("papayawhip", 0xffefd5)
      .set("peachpuff", 0xffdab9)
      .set("peru", 0xcd853f)
      .set("pink", 0xffc0cb)
      .set("plum", 0xdda0dd)
      .set("powderblue", 0xb0e0e6)
      .set("purple", 0x800080)
      .set("rebeccapurple", 0x663399)
      .set("red", 0xff0000)
      .set("rosybrown", 0xbc8f8f)
      .set("royalblue", 0x4169e1)
      .set("saddlebrown", 0x8b4513)
      .set("salmon", 0xfa8072)
      .set("sandybrown", 0xf4a460)
      .set("seagreen", 0x2e8b57)
      .set("seashell", 0xfff5ee)
      .set("sienna", 0xa0522d)
      .set("silver", 0xc0c0c0)
      .set("skyblue", 0x87ceeb)
      .set("slateblue", 0x6a5acd)
      .set("slategray", 0x708090)
      .set("slategrey", 0x708090)
      .set("snow", 0xfffafa)
      .set("springgreen", 0x00ff7f)
      .set("steelblue", 0x4682b4)
      .set("tan", 0xd2b48c)
      .set("teal", 0x008080)
      .set("thistle", 0xd8bfd8)
      .set("tomato", 0xff6347)
      .set("turquoise", 0x40e0d0)
      .set("violet", 0xee82ee)
      .set("wheat", 0xf5deb3)
      .set("white", 0xffffff)
      .set("whitesmoke", 0xf5f5f5)
      .set("yellow", 0xffff00)
      .set("yellowgreen", 0x9acd32);

  var darker = .7;
  var brighter = 1 / darker;

  function rgb(r, g, b) {
    if (arguments.length === 1) {
      if (!(r instanceof Color)) r = color(r);
      if (r) {
        r = r.rgb();
        b = r.b;
        g = r.g;
        r = r.r;
      } else {
        r = g = b = NaN;
      }
    }
    return new Rgb(r, g, b);
  }

  function Rgb(r, g, b) {
    this.r = +r;
    this.g = +g;
    this.b = +b;
  }

  var _prototype = rgb.prototype = Rgb.prototype = new Color;

  _prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.rgb = function() {
    return this;
  };

  _prototype.displayable = function() {
    return (0 <= this.r && this.r <= 255)
        && (0 <= this.g && this.g <= 255)
        && (0 <= this.b && this.b <= 255);
  };

  _prototype.toString = function() {
    return format(this.r, this.g, this.b);
  };

  function format(r, g, b) {
    return "#"
        + (isNaN(r) ? "00" : (r = Math.round(r)) < 16 ? "0" + Math.max(0, r).toString(16) : Math.min(255, r).toString(16))
        + (isNaN(g) ? "00" : (g = Math.round(g)) < 16 ? "0" + Math.max(0, g).toString(16) : Math.min(255, g).toString(16))
        + (isNaN(b) ? "00" : (b = Math.round(b)) < 16 ? "0" + Math.max(0, b).toString(16) : Math.min(255, b).toString(16));
  }

  function hsl(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Hsl) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Color)) h = color(h);
        if (h) {
          if (h instanceof Hsl) return h;
          h = h.rgb();
          var r = h.r / 255,
              g = h.g / 255,
              b = h.b / 255,
              min = Math.min(r, g, b),
              max = Math.max(r, g, b),
              range = max - min;
          l = (max + min) / 2;
          if (range) {
            s = l < .5 ? range / (max + min) : range / (2 - max - min);
            if (r === max) h = (g - b) / range + (g < b) * 6;
            else if (g === max) h = (b - r) / range + 2;
            else h = (r - g) / range + 4;
            h *= 60;
          } else {
            h = NaN;
            s = l > 0 && l < 1 ? 0 : h;
          }
        } else {
          h = s = l = NaN;
        }
      }
    }
    return new Hsl(h, s, l);
  }

  function Hsl(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }

  var __prototype = hsl.prototype = Hsl.prototype = new Color;

  __prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  __prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  __prototype.rgb = function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l + (l < .5 ? l : 1 - l) * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
    );
  };

  __prototype.displayable = function() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s))
        && (0 <= this.l && this.l <= 1);
  };

  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  var Kn = 18;

  var Xn = 0.950470;
  var Yn = 1;
  var Zn = 1.088830;
  var t0 = 4 / 29;
  var t1 = 6 / 29;
  var t2 = 3 * t1 * t1;
  var t3 = t1 * t1 * t1;

  function lab(l, a, b) {
    if (arguments.length === 1) {
      if (l instanceof Lab) {
        b = l.b;
        a = l.a;
        l = l.l;
      } else if (l instanceof Hcl) {
        var h = l.h * deg2rad;
        b = Math.sin(h) * l.c;
        a = Math.cos(h) * l.c;
        l = l.l;
      } else {
        if (!(l instanceof Rgb)) l = rgb(l);
        var r = rgb2xyz(l.r),
            g = rgb2xyz(l.g),
            b = rgb2xyz(l.b),
            x = xyz2lab((0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / Xn),
            y = xyz2lab((0.2126729 * r + 0.7151522 * g + 0.0721750 * b) / Yn),
            z = xyz2lab((0.0193339 * r + 0.1191920 * g + 0.9503041 * b) / Zn);
        b = 200 * (y - z);
        a = 500 * (x - y);
        l = 116 * y - 16;
      }
    }
    return new Lab(l, a, b);
  }

  function Lab(l, a, b) {
    this.l = +l;
    this.a = +a;
    this.b = +b;
  }

  var ___prototype = lab.prototype = Lab.prototype = new Color;

  ___prototype.brighter = function(k) {
    return new Lab(this.l + Kn * (k == null ? 1 : k), this.a, this.b);
  };

  ___prototype.darker = function(k) {
    return new Lab(this.l - Kn * (k == null ? 1 : k), this.a, this.b);
  };

  ___prototype.rgb = function() {
    var y = (this.l + 16) / 116,
        x = isNaN(this.a) ? y : y + this.a / 500,
        z = isNaN(this.b) ? y : y - this.b / 200;
    y = Yn * lab2xyz(y);
    x = Xn * lab2xyz(x);
    z = Zn * lab2xyz(z);
    return new Rgb(
      xyz2rgb( 3.2404542 * x - 1.5371385 * y - 0.4985314 * z), // D65 -> sRGB
      xyz2rgb(-0.9692660 * x + 1.8760108 * y + 0.0415560 * z),
      xyz2rgb( 0.0556434 * x - 0.2040259 * y + 1.0572252 * z)
    );
  };

  function xyz2lab(t) {
    return t > t3 ? Math.pow(t, 1 / 3) : t / t2 + t0;
  }

  function lab2xyz(t) {
    return t > t1 ? t * t * t : t2 * (t - t0);
  }

  function xyz2rgb(x) {
    return 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
  }

  function rgb2xyz(x) {
    return (x /= 255) <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  }

  var deg2rad = Math.PI / 180;
  var rad2deg = 180 / Math.PI;

  function hcl(h, c, l) {
    if (arguments.length === 1) {
      if (h instanceof Hcl) {
        l = h.l;
        c = h.c;
        h = h.h;
      } else {
        if (!(h instanceof Lab)) h = lab(h);
        l = h.l;
        c = Math.sqrt(h.a * h.a + h.b * h.b);
        h = Math.atan2(h.b, h.a) * rad2deg;
        if (h < 0) h += 360;
      }
    }
    return new Hcl(h, c, l);
  }

  function Hcl(h, c, l) {
    this.h = +h;
    this.c = +c;
    this.l = +l;
  }

  var ____prototype = hcl.prototype = Hcl.prototype = new Color;

  ____prototype.brighter = function(k) {
    return new Hcl(this.h, this.c, this.l + Kn * (k == null ? 1 : k));
  };

  ____prototype.darker = function(k) {
    return new Hcl(this.h, this.c, this.l - Kn * (k == null ? 1 : k));
  };

  ____prototype.rgb = function() {
    return lab(this).rgb();
  };

  var A = -0.14861;
  var B = +1.78277;
  var C = -0.29227;
  var D = -0.90649;
  var E = +1.97294;
  var ED = E * D;
  var EB = E * B;
  var BC_DA = B * C - D * A;

  function cubehelix(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Cubehelix) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Rgb)) h = rgb(h);
        var r = h.r / 255, g = h.g / 255, b = h.b / 255;
        l = (BC_DA * b + ED * r - EB * g) / (BC_DA + ED - EB);
        var bl = b - l, k = (E * (g - l) - C * bl) / D;
        s = Math.sqrt(k * k + bl * bl) / (E * l * (1 - l)); // NaN if l=0 or l=1
        h = s ? Math.atan2(k, bl) * rad2deg - 120 : NaN;
        if (h < 0) h += 360;
      }
    }
    return new Cubehelix(h, s, l);
  }

  function Cubehelix(h, s, l) {
    this.h = +h;
    this.s = +s;
    this.l = +l;
  }

  var prototype = cubehelix.prototype = Cubehelix.prototype = new Color;

  prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Cubehelix(this.h, this.s, this.l * k);
  };

  prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Cubehelix(this.h, this.s, this.l * k);
  };

  prototype.rgb = function() {
    var h = isNaN(this.h) ? 0 : (this.h + 120) * deg2rad,
        l = +this.l,
        a = isNaN(this.s) ? 0 : this.s * l * (1 - l),
        cosh = Math.cos(h),
        sinh = Math.sin(h);
    return new Rgb(
      255 * (l + a * (A * cosh + B * sinh)),
      255 * (l + a * (C * cosh + D * sinh)),
      255 * (l + a * (E * cosh))
    );
  };

  function interpolateCubehelixGamma(gamma) {
    return function(a, b) {
      a = cubehelix(a);
      b = cubehelix(b);
      var ah = isNaN(a.h) ? b.h : a.h,
          as = isNaN(a.s) ? b.s : a.s,
          al = a.l,
          bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
          bs = isNaN(b.s) ? 0 : b.s - as,
          bl = b.l - al;
      return function(t) {
        a.h = ah + bh * t;
        a.s = as + bs * t;
        a.l = al + bl * Math.pow(t, gamma);
        return a + "";
      };
    };
  }

  function interpolateCubehelixGammaLong(gamma) {
    return function(a, b) {
      a = cubehelix(a);
      b = cubehelix(b);
      var ah = isNaN(a.h) ? b.h : a.h,
          as = isNaN(a.s) ? b.s : a.s,
          al = a.l,
          bh = isNaN(b.h) ? 0 : b.h - ah,
          bs = isNaN(b.s) ? 0 : b.s - as,
          bl = b.l - al;
      return function(t) {
        a.h = ah + bh * t;
        a.s = as + bs * t;
        a.l = al + bl * Math.pow(t, gamma);
        return a + "";
      };
    };
  }

  function interpolateHclLong(a, b) {
    a = hcl(a);
    b = hcl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        ac = isNaN(a.c) ? b.c : a.c,
        al = a.l,
        bh = isNaN(b.h) ? 0 : b.h - ah,
        bc = isNaN(b.c) ? 0 : b.c - ac,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.c = ac + bc * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateHcl(a, b) {
    a = hcl(a);
    b = hcl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        ac = isNaN(a.c) ? b.c : a.c,
        al = a.l,
        bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
        bc = isNaN(b.c) ? 0 : b.c - ac,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.c = ac + bc * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateLab(a, b) {
    a = lab(a);
    b = lab(b);
    var al = a.l,
        aa = a.a,
        ab = a.b,
        bl = b.l - al,
        ba = b.a - aa,
        bb = b.b - ab;
    return function(t) {
      a.l = al + bl * t;
      a.a = aa + ba * t;
      a.b = ab + bb * t;
      return a + "";
    };
  }

  function interpolateHslLong(a, b) {
    a = hsl(a);
    b = hsl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        as = isNaN(a.s) ? b.s : a.s,
        al = a.l,
        bh = isNaN(b.h) ? 0 : b.h - ah,
        bs = isNaN(b.s) ? 0 : b.s - as,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.s = as + bs * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateHsl(a, b) {
    a = hsl(a);
    b = hsl(b);
    var ah = isNaN(a.h) ? b.h : a.h,
        as = isNaN(a.s) ? b.s : a.s,
        al = a.l,
        bh = isNaN(b.h) ? 0 : deltaHue(b.h, ah),
        bs = isNaN(b.s) ? 0 : b.s - as,
        bl = b.l - al;
    return function(t) {
      a.h = ah + bh * t;
      a.s = as + bs * t;
      a.l = al + bl * t;
      return a + "";
    };
  }

  function interpolateRgb(a, b) {
    a = rgb(a);
    b = rgb(b);
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        br = b.r - ar,
        bg = b.g - ag,
        bb = b.b - ab;
    return function(t) {
      return format(Math.round(ar + br * t), Math.round(ag + bg * t), Math.round(ab + bb * t));
    };
  }

  exports.interpolateCubehelix = interpolateCubehelixGamma(1);
  exports.interpolateCubehelixLong = interpolateCubehelixGammaLong(1);

  exports.color = color;
  exports.rgb = rgb;
  exports.hsl = hsl;
  exports.lab = lab;
  exports.hcl = hcl;
  exports.cubehelix = cubehelix;
  exports.interpolateRgb = interpolateRgb;
  exports.interpolateHsl = interpolateHsl;
  exports.interpolateHslLong = interpolateHslLong;
  exports.interpolateLab = interpolateLab;
  exports.interpolateHcl = interpolateHcl;
  exports.interpolateHclLong = interpolateHclLong;
  exports.interpolateCubehelixGamma = interpolateCubehelixGamma;
  exports.interpolateCubehelixGammaLong = interpolateCubehelixGammaLong;

}));
},{}],3:[function(require,module,exports){
if (typeof Map === "undefined") {
  Map = function() { this.clear(); };
  Map.prototype = {
    set: function(k, v) { this._[k] = v; return this; },
    get: function(k) { return this._[k]; },
    has: function(k) { return k in this._; },
    delete: function(k) { return k in this._ && delete this._[k]; },
    clear: function() { this._ = Object.create(null); },
    get size() { var n = 0; for (var k in this._) ++n; return n; },
    forEach: function(c) { for (var k in this._) c(this._[k], k, this); }
  };
} else (function() {
  var m = new Map;
  if (m.set(0, 0) !== m) {
    m = m.set;
    Map.prototype.set = function() { m.apply(this, arguments); return this; };
  }
})();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  factory((global.scale = {}));
}(this, function (exports) { 'use strict';

  function utcDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(Date.UTC(-1, d.m, d.d, d.H, d.M, d.S, d.L));
      date.setUTCFullYear(d.y);
      return date;
    }
    return new Date(Date.UTC(d.y, d.m, d.d, d.H, d.M, d.S, d.L));
  }

  function localDate(d) {
    if (0 <= d.y && d.y < 100) {
      var date = new Date(-1, d.m, d.d, d.H, d.M, d.S, d.L);
      date.setFullYear(d.y);
      return date;
    }
    return new Date(d.y, d.m, d.d, d.H, d.M, d.S, d.L);
  }

  var pads = {"-": "", "_": " ", "0": "0"};

  function newYear(y) {
    return {y: y, m: 0, d: 1, H: 0, M: 0, S: 0, L: 0};
  }

  var percentRe = /^%/;

  function parseLiteralPercent(d, string, i) {
    var n = percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }

  function parseZone(d, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5))
        ? (d.Z = -string, i + 5) // sign differs from getTimezoneOffset!
        : -1;
  }

  var numberRe = /^\s*\d+/;

  function parseWeekdayNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 1));
    return n ? (d.w = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberSunday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.U = +n[0], i + n[0].length) : -1;
  }

  function parseWeekNumberMonday(d, string, i) {
    var n = numberRe.exec(string.slice(i));
    return n ? (d.W = +n[0], i + n[0].length) : -1;
  }

  function parseYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.y = +n[0] + (+n[0] > 68 ? 1900 : 2000), i + n[0].length) : -1;
  }

  function parseMonthNumber(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.m = n[0] - 1, i + n[0].length) : -1;
  }

  function parseDayOfMonth(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.d = +n[0], i + n[0].length) : -1;
  }

  function parseDayOfYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.m = 0, d.d = +n[0], i + n[0].length) : -1;
  }

  function parseHour24(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.H = +n[0], i + n[0].length) : -1;
  }

  function parseMinutes(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.M = +n[0], i + n[0].length) : -1;
  }

  function parseSeconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 2));
    return n ? (d.S = +n[0], i + n[0].length) : -1;
  }

  function parseMilliseconds(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 3));
    return n ? (d.L = +n[0], i + n[0].length) : -1;
  }

  function parseFullYear(d, string, i) {
    var n = numberRe.exec(string.slice(i, i + 4));
    return n ? (d.y = +n[0], i + n[0].length) : -1;
  }

  function formatLiteralPercent() {
    return "%";
  }

  function formatUTCZone() {
    return "+0000";
  }

  function pad(value, fill, width) {
    var sign = value < 0 ? "-" : "",
        string = (sign ? -value : value) + "",
        length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }

  function formatUTCFullYear(d, p) {
    return pad(d.getUTCFullYear() % 10000, p, 4);
  }

  function _formatUTCYear(d, p) {
    return pad(d.getUTCFullYear() % 100, p, 2);
  }

  var t1 = new Date;

  var t0 = new Date;

  function newInterval(floori, offseti, count) {

    function interval(date) {
      return floori(date = new Date(+date)), date;
    }

    interval.floor = interval;

    interval.round = function(date) {
      var d0 = new Date(+date),
          d1 = new Date(date - 1);
      floori(d0), floori(d1), offseti(d1, 1);
      return date - d0 < d1 - date ? d0 : d1;
    };

    interval.ceil = function(date) {
      return floori(date = new Date(date - 1)), offseti(date, 1), date;
    };

    interval.offset = function(date, step) {
      return offseti(date = new Date(+date), step == null ? 1 : Math.floor(step)), date;
    };

    interval.range = function(start, stop, step) {
      var range = [];
      start = new Date(start - 1);
      stop = new Date(+stop);
      step = step == null ? 1 : Math.floor(step);
      if (!(start < stop) || !(step > 0)) return range; // also handles Invalid Date
      offseti(start, 1), floori(start);
      if (start < stop) range.push(new Date(+start));
      while (offseti(start, step), floori(start), start < stop) range.push(new Date(+start));
      return range;
    };

    interval.filter = function(test) {
      return newInterval(function(date) {
        while (floori(date), !test(date)) date.setTime(date - 1);
      }, function(date, step) {
        while (--step >= 0) while (offseti(date, 1), !test(date));
      });
    };

    if (count) interval.count = function(start, end) {
      t0.setTime(+start), t1.setTime(+end);
      floori(t0), floori(t1);
      return Math.floor(count(t0, t1));
    };

    return interval;
  }

  var utcYear = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCMonth(0, 1);
  }, function(date, step) {
    date.setUTCFullYear(date.getUTCFullYear() + step);
  }, function(start, end) {
    return end.getUTCFullYear() - start.getUTCFullYear();
  });

  function utcWeekday(i) {
    return newInterval(function(date) {
      date.setUTCHours(0, 0, 0, 0);
      date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setUTCDate(date.getUTCDate() + step * 7);
    }, function(start, end) {
      return (end - start) / 6048e5;
    });
  }

  var utcMonday = utcWeekday(1);

  function formatUTCWeekNumberMonday(d, p) {
    return pad(utcMonday.count(utcYear(d), d), p, 2);
  }

  function formatUTCWeekdayNumber(d) {
    return d.getUTCDay();
  }

  var utcSunday = utcWeekday(0);

  function formatUTCWeekNumberSunday(d, p) {
    return pad(utcSunday.count(utcYear(d), d), p, 2);
  }

  function formatUTCSeconds(d, p) {
    return pad(d.getUTCSeconds(), p, 2);
  }

  function formatUTCMinutes(d, p) {
    return pad(d.getUTCMinutes(), p, 2);
  }

  function formatUTCMonthNumber(d, p) {
    return pad(d.getUTCMonth() + 1, p, 2);
  }

  function formatUTCMilliseconds(d, p) {
    return pad(d.getUTCMilliseconds(), p, 3);
  }

  var utcDay = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setUTCDate(date.getUTCDate() + step);
  }, function(start, end) {
    return (end - start) / 864e5;
  });

  function formatUTCDayOfYear(d, p) {
    return pad(1 + utcDay.count(utcYear(d), d), p, 3);
  }

  function formatUTCHour12(d, p) {
    return pad(d.getUTCHours() % 12 || 12, p, 2);
  }

  function formatUTCHour24(d, p) {
    return pad(d.getUTCHours(), p, 2);
  }

  function formatUTCDayOfMonth(d, p) {
    return pad(d.getUTCDate(), p, 2);
  }

  function formatZone(d) {
    var z = d.getTimezoneOffset();
    return (z > 0 ? "-" : (z *= -1, "+"))
        + pad(z / 60 | 0, "0", 2)
        + pad(z % 60, "0", 2);
  }

  function formatFullYear(d, p) {
    return pad(d.getFullYear() % 10000, p, 4);
  }

  function _formatYear(d, p) {
    return pad(d.getFullYear() % 100, p, 2);
  }

  var year = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setMonth(0, 1);
  }, function(date, step) {
    date.setFullYear(date.getFullYear() + step);
  }, function(start, end) {
    return end.getFullYear() - start.getFullYear();
  });

  function weekday(i) {
    return newInterval(function(date) {
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (date.getDay() + 7 - i) % 7);
    }, function(date, step) {
      date.setDate(date.getDate() + step * 7);
    }, function(start, end) {
      return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 6048e5;
    });
  }

  var monday = weekday(1);

  function formatWeekNumberMonday(d, p) {
    return pad(monday.count(year(d), d), p, 2);
  }

  function formatWeekdayNumber(d) {
    return d.getDay();
  }

  var sunday = weekday(0);

  function formatWeekNumberSunday(d, p) {
    return pad(sunday.count(year(d), d), p, 2);
  }

  function formatSeconds(d, p) {
    return pad(d.getSeconds(), p, 2);
  }

  function formatMinutes(d, p) {
    return pad(d.getMinutes(), p, 2);
  }

  function formatMonthNumber(d, p) {
    return pad(d.getMonth() + 1, p, 2);
  }

  function formatMilliseconds(d, p) {
    return pad(d.getMilliseconds(), p, 3);
  }

  var day = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
  }, function(date, step) {
    date.setDate(date.getDate() + step);
  }, function(start, end) {
    return (end - start - (end.getTimezoneOffset() - start.getTimezoneOffset()) * 6e4) / 864e5;
  });

  function formatDayOfYear(d, p) {
    return pad(1 + day.count(year(d), d), p, 3);
  }

  function formatHour12(d, p) {
    return pad(d.getHours() % 12 || 12, p, 2);
  }

  function formatHour24(d, p) {
    return pad(d.getHours(), p, 2);
  }

  function formatDayOfMonth(d, p) {
    return pad(d.getDate(), p, 2);
  }

  function formatLookup(names) {
    var map = new Map, i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }

  var requoteRe = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;

  function requote(s) {
    return s.replace(requoteRe, "\\$&");
  }

  function formatRe(names) {
    return new RegExp("^(?:" + names.map(requote).join("|") + ")", "i");
  }

  function _localeFormat(locale) {
    var locale_dateTime = locale.dateTime,
        locale_date = locale.date,
        locale_time = locale.time,
        locale_periods = locale.periods,
        locale_weekdays = locale.days,
        locale_shortWeekdays = locale.shortDays,
        locale_months = locale.months,
        locale_shortMonths = locale.shortMonths;

    var periodLookup = formatLookup(locale_periods),
        weekdayRe = formatRe(locale_weekdays),
        weekdayLookup = formatLookup(locale_weekdays),
        shortWeekdayRe = formatRe(locale_shortWeekdays),
        shortWeekdayLookup = formatLookup(locale_shortWeekdays),
        monthRe = formatRe(locale_months),
        monthLookup = formatLookup(locale_months),
        shortMonthRe = formatRe(locale_shortMonths),
        shortMonthLookup = formatLookup(locale_shortMonths);

    var formats = {
      "a": formatShortWeekday,
      "A": formatWeekday,
      "b": formatShortMonth,
      "B": formatMonth,
      "c": null,
      "d": formatDayOfMonth,
      "e": formatDayOfMonth,
      "H": formatHour24,
      "I": formatHour12,
      "j": formatDayOfYear,
      "L": formatMilliseconds,
      "m": formatMonthNumber,
      "M": formatMinutes,
      "p": formatPeriod,
      "S": formatSeconds,
      "U": formatWeekNumberSunday,
      "w": formatWeekdayNumber,
      "W": formatWeekNumberMonday,
      "x": null,
      "X": null,
      "y": _formatYear,
      "Y": formatFullYear,
      "Z": formatZone,
      "%": formatLiteralPercent
    };

    var utcFormats = {
      "a": formatUTCShortWeekday,
      "A": formatUTCWeekday,
      "b": formatUTCShortMonth,
      "B": formatUTCMonth,
      "c": null,
      "d": formatUTCDayOfMonth,
      "e": formatUTCDayOfMonth,
      "H": formatUTCHour24,
      "I": formatUTCHour12,
      "j": formatUTCDayOfYear,
      "L": formatUTCMilliseconds,
      "m": formatUTCMonthNumber,
      "M": formatUTCMinutes,
      "p": formatUTCPeriod,
      "S": formatUTCSeconds,
      "U": formatUTCWeekNumberSunday,
      "w": formatUTCWeekdayNumber,
      "W": formatUTCWeekNumberMonday,
      "x": null,
      "X": null,
      "y": _formatUTCYear,
      "Y": formatUTCFullYear,
      "Z": formatUTCZone,
      "%": formatLiteralPercent
    };

    var parses = {
      "a": parseShortWeekday,
      "A": parseWeekday,
      "b": parseShortMonth,
      "B": parseMonth,
      "c": parseLocaleDateTime,
      "d": parseDayOfMonth,
      "e": parseDayOfMonth,
      "H": parseHour24,
      "I": parseHour24,
      "j": parseDayOfYear,
      "L": parseMilliseconds,
      "m": parseMonthNumber,
      "M": parseMinutes,
      "p": parsePeriod,
      "S": parseSeconds,
      "U": parseWeekNumberSunday,
      "w": parseWeekdayNumber,
      "W": parseWeekNumberMonday,
      "x": parseLocaleDate,
      "X": parseLocaleTime,
      "y": parseYear,
      "Y": parseFullYear,
      "Z": parseZone,
      "%": parseLiteralPercent
    };

    // These recursive directive definitions must be deferred.
    formats.x = newFormat(locale_date, formats);
    formats.X = newFormat(locale_time, formats);
    formats.c = newFormat(locale_dateTime, formats);
    utcFormats.x = newFormat(locale_date, utcFormats);
    utcFormats.X = newFormat(locale_time, utcFormats);
    utcFormats.c = newFormat(locale_dateTime, utcFormats);

    function newFormat(specifier, formats) {
      return function(date) {
        var string = [],
            i = -1,
            j = 0,
            n = specifier.length,
            c,
            pad,
            format;

        while (++i < n) {
          if (specifier.charCodeAt(i) === 37) {
            string.push(specifier.slice(j, i));
            if ((pad = pads[c = specifier.charAt(++i)]) != null) c = specifier.charAt(++i);
            if (format = formats[c]) c = format(date, pad == null ? (c === "e" ? " " : "0") : pad);
            string.push(c);
            j = i + 1;
          }
        }

        string.push(specifier.slice(j, i));
        return string.join("");
      };
    }

    function newParse(specifier, newDate) {
      return function(string) {
        var d = newYear(1900),
            i = parseSpecifier(d, specifier, string, 0);
        if (i != string.length) return null;

        // The am-pm flag is 0 for AM, and 1 for PM.
        if ("p" in d) d.H = d.H % 12 + d.p * 12;

        // If a time zone is specified, all fields are interpreted as UTC and then
        // offset according to the specified time zone.
        if ("Z" in d) {
          if ("w" in d && ("W" in d || "U" in d)) {
            var day = utcDate(newYear(d.y)).getUTCDay();
            if ("W" in d) d.U = d.W, d.w = (d.w + 6) % 7, --day;
            d.m = 0;
            d.d = d.w + d.U * 7 - (day + 6) % 7;
          }
          d.H += d.Z / 100 | 0;
          d.M += d.Z % 100;
          return utcDate(d);
        }

        // Otherwise, all fields are in local time.
        if ("w" in d && ("W" in d || "U" in d)) {
          var day = newDate(newYear(d.y)).getDay();
          if ("W" in d) d.U = d.W, d.w = (d.w + 6) % 7, --day;
          d.m = 0;
          d.d = d.w + d.U * 7 - (day + 6) % 7;
        }
        return newDate(d);
      };
    }

    function parseSpecifier(d, specifier, string, j) {
      var i = 0,
          n = specifier.length,
          m = string.length,
          c,
          parse;

      while (i < n) {
        if (j >= m) return -1;
        c = specifier.charCodeAt(i++);
        if (c === 37) {
          c = specifier.charAt(i++);
          parse = parses[c in pads ? specifier.charAt(i++) : c];
          if (!parse || ((j = parse(d, string, j)) < 0)) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }

      return j;
    }

    function parseShortWeekday(d, string, i) {
      var n = shortWeekdayRe.exec(string.slice(i));
      return n ? (d.w = shortWeekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseWeekday(d, string, i) {
      var n = weekdayRe.exec(string.slice(i));
      return n ? (d.w = weekdayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseShortMonth(d, string, i) {
      var n = shortMonthRe.exec(string.slice(i));
      return n ? (d.m = shortMonthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseMonth(d, string, i) {
      var n = monthRe.exec(string.slice(i));
      return n ? (d.m = monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }

    function parseLocaleDateTime(d, string, i) {
      return parseSpecifier(d, locale_dateTime, string, i);
    }

    function parseLocaleDate(d, string, i) {
      return parseSpecifier(d, locale_date, string, i);
    }

    function parseLocaleTime(d, string, i) {
      return parseSpecifier(d, locale_time, string, i);
    }

    function parsePeriod(d, string, i) {
      var n = periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (d.p = n, i);
    }

    function formatShortWeekday(d) {
      return locale_shortWeekdays[d.getDay()];
    }

    function formatWeekday(d) {
      return locale_weekdays[d.getDay()];
    }

    function formatShortMonth(d) {
      return locale_shortMonths[d.getMonth()];
    }

    function formatMonth(d) {
      return locale_months[d.getMonth()];
    }

    function formatPeriod(d) {
      return locale_periods[+(d.getHours() >= 12)];
    }

    function formatUTCShortWeekday(d) {
      return locale_shortWeekdays[d.getUTCDay()];
    }

    function formatUTCWeekday(d) {
      return locale_weekdays[d.getUTCDay()];
    }

    function formatUTCShortMonth(d) {
      return locale_shortMonths[d.getUTCMonth()];
    }

    function formatUTCMonth(d) {
      return locale_months[d.getUTCMonth()];
    }

    function formatUTCPeriod(d) {
      return locale_periods[+(d.getUTCHours() >= 12)];
    }

    return {
      format: function(specifier) {
        var f = newFormat(specifier += "", formats);
        f.parse = newParse(specifier, localDate);
        f.toString = function() { return specifier; };
        return f;
      },
      utcFormat: function(specifier) {
        var f = newFormat(specifier += "", utcFormats);
        f.parse = newParse(specifier, utcDate);
        f.toString = function() { return specifier; };
        return f;
      }
    };
  }

  var _locale = _localeFormat({
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: ["AM", "PM"],
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  });

  var utcFormat = _locale.utcFormat;

  var formatUTCYear = utcFormat("%Y");

  var formatUTCMonth = utcFormat("%B");

  var formatUTCWeek = utcFormat("%b %d");

  var formatUTCDay = utcFormat("%a %d");

  var utcWeek = utcSunday;

  var utcMonth = newInterval(function(date) {
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(1);
  }, function(date, step) {
    date.setUTCMonth(date.getUTCMonth() + step);
  }, function(start, end) {
    return end.getUTCMonth() - start.getUTCMonth() + (end.getUTCFullYear() - start.getUTCFullYear()) * 12;
  });

  var formatUTCHour = utcFormat("%I %p");

  var formatUTCMinute = utcFormat("%I:%M");

  var utcHour = newInterval(function(date) {
    date.setUTCMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  });

  var formatUTCSecond = utcFormat(":%S");

  var utcMinute = newInterval(function(date) {
    date.setUTCSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  });

  var formatUTCMillisecond = utcFormat(".%L");

  var utcSecond = newInterval(function(date) {
    date.setUTCMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  });

  function _tickFormat(date) {
    return (utcSecond(date) < date ? formatUTCMillisecond
        : utcMinute(date) < date ? formatUTCSecond
        : utcHour(date) < date ? formatUTCMinute
        : utcDay(date) < date ? formatUTCHour
        : utcMonth(date) < date ? (utcWeek(date) < date ? formatUTCDay : formatUTCWeek)
        : utcYear(date) < date ? formatUTCMonth
        : formatUTCYear)(date);
  }

  function newDate(t) {
    return new Date(t);
  }

  function rebind(scale, linear) {
    scale.range = function() {
      var x = linear.range.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    scale.rangeRound = function() {
      var x = linear.rangeRound.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    scale.clamp = function() {
      var x = linear.clamp.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    scale.interpolate = function() {
      var x = linear.interpolate.apply(linear, arguments);
      return x === linear ? scale : x;
    };

    return scale;
  }

  var e2 = Math.sqrt(2);

  var e5 = Math.sqrt(10);

  var e10 = Math.sqrt(50);

  function tickRange(domain, count) {
    if (count == null) count = 10;

    var start = domain[0],
        stop = domain[domain.length - 1];

    if (stop < start) error = stop, stop = start, start = error;

    var span = stop - start,
        step = Math.pow(10, Math.floor(Math.log(span / count) / Math.LN10)),
        error = span / count / step;

    // Filter ticks to get closer to the desired count.
    if (error >= e10) step *= 10;
    else if (error >= e5) step *= 5;
    else if (error >= e2) step *= 2;

    // Round start and stop values to step interval.
    return [
      Math.ceil(start / step) * step,
      Math.floor(stop / step) * step + step / 2, // inclusive
      step
    ];
  }

  var millisecondsPerSecond = 1000;
  var millisecondsPerMinute = millisecondsPerSecond * 60;
  var millisecondsPerHour = millisecondsPerMinute * 60;
  var millisecondsPerDay = millisecondsPerHour * 24;

  var millisecondsPerYear = millisecondsPerDay * 365;

  var millisecondsPerMonth = millisecondsPerDay * 30;

  var millisecondsPerWeek = millisecondsPerDay * 7;

  var tickIntervals = [
    ["seconds",  1,      millisecondsPerSecond],
    ["seconds",  5,  5 * millisecondsPerSecond],
    ["seconds", 15, 15 * millisecondsPerSecond],
    ["seconds", 30, 30 * millisecondsPerSecond],
    ["minutes",  1,      millisecondsPerMinute],
    ["minutes",  5,  5 * millisecondsPerMinute],
    ["minutes", 15, 15 * millisecondsPerMinute],
    ["minutes", 30, 30 * millisecondsPerMinute],
    [  "hours",  1,      millisecondsPerHour  ],
    [  "hours",  3,  3 * millisecondsPerHour  ],
    [  "hours",  6,  6 * millisecondsPerHour  ],
    [  "hours", 12, 12 * millisecondsPerHour  ],
    [   "days",  1,      millisecondsPerDay   ],
    [   "days",  2,  2 * millisecondsPerDay   ],
    [  "weeks",  1,      millisecondsPerWeek  ],
    [ "months",  1,      millisecondsPerMonth ],
    [ "months",  3,  3 * millisecondsPerMonth ],
    [  "years",  1,      millisecondsPerYear  ]
  ];

  function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }

  function ascendingComparator(f) {
    return function(d, x) {
      return ascending(f(d), x);
    };
  }

  function bisector(compare) {
    if (compare.length === 1) compare = ascendingComparator(compare);
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1;
          else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid;
          else lo = mid + 1;
        }
        return lo;
      }
    };
  }

  var bisectTickIntervals = bisector(function(method) {
    return method[2];
  }).right;

  function chooseTickInterval(start, stop, count) {
    var target = Math.abs(stop - start) / count,
        i = bisectTickIntervals(tickIntervals, target);
    return i === tickIntervals.length ? ["years", tickRange([start / millisecondsPerYear, stop / millisecondsPerYear], count)[2]]
        : i ? tickIntervals[target / tickIntervals[i - 1][2] < tickIntervals[i][2] / target ? i - 1 : i]
        : ["milliseconds", tickRange([start, stop], count)[2]];
  }

  function newTime(linear, timeInterval, tickFormat, format) {

    function scale(x) {
      return linear(x);
    }

    scale.invert = function(x) {
      return newDate(linear.invert(x));
    };

    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(newDate);
      linear.domain(x);
      return scale;
    };

    function tickInterval(interval, start, stop, step) {
      if (interval == null) interval = 10;

      // If a desired tick count is specified, pick a reasonable tick interval
      // based on the extent of the domain and a rough estimate of tick size.
      // If a named interval such as "seconds" was specified, convert to the
      // corresponding time interval and optionally filter using the step.
      // Otherwise, assume interval is already a time interval and use it.
      switch (typeof interval) {
        case "number": interval = chooseTickInterval(start, stop, interval), step = interval[1], interval = interval[0]; break;
        case "string": step = step == null ? 1 : Math.floor(step); break;
        default: return interval;
      }

      return isFinite(step) && step > 0 ? timeInterval(interval, step) : null;
    }

    scale.ticks = function(interval, step) {
      var domain = linear.domain(),
          t0 = domain[0],
          t1 = domain[domain.length - 1],
          t;

      if (t1 < t0) t = t0, t0 = t1, t1 = t;

      return (interval = tickInterval(interval, t0, t1, step))
          ? interval.range(t0, t1 + 1) // inclusive stop
          : [];
    };

    scale.tickFormat = function(specifier) {
      return specifier == null ? tickFormat : format(specifier);
    };

    scale.nice = function(interval, step) {
      var domain = linear.domain(),
          i0 = 0,
          i1 = domain.length - 1,
          t0 = domain[i0],
          t1 = domain[i1],
          t;

      if (t1 < t0) {
        t = i0, i0 = i1, i1 = t;
        t = t0, t0 = t1, t1 = t;
      }

      if (interval = tickInterval(interval, t0, t1, step)) {
        domain[i0] = +interval.floor(t0);
        domain[i1] = +interval.ceil(t1);
        linear.domain(domain);
      }

      return scale;
    };

    scale.copy = function() {
      return newTime(linear.copy(), timeInterval, tickFormat, format);
    };

    return rebind(scale, linear);
  }

  function scale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }

  function range(start, stop, step) {
    if ((n = arguments.length) < 3) {
      step = 1;
      if (n < 2) {
        stop = start;
        start = 0;
      }
    }

    var i = -1,
        n = Math.max(0, Math.ceil((stop - start) / step)) | 0,
        k = scale(Math.abs(step)),
        range = new Array(n);

    start *= k;
    step *= k;
    while (++i < n) {
      range[i] = (start + i * step) / k;
    }

    return range;
  }

  function millisecond(step) {
    return {
      range: function(start, stop) { return range(Math.ceil(start / step) * step, stop, step).map(newDate); },
      floor: function(date) { return newDate(Math.floor(date / step) * step); },
      ceil: function(date) { return newDate(Math.ceil(date / step) * step); }
    };
  }

  function _timeInterval(interval, step) {
    switch (interval) {
      case "milliseconds": return millisecond(step);
      case "seconds": return step > 1 ? utcSecond.filter(function(d) { return d.getUTCSeconds() % step === 0; }) : utcSecond;
      case "minutes": return step > 1 ? utcMinute.filter(function(d) { return d.getUTCMinutes() % step === 0; }) : utcMinute;
      case "hours": return step > 1 ? utcHour.filter(function(d) { return d.getUTCHours() % step === 0; }) : utcHour;
      case "days": return step > 1 ? utcDay.filter(function(d) { return (d.getUTCDate() - 1) % step === 0; }) : utcDay;
      case "weeks": return step > 1 ? utcWeek.filter(function(d) { return utcWeek.count(0, d) % step === 0; }) : utcWeek;
      case "months": return step > 1 ? utcMonth.filter(function(d) { return d.getUTCMonth() % step === 0; }) : utcMonth;
      case "years": return step > 1 ? utcYear.filter(function(d) { return d.getUTCFullYear() % step === 0; }) : utcYear;
    }
  }

  function interpolateNumber(a, b) {
    return a = +a, b -= a, function(t) {
      return a + b * t;
    };
  }

  function interpolateObject(a, b) {
    var i = {},
        c = {},
        k;

    for (k in a) {
      if (k in b) {
        i[k] = interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }

    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }

    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }


  // TODO sparse arrays?
  function interpolateArray(a, b) {
    var x = [],
        c = [],
        na = a.length,
        nb = b.length,
        n0 = Math.min(a.length, b.length),
        i;

    for (i = 0; i < n0; ++i) x.push(interpolate(a[i], b[i]));
    for (; i < na; ++i) c[i] = a[i];
    for (; i < nb; ++i) c[i] = b[i];

    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }

  function _format(r, g, b) {
    if (isNaN(r)) r = 0;
    if (isNaN(g)) g = 0;
    if (isNaN(b)) b = 0;
    return "#"
        + (r < 16 ? "0" + r.toString(16) : r.toString(16))
        + (g < 16 ? "0" + g.toString(16) : g.toString(16))
        + (b < 16 ? "0" + b.toString(16) : b.toString(16));
  }

  function Rgb(r, g, b) {
    this.r = Math.max(0, Math.min(255, Math.round(r)));
    this.g = Math.max(0, Math.min(255, Math.round(g)));
    this.b = Math.max(0, Math.min(255, Math.round(b)));
  }

  function Color() {}

  Color.prototype = {
    toString: function() {
      return this.rgb() + "";
    }
  };

  var _prototype = Rgb.prototype = new Color;

  var darker = .7;

  _prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  var brighter = 1 / darker;

  _prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Rgb(this.r * k, this.g * k, this.b * k);
  };

  _prototype.rgb = function() {
    return this;
  };

  _prototype.toString = function() {
    return _format(this.r, this.g, this.b);
  };

  var named = (new Map)
      .set("aliceblue", 0xf0f8ff)
      .set("antiquewhite", 0xfaebd7)
      .set("aqua", 0x00ffff)
      .set("aquamarine", 0x7fffd4)
      .set("azure", 0xf0ffff)
      .set("beige", 0xf5f5dc)
      .set("bisque", 0xffe4c4)
      .set("black", 0x000000)
      .set("blanchedalmond", 0xffebcd)
      .set("blue", 0x0000ff)
      .set("blueviolet", 0x8a2be2)
      .set("brown", 0xa52a2a)
      .set("burlywood", 0xdeb887)
      .set("cadetblue", 0x5f9ea0)
      .set("chartreuse", 0x7fff00)
      .set("chocolate", 0xd2691e)
      .set("coral", 0xff7f50)
      .set("cornflowerblue", 0x6495ed)
      .set("cornsilk", 0xfff8dc)
      .set("crimson", 0xdc143c)
      .set("cyan", 0x00ffff)
      .set("darkblue", 0x00008b)
      .set("darkcyan", 0x008b8b)
      .set("darkgoldenrod", 0xb8860b)
      .set("darkgray", 0xa9a9a9)
      .set("darkgreen", 0x006400)
      .set("darkgrey", 0xa9a9a9)
      .set("darkkhaki", 0xbdb76b)
      .set("darkmagenta", 0x8b008b)
      .set("darkolivegreen", 0x556b2f)
      .set("darkorange", 0xff8c00)
      .set("darkorchid", 0x9932cc)
      .set("darkred", 0x8b0000)
      .set("darksalmon", 0xe9967a)
      .set("darkseagreen", 0x8fbc8f)
      .set("darkslateblue", 0x483d8b)
      .set("darkslategray", 0x2f4f4f)
      .set("darkslategrey", 0x2f4f4f)
      .set("darkturquoise", 0x00ced1)
      .set("darkviolet", 0x9400d3)
      .set("deeppink", 0xff1493)
      .set("deepskyblue", 0x00bfff)
      .set("dimgray", 0x696969)
      .set("dimgrey", 0x696969)
      .set("dodgerblue", 0x1e90ff)
      .set("firebrick", 0xb22222)
      .set("floralwhite", 0xfffaf0)
      .set("forestgreen", 0x228b22)
      .set("fuchsia", 0xff00ff)
      .set("gainsboro", 0xdcdcdc)
      .set("ghostwhite", 0xf8f8ff)
      .set("gold", 0xffd700)
      .set("goldenrod", 0xdaa520)
      .set("gray", 0x808080)
      .set("green", 0x008000)
      .set("greenyellow", 0xadff2f)
      .set("grey", 0x808080)
      .set("honeydew", 0xf0fff0)
      .set("hotpink", 0xff69b4)
      .set("indianred", 0xcd5c5c)
      .set("indigo", 0x4b0082)
      .set("ivory", 0xfffff0)
      .set("khaki", 0xf0e68c)
      .set("lavender", 0xe6e6fa)
      .set("lavenderblush", 0xfff0f5)
      .set("lawngreen", 0x7cfc00)
      .set("lemonchiffon", 0xfffacd)
      .set("lightblue", 0xadd8e6)
      .set("lightcoral", 0xf08080)
      .set("lightcyan", 0xe0ffff)
      .set("lightgoldenrodyellow", 0xfafad2)
      .set("lightgray", 0xd3d3d3)
      .set("lightgreen", 0x90ee90)
      .set("lightgrey", 0xd3d3d3)
      .set("lightpink", 0xffb6c1)
      .set("lightsalmon", 0xffa07a)
      .set("lightseagreen", 0x20b2aa)
      .set("lightskyblue", 0x87cefa)
      .set("lightslategray", 0x778899)
      .set("lightslategrey", 0x778899)
      .set("lightsteelblue", 0xb0c4de)
      .set("lightyellow", 0xffffe0)
      .set("lime", 0x00ff00)
      .set("limegreen", 0x32cd32)
      .set("linen", 0xfaf0e6)
      .set("magenta", 0xff00ff)
      .set("maroon", 0x800000)
      .set("mediumaquamarine", 0x66cdaa)
      .set("mediumblue", 0x0000cd)
      .set("mediumorchid", 0xba55d3)
      .set("mediumpurple", 0x9370db)
      .set("mediumseagreen", 0x3cb371)
      .set("mediumslateblue", 0x7b68ee)
      .set("mediumspringgreen", 0x00fa9a)
      .set("mediumturquoise", 0x48d1cc)
      .set("mediumvioletred", 0xc71585)
      .set("midnightblue", 0x191970)
      .set("mintcream", 0xf5fffa)
      .set("mistyrose", 0xffe4e1)
      .set("moccasin", 0xffe4b5)
      .set("navajowhite", 0xffdead)
      .set("navy", 0x000080)
      .set("oldlace", 0xfdf5e6)
      .set("olive", 0x808000)
      .set("olivedrab", 0x6b8e23)
      .set("orange", 0xffa500)
      .set("orangered", 0xff4500)
      .set("orchid", 0xda70d6)
      .set("palegoldenrod", 0xeee8aa)
      .set("palegreen", 0x98fb98)
      .set("paleturquoise", 0xafeeee)
      .set("palevioletred", 0xdb7093)
      .set("papayawhip", 0xffefd5)
      .set("peachpuff", 0xffdab9)
      .set("peru", 0xcd853f)
      .set("pink", 0xffc0cb)
      .set("plum", 0xdda0dd)
      .set("powderblue", 0xb0e0e6)
      .set("purple", 0x800080)
      .set("rebeccapurple", 0x663399)
      .set("red", 0xff0000)
      .set("rosybrown", 0xbc8f8f)
      .set("royalblue", 0x4169e1)
      .set("saddlebrown", 0x8b4513)
      .set("salmon", 0xfa8072)
      .set("sandybrown", 0xf4a460)
      .set("seagreen", 0x2e8b57)
      .set("seashell", 0xfff5ee)
      .set("sienna", 0xa0522d)
      .set("silver", 0xc0c0c0)
      .set("skyblue", 0x87ceeb)
      .set("slateblue", 0x6a5acd)
      .set("slategray", 0x708090)
      .set("slategrey", 0x708090)
      .set("snow", 0xfffafa)
      .set("springgreen", 0x00ff7f)
      .set("steelblue", 0x4682b4)
      .set("tan", 0xd2b48c)
      .set("teal", 0x008080)
      .set("thistle", 0xd8bfd8)
      .set("tomato", 0xff6347)
      .set("turquoise", 0x40e0d0)
      .set("violet", 0xee82ee)
      .set("wheat", 0xf5deb3)
      .set("white", 0xffffff)
      .set("whitesmoke", 0xf5f5f5)
      .set("yellow", 0xffff00)
      .set("yellowgreen", 0x9acd32);

  function rgbn(n) {
    return rgb(n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff);
  }

  function Hsl(h, s, l) {
    this.h = +h;
    this.s = Math.max(0, Math.min(1, +s));
    this.l = Math.max(0, Math.min(1, +l));
  }

  var prototype = Hsl.prototype = new Color;

  prototype.brighter = function(k) {
    k = k == null ? brighter : Math.pow(brighter, k);
    return new Hsl(this.h, this.s, this.l * k);
  };

  prototype.darker = function(k) {
    k = k == null ? darker : Math.pow(darker, k);
    return new Hsl(this.h, this.s, this.l * k);
  };


  /* From FvD 13.37, CSS Color Module Level 3 */
  function hsl2rgb(h, m1, m2) {
    return (h < 60 ? m1 + (m2 - m1) * h / 60
        : h < 180 ? m2
        : h < 240 ? m1 + (m2 - m1) * (240 - h) / 60
        : m1) * 255;
  }

  prototype.rgb = function() {
    var h = this.h % 360 + (this.h < 0) * 360,
        s = isNaN(h) || isNaN(this.s) ? 0 : this.s,
        l = this.l,
        m2 = l <= .5 ? l * (1 + s) : l + s - l * s,
        m1 = 2 * l - m2;
    return new Rgb(
      hsl2rgb(h >= 240 ? h - 240 : h + 120, m1, m2),
      hsl2rgb(h, m1, m2),
      hsl2rgb(h < 120 ? h + 240 : h - 120, m1, m2)
    );
  };

  function hsl(h, s, l) {
    if (arguments.length === 1) {
      if (h instanceof Hsl) {
        l = h.l;
        s = h.s;
        h = h.h;
      } else {
        if (!(h instanceof Color)) h = color(h);
        if (h) {
          if (h instanceof Hsl) return h;
          h = h.rgb();
          var r = h.r / 255,
              g = h.g / 255,
              b = h.b / 255,
              min = Math.min(r, g, b),
              max = Math.max(r, g, b),
              range = max - min;
          l = (max + min) / 2;
          if (range) {
            s = l < .5 ? range / (max + min) : range / (2 - max - min);
            if (r === max) h = (g - b) / range + (g < b) * 6;
            else if (g === max) h = (b - r) / range + 2;
            else h = (r - g) / range + 4;
            h *= 60;
          } else {
            h = NaN;
            s = l > 0 && l < 1 ? 0 : h;
          }
        } else {
          h = s = l = NaN;
        }
      }
    }
    return new Hsl(h, s, l);
  }

  var reHslPercent = /^hsl\(\s*([-+]?\d+(?:\.\d+)?)\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  var reRgbPercent = /^rgb\(\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*,\s*([-+]?\d+(?:\.\d+)?)%\s*\)$/;

  var reRgbInteger = /^rgb\(\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*,\s*([-+]?\d+)\s*\)$/;

  var reHex6 = /^#([0-9a-f]{6})$/;

  var reHex3 = /^#([0-9a-f]{3})$/;

  function color(format) {
    var m;
    format = (format + "").trim().toLowerCase();
    return (m = reHex3.exec(format)) ? (m = parseInt(m[1], 16), rgb((m >> 8 & 0xf) | (m >> 4 & 0x0f0), (m >> 4 & 0xf) | (m & 0xf0), ((m & 0xf) << 4) | (m & 0xf))) // #f00
        : (m = reHex6.exec(format)) ? rgbn(parseInt(m[1], 16)) // #ff0000
        : (m = reRgbInteger.exec(format)) ? rgb(m[1], m[2], m[3]) // rgb(255,0,0)
        : (m = reRgbPercent.exec(format)) ? rgb(m[1] * 2.55, m[2] * 2.55, m[3] * 2.55) // rgb(100%,0%,0%)
        : (m = reHslPercent.exec(format)) ? hsl(m[1], m[2] * .01, m[3] * .01) // hsl(120,50%,50%)
        : named.has(format) ? rgbn(named.get(format))
        : null;
  }

  function rgb(r, g, b) {
    if (arguments.length === 1) {
      if (!(r instanceof Color)) r = color(r);
      if (r) {
        r = r.rgb();
        b = r.b;
        g = r.g;
        r = r.r;
      } else {
        r = g = b = NaN;
      }
    }
    return new Rgb(r, g, b);
  }

  function interpolateRgb(a, b) {
    a = rgb(a);
    b = rgb(b);
    var ar = a.r,
        ag = a.g,
        ab = a.b,
        br = b.r - ar,
        bg = b.g - ag,
        bb = b.b - ab;
    return function(t) {
      return _format(Math.round(ar + br * t), Math.round(ag + bg * t), Math.round(ab + bb * t));
    };
  }

  function interpolate0(b) {
    return function() {
      return b;
    };
  }

  function interpolate1(b) {
    return function(t) {
      return b(t) + "";
    };
  }

  var reA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g;
  var reB = new RegExp(reA.source, "g");

  function interpolateString(a, b) {
    var bi = reA.lastIndex = reB.lastIndex = 0, // scan index for next number in b
        am, // current match in a
        bm, // current match in b
        bs, // string preceding current number in b, if any
        i = -1, // index in s
        s = [], // string constants and placeholders
        q = []; // number interpolators

    // Coerce inputs to strings.
    a = a + "", b = b + "";

    // Interpolate pairs of numbers in a & b.
    while ((am = reA.exec(a))
        && (bm = reB.exec(b))) {
      if ((bs = bm.index) > bi) { // a string precedes the next number in b
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; // coalesce with previous string
        else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) { // numbers in a & b match
        if (s[i]) s[i] += bm; // coalesce with previous string
        else s[++i] = bm;
      } else { // interpolate non-matching numbers
        s[++i] = null;
        q.push({i: i, x: interpolateNumber(am, bm)});
      }
      bi = reB.lastIndex;
    }

    // Add remains of b.
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; // coalesce with previous string
      else s[++i] = bs;
    }

    // Special optimization for only a single match.
    // Otherwise, interpolate each of the numbers and rejoin the string.
    return s.length < 2 ? (q[0]
        ? interpolate1(q[0].x)
        : interpolate0(b))
        : (b = q.length, function(t) {
            for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
            return s.join("");
          });
  }

  var interpolators = [
    function(a, b) {
      var t = typeof b, c;
      return (t === "string" ? ((c = color(b)) ? (b = c, interpolateRgb) : interpolateString)
          : b instanceof color ? interpolateRgb
          : Array.isArray(b) ? interpolateArray
          : t === "object" && isNaN(b) ? interpolateObject
          : interpolateNumber)(a, b);
    }
  ];

  function interpolate(a, b) {
    var i = interpolators.length, f;
    while (--i >= 0 && !(f = interpolators[i](a, b)));
    return f;
  }

  function nice(domain, step) {
    domain = domain.slice();
    if (!step) return domain;

    var i0 = 0,
        i1 = domain.length - 1,
        x0 = domain[i0],
        x1 = domain[i1],
        t;

    if (x1 < x0) {
      t = i0, i0 = i1, i1 = t;
      t = x0, x0 = x1, x1 = t;
    }

    domain[i0] = Math.floor(x0 / step) * step;
    domain[i1] = Math.ceil(x1 / step) * step;
    return domain;
  }

  var prefixes = ["y","z","a","f","p","n","µ","m","","k","M","G","T","P","E","Z","Y"];


  // Computes the decimal coefficient and exponent of the specified number x with
  // significant digits p, where x is positive and p is in [1, 21] or undefined.
  // For example, formatDecimal(1.23) returns ["123", 0].
  function formatDecimal(x, p) {
    if ((i = (x = p ? x.toExponential(p - 1) : x.toExponential()).indexOf("e")) < 0) return null; // NaN, ±Infinity
    var i, coefficient = x.slice(0, i);

    // The string returned by toExponential either has the form \d\.\d+e[-+]\d+
    // (e.g., 1.2e+3) or the form \de[-+]\d+ (e.g., 1e+3).
    return [
      coefficient.length > 1 ? coefficient[0] + coefficient.slice(2) : coefficient,
      +x.slice(i + 1)
    ];
  }

  function exponent(x) {
    return x = formatDecimal(Math.abs(x)), x ? x[1] : NaN;
  }

  var prefixExponent;

  function formatPrefixAuto(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1],
        i = exponent - (prefixExponent = Math.max(-8, Math.min(8, Math.floor(exponent / 3))) * 3) + 1,
        n = coefficient.length;
    return i === n ? coefficient
        : i > n ? coefficient + new Array(i - n + 1).join("0")
        : i > 0 ? coefficient.slice(0, i) + "." + coefficient.slice(i)
        : "0." + new Array(1 - i).join("0") + formatDecimal(x, p + i - 1)[0]; // less than 1y!
  }

  function formatRounded(x, p) {
    var d = formatDecimal(x, p);
    if (!d) return x + "";
    var coefficient = d[0],
        exponent = d[1];
    return exponent < 0 ? "0." + new Array(-exponent).join("0") + coefficient
        : coefficient.length > exponent + 1 ? coefficient.slice(0, exponent + 1) + "." + coefficient.slice(exponent + 1)
        : coefficient + new Array(exponent - coefficient.length + 2).join("0");
  }

  function formatDefault(x, p) {
    x = x.toPrecision(p);

    out: for (var n = x.length, i = 1, i0 = -1, i1; i < n; ++i) {
      switch (x[i]) {
        case ".": i0 = i1 = i; break;
        case "0": if (i0 === 0) i0 = i; i1 = i; break;
        case "e": break out;
        default: if (i0 > 0) i0 = 0; break;
      }
    }

    return i0 > 0 ? x.slice(0, i0) + x.slice(i1 + 1) : x;
  }

  var formatTypes = {
    "": formatDefault,
    "%": function(x, p) { return (x * 100).toFixed(p); },
    "b": function(x) { return Math.round(x).toString(2); },
    "c": function(x) { return x + ""; },
    "d": function(x) { return Math.round(x).toString(10); },
    "e": function(x, p) { return x.toExponential(p); },
    "f": function(x, p) { return x.toFixed(p); },
    "g": function(x, p) { return x.toPrecision(p); },
    "o": function(x) { return Math.round(x).toString(8); },
    "p": function(x, p) { return formatRounded(x * 100, p); },
    "r": formatRounded,
    "s": formatPrefixAuto,
    "X": function(x) { return Math.round(x).toString(16).toUpperCase(); },
    "x": function(x) { return Math.round(x).toString(16); }
  };


  // [[fill]align][sign][symbol][0][width][,][.precision][type]
  var re = /^(?:(.)?([<>=^]))?([+\-\( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?([a-z%])?$/i;

  function FormatSpecifier(specifier) {
    if (!(match = re.exec(specifier))) throw new Error("invalid format: " + specifier);

    var match,
        fill = match[1] || " ",
        align = match[2] || ">",
        sign = match[3] || "-",
        symbol = match[4] || "",
        zero = !!match[5],
        width = match[6] && +match[6],
        comma = !!match[7],
        precision = match[8] && +match[8].slice(1),
        type = match[9] || "";

    // The "n" type is an alias for ",g".
    if (type === "n") comma = true, type = "g";

    // Map invalid types to the default format.
    else if (!formatTypes[type]) type = "";

    // If zero fill is specified, padding goes after sign and before digits.
    if (zero || (fill === "0" && align === "=")) zero = true, fill = "0", align = "=";

    this.fill = fill;
    this.align = align;
    this.sign = sign;
    this.symbol = symbol;
    this.zero = zero;
    this.width = width;
    this.comma = comma;
    this.precision = precision;
    this.type = type;
  }

  FormatSpecifier.prototype.toString = function() {
    return this.fill
        + this.align
        + this.sign
        + this.symbol
        + (this.zero ? "0" : "")
        + (this.width == null ? "" : Math.max(1, this.width | 0))
        + (this.comma ? "," : "")
        + (this.precision == null ? "" : "." + Math.max(0, this.precision | 0))
        + this.type;
  };

  function formatSpecifier(specifier) {
    return new FormatSpecifier(specifier);
  }

  function _identity(x) {
    return x;
  }

  function formatGroup(grouping, thousands) {
    return function(value, width) {
      var i = value.length,
          t = [],
          j = 0,
          g = grouping[0],
          length = 0;

      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = grouping[j = (j + 1) % grouping.length];
      }

      return t.reverse().join(thousands);
    };
  }

  function localeFormat(locale) {
    var group = locale.grouping && locale.thousands ? formatGroup(locale.grouping, locale.thousands) : _identity,
        currency = locale.currency,
        decimal = locale.decimal;

    function format(specifier) {
      specifier = formatSpecifier(specifier);

      var fill = specifier.fill,
          align = specifier.align,
          sign = specifier.sign,
          symbol = specifier.symbol,
          zero = specifier.zero,
          width = specifier.width,
          comma = specifier.comma,
          precision = specifier.precision,
          type = specifier.type;

      // Compute the prefix and suffix.
      // For SI-prefix, the suffix is lazily computed.
      var prefix = symbol === "$" ? currency[0] : symbol === "#" && /[boxX]/.test(type) ? "0" + type.toLowerCase() : "",
          suffix = symbol === "$" ? currency[1] : /[%p]/.test(type) ? "%" : "";

      // What format function should we use?
      // Is this an integer type?
      // Can this type generate exponential notation?
      var formatType = formatTypes[type],
          maybeSuffix = !type || /[defgprs%]/.test(type);

      // Set the default precision if not specified,
      // or clamp the specified precision to the supported range.
      // For significant precision, it must be in [1, 21].
      // For fixed precision, it must be in [0, 20].
      precision = precision == null ? (type ? 6 : 12)
          : /[gprs]/.test(type) ? Math.max(1, Math.min(21, precision))
          : Math.max(0, Math.min(20, precision));

      return function(value) {
        var valuePrefix = prefix,
            valueSuffix = suffix;

        if (type === "c") {
          valueSuffix = formatType(value) + valueSuffix;
          value = "";
        } else {
          value = +value;

          // Convert negative to positive, and compute the prefix.
          // Note that -0 is not less than 0, but 1 / -0 is!
          var valueNegative = (value < 0 || 1 / value < 0) && (value *= -1, true);

          // Perform the initial formatting.
          value = formatType(value, precision);

          // Compute the prefix and suffix.
          valuePrefix = (valueNegative ? (sign === "(" ? sign : "-") : sign === "-" || sign === "(" ? "" : sign) + valuePrefix;
          valueSuffix = valueSuffix + (type === "s" ? prefixes[8 + prefixExponent / 3] : "") + (valueNegative && sign === "(" ? ")" : "");

          // Break the formatted value into the integer “value” part that can be
          // grouped, and fractional or exponential “suffix” part that is not.
          if (maybeSuffix) {
            var i = -1, n = value.length, c;
            while (++i < n) {
              if (c = value.charCodeAt(i), 48 > c || c > 57) {
                valueSuffix = (c === 46 ? decimal + value.slice(i + 1) : value.slice(i)) + valueSuffix;
                value = value.slice(0, i);
                break;
              }
            }
          }
        }

        // If the fill character is not "0", grouping is applied before padding.
        if (comma && !zero) value = group(value, Infinity);

        // Compute the padding.
        var length = valuePrefix.length + value.length + valueSuffix.length,
            padding = length < width ? new Array(width - length + 1).join(fill) : "";

        // If the fill character is "0", grouping is applied after padding.
        if (comma && zero) value = group(padding + value, padding.length ? width - valueSuffix.length : Infinity), padding = "";

        // Reconstruct the final output based on the desired alignment.
        switch (align) {
          case "<": return valuePrefix + value + valueSuffix + padding;
          case "=": return valuePrefix + padding + value + valueSuffix;
          case "^": return padding.slice(0, length = padding.length >> 1) + valuePrefix + value + valueSuffix + padding.slice(length);
        }
        return padding + valuePrefix + value + valueSuffix;
      };
    }

    function formatPrefix(specifier, value) {
      var f = format((specifier = formatSpecifier(specifier), specifier.type = "f", specifier)),
          e = Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3,
          k = Math.pow(10, -e),
          prefix = prefixes[8 + e / 3];
      return function(value) {
        return f(k * value) + prefix;
      };
    }

    return {
      format: format,
      formatPrefix: formatPrefix
    };
  }

  var locale = localeFormat({
    decimal: ".",
    thousands: ",",
    grouping: [3],
    currency: ["$", ""]
  });

  var __format = locale.format;

  function precisionFixed(step) {
    return Math.max(0, -exponent(Math.abs(step)));
  }

  function precisionRound(step, max) {
    return Math.max(0, exponent(Math.abs(max)) - exponent(Math.abs(step))) + 1;
  }

  var formatPrefix = locale.formatPrefix;

  function precisionPrefix(step, value) {
    return Math.max(0, Math.max(-8, Math.min(8, Math.floor(exponent(value) / 3))) * 3 - exponent(Math.abs(step)));
  }

  function __tickFormat(domain, count, specifier) {
    var range = tickRange(domain, count);
    if (specifier == null) {
      specifier = ",." + precisionFixed(range[2]) + "f";
    } else {
      switch (specifier = formatSpecifier(specifier), specifier.type) {
        case "s": {
          var value = Math.max(Math.abs(range[0]), Math.abs(range[1]));
          if (specifier.precision == null) specifier.precision = precisionPrefix(range[2], value);
          return formatPrefix(specifier, value);
        }
        case "":
        case "e":
        case "g":
        case "p":
        case "r": {
          if (specifier.precision == null) specifier.precision = precisionRound(range[2], Math.max(Math.abs(range[0]), Math.abs(range[1]))) - (specifier.type === "e");
          break;
        }
        case "f":
        case "%": {
          if (specifier.precision == null) specifier.precision = precisionFixed(range[2]) - (specifier.type === "%") * 2;
          break;
        }
      }
    }
    return __format(specifier);
  }

  function ticks(domain, count) {
    return range.apply(null, tickRange(domain, count));
  }

  function interpolateRound(a, b) {
    return a = +a, b -= a, function(t) {
      return Math.round(a + b * t);
    };
  }

  function uninterpolateNumber(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  }

  function uninterpolateClamp(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) / b));
    };
  }

  function bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]),
        i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }

  var ascendingBisect = bisector(ascending);
  var bisectRight = ascendingBisect.right;

  var bisect = bisectRight;

  function polylinear(domain, range, uninterpolate, interpolate) {
    var k = Math.min(domain.length, range.length) - 1,
        u = new Array(k),
        i = new Array(k),
        j = -1;

    // Handle descending domains.
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }

    while (++j < k) {
      u[j] = uninterpolate(domain[j], domain[j + 1]);
      i[j] = interpolate(range[j], range[j + 1]);
    }

    return function(x) {
      var j = bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }

  function newLinear(domain, range, interpolate, clamp) {
    var output,
        input;

    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? polylinear : bilinear,
          uninterpolate = clamp ? uninterpolateClamp : uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, interpolateNumber);
      return scale;
    }

    function scale(x) {
      return output(x);
    }

    scale.invert = function(y) {
      return input(y);
    };

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      return rescale();
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      return rescale();
    };

    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(interpolateRound);
    };

    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = !!x;
      return rescale();
    };

    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };

    scale.ticks = function(count) {
      return ticks(domain, count);
    };

    scale.tickFormat = function(count, specifier) {
      return __tickFormat(domain, count, specifier);
    };

    scale.nice = function(count) {
      domain = nice(domain, tickRange(domain, count)[2]);
      return rescale();
    };

    scale.copy = function() {
      return newLinear(domain, range, interpolate, clamp);
    };

    return rescale();
  }

  function linear() {
    return newLinear([0, 1], [0, 1], interpolate, false);
  }

  function utcTime() {
    return newTime(linear(), _timeInterval, _tickFormat, utcFormat).domain([Date.UTC(2000, 0, 1), Date.UTC(2000, 0, 2)]);
  }

  var format = _locale.format;

  var formatYear = format("%Y");

  var formatMonth = format("%B");

  var formatWeek = format("%b %d");

  var formatDay = format("%a %d");

  var week = sunday;

  var month = newInterval(function(date) {
    date.setHours(0, 0, 0, 0);
    date.setDate(1);
  }, function(date, step) {
    date.setMonth(date.getMonth() + step);
  }, function(start, end) {
    return end.getMonth() - start.getMonth() + (end.getFullYear() - start.getFullYear()) * 12;
  });

  var formatHour = format("%I %p");

  var formatMinute = format("%I:%M");

  var hour = newInterval(function(date) {
    date.setMinutes(0, 0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 36e5);
  }, function(start, end) {
    return (end - start) / 36e5;
  });

  var formatSecond = format(":%S");

  var minute = newInterval(function(date) {
    date.setSeconds(0, 0);
  }, function(date, step) {
    date.setTime(+date + step * 6e4);
  }, function(start, end) {
    return (end - start) / 6e4;
  });

  var formatMillisecond = format(".%L");

  var second = newInterval(function(date) {
    date.setMilliseconds(0);
  }, function(date, step) {
    date.setTime(+date + step * 1e3);
  }, function(start, end) {
    return (end - start) / 1e3;
  });

  function tickFormat(date) {
    return (second(date) < date ? formatMillisecond
        : minute(date) < date ? formatSecond
        : hour(date) < date ? formatMinute
        : day(date) < date ? formatHour
        : month(date) < date ? (week(date) < date ? formatDay : formatWeek)
        : year(date) < date ? formatMonth
        : formatYear)(date);
  }

  function timeInterval(interval, step) {
    switch (interval) {
      case "milliseconds": return millisecond(step);
      case "seconds": return step > 1 ? second.filter(function(d) { return d.getSeconds() % step === 0; }) : second;
      case "minutes": return step > 1 ? minute.filter(function(d) { return d.getMinutes() % step === 0; }) : minute;
      case "hours": return step > 1 ? hour.filter(function(d) { return d.getHours() % step === 0; }) : hour;
      case "days": return step > 1 ? day.filter(function(d) { return (d.getDate() - 1) % step === 0; }) : day;
      case "weeks": return step > 1 ? week.filter(function(d) { return week.count(0, d) % step === 0; }) : week;
      case "months": return step > 1 ? month.filter(function(d) { return d.getMonth() % step === 0; }) : month;
      case "years": return step > 1 ? year.filter(function(d) { return d.getFullYear() % step === 0; }) : year;
    }
  }

  function time() {
    return newTime(linear(), timeInterval, tickFormat, format).domain([new Date(2000, 0, 1), new Date(2000, 0, 2)]);
  }

  function newThreshold(domain, range, n) {

    function scale(x) {
      if (x <= x) return range[bisect(domain, x, 0, n)];
    }

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.slice(), n = Math.min(domain.length, range.length - 1);
      return scale;
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice(), n = Math.min(domain.length, range.length - 1);
      return scale;
    };

    scale.invertExtent = function(y) {
      return y = range.indexOf(y), [domain[y - 1], domain[y]];
    };

    scale.copy = function() {
      return newThreshold(domain, range);
    };

    return scale;
  }

  function threshold() {
    return newThreshold([.5], [0, 1], 1);
  }

  function newPow(linear, exponent, domain) {

    function powp(x) {
      return x < 0 ? -Math.pow(-x, exponent) : Math.pow(x, exponent);
    }

    function powb(x) {
      return x < 0 ? -Math.pow(-x, 1 / exponent) : Math.pow(x, 1 / exponent);
    }

    function scale(x) {
      return linear(powp(x));
    }

    scale.invert = function(x) {
      return powb(linear.invert(x));
    };

    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      exponent = +x;
      return scale.domain(domain);
    };

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      linear.domain(domain.map(powp));
      return scale;
    };

    scale.ticks = function(count) {
      return ticks(domain, count);
    };

    scale.tickFormat = function(count, specifier) {
      return __tickFormat(domain, count, specifier);
    };

    scale.nice = function(count) {
      return scale.domain(nice(domain, tickRange(domain, count)[2]));
    };

    scale.copy = function() {
      return newPow(linear.copy(), exponent, domain);
    };

    return rebind(scale, linear);
  }

  function sqrt() {
    return newPow(linear(), .5, [0, 1]);
  }

  function newQuantize(x0, x1, range) {
    var kx, i;

    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }

    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }

    scale.domain = function(x) {
      if (!arguments.length) return [x0, x1];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      return rescale();
    };

    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [y, y + 1 / kx];
    };

    scale.copy = function() {
      return newQuantize(x0, x1, range); // copy on write
    };

    return rescale();
  }

  function quantize() {
    return newQuantize(0, 1, [0, 1]);
  }


  // R-7 per <http://en.wikipedia.org/wiki/Quantile>
  function quantile(values, p) {
    var H = (values.length - 1) * p + 1,
        h = Math.floor(H),
        v = +values[h - 1],
        e = H - h;
    return e ? v + e * (values[h] - v) : v;
  }

  function newQuantile(domain, range) {
    var thresholds;

    function rescale() {
      var k = 0,
          q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = quantile(domain, k / q);
      return scale;
    }

    function scale(x) {
      if (!isNaN(x = +x)) return range[bisect(thresholds, x)];
    }

    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      for (var i = 0, n = x.length, v; i < n; ++i) if (v = x[i], v != null && !isNaN(v = +v)) domain.push(v);
      domain.sort(ascending);
      return rescale();
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      return rescale();
    };

    scale.quantiles = function() {
      return thresholds;
    };

    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [NaN, NaN] : [
        y > 0 ? thresholds[y - 1] : domain[0],
        y < thresholds.length ? thresholds[y] : domain[domain.length - 1]
      ];
    };

    scale.copy = function() {
      return newQuantile(domain, range); // copy on write!
    };

    return rescale();
  }

  function _quantile() {
    return newQuantile([], []);
  }

  function pow() {
    return newPow(linear(), 1, [0, 1]);
  }

  function steps(length, start, step) {
    var steps = new Array(length), i = -1;
    while (++i < length) steps[i] = start + step * i;
    return steps;
  }

  function newOrdinal(domain, ranger) {
    var index,
        range,
        rangeBand;

    function scale(x) {
      var k = x + "", i = index.get(k);
      if (!i) {
        if (ranger.t !== "range") return;
        index.set(k, i = domain.push(x));
      }
      return range[(i - 1) % range.length];
    }

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = [];
      index = new Map;
      var i = -1, n = x.length, xi, xk;
      while (++i < n) if (!index.has(xk = (xi = x[i]) + "")) index.set(xk, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };

    scale.range = function(x) {
      if (!arguments.length) return range.slice();
      range = x.slice();
      rangeBand = 0;
      ranger = {t: "range", a: arguments};
      return scale;
    };

    scale.rangePoints = function(x, padding) {
      padding = arguments.length < 2 ? 0 : +padding;
      var start = +x[0],
          stop = +x[1],
          step = domain.length < 2 ? (start = (start + stop) / 2, 0) : (stop - start) / (domain.length - 1 + padding);
      range = steps(domain.length, start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {t: "rangePoints", a: arguments};
      return scale;
    };

    scale.rangeRoundPoints = function(x, padding) {
      padding = arguments.length < 2 ? 0 : +padding;
      var start = +x[0],
          stop = +x[1],
          step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 0) : (stop - start) / (domain.length - 1 + padding) | 0; // bitwise floor for symmetry
      range = steps(domain.length, start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
      rangeBand = 0;
      ranger = {t: "rangeRoundPoints", a: arguments};
      return scale;
    };

    scale.rangeBands = function(x, padding, outerPadding) {
      padding = arguments.length < 2 ? 0 : +padding;
      outerPadding = arguments.length < 3 ? padding : +outerPadding;
      var reverse = +x[1] < +x[0],
          start = +x[reverse - 0],
          stop = +x[1 - reverse],
          step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(domain.length, start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {t: "rangeBands", a: arguments};
      return scale;
    };

    scale.rangeRoundBands = function(x, padding, outerPadding) {
      padding = arguments.length < 2 ? 0 : +padding;
      outerPadding = arguments.length < 3 ? padding : +outerPadding;
      var reverse = +x[1] < +x[0],
          start = +x[reverse - 0],
          stop = +x[1 - reverse],
          step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
      range = steps(domain.length, start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {t: "rangeRoundBands", a: arguments};
      return scale;
    };

    scale.rangeBand = function() {
      return rangeBand;
    };

    scale.rangeExtent = function() {
      var t = ranger.a[0], start = t[0], stop = t[t.length - 1];
      if (stop < start) t = stop, stop = start, start = t;
      return [start, stop];
    };

    scale.copy = function() {
      return newOrdinal(domain, ranger);
    };

    return scale.domain(domain);
  }

  function ordinal() {
    return newOrdinal([], {t: "range", a: [[]]});
  }

  var tickFormatOther = __format(",");

  var tickFormat10 = __format(".0e");

  function newLog(linear, base, domain) {

    function log(x) {
      return (domain[0] < 0 ? -Math.log(x > 0 ? 0 : -x) : Math.log(x < 0 ? 0 : x)) / Math.log(base);
    }

    function pow(x) {
      return domain[0] < 0 ? -Math.pow(base, -x) : Math.pow(base, x);
    }

    function scale(x) {
      return linear(log(x));
    }

    scale.invert = function(x) {
      return pow(linear.invert(x));
    };

    scale.base = function(x) {
      if (!arguments.length) return base;
      base = +x;
      return scale.domain(domain);
    };

    scale.domain = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      linear.domain(domain.map(log));
      return scale;
    };

    scale.nice = function() {
      var x = nice(linear.domain(), 1);
      linear.domain(x);
      domain = x.map(pow);
      return scale;
    };

    scale.ticks = function() {
      var u = domain[0],
          v = domain[domain.length - 1];
      if (v < u) i = u, u = v, v = i;
      var i = Math.floor(log(u)),
          j = Math.ceil(log(v)),
          k,
          t,
          n = base % 1 ? 2 : base,
          ticks = [];

      if (isFinite(j - i)) {
        if (u > 0) {
          for (--j, k = 1; k < n; ++k) if ((t = pow(i) * k) < u) continue; else ticks.push(t);
          while (++i < j) for (k = 1; k < n; ++k) ticks.push(pow(i) * k);
          for (k = 1; k < n; ++k) if ((t = pow(i) * k) > v) break; else ticks.push(t);
        } else {
          for (++i, k = n - 1; k >= 1; --k) if ((t = pow(i) * k) < u) continue; else ticks.push(t);
          while (++i < j) for (k = n - 1; k >= 1; --k) ticks.push(pow(i) * k);
          for (k = n - 1; k >= 1; --k) if ((t = pow(i) * k) > v) break; else ticks.push(t);
        }
      }

      return ticks;
    };

    scale.tickFormat = function(count, specifier) {
      if (specifier == null) specifier = base === 10 ? tickFormat10 : tickFormatOther;
      else if (typeof specifier !== "function") specifier = __format(specifier);
      if (count == null) return specifier;
      var k = Math.min(base, scale.ticks().length / count),
          f = domain[0] > 0 ? (e = 1e-12, Math.ceil) : (e = -1e-12, Math.floor),
          e;
      return function(d) {
        return pow(f(log(d) + e)) / d >= k ? specifier(d) : "";
      };
    };

    scale.copy = function() {
      return newLog(linear.copy(), base, domain);
    };

    return rebind(scale, linear);
  }

  function log() {
    return newLog(linear(), 10, [1, 10]);
  }

  function newIdentity(domain) {

    function scale(x) {
      return +x;
    }

    scale.invert = scale;

    scale.domain = scale.range = function(x) {
      if (!arguments.length) return domain.slice();
      domain = x.map(Number);
      return scale;
    };

    scale.ticks = function(count) {
      return ticks(domain, count);
    };

    scale.tickFormat = function(count, specifier) {
      return __tickFormat(domain, count, specifier);
    };

    scale.copy = function() {
      return newIdentity(domain);
    };

    return scale;
  }

  function identity() {
    return newIdentity([0, 1]);
  }

  function category20c() {
    return ordinal().range([
      "#3182bd", "#6baed6", "#9ecae1", "#c6dbef",
      "#e6550d", "#fd8d3c", "#fdae6b", "#fdd0a2",
      "#31a354", "#74c476", "#a1d99b", "#c7e9c0",
      "#756bb1", "#9e9ac8", "#bcbddc", "#dadaeb",
      "#636363", "#969696", "#bdbdbd", "#d9d9d9"
    ]);
  }

  function category20b() {
    return ordinal().range([
      "#393b79", "#5254a3", "#6b6ecf", "#9c9ede",
      "#637939", "#8ca252", "#b5cf6b", "#cedb9c",
      "#8c6d31", "#bd9e39", "#e7ba52", "#e7cb94",
      "#843c39", "#ad494a", "#d6616b", "#e7969c",
      "#7b4173", "#a55194", "#ce6dbd", "#de9ed6"
    ]);
  }

  function category20() {
    return ordinal().range([
      "#1f77b4", "#aec7e8",
      "#ff7f0e", "#ffbb78",
      "#2ca02c", "#98df8a",
      "#d62728", "#ff9896",
      "#9467bd", "#c5b0d5",
      "#8c564b", "#c49c94",
      "#e377c2", "#f7b6d2",
      "#7f7f7f", "#c7c7c7",
      "#bcbd22", "#dbdb8d",
      "#17becf", "#9edae5"
    ]);
  }

  function category10() {
    return ordinal().range([
      "#1f77b4",
      "#ff7f0e",
      "#2ca02c",
      "#d62728",
      "#9467bd",
      "#8c564b",
      "#e377c2",
      "#7f7f7f",
      "#bcbd22",
      "#17becf"
    ]);
  }

  exports.category10 = category10;
  exports.category20 = category20;
  exports.category20b = category20b;
  exports.category20c = category20c;
  exports.identity = identity;
  exports.linear = linear;
  exports.log = log;
  exports.ordinal = ordinal;
  exports.pow = pow;
  exports.quantile = _quantile;
  exports.quantize = quantize;
  exports.sqrt = sqrt;
  exports.threshold = threshold;
  exports.time = time;
  exports.utcTime = utcTime;

}));
},{}],4:[function(require,module,exports){
"use strict";

var scales = require("d3-scale");

module.exports = {
  "dark": "#444444",
  "light": "#f7f7f7",
  "missing": "#cccccc",
  "off": "#b22200",
  "on": "#224f20",
  "scale": scales.ordinal().range(["#b22200", "#eace3f", "#282f6b", "#b35c1e", "#224f20", "#5f487c", "#759143", "#419391", "#993c88", "#e89c89", "#ffee8d", "#afd5e8", "#f7ba77", "#a5c697", "#c5b5e5", "#d1d392", "#bbefd0", "#e099cf"])
};

},{"d3-scale":3}],"d3plus-color":[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3 = {
  array: require("d3-arrays"),
  color: require("d3-color")
};

var settings = require("./defaults.js");

var Color = (function () {

  /**
      @param {Color|String|Number|true|false|null|undefined} color
      @param {object} [defaults = src/defaults.js]
  */

  function Color(color, defaults) {
    _classCallCheck(this, Color);

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
    } else if (!this.color) {
      this.color = color;
    }
  }

  /**
      Mixes a second color, returning a new Color object.
      @param {Color} c2 - The color to be mixed in. If it is not a d3plus-color Object, then it will be parsed into one.
      @returns {Color}
  */

  _createClass(Color, [{
    key: "add",
    value: function add(c2) {
      if (c2.constructor !== Color) {
        c2 = new Color(c2);
      }
      var o1 = this.opacity(),
          o2 = c2.opacity(),
          c1 = this.hsl();
      c2 = c2.hsl();
      var d = Math.abs(c2.h * o2 - c1.h * o1);
      if (d > 180) {
        d = d - 360;
      }
      var h = (d3.array.min([c1.h, c2.h]) + d / 2) % 360,
          s = c1.s + (c2.s * o2 - c1.s * o1) / 2,
          l = c1.l + (c2.l * o2 - c1.l * o1) / 2;
      // a = o1 + (o2 - o1) / 2;
      if (h < 0) {
        h = 360 + h;
      }
      return new Color("hsl(" + [h, s * 100 + "%", l * 100 + "%"].join(",") + ")");
      // return new Color("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")");
    }

    /**
        Returns true if the color is displayable.
        @returns {Boolean}
    */
  }, {
    key: "displayable",
    value: function displayable() {
      return this.d3.displayable();
    }

    /**
        Returns the hexidecimal value.
        @returns {String}
    */
  }, {
    key: "hex",
    value: function hex() {
      return this.toString();
    }

    /** Returns the D3 hsl object. */
  }, {
    key: "hsl",
    value: function hsl() {
      return d3.color.hsl(this.d3);
    }

    /**
        Darkens the color if it is too light to appear on white.
        @returns {Color}
    */
  }, {
    key: "legible",
    value: function legible() {
      var c = this.hsl();
      if (c.l > 0.45) {
        if (c.s > 0.8) {
          c.s = 0.8;
        }
        c.l = 0.45;
      }
      return new Color(c.toString());
    }

    /**
        Lightens the color while also reducing the saturation.
        @returns {Color}
    */
  }, {
    key: "lighter",
    value: function lighter(i) {
      if (!i) {
        i = 0.5;
      }
      var c = this.hsl();
      i = (1 - c.l) * i;
      c.l += i;c.s -= i;
      return new Color(c.toString());
    }

    // Parses opacity from original rgba or hsla value.
  }, {
    key: "opacity",
    value: function opacity() {
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
  }, {
    key: "rgb",
    value: function rgb() {
      return this.d3;
    }

    /**
        Subtracts a second color, returning a new Color object.
        @param {Color} c2 - The color to be subtracted out. If it is not a d3plus-color Object, then it will be parsed into one.
        @returns {Color}
    */
  }, {
    key: "subtract",
    value: function subtract(c2) {
      if (c2.constructor !== Color) {
        c2 = new Color(c2);
      }
      var o1 = this.opacity(),
          o2 = c2.opacity(),
          c1 = this.hsl();
      c2 = c2.hsl();
      var d = c2.h * o2 - c1.h * o1;
      if (Math.abs(d) > 180) {
        d = d - 360;
      }
      var h = (c1.h - d) % 360,
          s = c1.s - (c2.s * o2 - c1.s * o1) / 2,
          l = c1.l - (c2.l * o2 - c1.l * o1) / 2;
      // a = o1 - (o2 - o1) / 2;
      if (h < 0) {
        h = 360 + h;
      }
      return new Color("hsl(" + [h, s * 100 + "%", l * 100 + "%"].join(",") + ")");
      // return new Color("hsla(" + [h, s * 100 + "%", l * 100 + "%", a].join(",") + ")");
    }

    /**
        Analyzes the color and determines an appropriate color for text to be placed on top of the color.
        @returns {Color}
    */
  }, {
    key: "text",
    value: function text() {
      var rgb = this.rgb(),
          r = rgb.r,
          g = rgb.g,
          b = rgb.b,
          yiq = (r * 299 + g * 587 + b * 114) / 1000,
          c = yiq >= 128 ? this.defaults.dark : this.defaults.light;
      return new Color(c);
    }

    /**
        Pass-through method for D3 toString function.
        @returns {String}
    */
  }, {
    key: "toString",
    value: function toString() {
      return this.d3.toString();
    }
  }]);

  return Color;
})();

module.exports = Color;

},{"./defaults.js":4,"d3-arrays":1,"d3-color":2}]},{},[])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZDMtYXJyYXlzL2J1aWxkL2FycmF5cy5qcyIsIm5vZGVfbW9kdWxlcy9kMy1jb2xvci9idWlsZC9jb2xvci5qcyIsIm5vZGVfbW9kdWxlcy9kMy1zY2FsZS9idWlsZC9zY2FsZS5qcyIsIi9Vc2Vycy9EYXZlL1NpdGVzL2QzcGx1cy1jb2xvci9zcmMvZGVmYXVsdHMuanMiLCIvVXNlcnMvRGF2ZS9TaXRlcy9kM3BsdXMtY29sb3Ivc3JjL0NvbG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDanJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3I5RUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUVqQyxNQUFNLENBQUMsT0FBTyxHQUFHO0FBQ2YsUUFBTSxFQUFFLFNBQVM7QUFDakIsU0FBTyxFQUFFLFNBQVM7QUFDbEIsV0FBUyxFQUFFLFNBQVM7QUFDcEIsT0FBSyxFQUFFLFNBQVM7QUFDaEIsTUFBSSxFQUFFLFNBQVM7QUFDZixTQUFPLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUM5QixTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFDaEUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQ2hFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUNqRSxDQUFDO0NBQ0gsQ0FBQzs7Ozs7Ozs7O0FDYkYsSUFBSSxFQUFFLEdBQUc7QUFDUCxPQUFLLEVBQUUsT0FBTyxDQUFDLFdBQVcsQ0FBQztBQUMzQixPQUFLLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQztDQUMzQixDQUFDOztBQUVGLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7SUFFbEMsS0FBSzs7Ozs7OztBQU1FLFdBTlAsS0FBSyxDQU1HLEtBQUssRUFBRSxRQUFRLEVBQUU7MEJBTnpCLEtBQUs7O0FBUVAsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDOzs7QUFHckMsUUFBSSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO0FBQ3pDLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDcEM7O1NBRUksSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3ZCLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUM7T0FDL0I7O1dBRUksSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO0FBQ3hCLGNBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7U0FDaEM7O0FBRUQsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDOztBQUU5QyxRQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtBQUNaLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdEMsTUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNwQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjtHQUVGOzs7Ozs7OztlQWxDRyxLQUFLOztXQTBDTixhQUFDLEVBQUUsRUFBRTtBQUNOLFVBQUksRUFBRSxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7QUFBRSxVQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7T0FBRTtBQUNyRCxVQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO1VBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUU7VUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVELFFBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxVQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQUUsU0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7T0FBRTtBQUM3QixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksR0FBRztVQUM5QyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksQ0FBQztVQUN0QyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBLEdBQUksQ0FBQyxDQUFDOztBQUUzQyxVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFBRSxTQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUFFO0FBQzNCLGFBQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDOztLQUU5RTs7Ozs7Ozs7V0FNVSx1QkFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUM5Qjs7Ozs7Ozs7V0FNRSxlQUFHO0FBQ0osYUFBTyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDeEI7Ozs7O1dBR0UsZUFBRztBQUNKLGFBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzlCOzs7Ozs7OztXQU1NLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ25CLFVBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUU7QUFDZCxZQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFO0FBQUUsV0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7U0FBRTtBQUM3QixTQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztPQUNaO0FBQ0QsYUFBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztLQUNoQzs7Ozs7Ozs7V0FNTSxpQkFBQyxDQUFDLEVBQUU7QUFDVCxVQUFJLENBQUMsQ0FBQyxFQUFFO0FBQUUsU0FBQyxHQUFHLEdBQUcsQ0FBQztPQUFFO0FBQ3BCLFVBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNuQixPQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUNsQixPQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxBQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ25CLGFBQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDaEM7Ozs7O1dBR00sbUJBQUc7QUFDUixhQUFPLENBQUMsQ0FBQzs7Ozs7Ozs7OztLQVVWOzs7OztXQUdFLGVBQUc7QUFDSixhQUFPLElBQUksQ0FBQyxFQUFFLENBQUM7S0FDaEI7Ozs7Ozs7OztXQU9PLGtCQUFDLEVBQUUsRUFBRTtBQUNYLFVBQUksRUFBRSxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7QUFBRSxVQUFFLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7T0FBRTtBQUNyRCxVQUFJLEVBQUUsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFO1VBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUU7VUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzVELFFBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDZCxVQUFJLENBQUMsR0FBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQUFBQyxDQUFDO0FBQ2hDLFVBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFBRSxTQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztPQUFFO0FBQ3ZDLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxHQUFHO1VBQ3BCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBSSxDQUFDO1VBQ3RDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUEsR0FBSSxDQUFDLENBQUM7O0FBRTNDLFVBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUFFLFNBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO09BQUU7QUFDM0IsYUFBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0tBRTlFOzs7Ozs7OztXQU1HLGdCQUFHO0FBQ0wsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtVQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztVQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztVQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztVQUNqRCxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQSxHQUFJLElBQUk7VUFDMUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7QUFDOUQsYUFBTyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyQjs7Ozs7Ozs7V0FNTyxvQkFBRztBQUNULGFBQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUMzQjs7O1NBL0pHLEtBQUs7OztBQW1LWCxNQUFNLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpZiAodHlwZW9mIE1hcCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICBNYXAgPSBmdW5jdGlvbigpIHsgdGhpcy5jbGVhcigpOyB9O1xuICBNYXAucHJvdG90eXBlID0ge1xuICAgIHNldDogZnVuY3Rpb24oaywgdikgeyB0aGlzLl9ba10gPSB2OyByZXR1cm4gdGhpczsgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIHRoaXMuX1trXTsgfSxcbiAgICBoYXM6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fOyB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl8gJiYgZGVsZXRlIHRoaXMuX1trXTsgfSxcbiAgICBjbGVhcjogZnVuY3Rpb24oKSB7IHRoaXMuXyA9IE9iamVjdC5jcmVhdGUobnVsbCk7IH0sXG4gICAgZ2V0IHNpemUoKSB7IHZhciBuID0gMDsgZm9yICh2YXIgayBpbiB0aGlzLl8pICsrbjsgcmV0dXJuIG47IH0sXG4gICAgZm9yRWFjaDogZnVuY3Rpb24oYykgeyBmb3IgKHZhciBrIGluIHRoaXMuXykgYyh0aGlzLl9ba10sIGssIHRoaXMpOyB9XG4gIH07XG59XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmFycmF5cyA9IHt9KSk7XG59KHRoaXMsIGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuICBmdW5jdGlvbiBsZW5ndGgoZCkge1xuICAgIHJldHVybiBkLmxlbmd0aDtcbiAgfVxuXG4gIHZhciBtaW4gPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBpID0gLTEsXG4gICAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGEsXG4gICAgICAgIGI7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBhID4gYikgYSA9IGI7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpICE9IG51bGwgJiYgYiA+PSBiKSB7IGEgPSBiOyBicmVhazsgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsICYmIGEgPiBiKSBhID0gYjtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIHZhciB0cmFuc3Bvc2UgPSBmdW5jdGlvbihtYXRyaXgpIHtcbiAgICBpZiAoIShuID0gbWF0cml4Lmxlbmd0aCkpIHJldHVybiBbXTtcbiAgICBmb3IgKHZhciBpID0gLTEsIG0gPSBtaW4obWF0cml4LCBsZW5ndGgpLCB0cmFuc3Bvc2UgPSBuZXcgQXJyYXkobSk7ICsraSA8IG07KSB7XG4gICAgICBmb3IgKHZhciBqID0gLTEsIG4sIHJvdyA9IHRyYW5zcG9zZVtpXSA9IG5ldyBBcnJheShuKTsgKytqIDwgbjspIHtcbiAgICAgICAgcm93W2pdID0gbWF0cml4W2pdW2ldO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJhbnNwb3NlO1xuICB9XG5cbiAgdmFyIHppcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0cmFuc3Bvc2UoYXJndW1lbnRzKTtcbiAgfVxuXG4gIHZhciBudW1iZXIgPSBmdW5jdGlvbih4KSB7XG4gICAgcmV0dXJuIHggPT09IG51bGwgPyBOYU4gOiAreDtcbiAgfVxuXG4gIHZhciB2YXJpYW5jZSA9IGZ1bmN0aW9uKGFycmF5LCBmKSB7XG4gICAgdmFyIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIG0gPSAwLFxuICAgICAgICBhLFxuICAgICAgICBkLFxuICAgICAgICBzID0gMCxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBqID0gMDtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICBpZiAoIWlzTmFOKGEgPSBudW1iZXIoYXJyYXlbaV0pKSkge1xuICAgICAgICAgIGQgPSBhIC0gbTtcbiAgICAgICAgICBtICs9IGQgLyArK2o7XG4gICAgICAgICAgcyArPSBkICogKGEgLSBtKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaWYgKCFpc05hTihhID0gbnVtYmVyKGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSkpIHtcbiAgICAgICAgICBkID0gYSAtIG07XG4gICAgICAgICAgbSArPSBkIC8gKytqO1xuICAgICAgICAgIHMgKz0gZCAqIChhIC0gbSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaiA+IDEpIHJldHVybiBzIC8gKGogLSAxKTtcbiAgfVxuXG4gIHZhciB2YWx1ZXMgPSBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgdmFsdWVzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG1hcCkgdmFsdWVzLnB1c2gobWFwW2tleV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICB2YXIgc3VtID0gZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgICB2YXIgcyA9IDAsXG4gICAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGEsXG4gICAgICAgIGkgPSAtMTtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpc05hTihhID0gK2FycmF5W2ldKSkgcyArPSBhOyAvLyBOb3RlOiB6ZXJvIGFuZCBudWxsIGFyZSBlcXVpdmFsZW50LlxuICAgIH1cblxuICAgIGVsc2Uge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghaXNOYU4oYSA9ICtmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkpIHMgKz0gYTtcbiAgICB9XG5cbiAgICByZXR1cm4gcztcbiAgfVxuXG4gIHZhciBzaHVmZmxlID0gZnVuY3Rpb24oYXJyYXksIGkwLCBpMSkge1xuICAgIGlmICgobSA9IGFyZ3VtZW50cy5sZW5ndGgpIDwgMykge1xuICAgICAgaTEgPSBhcnJheS5sZW5ndGg7XG4gICAgICBpZiAobSA8IDIpIGkwID0gMDtcbiAgICB9XG5cbiAgICB2YXIgbSA9IGkxIC0gaTAsXG4gICAgICAgIHQsXG4gICAgICAgIGk7XG5cbiAgICB3aGlsZSAobSkge1xuICAgICAgaSA9IE1hdGgucmFuZG9tKCkgKiBtLS0gfCAwO1xuICAgICAgdCA9IGFycmF5W20gKyBpMF07XG4gICAgICBhcnJheVttICsgaTBdID0gYXJyYXlbaSArIGkwXTtcbiAgICAgIGFycmF5W2kgKyBpMF0gPSB0O1xuICAgIH1cblxuICAgIHJldHVybiBhcnJheTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICB2YXIgayA9IDE7XG4gICAgd2hpbGUgKHggKiBrICUgMSkgayAqPSAxMDtcbiAgICByZXR1cm4gaztcbiAgfVxuXG4gIHZhciByYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgaWYgKChuID0gYXJndW1lbnRzLmxlbmd0aCkgPCAzKSB7XG4gICAgICBzdGVwID0gMTtcbiAgICAgIGlmIChuIDwgMikge1xuICAgICAgICBzdG9wID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgaSA9IC0xLFxuICAgICAgICBuID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChzdG9wIC0gc3RhcnQpIC8gc3RlcCkpIHwgMCxcbiAgICAgICAgayA9IHNjYWxlKE1hdGguYWJzKHN0ZXApKSxcbiAgICAgICAgcmFuZ2UgPSBuZXcgQXJyYXkobik7XG5cbiAgICBzdGFydCAqPSBrO1xuICAgIHN0ZXAgKj0gaztcbiAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgcmFuZ2VbaV0gPSAoc3RhcnQgKyBpICogc3RlcCkgLyBrO1xuICAgIH1cblxuICAgIHJldHVybiByYW5nZTtcbiAgfVxuXG5cbiAgLy8gUi03IHBlciA8aHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9RdWFudGlsZT5cbiAgdmFyIHF1YW50aWxlID0gZnVuY3Rpb24odmFsdWVzLCBwKSB7XG4gICAgdmFyIEggPSAodmFsdWVzLmxlbmd0aCAtIDEpICogcCArIDEsXG4gICAgICAgIGggPSBNYXRoLmZsb29yKEgpLFxuICAgICAgICB2ID0gK3ZhbHVlc1toIC0gMV0sXG4gICAgICAgIGUgPSBIIC0gaDtcbiAgICByZXR1cm4gZSA/IHYgKyBlICogKHZhbHVlc1toXSAtIHYpIDogdjtcbiAgfVxuXG4gIHZhciBwZXJtdXRlID0gZnVuY3Rpb24oYXJyYXksIGluZGV4ZXMpIHtcbiAgICB2YXIgaSA9IGluZGV4ZXMubGVuZ3RoLCBwZXJtdXRlcyA9IG5ldyBBcnJheShpKTtcbiAgICB3aGlsZSAoaS0tKSBwZXJtdXRlc1tpXSA9IGFycmF5W2luZGV4ZXNbaV1dO1xuICAgIHJldHVybiBwZXJtdXRlcztcbiAgfVxuXG4gIHZhciBwYWlycyA9IGZ1bmN0aW9uKGFycmF5KSB7XG4gICAgdmFyIGkgPSAwLCBuID0gYXJyYXkubGVuZ3RoIC0gMSwgcDAsIHAxID0gYXJyYXlbMF0sIHBhaXJzID0gbmV3IEFycmF5KG4gPCAwID8gMCA6IG4pO1xuICAgIHdoaWxlIChpIDwgbikgcGFpcnNbaV0gPSBbcDAgPSBwMSwgcDEgPSBhcnJheVsrK2ldXTtcbiAgICByZXR1cm4gcGFpcnM7XG4gIH1cblxuICB2YXIgbmVzdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBrZXlzID0gW10sXG4gICAgICAgIHNvcnRLZXlzID0gW10sXG4gICAgICAgIHNvcnRWYWx1ZXMsXG4gICAgICAgIHJvbGx1cCxcbiAgICAgICAgbmVzdDtcblxuICAgIGZ1bmN0aW9uIG1hcChhcnJheSwgZGVwdGgpIHtcbiAgICAgIGlmIChkZXB0aCA+PSBrZXlzLmxlbmd0aCkgcmV0dXJuIHJvbGx1cFxuICAgICAgICAgID8gcm9sbHVwLmNhbGwobmVzdCwgYXJyYXkpIDogKHNvcnRWYWx1ZXNcbiAgICAgICAgICA/IGFycmF5LnNvcnQoc29ydFZhbHVlcylcbiAgICAgICAgICA6IGFycmF5KTtcblxuICAgICAgdmFyIGkgPSAtMSxcbiAgICAgICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICAgIGtleSA9IGtleXNbZGVwdGgrK10sXG4gICAgICAgICAga2V5VmFsdWUsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgICAgdmFsdWVzQnlLZXkgPSBuZXcgTWFwLFxuICAgICAgICAgIHZhbHVlcztcblxuICAgICAgd2hpbGUgKCsraSA8IG4pIHtcbiAgICAgICAgaWYgKHZhbHVlcyA9IHZhbHVlc0J5S2V5LmdldChrZXlWYWx1ZSA9IGtleSh2YWx1ZSA9IGFycmF5W2ldKSArIFwiXCIpKSB7XG4gICAgICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhbHVlc0J5S2V5LnNldChrZXlWYWx1ZSwgW3ZhbHVlXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFsdWVzQnlLZXkuZm9yRWFjaChmdW5jdGlvbih2YWx1ZXMsIGtleSkge1xuICAgICAgICB2YWx1ZXNCeUtleS5zZXQoa2V5LCBtYXAodmFsdWVzLCBkZXB0aCkpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB2YWx1ZXNCeUtleTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBlbnRyaWVzKG1hcCwgZGVwdGgpIHtcbiAgICAgIGlmIChkZXB0aCA+PSBrZXlzLmxlbmd0aCkgcmV0dXJuIG1hcDtcblxuICAgICAgdmFyIGFycmF5ID0gbmV3IEFycmF5KG1hcC5zaXplKSxcbiAgICAgICAgICBpID0gLTEsXG4gICAgICAgICAgc29ydEtleSA9IHNvcnRLZXlzW2RlcHRoKytdO1xuXG4gICAgICBtYXAuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGFycmF5WysraV0gPSB7a2V5OiBrZXksIHZhbHVlczogZW50cmllcyh2YWx1ZSwgZGVwdGgpfTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gc29ydEtleVxuICAgICAgICAgID8gYXJyYXkuc29ydChmdW5jdGlvbihhLCBiKSB7IHJldHVybiBzb3J0S2V5KGEua2V5LCBiLmtleSk7IH0pXG4gICAgICAgICAgOiBhcnJheTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmVzdCA9IHtcbiAgICAgIG1hcDogZnVuY3Rpb24oYXJyYXkpIHsgcmV0dXJuIG1hcChhcnJheSwgMCk7IH0sXG4gICAgICBlbnRyaWVzOiBmdW5jdGlvbihhcnJheSkgeyByZXR1cm4gZW50cmllcyhtYXAoYXJyYXksIDApLCAwKTsgfSxcbiAgICAgIGtleTogZnVuY3Rpb24oZCkgeyBrZXlzLnB1c2goZCk7IHJldHVybiBuZXN0OyB9LFxuICAgICAgc29ydEtleXM6IGZ1bmN0aW9uKG9yZGVyKSB7IHNvcnRLZXlzW2tleXMubGVuZ3RoIC0gMV0gPSBvcmRlcjsgcmV0dXJuIG5lc3Q7IH0sXG4gICAgICBzb3J0VmFsdWVzOiBmdW5jdGlvbihvcmRlcikgeyBzb3J0VmFsdWVzID0gb3JkZXI7IHJldHVybiBuZXN0OyB9LFxuICAgICAgcm9sbHVwOiBmdW5jdGlvbihmKSB7IHJvbGx1cCA9IGY7IHJldHVybiBuZXN0OyB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBtZXJnZSA9IGZ1bmN0aW9uKGFycmF5cykge1xuICAgIHZhciBuID0gYXJyYXlzLmxlbmd0aCxcbiAgICAgICAgbSxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBqID0gMCxcbiAgICAgICAgbWVyZ2VkLFxuICAgICAgICBhcnJheTtcblxuICAgIHdoaWxlICgrK2kgPCBuKSBqICs9IGFycmF5c1tpXS5sZW5ndGg7XG4gICAgbWVyZ2VkID0gbmV3IEFycmF5KGopO1xuXG4gICAgd2hpbGUgKC0tbiA+PSAwKSB7XG4gICAgICBhcnJheSA9IGFycmF5c1tuXTtcbiAgICAgIG0gPSBhcnJheS5sZW5ndGg7XG4gICAgICB3aGlsZSAoLS1tID49IDApIHtcbiAgICAgICAgbWVyZ2VkWy0tal0gPSBhcnJheVttXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWVyZ2VkO1xuICB9XG5cbiAgdmFyIGFzY2VuZGluZyA9IGZ1bmN0aW9uKGEsIGIpIHtcbiAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IGEgPj0gYiA/IDAgOiBOYU47XG4gIH1cblxuICB2YXIgbWVkaWFuID0gZnVuY3Rpb24oYXJyYXksIGYpIHtcbiAgICB2YXIgbnVtYmVycyA9IFtdLFxuICAgICAgICBuID0gYXJyYXkubGVuZ3RoLFxuICAgICAgICBhLFxuICAgICAgICBpID0gLTE7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICghaXNOYU4oYSA9IG51bWJlcihhcnJheVtpXSkpKSBudW1iZXJzLnB1c2goYSk7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpc05hTihhID0gbnVtYmVyKGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSkpIG51bWJlcnMucHVzaChhKTtcbiAgICB9XG5cbiAgICBpZiAobnVtYmVycy5sZW5ndGgpIHJldHVybiBxdWFudGlsZShudW1iZXJzLnNvcnQoYXNjZW5kaW5nKSwgLjUpO1xuICB9XG5cbiAgdmFyIG1lYW4gPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBzID0gMCxcbiAgICAgICAgbiA9IGFycmF5Lmxlbmd0aCxcbiAgICAgICAgYSxcbiAgICAgICAgaSA9IC0xLFxuICAgICAgICBqID0gbjtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpc05hTihhID0gbnVtYmVyKGFycmF5W2ldKSkpIHMgKz0gYTsgZWxzZSAtLWo7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpc05hTihhID0gbnVtYmVyKGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSkpIHMgKz0gYTsgZWxzZSAtLWo7XG4gICAgfVxuXG4gICAgaWYgKGopIHJldHVybiBzIC8gajtcbiAgfVxuXG4gIHZhciBtYXggPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBpID0gLTEsXG4gICAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGEsXG4gICAgICAgIGI7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYjsgYnJlYWs7IH1cbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBhcnJheVtpXSkgIT0gbnVsbCAmJiBiID4gYSkgYSA9IGI7XG4gICAgfVxuXG4gICAgZWxzZSB7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gZi5jYWxsKGFycmF5LCBhcnJheVtpXSwgaSkpICE9IG51bGwgJiYgYiA+PSBiKSB7IGEgPSBiOyBicmVhazsgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsICYmIGIgPiBhKSBhID0gYjtcbiAgICB9XG5cbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIHZhciBrZXlzID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWFwKSBrZXlzLnB1c2goa2V5KTtcbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIHZhciBleHRlbnQgPSBmdW5jdGlvbihhcnJheSwgZikge1xuICAgIHZhciBpID0gLTEsXG4gICAgICAgIG4gPSBhcnJheS5sZW5ndGgsXG4gICAgICAgIGEsXG4gICAgICAgIGIsXG4gICAgICAgIGM7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGFycmF5W2ldKSAhPSBudWxsICYmIGIgPj0gYikgeyBhID0gYyA9IGI7IGJyZWFrOyB9XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKChiID0gYXJyYXlbaV0pICE9IG51bGwpIHtcbiAgICAgICAgaWYgKGEgPiBiKSBhID0gYjtcbiAgICAgICAgaWYgKGMgPCBiKSBjID0gYjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBlbHNlIHtcbiAgICAgIHdoaWxlICgrK2kgPCBuKSBpZiAoKGIgPSBmLmNhbGwoYXJyYXksIGFycmF5W2ldLCBpKSkgIT0gbnVsbCAmJiBiID49IGIpIHsgYSA9IGMgPSBiOyBicmVhazsgfVxuICAgICAgd2hpbGUgKCsraSA8IG4pIGlmICgoYiA9IGYuY2FsbChhcnJheSwgYXJyYXlbaV0sIGkpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChhID4gYikgYSA9IGI7XG4gICAgICAgIGlmIChjIDwgYikgYyA9IGI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFthLCBjXTtcbiAgfVxuXG4gIHZhciBlbnRyaWVzID0gZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGVudHJpZXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWFwKSBlbnRyaWVzLnB1c2goe2tleToga2V5LCB2YWx1ZTogbWFwW2tleV19KTtcbiAgICByZXR1cm4gZW50cmllcztcbiAgfVxuXG4gIHZhciBkZXZpYXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHZhcmlhbmNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgcmV0dXJuIHYgPyBNYXRoLnNxcnQodikgOiB2O1xuICB9XG5cbiAgdmFyIGRlc2NlbmRpbmcgPSBmdW5jdGlvbihhLCBiKSB7XG4gICAgcmV0dXJuIGIgPCBhID8gLTEgOiBiID4gYSA/IDEgOiBiID49IGEgPyAwIDogTmFOO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNjZW5kaW5nQ29tcGFyYXRvcihmKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGQsIHgpIHtcbiAgICAgIHJldHVybiBhc2NlbmRpbmcoZihkKSwgeCk7XG4gICAgfTtcbiAgfVxuXG4gIHZhciBiaXNlY3RvciA9IGZ1bmN0aW9uKGNvbXBhcmUpIHtcbiAgICBpZiAoY29tcGFyZS5sZW5ndGggPT09IDEpIGNvbXBhcmUgPSBhc2NlbmRpbmdDb21wYXJhdG9yKGNvbXBhcmUpO1xuICAgIHJldHVybiB7XG4gICAgICBsZWZ0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBsbyA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgNCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpIDwgMCkgbG8gPSBtaWQgKyAxO1xuICAgICAgICAgIGVsc2UgaGkgPSBtaWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvO1xuICAgICAgfSxcbiAgICAgIHJpZ2h0OiBmdW5jdGlvbihhLCB4LCBsbywgaGkpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPCAzKSBsbyA9IDA7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgNCkgaGkgPSBhLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGxvIDwgaGkpIHtcbiAgICAgICAgICB2YXIgbWlkID0gbG8gKyBoaSA+Pj4gMTtcbiAgICAgICAgICBpZiAoY29tcGFyZShhW21pZF0sIHgpID4gMCkgaGkgPSBtaWQ7XG4gICAgICAgICAgZWxzZSBsbyA9IG1pZCArIDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxvO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgYXNjZW5kaW5nQmlzZWN0ID0gYmlzZWN0b3IoYXNjZW5kaW5nKTtcbiAgZXhwb3J0cy5iaXNlY3RSaWdodCA9IGFzY2VuZGluZ0Jpc2VjdC5yaWdodDtcbiAgZXhwb3J0cy5iaXNlY3RMZWZ0ID0gYXNjZW5kaW5nQmlzZWN0LmxlZnQ7XG4gIHZhciBiaXNlY3QgPSBleHBvcnRzLmJpc2VjdFJpZ2h0O1xuXG4gIGV4cG9ydHMuYXNjZW5kaW5nID0gYXNjZW5kaW5nO1xuICBleHBvcnRzLmJpc2VjdCA9IGJpc2VjdDtcbiAgZXhwb3J0cy5iaXNlY3RvciA9IGJpc2VjdG9yO1xuICBleHBvcnRzLmRlc2NlbmRpbmcgPSBkZXNjZW5kaW5nO1xuICBleHBvcnRzLmRldmlhdGlvbiA9IGRldmlhdGlvbjtcbiAgZXhwb3J0cy5lbnRyaWVzID0gZW50cmllcztcbiAgZXhwb3J0cy5leHRlbnQgPSBleHRlbnQ7XG4gIGV4cG9ydHMua2V5cyA9IGtleXM7XG4gIGV4cG9ydHMubWF4ID0gbWF4O1xuICBleHBvcnRzLm1lYW4gPSBtZWFuO1xuICBleHBvcnRzLm1lZGlhbiA9IG1lZGlhbjtcbiAgZXhwb3J0cy5tZXJnZSA9IG1lcmdlO1xuICBleHBvcnRzLm1pbiA9IG1pbjtcbiAgZXhwb3J0cy5uZXN0ID0gbmVzdDtcbiAgZXhwb3J0cy5wYWlycyA9IHBhaXJzO1xuICBleHBvcnRzLnBlcm11dGUgPSBwZXJtdXRlO1xuICBleHBvcnRzLnF1YW50aWxlID0gcXVhbnRpbGU7XG4gIGV4cG9ydHMucmFuZ2UgPSByYW5nZTtcbiAgZXhwb3J0cy5zaHVmZmxlID0gc2h1ZmZsZTtcbiAgZXhwb3J0cy5zdW0gPSBzdW07XG4gIGV4cG9ydHMudHJhbnNwb3NlID0gdHJhbnNwb3NlO1xuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcbiAgZXhwb3J0cy52YXJpYW5jZSA9IHZhcmlhbmNlO1xuICBleHBvcnRzLnppcCA9IHppcDtcblxufSkpOyIsImlmICh0eXBlb2YgTWFwID09PSBcInVuZGVmaW5lZFwiKSB7XG4gIE1hcCA9IGZ1bmN0aW9uKCkgeyB0aGlzLmNsZWFyKCk7IH07XG4gIE1hcC5wcm90b3R5cGUgPSB7XG4gICAgc2V0OiBmdW5jdGlvbihrLCB2KSB7IHRoaXMuX1trXSA9IHY7IHJldHVybiB0aGlzOyB9LFxuICAgIGdldDogZnVuY3Rpb24oaykgeyByZXR1cm4gdGhpcy5fW2tdOyB9LFxuICAgIGhhczogZnVuY3Rpb24oaykgeyByZXR1cm4gayBpbiB0aGlzLl87IH0sXG4gICAgZGVsZXRlOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXyAmJiBkZWxldGUgdGhpcy5fW2tdOyB9LFxuICAgIGNsZWFyOiBmdW5jdGlvbigpIHsgdGhpcy5fID0gT2JqZWN0LmNyZWF0ZShudWxsKTsgfSxcbiAgICBnZXQgc2l6ZSgpIHsgdmFyIG4gPSAwOyBmb3IgKHZhciBrIGluIHRoaXMuXykgKytuOyByZXR1cm4gbjsgfSxcbiAgICBmb3JFYWNoOiBmdW5jdGlvbihjKSB7IGZvciAodmFyIGsgaW4gdGhpcy5fKSBjKHRoaXMuX1trXSwgaywgdGhpcyk7IH1cbiAgfTtcbn0gZWxzZSAoZnVuY3Rpb24oKSB7XG4gIHZhciBtID0gbmV3IE1hcDtcbiAgaWYgKG0uc2V0KDAsIDApICE9PSBtKSB7XG4gICAgbSA9IG0uc2V0O1xuICAgIE1hcC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24oKSB7IG0uYXBwbHkodGhpcywgYXJndW1lbnRzKTsgcmV0dXJuIHRoaXM7IH07XG4gIH1cbn0pKCk7XG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuICB0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcbiAgZmFjdG9yeSgoZ2xvYmFsLmNvbG9yID0ge30pKTtcbn0odGhpcywgZnVuY3Rpb24gKGV4cG9ydHMpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIGRlbHRhSHVlKGgxLCBoMCkge1xuICAgIHZhciBkZWx0YSA9IGgxIC0gaDA7XG4gICAgcmV0dXJuIGRlbHRhID4gMTgwIHx8IGRlbHRhIDwgLTE4MFxuICAgICAgICA/IGRlbHRhIC0gMzYwICogTWF0aC5yb3VuZChkZWx0YSAvIDM2MClcbiAgICAgICAgOiBkZWx0YTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbG9yKCkge31cblxuICB2YXIgcmVIZXgzID0gL14jKFswLTlhLWZdezN9KSQvO1xuICB2YXIgcmVIZXg2ID0gL14jKFswLTlhLWZdezZ9KSQvO1xuICB2YXIgcmVSZ2JJbnRlZ2VyID0gL15yZ2JcXChcXHMqKFstK10/XFxkKylcXHMqLFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKlxcKSQvO1xuICB2YXIgcmVSZ2JQZXJjZW50ID0gL15yZ2JcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvO1xuICB2YXIgcmVIc2xQZXJjZW50ID0gL15oc2xcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPylcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqLFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KSVcXHMqXFwpJC87XG5cbiAgY29sb3IucHJvdG90eXBlID0gQ29sb3IucHJvdG90eXBlID0ge1xuICAgIGRpc3BsYXlhYmxlOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnJnYigpLmRpc3BsYXlhYmxlKCk7XG4gICAgfSxcbiAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZ2IoKSArIFwiXCI7XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICAgIHZhciBtO1xuICAgIGZvcm1hdCA9IChmb3JtYXQgKyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCByZ2IoKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHgwZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZikpKSAvLyAjZjAwXG4gICAgICAgIDogKG0gPSByZUhleDYuZXhlYyhmb3JtYXQpKSA/IHJnYm4ocGFyc2VJbnQobVsxXSwgMTYpKSAvLyAjZmYwMDAwXG4gICAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdLCBtWzJdLCBtWzNdKSAvLyByZ2IoMjU1LDAsMClcbiAgICAgICAgOiAobSA9IHJlUmdiUGVyY2VudC5leGVjKGZvcm1hdCkpID8gcmdiKG1bMV0gKiAyLjU1LCBtWzJdICogMi41NSwgbVszXSAqIDIuNTUpIC8vIHJnYigxMDAlLDAlLDAlKVxuICAgICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2wobVsxXSwgbVsyXSAqIC4wMSwgbVszXSAqIC4wMSkgLy8gaHNsKDEyMCw1MCUsNTAlKVxuICAgICAgICA6IG5hbWVkLmhhcyhmb3JtYXQpID8gcmdibihuYW1lZC5nZXQoZm9ybWF0KSlcbiAgICAgICAgOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdibihuKSB7XG4gICAgcmV0dXJuIHJnYihuID4+IDE2ICYgMHhmZiwgbiA+PiA4ICYgMHhmZiwgbiAmIDB4ZmYpO1xuICB9XG5cbiAgdmFyIG5hbWVkID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiYWxpY2VibHVlXCIsIDB4ZjBmOGZmKVxuICAgICAgLnNldChcImFudGlxdWV3aGl0ZVwiLCAweGZhZWJkNylcbiAgICAgIC5zZXQoXCJhcXVhXCIsIDB4MDBmZmZmKVxuICAgICAgLnNldChcImFxdWFtYXJpbmVcIiwgMHg3ZmZmZDQpXG4gICAgICAuc2V0KFwiYXp1cmVcIiwgMHhmMGZmZmYpXG4gICAgICAuc2V0KFwiYmVpZ2VcIiwgMHhmNWY1ZGMpXG4gICAgICAuc2V0KFwiYmlzcXVlXCIsIDB4ZmZlNGM0KVxuICAgICAgLnNldChcImJsYWNrXCIsIDB4MDAwMDAwKVxuICAgICAgLnNldChcImJsYW5jaGVkYWxtb25kXCIsIDB4ZmZlYmNkKVxuICAgICAgLnNldChcImJsdWVcIiwgMHgwMDAwZmYpXG4gICAgICAuc2V0KFwiYmx1ZXZpb2xldFwiLCAweDhhMmJlMilcbiAgICAgIC5zZXQoXCJicm93blwiLCAweGE1MmEyYSlcbiAgICAgIC5zZXQoXCJidXJseXdvb2RcIiwgMHhkZWI4ODcpXG4gICAgICAuc2V0KFwiY2FkZXRibHVlXCIsIDB4NWY5ZWEwKVxuICAgICAgLnNldChcImNoYXJ0cmV1c2VcIiwgMHg3ZmZmMDApXG4gICAgICAuc2V0KFwiY2hvY29sYXRlXCIsIDB4ZDI2OTFlKVxuICAgICAgLnNldChcImNvcmFsXCIsIDB4ZmY3ZjUwKVxuICAgICAgLnNldChcImNvcm5mbG93ZXJibHVlXCIsIDB4NjQ5NWVkKVxuICAgICAgLnNldChcImNvcm5zaWxrXCIsIDB4ZmZmOGRjKVxuICAgICAgLnNldChcImNyaW1zb25cIiwgMHhkYzE0M2MpXG4gICAgICAuc2V0KFwiY3lhblwiLCAweDAwZmZmZilcbiAgICAgIC5zZXQoXCJkYXJrYmx1ZVwiLCAweDAwMDA4YilcbiAgICAgIC5zZXQoXCJkYXJrY3lhblwiLCAweDAwOGI4YilcbiAgICAgIC5zZXQoXCJkYXJrZ29sZGVucm9kXCIsIDB4Yjg4NjBiKVxuICAgICAgLnNldChcImRhcmtncmF5XCIsIDB4YTlhOWE5KVxuICAgICAgLnNldChcImRhcmtncmVlblwiLCAweDAwNjQwMClcbiAgICAgIC5zZXQoXCJkYXJrZ3JleVwiLCAweGE5YTlhOSlcbiAgICAgIC5zZXQoXCJkYXJra2hha2lcIiwgMHhiZGI3NmIpXG4gICAgICAuc2V0KFwiZGFya21hZ2VudGFcIiwgMHg4YjAwOGIpXG4gICAgICAuc2V0KFwiZGFya29saXZlZ3JlZW5cIiwgMHg1NTZiMmYpXG4gICAgICAuc2V0KFwiZGFya29yYW5nZVwiLCAweGZmOGMwMClcbiAgICAgIC5zZXQoXCJkYXJrb3JjaGlkXCIsIDB4OTkzMmNjKVxuICAgICAgLnNldChcImRhcmtyZWRcIiwgMHg4YjAwMDApXG4gICAgICAuc2V0KFwiZGFya3NhbG1vblwiLCAweGU5OTY3YSlcbiAgICAgIC5zZXQoXCJkYXJrc2VhZ3JlZW5cIiwgMHg4ZmJjOGYpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlYmx1ZVwiLCAweDQ4M2Q4YilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVncmF5XCIsIDB4MmY0ZjRmKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWdyZXlcIiwgMHgyZjRmNGYpXG4gICAgICAuc2V0KFwiZGFya3R1cnF1b2lzZVwiLCAweDAwY2VkMSlcbiAgICAgIC5zZXQoXCJkYXJrdmlvbGV0XCIsIDB4OTQwMGQzKVxuICAgICAgLnNldChcImRlZXBwaW5rXCIsIDB4ZmYxNDkzKVxuICAgICAgLnNldChcImRlZXBza3libHVlXCIsIDB4MDBiZmZmKVxuICAgICAgLnNldChcImRpbWdyYXlcIiwgMHg2OTY5NjkpXG4gICAgICAuc2V0KFwiZGltZ3JleVwiLCAweDY5Njk2OSlcbiAgICAgIC5zZXQoXCJkb2RnZXJibHVlXCIsIDB4MWU5MGZmKVxuICAgICAgLnNldChcImZpcmVicmlja1wiLCAweGIyMjIyMilcbiAgICAgIC5zZXQoXCJmbG9yYWx3aGl0ZVwiLCAweGZmZmFmMClcbiAgICAgIC5zZXQoXCJmb3Jlc3RncmVlblwiLCAweDIyOGIyMilcbiAgICAgIC5zZXQoXCJmdWNoc2lhXCIsIDB4ZmYwMGZmKVxuICAgICAgLnNldChcImdhaW5zYm9yb1wiLCAweGRjZGNkYylcbiAgICAgIC5zZXQoXCJnaG9zdHdoaXRlXCIsIDB4ZjhmOGZmKVxuICAgICAgLnNldChcImdvbGRcIiwgMHhmZmQ3MDApXG4gICAgICAuc2V0KFwiZ29sZGVucm9kXCIsIDB4ZGFhNTIwKVxuICAgICAgLnNldChcImdyYXlcIiwgMHg4MDgwODApXG4gICAgICAuc2V0KFwiZ3JlZW5cIiwgMHgwMDgwMDApXG4gICAgICAuc2V0KFwiZ3JlZW55ZWxsb3dcIiwgMHhhZGZmMmYpXG4gICAgICAuc2V0KFwiZ3JleVwiLCAweDgwODA4MClcbiAgICAgIC5zZXQoXCJob25leWRld1wiLCAweGYwZmZmMClcbiAgICAgIC5zZXQoXCJob3RwaW5rXCIsIDB4ZmY2OWI0KVxuICAgICAgLnNldChcImluZGlhbnJlZFwiLCAweGNkNWM1YylcbiAgICAgIC5zZXQoXCJpbmRpZ29cIiwgMHg0YjAwODIpXG4gICAgICAuc2V0KFwiaXZvcnlcIiwgMHhmZmZmZjApXG4gICAgICAuc2V0KFwia2hha2lcIiwgMHhmMGU2OGMpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJcIiwgMHhlNmU2ZmEpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJibHVzaFwiLCAweGZmZjBmNSlcbiAgICAgIC5zZXQoXCJsYXduZ3JlZW5cIiwgMHg3Y2ZjMDApXG4gICAgICAuc2V0KFwibGVtb25jaGlmZm9uXCIsIDB4ZmZmYWNkKVxuICAgICAgLnNldChcImxpZ2h0Ymx1ZVwiLCAweGFkZDhlNilcbiAgICAgIC5zZXQoXCJsaWdodGNvcmFsXCIsIDB4ZjA4MDgwKVxuICAgICAgLnNldChcImxpZ2h0Y3lhblwiLCAweGUwZmZmZilcbiAgICAgIC5zZXQoXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiLCAweGZhZmFkMilcbiAgICAgIC5zZXQoXCJsaWdodGdyYXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRncmVlblwiLCAweDkwZWU5MClcbiAgICAgIC5zZXQoXCJsaWdodGdyZXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRwaW5rXCIsIDB4ZmZiNmMxKVxuICAgICAgLnNldChcImxpZ2h0c2FsbW9uXCIsIDB4ZmZhMDdhKVxuICAgICAgLnNldChcImxpZ2h0c2VhZ3JlZW5cIiwgMHgyMGIyYWEpXG4gICAgICAuc2V0KFwibGlnaHRza3libHVlXCIsIDB4ODdjZWZhKVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmF5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmV5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c3RlZWxibHVlXCIsIDB4YjBjNGRlKVxuICAgICAgLnNldChcImxpZ2h0eWVsbG93XCIsIDB4ZmZmZmUwKVxuICAgICAgLnNldChcImxpbWVcIiwgMHgwMGZmMDApXG4gICAgICAuc2V0KFwibGltZWdyZWVuXCIsIDB4MzJjZDMyKVxuICAgICAgLnNldChcImxpbmVuXCIsIDB4ZmFmMGU2KVxuICAgICAgLnNldChcIm1hZ2VudGFcIiwgMHhmZjAwZmYpXG4gICAgICAuc2V0KFwibWFyb29uXCIsIDB4ODAwMDAwKVxuICAgICAgLnNldChcIm1lZGl1bWFxdWFtYXJpbmVcIiwgMHg2NmNkYWEpXG4gICAgICAuc2V0KFwibWVkaXVtYmx1ZVwiLCAweDAwMDBjZClcbiAgICAgIC5zZXQoXCJtZWRpdW1vcmNoaWRcIiwgMHhiYTU1ZDMpXG4gICAgICAuc2V0KFwibWVkaXVtcHVycGxlXCIsIDB4OTM3MGRiKVxuICAgICAgLnNldChcIm1lZGl1bXNlYWdyZWVuXCIsIDB4M2NiMzcxKVxuICAgICAgLnNldChcIm1lZGl1bXNsYXRlYmx1ZVwiLCAweDdiNjhlZSlcbiAgICAgIC5zZXQoXCJtZWRpdW1zcHJpbmdncmVlblwiLCAweDAwZmE5YSlcbiAgICAgIC5zZXQoXCJtZWRpdW10dXJxdW9pc2VcIiwgMHg0OGQxY2MpXG4gICAgICAuc2V0KFwibWVkaXVtdmlvbGV0cmVkXCIsIDB4YzcxNTg1KVxuICAgICAgLnNldChcIm1pZG5pZ2h0Ymx1ZVwiLCAweDE5MTk3MClcbiAgICAgIC5zZXQoXCJtaW50Y3JlYW1cIiwgMHhmNWZmZmEpXG4gICAgICAuc2V0KFwibWlzdHlyb3NlXCIsIDB4ZmZlNGUxKVxuICAgICAgLnNldChcIm1vY2Nhc2luXCIsIDB4ZmZlNGI1KVxuICAgICAgLnNldChcIm5hdmFqb3doaXRlXCIsIDB4ZmZkZWFkKVxuICAgICAgLnNldChcIm5hdnlcIiwgMHgwMDAwODApXG4gICAgICAuc2V0KFwib2xkbGFjZVwiLCAweGZkZjVlNilcbiAgICAgIC5zZXQoXCJvbGl2ZVwiLCAweDgwODAwMClcbiAgICAgIC5zZXQoXCJvbGl2ZWRyYWJcIiwgMHg2YjhlMjMpXG4gICAgICAuc2V0KFwib3JhbmdlXCIsIDB4ZmZhNTAwKVxuICAgICAgLnNldChcIm9yYW5nZXJlZFwiLCAweGZmNDUwMClcbiAgICAgIC5zZXQoXCJvcmNoaWRcIiwgMHhkYTcwZDYpXG4gICAgICAuc2V0KFwicGFsZWdvbGRlbnJvZFwiLCAweGVlZThhYSlcbiAgICAgIC5zZXQoXCJwYWxlZ3JlZW5cIiwgMHg5OGZiOTgpXG4gICAgICAuc2V0KFwicGFsZXR1cnF1b2lzZVwiLCAweGFmZWVlZSlcbiAgICAgIC5zZXQoXCJwYWxldmlvbGV0cmVkXCIsIDB4ZGI3MDkzKVxuICAgICAgLnNldChcInBhcGF5YXdoaXBcIiwgMHhmZmVmZDUpXG4gICAgICAuc2V0KFwicGVhY2hwdWZmXCIsIDB4ZmZkYWI5KVxuICAgICAgLnNldChcInBlcnVcIiwgMHhjZDg1M2YpXG4gICAgICAuc2V0KFwicGlua1wiLCAweGZmYzBjYilcbiAgICAgIC5zZXQoXCJwbHVtXCIsIDB4ZGRhMGRkKVxuICAgICAgLnNldChcInBvd2RlcmJsdWVcIiwgMHhiMGUwZTYpXG4gICAgICAuc2V0KFwicHVycGxlXCIsIDB4ODAwMDgwKVxuICAgICAgLnNldChcInJlYmVjY2FwdXJwbGVcIiwgMHg2NjMzOTkpXG4gICAgICAuc2V0KFwicmVkXCIsIDB4ZmYwMDAwKVxuICAgICAgLnNldChcInJvc3licm93blwiLCAweGJjOGY4ZilcbiAgICAgIC5zZXQoXCJyb3lhbGJsdWVcIiwgMHg0MTY5ZTEpXG4gICAgICAuc2V0KFwic2FkZGxlYnJvd25cIiwgMHg4YjQ1MTMpXG4gICAgICAuc2V0KFwic2FsbW9uXCIsIDB4ZmE4MDcyKVxuICAgICAgLnNldChcInNhbmR5YnJvd25cIiwgMHhmNGE0NjApXG4gICAgICAuc2V0KFwic2VhZ3JlZW5cIiwgMHgyZThiNTcpXG4gICAgICAuc2V0KFwic2Vhc2hlbGxcIiwgMHhmZmY1ZWUpXG4gICAgICAuc2V0KFwic2llbm5hXCIsIDB4YTA1MjJkKVxuICAgICAgLnNldChcInNpbHZlclwiLCAweGMwYzBjMClcbiAgICAgIC5zZXQoXCJza3libHVlXCIsIDB4ODdjZWViKVxuICAgICAgLnNldChcInNsYXRlYmx1ZVwiLCAweDZhNWFjZClcbiAgICAgIC5zZXQoXCJzbGF0ZWdyYXlcIiwgMHg3MDgwOTApXG4gICAgICAuc2V0KFwic2xhdGVncmV5XCIsIDB4NzA4MDkwKVxuICAgICAgLnNldChcInNub3dcIiwgMHhmZmZhZmEpXG4gICAgICAuc2V0KFwic3ByaW5nZ3JlZW5cIiwgMHgwMGZmN2YpXG4gICAgICAuc2V0KFwic3RlZWxibHVlXCIsIDB4NDY4MmI0KVxuICAgICAgLnNldChcInRhblwiLCAweGQyYjQ4YylcbiAgICAgIC5zZXQoXCJ0ZWFsXCIsIDB4MDA4MDgwKVxuICAgICAgLnNldChcInRoaXN0bGVcIiwgMHhkOGJmZDgpXG4gICAgICAuc2V0KFwidG9tYXRvXCIsIDB4ZmY2MzQ3KVxuICAgICAgLnNldChcInR1cnF1b2lzZVwiLCAweDQwZTBkMClcbiAgICAgIC5zZXQoXCJ2aW9sZXRcIiwgMHhlZTgyZWUpXG4gICAgICAuc2V0KFwid2hlYXRcIiwgMHhmNWRlYjMpXG4gICAgICAuc2V0KFwid2hpdGVcIiwgMHhmZmZmZmYpXG4gICAgICAuc2V0KFwid2hpdGVzbW9rZVwiLCAweGY1ZjVmNSlcbiAgICAgIC5zZXQoXCJ5ZWxsb3dcIiwgMHhmZmZmMDApXG4gICAgICAuc2V0KFwieWVsbG93Z3JlZW5cIiwgMHg5YWNkMzIpO1xuXG4gIHZhciBkYXJrZXIgPSAuNztcbiAgdmFyIGJyaWdodGVyID0gMSAvIGRhcmtlcjtcblxuICBmdW5jdGlvbiByZ2IociwgZywgYikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoIShyIGluc3RhbmNlb2YgQ29sb3IpKSByID0gY29sb3Iocik7XG4gICAgICBpZiAocikge1xuICAgICAgICByID0gci5yZ2IoKTtcbiAgICAgICAgYiA9IHIuYjtcbiAgICAgICAgZyA9IHIuZztcbiAgICAgICAgciA9IHIucjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHIgPSBnID0gYiA9IE5hTjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSZ2IociwgZywgYik7XG4gIH1cblxuICBmdW5jdGlvbiBSZ2IociwgZywgYikge1xuICAgIHRoaXMuciA9ICtyO1xuICAgIHRoaXMuZyA9ICtnO1xuICAgIHRoaXMuYiA9ICtiO1xuICB9XG5cbiAgdmFyIF9wcm90b3R5cGUgPSByZ2IucHJvdG90eXBlID0gUmdiLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrKTtcbiAgfTtcblxuICBfcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IFJnYih0aGlzLnIgKiBrLCB0aGlzLmcgKiBrLCB0aGlzLmIgKiBrKTtcbiAgfTtcblxuICBfcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIF9wcm90b3R5cGUuZGlzcGxheWFibGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKDAgPD0gdGhpcy5yICYmIHRoaXMuciA8PSAyNTUpXG4gICAgICAgICYmICgwIDw9IHRoaXMuZyAmJiB0aGlzLmcgPD0gMjU1KVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmIgJiYgdGhpcy5iIDw9IDI1NSk7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBmb3JtYXQodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gIH07XG5cbiAgZnVuY3Rpb24gZm9ybWF0KHIsIGcsIGIpIHtcbiAgICByZXR1cm4gXCIjXCJcbiAgICAgICAgKyAoaXNOYU4ocikgPyBcIjAwXCIgOiAociA9IE1hdGgucm91bmQocikpIDwgMTYgPyBcIjBcIiArIE1hdGgubWF4KDAsIHIpLnRvU3RyaW5nKDE2KSA6IE1hdGgubWluKDI1NSwgcikudG9TdHJpbmcoMTYpKVxuICAgICAgICArIChpc05hTihnKSA/IFwiMDBcIiA6IChnID0gTWF0aC5yb3VuZChnKSkgPCAxNiA/IFwiMFwiICsgTWF0aC5tYXgoMCwgZykudG9TdHJpbmcoMTYpIDogTWF0aC5taW4oMjU1LCBnKS50b1N0cmluZygxNikpXG4gICAgICAgICsgKGlzTmFOKGIpID8gXCIwMFwiIDogKGIgPSBNYXRoLnJvdW5kKGIpKSA8IDE2ID8gXCIwXCIgKyBNYXRoLm1heCgwLCBiKS50b1N0cmluZygxNikgOiBNYXRoLm1pbigyNTUsIGIpLnRvU3RyaW5nKDE2KSk7XG4gIH1cblxuICBmdW5jdGlvbiBoc2woaCwgcywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEhzbCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBzID0gaC5zO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIENvbG9yKSkgaCA9IGNvbG9yKGgpO1xuICAgICAgICBpZiAoaCkge1xuICAgICAgICAgIGlmIChoIGluc3RhbmNlb2YgSHNsKSByZXR1cm4gaDtcbiAgICAgICAgICBoID0gaC5yZ2IoKTtcbiAgICAgICAgICB2YXIgciA9IGguciAvIDI1NSxcbiAgICAgICAgICAgICAgZyA9IGguZyAvIDI1NSxcbiAgICAgICAgICAgICAgYiA9IGguYiAvIDI1NSxcbiAgICAgICAgICAgICAgbWluID0gTWF0aC5taW4ociwgZywgYiksXG4gICAgICAgICAgICAgIG1heCA9IE1hdGgubWF4KHIsIGcsIGIpLFxuICAgICAgICAgICAgICByYW5nZSA9IG1heCAtIG1pbjtcbiAgICAgICAgICBsID0gKG1heCArIG1pbikgLyAyO1xuICAgICAgICAgIGlmIChyYW5nZSkge1xuICAgICAgICAgICAgcyA9IGwgPCAuNSA/IHJhbmdlIC8gKG1heCArIG1pbikgOiByYW5nZSAvICgyIC0gbWF4IC0gbWluKTtcbiAgICAgICAgICAgIGlmIChyID09PSBtYXgpIGggPSAoZyAtIGIpIC8gcmFuZ2UgKyAoZyA8IGIpICogNjtcbiAgICAgICAgICAgIGVsc2UgaWYgKGcgPT09IG1heCkgaCA9IChiIC0gcikgLyByYW5nZSArIDI7XG4gICAgICAgICAgICBlbHNlIGggPSAociAtIGcpIC8gcmFuZ2UgKyA0O1xuICAgICAgICAgICAgaCAqPSA2MDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaCA9IE5hTjtcbiAgICAgICAgICAgIHMgPSBsID4gMCAmJiBsIDwgMSA/IDAgOiBoO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBoID0gcyA9IGwgPSBOYU47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIc2woaCwgcywgbCk7XG4gIH1cblxuICBmdW5jdGlvbiBIc2woaCwgcywgbCkge1xuICAgIHRoaXMuaCA9ICtoO1xuICAgIHRoaXMucyA9ICtzO1xuICAgIHRoaXMubCA9ICtsO1xuICB9XG5cbiAgdmFyIF9fcHJvdG90eXBlID0gaHNsLnByb3RvdHlwZSA9IEhzbC5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgX19wcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGJyaWdodGVyIDogTWF0aC5wb3coYnJpZ2h0ZXIsIGspO1xuICAgIHJldHVybiBuZXcgSHNsKHRoaXMuaCwgdGhpcy5zLCB0aGlzLmwgKiBrKTtcbiAgfTtcblxuICBfX3Byb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBIc2wodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIF9fcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoID0gdGhpcy5oICUgMzYwICsgKHRoaXMuaCA8IDApICogMzYwLFxuICAgICAgICBzID0gaXNOYU4oaCkgfHwgaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMsXG4gICAgICAgIGwgPSB0aGlzLmwsXG4gICAgICAgIG0yID0gbCArIChsIDwgLjUgPyBsIDogMSAtIGwpICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMilcbiAgICApO1xuICB9O1xuXG4gIF9fcHJvdG90eXBlLmRpc3BsYXlhYmxlID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDw9IHRoaXMucyAmJiB0aGlzLnMgPD0gMSB8fCBpc05hTih0aGlzLnMpKVxuICAgICAgICAmJiAoMCA8PSB0aGlzLmwgJiYgdGhpcy5sIDw9IDEpO1xuICB9O1xuXG4gIC8qIEZyb20gRnZEIDEzLjM3LCBDU1MgQ29sb3IgTW9kdWxlIExldmVsIDMgKi9cbiAgZnVuY3Rpb24gaHNsMnJnYihoLCBtMSwgbTIpIHtcbiAgICByZXR1cm4gKGggPCA2MCA/IG0xICsgKG0yIC0gbTEpICogaCAvIDYwXG4gICAgICAgIDogaCA8IDE4MCA/IG0yXG4gICAgICAgIDogaCA8IDI0MCA/IG0xICsgKG0yIC0gbTEpICogKDI0MCAtIGgpIC8gNjBcbiAgICAgICAgOiBtMSkgKiAyNTU7XG4gIH1cblxuICB2YXIgS24gPSAxODtcblxuICB2YXIgWG4gPSAwLjk1MDQ3MDtcbiAgdmFyIFluID0gMTtcbiAgdmFyIFpuID0gMS4wODg4MzA7XG4gIHZhciB0MCA9IDQgLyAyOTtcbiAgdmFyIHQxID0gNiAvIDI5O1xuICB2YXIgdDIgPSAzICogdDEgKiB0MTtcbiAgdmFyIHQzID0gdDEgKiB0MSAqIHQxO1xuXG4gIGZ1bmN0aW9uIGxhYihsLCBhLCBiKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChsIGluc3RhbmNlb2YgTGFiKSB7XG4gICAgICAgIGIgPSBsLmI7XG4gICAgICAgIGEgPSBsLmE7XG4gICAgICAgIGwgPSBsLmw7XG4gICAgICB9IGVsc2UgaWYgKGwgaW5zdGFuY2VvZiBIY2wpIHtcbiAgICAgICAgdmFyIGggPSBsLmggKiBkZWcycmFkO1xuICAgICAgICBiID0gTWF0aC5zaW4oaCkgKiBsLmM7XG4gICAgICAgIGEgPSBNYXRoLmNvcyhoKSAqIGwuYztcbiAgICAgICAgbCA9IGwubDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGwgaW5zdGFuY2VvZiBSZ2IpKSBsID0gcmdiKGwpO1xuICAgICAgICB2YXIgciA9IHJnYjJ4eXoobC5yKSxcbiAgICAgICAgICAgIGcgPSByZ2IyeHl6KGwuZyksXG4gICAgICAgICAgICBiID0gcmdiMnh5eihsLmIpLFxuICAgICAgICAgICAgeCA9IHh5ejJsYWIoKDAuNDEyNDU2NCAqIHIgKyAwLjM1NzU3NjEgKiBnICsgMC4xODA0Mzc1ICogYikgLyBYbiksXG4gICAgICAgICAgICB5ID0geHl6MmxhYigoMC4yMTI2NzI5ICogciArIDAuNzE1MTUyMiAqIGcgKyAwLjA3MjE3NTAgKiBiKSAvIFluKSxcbiAgICAgICAgICAgIHogPSB4eXoybGFiKCgwLjAxOTMzMzkgKiByICsgMC4xMTkxOTIwICogZyArIDAuOTUwMzA0MSAqIGIpIC8gWm4pO1xuICAgICAgICBiID0gMjAwICogKHkgLSB6KTtcbiAgICAgICAgYSA9IDUwMCAqICh4IC0geSk7XG4gICAgICAgIGwgPSAxMTYgKiB5IC0gMTY7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgTGFiKGwsIGEsIGIpO1xuICB9XG5cbiAgZnVuY3Rpb24gTGFiKGwsIGEsIGIpIHtcbiAgICB0aGlzLmwgPSArbDtcbiAgICB0aGlzLmEgPSArYTtcbiAgICB0aGlzLmIgPSArYjtcbiAgfVxuXG4gIHZhciBfX19wcm90b3R5cGUgPSBsYWIucHJvdG90eXBlID0gTGFiLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfX19wcm90b3R5cGUuYnJpZ2h0ZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgcmV0dXJuIG5ldyBMYWIodGhpcy5sICsgS24gKiAoayA9PSBudWxsID8gMSA6IGspLCB0aGlzLmEsIHRoaXMuYik7XG4gIH07XG5cbiAgX19fcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICByZXR1cm4gbmV3IExhYih0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogayksIHRoaXMuYSwgdGhpcy5iKTtcbiAgfTtcblxuICBfX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHkgPSAodGhpcy5sICsgMTYpIC8gMTE2LFxuICAgICAgICB4ID0gaXNOYU4odGhpcy5hKSA/IHkgOiB5ICsgdGhpcy5hIC8gNTAwLFxuICAgICAgICB6ID0gaXNOYU4odGhpcy5iKSA/IHkgOiB5IC0gdGhpcy5iIC8gMjAwO1xuICAgIHkgPSBZbiAqIGxhYjJ4eXooeSk7XG4gICAgeCA9IFhuICogbGFiMnh5eih4KTtcbiAgICB6ID0gWm4gKiBsYWIyeHl6KHopO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgeHl6MnJnYiggMy4yNDA0NTQyICogeCAtIDEuNTM3MTM4NSAqIHkgLSAwLjQ5ODUzMTQgKiB6KSwgLy8gRDY1IC0+IHNSR0JcbiAgICAgIHh5ejJyZ2IoLTAuOTY5MjY2MCAqIHggKyAxLjg3NjAxMDggKiB5ICsgMC4wNDE1NTYwICogeiksXG4gICAgICB4eXoycmdiKCAwLjA1NTY0MzQgKiB4IC0gMC4yMDQwMjU5ICogeSArIDEuMDU3MjI1MiAqIHopXG4gICAgKTtcbiAgfTtcblxuICBmdW5jdGlvbiB4eXoybGFiKHQpIHtcbiAgICByZXR1cm4gdCA+IHQzID8gTWF0aC5wb3codCwgMSAvIDMpIDogdCAvIHQyICsgdDA7XG4gIH1cblxuICBmdW5jdGlvbiBsYWIyeHl6KHQpIHtcbiAgICByZXR1cm4gdCA+IHQxID8gdCAqIHQgKiB0IDogdDIgKiAodCAtIHQwKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHh5ejJyZ2IoeCkge1xuICAgIHJldHVybiAyNTUgKiAoeCA8PSAwLjAwMzEzMDggPyAxMi45MiAqIHggOiAxLjA1NSAqIE1hdGgucG93KHgsIDEgLyAyLjQpIC0gMC4wNTUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdiMnh5eih4KSB7XG4gICAgcmV0dXJuICh4IC89IDI1NSkgPD0gMC4wNDA0NSA/IHggLyAxMi45MiA6IE1hdGgucG93KCh4ICsgMC4wNTUpIC8gMS4wNTUsIDIuNCk7XG4gIH1cblxuICB2YXIgZGVnMnJhZCA9IE1hdGguUEkgLyAxODA7XG4gIHZhciByYWQyZGVnID0gMTgwIC8gTWF0aC5QSTtcblxuICBmdW5jdGlvbiBoY2woaCwgYywgbCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoaCBpbnN0YW5jZW9mIEhjbCkge1xuICAgICAgICBsID0gaC5sO1xuICAgICAgICBjID0gaC5jO1xuICAgICAgICBoID0gaC5oO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCEoaCBpbnN0YW5jZW9mIExhYikpIGggPSBsYWIoaCk7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIGMgPSBNYXRoLnNxcnQoaC5hICogaC5hICsgaC5iICogaC5iKTtcbiAgICAgICAgaCA9IE1hdGguYXRhbjIoaC5iLCBoLmEpICogcmFkMmRlZztcbiAgICAgICAgaWYgKGggPCAwKSBoICs9IDM2MDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBIY2woaCwgYywgbCk7XG4gIH1cblxuICBmdW5jdGlvbiBIY2woaCwgYywgbCkge1xuICAgIHRoaXMuaCA9ICtoO1xuICAgIHRoaXMuYyA9ICtjO1xuICAgIHRoaXMubCA9ICtsO1xuICB9XG5cbiAgdmFyIF9fX19wcm90b3R5cGUgPSBoY2wucHJvdG90eXBlID0gSGNsLnByb3RvdHlwZSA9IG5ldyBDb2xvcjtcblxuICBfX19fcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgKyBLbiAqIChrID09IG51bGwgPyAxIDogaykpO1xuICB9O1xuXG4gIF9fX19wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIHJldHVybiBuZXcgSGNsKHRoaXMuaCwgdGhpcy5jLCB0aGlzLmwgLSBLbiAqIChrID09IG51bGwgPyAxIDogaykpO1xuICB9O1xuXG4gIF9fX19wcm90b3R5cGUucmdiID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGxhYih0aGlzKS5yZ2IoKTtcbiAgfTtcblxuICB2YXIgQSA9IC0wLjE0ODYxO1xuICB2YXIgQiA9ICsxLjc4Mjc3O1xuICB2YXIgQyA9IC0wLjI5MjI3O1xuICB2YXIgRCA9IC0wLjkwNjQ5O1xuICB2YXIgRSA9ICsxLjk3Mjk0O1xuICB2YXIgRUQgPSBFICogRDtcbiAgdmFyIEVCID0gRSAqIEI7XG4gIHZhciBCQ19EQSA9IEIgKiBDIC0gRCAqIEE7XG5cbiAgZnVuY3Rpb24gY3ViZWhlbGl4KGgsIHMsIGwpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKGggaW5zdGFuY2VvZiBDdWJlaGVsaXgpIHtcbiAgICAgICAgbCA9IGgubDtcbiAgICAgICAgcyA9IGgucztcbiAgICAgICAgaCA9IGguaDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghKGggaW5zdGFuY2VvZiBSZ2IpKSBoID0gcmdiKGgpO1xuICAgICAgICB2YXIgciA9IGguciAvIDI1NSwgZyA9IGguZyAvIDI1NSwgYiA9IGguYiAvIDI1NTtcbiAgICAgICAgbCA9IChCQ19EQSAqIGIgKyBFRCAqIHIgLSBFQiAqIGcpIC8gKEJDX0RBICsgRUQgLSBFQik7XG4gICAgICAgIHZhciBibCA9IGIgLSBsLCBrID0gKEUgKiAoZyAtIGwpIC0gQyAqIGJsKSAvIEQ7XG4gICAgICAgIHMgPSBNYXRoLnNxcnQoayAqIGsgKyBibCAqIGJsKSAvIChFICogbCAqICgxIC0gbCkpOyAvLyBOYU4gaWYgbD0wIG9yIGw9MVxuICAgICAgICBoID0gcyA/IE1hdGguYXRhbjIoaywgYmwpICogcmFkMmRlZyAtIDEyMCA6IE5hTjtcbiAgICAgICAgaWYgKGggPCAwKSBoICs9IDM2MDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgoaCwgcywgbCk7XG4gIH1cblxuICBmdW5jdGlvbiBDdWJlaGVsaXgoaCwgcywgbCkge1xuICAgIHRoaXMuaCA9ICtoO1xuICAgIHRoaXMucyA9ICtzO1xuICAgIHRoaXMubCA9ICtsO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IGN1YmVoZWxpeC5wcm90b3R5cGUgPSBDdWJlaGVsaXgucHJvdG90eXBlID0gbmV3IENvbG9yO1xuXG4gIHByb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIHByb3RvdHlwZS5kYXJrZXIgPSBmdW5jdGlvbihrKSB7XG4gICAgayA9IGsgPT0gbnVsbCA/IGRhcmtlciA6IE1hdGgucG93KGRhcmtlciwgayk7XG4gICAgcmV0dXJuIG5ldyBDdWJlaGVsaXgodGhpcy5oLCB0aGlzLnMsIHRoaXMubCAqIGspO1xuICB9O1xuXG4gIHByb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaCA9IGlzTmFOKHRoaXMuaCkgPyAwIDogKHRoaXMuaCArIDEyMCkgKiBkZWcycmFkLFxuICAgICAgICBsID0gK3RoaXMubCxcbiAgICAgICAgYSA9IGlzTmFOKHRoaXMucykgPyAwIDogdGhpcy5zICogbCAqICgxIC0gbCksXG4gICAgICAgIGNvc2ggPSBNYXRoLmNvcyhoKSxcbiAgICAgICAgc2luaCA9IE1hdGguc2luKGgpO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgMjU1ICogKGwgKyBhICogKEEgKiBjb3NoICsgQiAqIHNpbmgpKSxcbiAgICAgIDI1NSAqIChsICsgYSAqIChDICogY29zaCArIEQgKiBzaW5oKSksXG4gICAgICAyNTUgKiAobCArIGEgKiAoRSAqIGNvc2gpKVxuICAgICk7XG4gIH07XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYShnYW1tYSkge1xuICAgIHJldHVybiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICBhID0gY3ViZWhlbGl4KGEpO1xuICAgICAgYiA9IGN1YmVoZWxpeChiKTtcbiAgICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgICAgYXMgPSBpc05hTihhLnMpID8gYi5zIDogYS5zLFxuICAgICAgICAgIGFsID0gYS5sLFxuICAgICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBkZWx0YUh1ZShiLmgsIGFoKSxcbiAgICAgICAgICBicyA9IGlzTmFOKGIucykgPyAwIDogYi5zIC0gYXMsXG4gICAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgICBhLnMgPSBhcyArIGJzICogdDtcbiAgICAgICAgYS5sID0gYWwgKyBibCAqIE1hdGgucG93KHQsIGdhbW1hKTtcbiAgICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgICAgfTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYUxvbmcoZ2FtbWEpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oYSwgYikge1xuICAgICAgYSA9IGN1YmVoZWxpeChhKTtcbiAgICAgIGIgPSBjdWJlaGVsaXgoYik7XG4gICAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICAgIGFzID0gaXNOYU4oYS5zKSA/IGIucyA6IGEucyxcbiAgICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogYi5oIC0gYWgsXG4gICAgICAgICAgYnMgPSBpc05hTihiLnMpID8gMCA6IGIucyAtIGFzLFxuICAgICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgICAgYS5zID0gYXMgKyBicyAqIHQ7XG4gICAgICAgIGEubCA9IGFsICsgYmwgKiBNYXRoLnBvdyh0LCBnYW1tYSk7XG4gICAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICAgIH07XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlSGNsTG9uZyhhLCBiKSB7XG4gICAgYSA9IGhjbChhKTtcbiAgICBiID0gaGNsKGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFjID0gaXNOYU4oYS5jKSA/IGIuYyA6IGEuYyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBiLmggLSBhaCxcbiAgICAgICAgYmMgPSBpc05hTihiLmMpID8gMCA6IGIuYyAtIGFjLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEuYyA9IGFjICsgYmMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlSGNsKGEsIGIpIHtcbiAgICBhID0gaGNsKGEpO1xuICAgIGIgPSBoY2woYik7XG4gICAgdmFyIGFoID0gaXNOYU4oYS5oKSA/IGIuaCA6IGEuaCxcbiAgICAgICAgYWMgPSBpc05hTihhLmMpID8gYi5jIDogYS5jLFxuICAgICAgICBhbCA9IGEubCxcbiAgICAgICAgYmggPSBpc05hTihiLmgpID8gMCA6IGRlbHRhSHVlKGIuaCwgYWgpLFxuICAgICAgICBiYyA9IGlzTmFOKGIuYykgPyAwIDogYi5jIC0gYWMsXG4gICAgICAgIGJsID0gYi5sIC0gYWw7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIGEuaCA9IGFoICsgYmggKiB0O1xuICAgICAgYS5jID0gYWMgKyBiYyAqIHQ7XG4gICAgICBhLmwgPSBhbCArIGJsICogdDtcbiAgICAgIHJldHVybiBhICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVMYWIoYSwgYikge1xuICAgIGEgPSBsYWIoYSk7XG4gICAgYiA9IGxhYihiKTtcbiAgICB2YXIgYWwgPSBhLmwsXG4gICAgICAgIGFhID0gYS5hLFxuICAgICAgICBhYiA9IGEuYixcbiAgICAgICAgYmwgPSBiLmwgLSBhbCxcbiAgICAgICAgYmEgPSBiLmEgLSBhYSxcbiAgICAgICAgYmIgPSBiLmIgLSBhYjtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICBhLmEgPSBhYSArIGJhICogdDtcbiAgICAgIGEuYiA9IGFiICsgYmIgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUhzbExvbmcoYSwgYikge1xuICAgIGEgPSBoc2woYSk7XG4gICAgYiA9IGhzbChiKTtcbiAgICB2YXIgYWggPSBpc05hTihhLmgpID8gYi5oIDogYS5oLFxuICAgICAgICBhcyA9IGlzTmFOKGEucykgPyBiLnMgOiBhLnMsXG4gICAgICAgIGFsID0gYS5sLFxuICAgICAgICBiaCA9IGlzTmFOKGIuaCkgPyAwIDogYi5oIC0gYWgsXG4gICAgICAgIGJzID0gaXNOYU4oYi5zKSA/IDAgOiBiLnMgLSBhcyxcbiAgICAgICAgYmwgPSBiLmwgLSBhbDtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgYS5oID0gYWggKyBiaCAqIHQ7XG4gICAgICBhLnMgPSBhcyArIGJzICogdDtcbiAgICAgIGEubCA9IGFsICsgYmwgKiB0O1xuICAgICAgcmV0dXJuIGEgKyBcIlwiO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUhzbChhLCBiKSB7XG4gICAgYSA9IGhzbChhKTtcbiAgICBiID0gaHNsKGIpO1xuICAgIHZhciBhaCA9IGlzTmFOKGEuaCkgPyBiLmggOiBhLmgsXG4gICAgICAgIGFzID0gaXNOYU4oYS5zKSA/IGIucyA6IGEucyxcbiAgICAgICAgYWwgPSBhLmwsXG4gICAgICAgIGJoID0gaXNOYU4oYi5oKSA/IDAgOiBkZWx0YUh1ZShiLmgsIGFoKSxcbiAgICAgICAgYnMgPSBpc05hTihiLnMpID8gMCA6IGIucyAtIGFzLFxuICAgICAgICBibCA9IGIubCAtIGFsO1xuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBhLmggPSBhaCArIGJoICogdDtcbiAgICAgIGEucyA9IGFzICsgYnMgKiB0O1xuICAgICAgYS5sID0gYWwgKyBibCAqIHQ7XG4gICAgICByZXR1cm4gYSArIFwiXCI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlUmdiKGEsIGIpIHtcbiAgICBhID0gcmdiKGEpO1xuICAgIGIgPSByZ2IoYik7XG4gICAgdmFyIGFyID0gYS5yLFxuICAgICAgICBhZyA9IGEuZyxcbiAgICAgICAgYWIgPSBhLmIsXG4gICAgICAgIGJyID0gYi5yIC0gYXIsXG4gICAgICAgIGJnID0gYi5nIC0gYWcsXG4gICAgICAgIGJiID0gYi5iIC0gYWI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBmb3JtYXQoTWF0aC5yb3VuZChhciArIGJyICogdCksIE1hdGgucm91bmQoYWcgKyBiZyAqIHQpLCBNYXRoLnJvdW5kKGFiICsgYmIgKiB0KSk7XG4gICAgfTtcbiAgfVxuXG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVDdWJlaGVsaXggPSBpbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hKDEpO1xuICBleHBvcnRzLmludGVycG9sYXRlQ3ViZWhlbGl4TG9uZyA9IGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWFMb25nKDEpO1xuXG4gIGV4cG9ydHMuY29sb3IgPSBjb2xvcjtcbiAgZXhwb3J0cy5yZ2IgPSByZ2I7XG4gIGV4cG9ydHMuaHNsID0gaHNsO1xuICBleHBvcnRzLmxhYiA9IGxhYjtcbiAgZXhwb3J0cy5oY2wgPSBoY2w7XG4gIGV4cG9ydHMuY3ViZWhlbGl4ID0gY3ViZWhlbGl4O1xuICBleHBvcnRzLmludGVycG9sYXRlUmdiID0gaW50ZXJwb2xhdGVSZ2I7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVIc2wgPSBpbnRlcnBvbGF0ZUhzbDtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhzbExvbmcgPSBpbnRlcnBvbGF0ZUhzbExvbmc7XG4gIGV4cG9ydHMuaW50ZXJwb2xhdGVMYWIgPSBpbnRlcnBvbGF0ZUxhYjtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUhjbCA9IGludGVycG9sYXRlSGNsO1xuICBleHBvcnRzLmludGVycG9sYXRlSGNsTG9uZyA9IGludGVycG9sYXRlSGNsTG9uZztcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hID0gaW50ZXJwb2xhdGVDdWJlaGVsaXhHYW1tYTtcbiAgZXhwb3J0cy5pbnRlcnBvbGF0ZUN1YmVoZWxpeEdhbW1hTG9uZyA9IGludGVycG9sYXRlQ3ViZWhlbGl4R2FtbWFMb25nO1xuXG59KSk7IiwiaWYgKHR5cGVvZiBNYXAgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgTWFwID0gZnVuY3Rpb24oKSB7IHRoaXMuY2xlYXIoKTsgfTtcbiAgTWFwLnByb3RvdHlwZSA9IHtcbiAgICBzZXQ6IGZ1bmN0aW9uKGssIHYpIHsgdGhpcy5fW2tdID0gdjsgcmV0dXJuIHRoaXM7IH0sXG4gICAgZ2V0OiBmdW5jdGlvbihrKSB7IHJldHVybiB0aGlzLl9ba107IH0sXG4gICAgaGFzOiBmdW5jdGlvbihrKSB7IHJldHVybiBrIGluIHRoaXMuXzsgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKGspIHsgcmV0dXJuIGsgaW4gdGhpcy5fICYmIGRlbGV0ZSB0aGlzLl9ba107IH0sXG4gICAgY2xlYXI6IGZ1bmN0aW9uKCkgeyB0aGlzLl8gPSBPYmplY3QuY3JlYXRlKG51bGwpOyB9LFxuICAgIGdldCBzaXplKCkgeyB2YXIgbiA9IDA7IGZvciAodmFyIGsgaW4gdGhpcy5fKSArK247IHJldHVybiBuOyB9LFxuICAgIGZvckVhY2g6IGZ1bmN0aW9uKGMpIHsgZm9yICh2YXIgayBpbiB0aGlzLl8pIGModGhpcy5fW2tdLCBrLCB0aGlzKTsgfVxuICB9O1xufSBlbHNlIChmdW5jdGlvbigpIHtcbiAgdmFyIG0gPSBuZXcgTWFwO1xuICBpZiAobS5zZXQoMCwgMCkgIT09IG0pIHtcbiAgICBtID0gbS5zZXQ7XG4gICAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbigpIHsgbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyByZXR1cm4gdGhpczsgfTtcbiAgfVxufSkoKTtcblxuKGZ1bmN0aW9uIChnbG9iYWwsIGZhY3RvcnkpIHtcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gZmFjdG9yeShleHBvcnRzKSA6XG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShbJ2V4cG9ydHMnXSwgZmFjdG9yeSkgOlxuICBmYWN0b3J5KChnbG9iYWwuc2NhbGUgPSB7fSkpO1xufSh0aGlzLCBmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbiAgZnVuY3Rpb24gdXRjRGF0ZShkKSB7XG4gICAgaWYgKDAgPD0gZC55ICYmIGQueSA8IDEwMCkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygtMSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCkpO1xuICAgICAgZGF0ZS5zZXRVVENGdWxsWWVhcihkLnkpO1xuICAgICAgcmV0dXJuIGRhdGU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRGF0ZShEYXRlLlVUQyhkLnksIGQubSwgZC5kLCBkLkgsIGQuTSwgZC5TLCBkLkwpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvY2FsRGF0ZShkKSB7XG4gICAgaWYgKDAgPD0gZC55ICYmIGQueSA8IDEwMCkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSgtMSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCk7XG4gICAgICBkYXRlLnNldEZ1bGxZZWFyKGQueSk7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEYXRlKGQueSwgZC5tLCBkLmQsIGQuSCwgZC5NLCBkLlMsIGQuTCk7XG4gIH1cblxuICB2YXIgcGFkcyA9IHtcIi1cIjogXCJcIiwgXCJfXCI6IFwiIFwiLCBcIjBcIjogXCIwXCJ9O1xuXG4gIGZ1bmN0aW9uIG5ld1llYXIoeSkge1xuICAgIHJldHVybiB7eTogeSwgbTogMCwgZDogMSwgSDogMCwgTTogMCwgUzogMCwgTDogMH07XG4gIH1cblxuICB2YXIgcGVyY2VudFJlID0gL14lLztcblxuICBmdW5jdGlvbiBwYXJzZUxpdGVyYWxQZXJjZW50KGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gcGVyY2VudFJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAxKSk7XG4gICAgcmV0dXJuIG4gPyBpICsgblswXS5sZW5ndGggOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlWm9uZShkLCBzdHJpbmcsIGkpIHtcbiAgICByZXR1cm4gL15bKy1dXFxkezR9JC8udGVzdChzdHJpbmcgPSBzdHJpbmcuc2xpY2UoaSwgaSArIDUpKVxuICAgICAgICA/IChkLlogPSAtc3RyaW5nLCBpICsgNSkgLy8gc2lnbiBkaWZmZXJzIGZyb20gZ2V0VGltZXpvbmVPZmZzZXQhXG4gICAgICAgIDogLTE7XG4gIH1cblxuICB2YXIgbnVtYmVyUmUgPSAvXlxccypcXGQrLztcblxuICBmdW5jdGlvbiBwYXJzZVdlZWtkYXlOdW1iZXIoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMSkpO1xuICAgIHJldHVybiBuID8gKGQudyA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZVdlZWtOdW1iZXJTdW5kYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5VID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlV2Vla051bWJlck1vbmRheShkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICByZXR1cm4gbiA/IChkLlcgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VZZWFyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLnkgPSArblswXSArICgrblswXSA+IDY4ID8gMTkwMCA6IDIwMDApLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZU1vbnRoTnVtYmVyKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLm0gPSBuWzBdIC0gMSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VEYXlPZk1vbnRoKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDIpKTtcbiAgICByZXR1cm4gbiA/IChkLmQgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VEYXlPZlllYXIoZCwgc3RyaW5nLCBpKSB7XG4gICAgdmFyIG4gPSBudW1iZXJSZS5leGVjKHN0cmluZy5zbGljZShpLCBpICsgMykpO1xuICAgIHJldHVybiBuID8gKGQubSA9IDAsIGQuZCA9ICtuWzBdLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhvdXIyNChkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5IID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTWludXRlcyhkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5NID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlU2Vjb25kcyhkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyAyKSk7XG4gICAgcmV0dXJuIG4gPyAoZC5TID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlTWlsbGlzZWNvbmRzKGQsIHN0cmluZywgaSkge1xuICAgIHZhciBuID0gbnVtYmVyUmUuZXhlYyhzdHJpbmcuc2xpY2UoaSwgaSArIDMpKTtcbiAgICByZXR1cm4gbiA/IChkLkwgPSArblswXSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VGdWxsWWVhcihkLCBzdHJpbmcsIGkpIHtcbiAgICB2YXIgbiA9IG51bWJlclJlLmV4ZWMoc3RyaW5nLnNsaWNlKGksIGkgKyA0KSk7XG4gICAgcmV0dXJuIG4gPyAoZC55ID0gK25bMF0sIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdExpdGVyYWxQZXJjZW50KCkge1xuICAgIHJldHVybiBcIiVcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ1pvbmUoKSB7XG4gICAgcmV0dXJuIFwiKzAwMDBcIjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhZCh2YWx1ZSwgZmlsbCwgd2lkdGgpIHtcbiAgICB2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IFwiLVwiIDogXCJcIixcbiAgICAgICAgc3RyaW5nID0gKHNpZ24gPyAtdmFsdWUgOiB2YWx1ZSkgKyBcIlwiLFxuICAgICAgICBsZW5ndGggPSBzdHJpbmcubGVuZ3RoO1xuICAgIHJldHVybiBzaWduICsgKGxlbmd0aCA8IHdpZHRoID8gbmV3IEFycmF5KHdpZHRoIC0gbGVuZ3RoICsgMSkuam9pbihmaWxsKSArIHN0cmluZyA6IHN0cmluZyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENGdWxsWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAwMCwgcCwgNCk7XG4gIH1cblxuICBmdW5jdGlvbiBfZm9ybWF0VVRDWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0Z1bGxZZWFyKCkgJSAxMDAsIHAsIDIpO1xuICB9XG5cbiAgdmFyIHQxID0gbmV3IERhdGU7XG5cbiAgdmFyIHQwID0gbmV3IERhdGU7XG5cbiAgZnVuY3Rpb24gbmV3SW50ZXJ2YWwoZmxvb3JpLCBvZmZzZXRpLCBjb3VudCkge1xuXG4gICAgZnVuY3Rpb24gaW50ZXJ2YWwoZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoK2RhdGUpKSwgZGF0ZTtcbiAgICB9XG5cbiAgICBpbnRlcnZhbC5mbG9vciA9IGludGVydmFsO1xuXG4gICAgaW50ZXJ2YWwucm91bmQgPSBmdW5jdGlvbihkYXRlKSB7XG4gICAgICB2YXIgZDAgPSBuZXcgRGF0ZSgrZGF0ZSksXG4gICAgICAgICAgZDEgPSBuZXcgRGF0ZShkYXRlIC0gMSk7XG4gICAgICBmbG9vcmkoZDApLCBmbG9vcmkoZDEpLCBvZmZzZXRpKGQxLCAxKTtcbiAgICAgIHJldHVybiBkYXRlIC0gZDAgPCBkMSAtIGRhdGUgPyBkMCA6IGQxO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5jZWlsID0gZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgcmV0dXJuIGZsb29yaShkYXRlID0gbmV3IERhdGUoZGF0ZSAtIDEpKSwgb2Zmc2V0aShkYXRlLCAxKSwgZGF0ZTtcbiAgICB9O1xuXG4gICAgaW50ZXJ2YWwub2Zmc2V0ID0gZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgcmV0dXJuIG9mZnNldGkoZGF0ZSA9IG5ldyBEYXRlKCtkYXRlKSwgc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCkpLCBkYXRlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5yYW5nZSA9IGZ1bmN0aW9uKHN0YXJ0LCBzdG9wLCBzdGVwKSB7XG4gICAgICB2YXIgcmFuZ2UgPSBbXTtcbiAgICAgIHN0YXJ0ID0gbmV3IERhdGUoc3RhcnQgLSAxKTtcbiAgICAgIHN0b3AgPSBuZXcgRGF0ZSgrc3RvcCk7XG4gICAgICBzdGVwID0gc3RlcCA9PSBudWxsID8gMSA6IE1hdGguZmxvb3Ioc3RlcCk7XG4gICAgICBpZiAoIShzdGFydCA8IHN0b3ApIHx8ICEoc3RlcCA+IDApKSByZXR1cm4gcmFuZ2U7IC8vIGFsc28gaGFuZGxlcyBJbnZhbGlkIERhdGVcbiAgICAgIG9mZnNldGkoc3RhcnQsIDEpLCBmbG9vcmkoc3RhcnQpO1xuICAgICAgaWYgKHN0YXJ0IDwgc3RvcCkgcmFuZ2UucHVzaChuZXcgRGF0ZSgrc3RhcnQpKTtcbiAgICAgIHdoaWxlIChvZmZzZXRpKHN0YXJ0LCBzdGVwKSwgZmxvb3JpKHN0YXJ0KSwgc3RhcnQgPCBzdG9wKSByYW5nZS5wdXNoKG5ldyBEYXRlKCtzdGFydCkpO1xuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH07XG5cbiAgICBpbnRlcnZhbC5maWx0ZXIgPSBmdW5jdGlvbih0ZXN0KSB7XG4gICAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB3aGlsZSAoZmxvb3JpKGRhdGUpLCAhdGVzdChkYXRlKSkgZGF0ZS5zZXRUaW1lKGRhdGUgLSAxKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICAgICAgd2hpbGUgKC0tc3RlcCA+PSAwKSB3aGlsZSAob2Zmc2V0aShkYXRlLCAxKSwgIXRlc3QoZGF0ZSkpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGlmIChjb3VudCkgaW50ZXJ2YWwuY291bnQgPSBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgICB0MC5zZXRUaW1lKCtzdGFydCksIHQxLnNldFRpbWUoK2VuZCk7XG4gICAgICBmbG9vcmkodDApLCBmbG9vcmkodDEpO1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoY291bnQodDAsIHQxKSk7XG4gICAgfTtcblxuICAgIHJldHVybiBpbnRlcnZhbDtcbiAgfVxuXG4gIHZhciB1dGNZZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRVVENNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VVRDRnVsbFllYXIoZGF0ZS5nZXRVVENGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldFVUQ0Z1bGxZZWFyKCkgLSBzdGFydC5nZXRVVENGdWxsWWVhcigpO1xuICB9KTtcblxuICBmdW5jdGlvbiB1dGNXZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSAtIChkYXRlLmdldFVUQ0RheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNjA0OGU1O1xuICAgIH0pO1xuICB9XG5cbiAgdmFyIHV0Y01vbmRheSA9IHV0Y1dlZWtkYXkoMSk7XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla051bWJlck1vbmRheShkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCh1dGNNb25kYXkuY291bnQodXRjWWVhcihkKSwgZCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDV2Vla2RheU51bWJlcihkKSB7XG4gICAgcmV0dXJuIGQuZ2V0VVRDRGF5KCk7XG4gIH1cblxuICB2YXIgdXRjU3VuZGF5ID0gdXRjV2Vla2RheSgwKTtcblxuICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrTnVtYmVyU3VuZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKHV0Y1N1bmRheS5jb3VudCh1dGNZZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENTZWNvbmRzKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0VVRDU2Vjb25kcygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ01pbnV0ZXMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNaW51dGVzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0VVRDTW9udGhOdW1iZXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNb250aCgpICsgMSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENNaWxsaXNlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENNaWxsaXNlY29uZHMoKSwgcCwgMyk7XG4gIH1cblxuICB2YXIgdXRjRGF5ID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDSG91cnMoMCwgMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ0RhdGUoZGF0ZS5nZXRVVENEYXRlKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gODY0ZTU7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mWWVhcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZCgxICsgdXRjRGF5LmNvdW50KHV0Y1llYXIoZCksIGQpLCBwLCAzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0hvdXIxMihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldFVUQ0hvdXJzKCkgJSAxMiB8fCAxMiwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRVVENIb3VyMjQoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENIb3VycygpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFVUQ0RheU9mTW9udGgoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRVVENEYXRlKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Wm9uZShkKSB7XG4gICAgdmFyIHogPSBkLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgcmV0dXJuICh6ID4gMCA/IFwiLVwiIDogKHogKj0gLTEsIFwiK1wiKSlcbiAgICAgICAgKyBwYWQoeiAvIDYwIHwgMCwgXCIwXCIsIDIpXG4gICAgICAgICsgcGFkKHogJSA2MCwgXCIwXCIsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RnVsbFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwMDAsIHAsIDQpO1xuICB9XG5cbiAgZnVuY3Rpb24gX2Zvcm1hdFllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRGdWxsWWVhcigpICUgMTAwLCBwLCAyKTtcbiAgfVxuXG4gIHZhciB5ZWFyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXRNb250aCgwLCAxKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RnVsbFllYXIoZGF0ZS5nZXRGdWxsWWVhcigpICsgc3RlcCk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpO1xuICB9KTtcblxuICBmdW5jdGlvbiB3ZWVrZGF5KGkpIHtcbiAgICByZXR1cm4gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSAtIChkYXRlLmdldERheSgpICsgNyAtIGkpICUgNyk7XG4gICAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgICAgZGF0ZS5zZXREYXRlKGRhdGUuZ2V0RGF0ZSgpICsgc3RlcCAqIDcpO1xuICAgIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICAgIHJldHVybiAoZW5kIC0gc3RhcnQgLSAoZW5kLmdldFRpbWV6b25lT2Zmc2V0KCkgLSBzdGFydC5nZXRUaW1lem9uZU9mZnNldCgpKSAqIDZlNCkgLyA2MDQ4ZTU7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgbW9uZGF5ID0gd2Vla2RheSgxKTtcblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrTnVtYmVyTW9uZGF5KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKG1vbmRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRXZWVrZGF5TnVtYmVyKGQpIHtcbiAgICByZXR1cm4gZC5nZXREYXkoKTtcbiAgfVxuXG4gIHZhciBzdW5kYXkgPSB3ZWVrZGF5KDApO1xuXG4gIGZ1bmN0aW9uIGZvcm1hdFdlZWtOdW1iZXJTdW5kYXkoZCwgcCkge1xuICAgIHJldHVybiBwYWQoc3VuZGF5LmNvdW50KHllYXIoZCksIGQpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdFNlY29uZHMoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRTZWNvbmRzKCksIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0TWludXRlcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldE1pbnV0ZXMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRNb250aE51bWJlcihkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldE1vbnRoKCkgKyAxLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdE1pbGxpc2Vjb25kcyhkLCBwKSB7XG4gICAgcmV0dXJuIHBhZChkLmdldE1pbGxpc2Vjb25kcygpLCBwLCAzKTtcbiAgfVxuXG4gIHZhciBkYXkgPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRIb3VycygwLCAwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0RGF0ZShkYXRlLmdldERhdGUoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCAtIChlbmQuZ2V0VGltZXpvbmVPZmZzZXQoKSAtIHN0YXJ0LmdldFRpbWV6b25lT2Zmc2V0KCkpICogNmU0KSAvIDg2NGU1O1xuICB9KTtcblxuICBmdW5jdGlvbiBmb3JtYXREYXlPZlllYXIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoMSArIGRheS5jb3VudCh5ZWFyKGQpLCBkKSwgcCwgMyk7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRIb3VyMTIoZCwgcCkge1xuICAgIHJldHVybiBwYWQoZC5nZXRIb3VycygpICUgMTIgfHwgMTIsIHAsIDIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0SG91cjI0KGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0SG91cnMoKSwgcCwgMik7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXREYXlPZk1vbnRoKGQsIHApIHtcbiAgICByZXR1cm4gcGFkKGQuZ2V0RGF0ZSgpLCBwLCAyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcm1hdExvb2t1cChuYW1lcykge1xuICAgIHZhciBtYXAgPSBuZXcgTWFwLCBpID0gLTEsIG4gPSBuYW1lcy5sZW5ndGg7XG4gICAgd2hpbGUgKCsraSA8IG4pIG1hcC5zZXQobmFtZXNbaV0udG9Mb3dlckNhc2UoKSwgaSk7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuXG4gIHZhciByZXF1b3RlUmUgPSAvW1xcXFxcXF5cXCRcXCpcXCtcXD9cXHxcXFtcXF1cXChcXClcXC5cXHtcXH1dL2c7XG5cbiAgZnVuY3Rpb24gcmVxdW90ZShzKSB7XG4gICAgcmV0dXJuIHMucmVwbGFjZShyZXF1b3RlUmUsIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0UmUobmFtZXMpIHtcbiAgICByZXR1cm4gbmV3IFJlZ0V4cChcIl4oPzpcIiArIG5hbWVzLm1hcChyZXF1b3RlKS5qb2luKFwifFwiKSArIFwiKVwiLCBcImlcIik7XG4gIH1cblxuICBmdW5jdGlvbiBfbG9jYWxlRm9ybWF0KGxvY2FsZSkge1xuICAgIHZhciBsb2NhbGVfZGF0ZVRpbWUgPSBsb2NhbGUuZGF0ZVRpbWUsXG4gICAgICAgIGxvY2FsZV9kYXRlID0gbG9jYWxlLmRhdGUsXG4gICAgICAgIGxvY2FsZV90aW1lID0gbG9jYWxlLnRpbWUsXG4gICAgICAgIGxvY2FsZV9wZXJpb2RzID0gbG9jYWxlLnBlcmlvZHMsXG4gICAgICAgIGxvY2FsZV93ZWVrZGF5cyA9IGxvY2FsZS5kYXlzLFxuICAgICAgICBsb2NhbGVfc2hvcnRXZWVrZGF5cyA9IGxvY2FsZS5zaG9ydERheXMsXG4gICAgICAgIGxvY2FsZV9tb250aHMgPSBsb2NhbGUubW9udGhzLFxuICAgICAgICBsb2NhbGVfc2hvcnRNb250aHMgPSBsb2NhbGUuc2hvcnRNb250aHM7XG5cbiAgICB2YXIgcGVyaW9kTG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9wZXJpb2RzKSxcbiAgICAgICAgd2Vla2RheVJlID0gZm9ybWF0UmUobG9jYWxlX3dlZWtkYXlzKSxcbiAgICAgICAgd2Vla2RheUxvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfd2Vla2RheXMpLFxuICAgICAgICBzaG9ydFdlZWtkYXlSZSA9IGZvcm1hdFJlKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgICAgc2hvcnRXZWVrZGF5TG9va3VwID0gZm9ybWF0TG9va3VwKGxvY2FsZV9zaG9ydFdlZWtkYXlzKSxcbiAgICAgICAgbW9udGhSZSA9IGZvcm1hdFJlKGxvY2FsZV9tb250aHMpLFxuICAgICAgICBtb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfbW9udGhzKSxcbiAgICAgICAgc2hvcnRNb250aFJlID0gZm9ybWF0UmUobG9jYWxlX3Nob3J0TW9udGhzKSxcbiAgICAgICAgc2hvcnRNb250aExvb2t1cCA9IGZvcm1hdExvb2t1cChsb2NhbGVfc2hvcnRNb250aHMpO1xuXG4gICAgdmFyIGZvcm1hdHMgPSB7XG4gICAgICBcImFcIjogZm9ybWF0U2hvcnRXZWVrZGF5LFxuICAgICAgXCJBXCI6IGZvcm1hdFdlZWtkYXksXG4gICAgICBcImJcIjogZm9ybWF0U2hvcnRNb250aCxcbiAgICAgIFwiQlwiOiBmb3JtYXRNb250aCxcbiAgICAgIFwiY1wiOiBudWxsLFxuICAgICAgXCJkXCI6IGZvcm1hdERheU9mTW9udGgsXG4gICAgICBcImVcIjogZm9ybWF0RGF5T2ZNb250aCxcbiAgICAgIFwiSFwiOiBmb3JtYXRIb3VyMjQsXG4gICAgICBcIklcIjogZm9ybWF0SG91cjEyLFxuICAgICAgXCJqXCI6IGZvcm1hdERheU9mWWVhcixcbiAgICAgIFwiTFwiOiBmb3JtYXRNaWxsaXNlY29uZHMsXG4gICAgICBcIm1cIjogZm9ybWF0TW9udGhOdW1iZXIsXG4gICAgICBcIk1cIjogZm9ybWF0TWludXRlcyxcbiAgICAgIFwicFwiOiBmb3JtYXRQZXJpb2QsXG4gICAgICBcIlNcIjogZm9ybWF0U2Vjb25kcyxcbiAgICAgIFwiVVwiOiBmb3JtYXRXZWVrTnVtYmVyU3VuZGF5LFxuICAgICAgXCJ3XCI6IGZvcm1hdFdlZWtkYXlOdW1iZXIsXG4gICAgICBcIldcIjogZm9ybWF0V2Vla051bWJlck1vbmRheSxcbiAgICAgIFwieFwiOiBudWxsLFxuICAgICAgXCJYXCI6IG51bGwsXG4gICAgICBcInlcIjogX2Zvcm1hdFllYXIsXG4gICAgICBcIllcIjogZm9ybWF0RnVsbFllYXIsXG4gICAgICBcIlpcIjogZm9ybWF0Wm9uZSxcbiAgICAgIFwiJVwiOiBmb3JtYXRMaXRlcmFsUGVyY2VudFxuICAgIH07XG5cbiAgICB2YXIgdXRjRm9ybWF0cyA9IHtcbiAgICAgIFwiYVwiOiBmb3JtYXRVVENTaG9ydFdlZWtkYXksXG4gICAgICBcIkFcIjogZm9ybWF0VVRDV2Vla2RheSxcbiAgICAgIFwiYlwiOiBmb3JtYXRVVENTaG9ydE1vbnRoLFxuICAgICAgXCJCXCI6IGZvcm1hdFVUQ01vbnRoLFxuICAgICAgXCJjXCI6IG51bGwsXG4gICAgICBcImRcIjogZm9ybWF0VVRDRGF5T2ZNb250aCxcbiAgICAgIFwiZVwiOiBmb3JtYXRVVENEYXlPZk1vbnRoLFxuICAgICAgXCJIXCI6IGZvcm1hdFVUQ0hvdXIyNCxcbiAgICAgIFwiSVwiOiBmb3JtYXRVVENIb3VyMTIsXG4gICAgICBcImpcIjogZm9ybWF0VVRDRGF5T2ZZZWFyLFxuICAgICAgXCJMXCI6IGZvcm1hdFVUQ01pbGxpc2Vjb25kcyxcbiAgICAgIFwibVwiOiBmb3JtYXRVVENNb250aE51bWJlcixcbiAgICAgIFwiTVwiOiBmb3JtYXRVVENNaW51dGVzLFxuICAgICAgXCJwXCI6IGZvcm1hdFVUQ1BlcmlvZCxcbiAgICAgIFwiU1wiOiBmb3JtYXRVVENTZWNvbmRzLFxuICAgICAgXCJVXCI6IGZvcm1hdFVUQ1dlZWtOdW1iZXJTdW5kYXksXG4gICAgICBcIndcIjogZm9ybWF0VVRDV2Vla2RheU51bWJlcixcbiAgICAgIFwiV1wiOiBmb3JtYXRVVENXZWVrTnVtYmVyTW9uZGF5LFxuICAgICAgXCJ4XCI6IG51bGwsXG4gICAgICBcIlhcIjogbnVsbCxcbiAgICAgIFwieVwiOiBfZm9ybWF0VVRDWWVhcixcbiAgICAgIFwiWVwiOiBmb3JtYXRVVENGdWxsWWVhcixcbiAgICAgIFwiWlwiOiBmb3JtYXRVVENab25lLFxuICAgICAgXCIlXCI6IGZvcm1hdExpdGVyYWxQZXJjZW50XG4gICAgfTtcblxuICAgIHZhciBwYXJzZXMgPSB7XG4gICAgICBcImFcIjogcGFyc2VTaG9ydFdlZWtkYXksXG4gICAgICBcIkFcIjogcGFyc2VXZWVrZGF5LFxuICAgICAgXCJiXCI6IHBhcnNlU2hvcnRNb250aCxcbiAgICAgIFwiQlwiOiBwYXJzZU1vbnRoLFxuICAgICAgXCJjXCI6IHBhcnNlTG9jYWxlRGF0ZVRpbWUsXG4gICAgICBcImRcIjogcGFyc2VEYXlPZk1vbnRoLFxuICAgICAgXCJlXCI6IHBhcnNlRGF5T2ZNb250aCxcbiAgICAgIFwiSFwiOiBwYXJzZUhvdXIyNCxcbiAgICAgIFwiSVwiOiBwYXJzZUhvdXIyNCxcbiAgICAgIFwialwiOiBwYXJzZURheU9mWWVhcixcbiAgICAgIFwiTFwiOiBwYXJzZU1pbGxpc2Vjb25kcyxcbiAgICAgIFwibVwiOiBwYXJzZU1vbnRoTnVtYmVyLFxuICAgICAgXCJNXCI6IHBhcnNlTWludXRlcyxcbiAgICAgIFwicFwiOiBwYXJzZVBlcmlvZCxcbiAgICAgIFwiU1wiOiBwYXJzZVNlY29uZHMsXG4gICAgICBcIlVcIjogcGFyc2VXZWVrTnVtYmVyU3VuZGF5LFxuICAgICAgXCJ3XCI6IHBhcnNlV2Vla2RheU51bWJlcixcbiAgICAgIFwiV1wiOiBwYXJzZVdlZWtOdW1iZXJNb25kYXksXG4gICAgICBcInhcIjogcGFyc2VMb2NhbGVEYXRlLFxuICAgICAgXCJYXCI6IHBhcnNlTG9jYWxlVGltZSxcbiAgICAgIFwieVwiOiBwYXJzZVllYXIsXG4gICAgICBcIllcIjogcGFyc2VGdWxsWWVhcixcbiAgICAgIFwiWlwiOiBwYXJzZVpvbmUsXG4gICAgICBcIiVcIjogcGFyc2VMaXRlcmFsUGVyY2VudFxuICAgIH07XG5cbiAgICAvLyBUaGVzZSByZWN1cnNpdmUgZGlyZWN0aXZlIGRlZmluaXRpb25zIG11c3QgYmUgZGVmZXJyZWQuXG4gICAgZm9ybWF0cy54ID0gbmV3Rm9ybWF0KGxvY2FsZV9kYXRlLCBmb3JtYXRzKTtcbiAgICBmb3JtYXRzLlggPSBuZXdGb3JtYXQobG9jYWxlX3RpbWUsIGZvcm1hdHMpO1xuICAgIGZvcm1hdHMuYyA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZVRpbWUsIGZvcm1hdHMpO1xuICAgIHV0Y0Zvcm1hdHMueCA9IG5ld0Zvcm1hdChsb2NhbGVfZGF0ZSwgdXRjRm9ybWF0cyk7XG4gICAgdXRjRm9ybWF0cy5YID0gbmV3Rm9ybWF0KGxvY2FsZV90aW1lLCB1dGNGb3JtYXRzKTtcbiAgICB1dGNGb3JtYXRzLmMgPSBuZXdGb3JtYXQobG9jYWxlX2RhdGVUaW1lLCB1dGNGb3JtYXRzKTtcblxuICAgIGZ1bmN0aW9uIG5ld0Zvcm1hdChzcGVjaWZpZXIsIGZvcm1hdHMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIHZhciBzdHJpbmcgPSBbXSxcbiAgICAgICAgICAgIGkgPSAtMSxcbiAgICAgICAgICAgIGogPSAwLFxuICAgICAgICAgICAgbiA9IHNwZWNpZmllci5sZW5ndGgsXG4gICAgICAgICAgICBjLFxuICAgICAgICAgICAgcGFkLFxuICAgICAgICAgICAgZm9ybWF0O1xuXG4gICAgICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci5jaGFyQ29kZUF0KGkpID09PSAzNykge1xuICAgICAgICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgICAgICAgIGlmICgocGFkID0gcGFkc1tjID0gc3BlY2lmaWVyLmNoYXJBdCgrK2kpXSkgIT0gbnVsbCkgYyA9IHNwZWNpZmllci5jaGFyQXQoKytpKTtcbiAgICAgICAgICAgIGlmIChmb3JtYXQgPSBmb3JtYXRzW2NdKSBjID0gZm9ybWF0KGRhdGUsIHBhZCA9PSBudWxsID8gKGMgPT09IFwiZVwiID8gXCIgXCIgOiBcIjBcIikgOiBwYWQpO1xuICAgICAgICAgICAgc3RyaW5nLnB1c2goYyk7XG4gICAgICAgICAgICBqID0gaSArIDE7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nLnB1c2goc3BlY2lmaWVyLnNsaWNlKGosIGkpKTtcbiAgICAgICAgcmV0dXJuIHN0cmluZy5qb2luKFwiXCIpO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBuZXdQYXJzZShzcGVjaWZpZXIsIG5ld0RhdGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHJpbmcpIHtcbiAgICAgICAgdmFyIGQgPSBuZXdZZWFyKDE5MDApLFxuICAgICAgICAgICAgaSA9IHBhcnNlU3BlY2lmaWVyKGQsIHNwZWNpZmllciwgc3RyaW5nLCAwKTtcbiAgICAgICAgaWYgKGkgIT0gc3RyaW5nLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgLy8gVGhlIGFtLXBtIGZsYWcgaXMgMCBmb3IgQU0sIGFuZCAxIGZvciBQTS5cbiAgICAgICAgaWYgKFwicFwiIGluIGQpIGQuSCA9IGQuSCAlIDEyICsgZC5wICogMTI7XG5cbiAgICAgICAgLy8gSWYgYSB0aW1lIHpvbmUgaXMgc3BlY2lmaWVkLCBhbGwgZmllbGRzIGFyZSBpbnRlcnByZXRlZCBhcyBVVEMgYW5kIHRoZW5cbiAgICAgICAgLy8gb2Zmc2V0IGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWVkIHRpbWUgem9uZS5cbiAgICAgICAgaWYgKFwiWlwiIGluIGQpIHtcbiAgICAgICAgICBpZiAoXCJ3XCIgaW4gZCAmJiAoXCJXXCIgaW4gZCB8fCBcIlVcIiBpbiBkKSkge1xuICAgICAgICAgICAgdmFyIGRheSA9IHV0Y0RhdGUobmV3WWVhcihkLnkpKS5nZXRVVENEYXkoKTtcbiAgICAgICAgICAgIGlmIChcIldcIiBpbiBkKSBkLlUgPSBkLlcsIGQudyA9IChkLncgKyA2KSAlIDcsIC0tZGF5O1xuICAgICAgICAgICAgZC5tID0gMDtcbiAgICAgICAgICAgIGQuZCA9IGQudyArIGQuVSAqIDcgLSAoZGF5ICsgNikgJSA3O1xuICAgICAgICAgIH1cbiAgICAgICAgICBkLkggKz0gZC5aIC8gMTAwIHwgMDtcbiAgICAgICAgICBkLk0gKz0gZC5aICUgMTAwO1xuICAgICAgICAgIHJldHVybiB1dGNEYXRlKGQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gT3RoZXJ3aXNlLCBhbGwgZmllbGRzIGFyZSBpbiBsb2NhbCB0aW1lLlxuICAgICAgICBpZiAoXCJ3XCIgaW4gZCAmJiAoXCJXXCIgaW4gZCB8fCBcIlVcIiBpbiBkKSkge1xuICAgICAgICAgIHZhciBkYXkgPSBuZXdEYXRlKG5ld1llYXIoZC55KSkuZ2V0RGF5KCk7XG4gICAgICAgICAgaWYgKFwiV1wiIGluIGQpIGQuVSA9IGQuVywgZC53ID0gKGQudyArIDYpICUgNywgLS1kYXk7XG4gICAgICAgICAgZC5tID0gMDtcbiAgICAgICAgICBkLmQgPSBkLncgKyBkLlUgKiA3IC0gKGRheSArIDYpICUgNztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3RGF0ZShkKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTcGVjaWZpZXIoZCwgc3BlY2lmaWVyLCBzdHJpbmcsIGopIHtcbiAgICAgIHZhciBpID0gMCxcbiAgICAgICAgICBuID0gc3BlY2lmaWVyLmxlbmd0aCxcbiAgICAgICAgICBtID0gc3RyaW5nLmxlbmd0aCxcbiAgICAgICAgICBjLFxuICAgICAgICAgIHBhcnNlO1xuXG4gICAgICB3aGlsZSAoaSA8IG4pIHtcbiAgICAgICAgaWYgKGogPj0gbSkgcmV0dXJuIC0xO1xuICAgICAgICBjID0gc3BlY2lmaWVyLmNoYXJDb2RlQXQoaSsrKTtcbiAgICAgICAgaWYgKGMgPT09IDM3KSB7XG4gICAgICAgICAgYyA9IHNwZWNpZmllci5jaGFyQXQoaSsrKTtcbiAgICAgICAgICBwYXJzZSA9IHBhcnNlc1tjIGluIHBhZHMgPyBzcGVjaWZpZXIuY2hhckF0KGkrKykgOiBjXTtcbiAgICAgICAgICBpZiAoIXBhcnNlIHx8ICgoaiA9IHBhcnNlKGQsIHN0cmluZywgaikpIDwgMCkpIHJldHVybiAtMTtcbiAgICAgICAgfSBlbHNlIGlmIChjICE9IHN0cmluZy5jaGFyQ29kZUF0KGorKykpIHtcbiAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGo7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VTaG9ydFdlZWtkYXkoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHNob3J0V2Vla2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGQudyA9IHNob3J0V2Vla2RheUxvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlV2Vla2RheShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gd2Vla2RheVJlLmV4ZWMoc3RyaW5nLnNsaWNlKGkpKTtcbiAgICAgIHJldHVybiBuID8gKGQudyA9IHdlZWtkYXlMb29rdXAuZ2V0KG5bMF0udG9Mb3dlckNhc2UoKSksIGkgKyBuWzBdLmxlbmd0aCkgOiAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZVNob3J0TW9udGgoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHNob3J0TW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLm0gPSBzaG9ydE1vbnRoTG9va3VwLmdldChuWzBdLnRvTG93ZXJDYXNlKCkpLCBpICsgblswXS5sZW5ndGgpIDogLTE7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VNb250aChkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHZhciBuID0gbW9udGhSZS5leGVjKHN0cmluZy5zbGljZShpKSk7XG4gICAgICByZXR1cm4gbiA/IChkLm0gPSBtb250aExvb2t1cC5nZXQoblswXS50b0xvd2VyQ2FzZSgpKSwgaSArIG5bMF0ubGVuZ3RoKSA6IC0xO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTG9jYWxlRGF0ZVRpbWUoZCwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX2RhdGVUaW1lLCBzdHJpbmcsIGkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHBhcnNlTG9jYWxlRGF0ZShkLCBzdHJpbmcsIGkpIHtcbiAgICAgIHJldHVybiBwYXJzZVNwZWNpZmllcihkLCBsb2NhbGVfZGF0ZSwgc3RyaW5nLCBpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwYXJzZUxvY2FsZVRpbWUoZCwgc3RyaW5nLCBpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTcGVjaWZpZXIoZCwgbG9jYWxlX3RpbWUsIHN0cmluZywgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcGFyc2VQZXJpb2QoZCwgc3RyaW5nLCBpKSB7XG4gICAgICB2YXIgbiA9IHBlcmlvZExvb2t1cC5nZXQoc3RyaW5nLnNsaWNlKGksIGkgKz0gMikudG9Mb3dlckNhc2UoKSk7XG4gICAgICByZXR1cm4gbiA9PSBudWxsID8gLTEgOiAoZC5wID0gbiwgaSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0U2hvcnRXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldERheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXREYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0U2hvcnRNb250aChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0TW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0TW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRNb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRQZXJpb2QoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRIb3VycygpID49IDEyKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDU2hvcnRXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfc2hvcnRXZWVrZGF5c1tkLmdldFVUQ0RheSgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENXZWVrZGF5KGQpIHtcbiAgICAgIHJldHVybiBsb2NhbGVfd2Vla2RheXNbZC5nZXRVVENEYXkoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDU2hvcnRNb250aChkKSB7XG4gICAgICByZXR1cm4gbG9jYWxlX3Nob3J0TW9udGhzW2QuZ2V0VVRDTW9udGgoKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZm9ybWF0VVRDTW9udGgoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9tb250aHNbZC5nZXRVVENNb250aCgpXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmb3JtYXRVVENQZXJpb2QoZCkge1xuICAgICAgcmV0dXJuIGxvY2FsZV9wZXJpb2RzWysoZC5nZXRVVENIb3VycygpID49IDEyKV07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGZvcm1hdDogZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICAgIHZhciBmID0gbmV3Rm9ybWF0KHNwZWNpZmllciArPSBcIlwiLCBmb3JtYXRzKTtcbiAgICAgICAgZi5wYXJzZSA9IG5ld1BhcnNlKHNwZWNpZmllciwgbG9jYWxEYXRlKTtcbiAgICAgICAgZi50b1N0cmluZyA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gc3BlY2lmaWVyOyB9O1xuICAgICAgICByZXR1cm4gZjtcbiAgICAgIH0sXG4gICAgICB1dGNGb3JtYXQ6IGZ1bmN0aW9uKHNwZWNpZmllcikge1xuICAgICAgICB2YXIgZiA9IG5ld0Zvcm1hdChzcGVjaWZpZXIgKz0gXCJcIiwgdXRjRm9ybWF0cyk7XG4gICAgICAgIGYucGFyc2UgPSBuZXdQYXJzZShzcGVjaWZpZXIsIHV0Y0RhdGUpO1xuICAgICAgICBmLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7IHJldHVybiBzcGVjaWZpZXI7IH07XG4gICAgICAgIHJldHVybiBmO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgX2xvY2FsZSA9IF9sb2NhbGVGb3JtYXQoe1xuICAgIGRhdGVUaW1lOiBcIiVhICViICVlICVYICVZXCIsXG4gICAgZGF0ZTogXCIlbS8lZC8lWVwiLFxuICAgIHRpbWU6IFwiJUg6JU06JVNcIixcbiAgICBwZXJpb2RzOiBbXCJBTVwiLCBcIlBNXCJdLFxuICAgIGRheXM6IFtcIlN1bmRheVwiLCBcIk1vbmRheVwiLCBcIlR1ZXNkYXlcIiwgXCJXZWRuZXNkYXlcIiwgXCJUaHVyc2RheVwiLCBcIkZyaWRheVwiLCBcIlNhdHVyZGF5XCJdLFxuICAgIHNob3J0RGF5czogW1wiU3VuXCIsIFwiTW9uXCIsIFwiVHVlXCIsIFwiV2VkXCIsIFwiVGh1XCIsIFwiRnJpXCIsIFwiU2F0XCJdLFxuICAgIG1vbnRoczogW1wiSmFudWFyeVwiLCBcIkZlYnJ1YXJ5XCIsIFwiTWFyY2hcIiwgXCJBcHJpbFwiLCBcIk1heVwiLCBcIkp1bmVcIiwgXCJKdWx5XCIsIFwiQXVndXN0XCIsIFwiU2VwdGVtYmVyXCIsIFwiT2N0b2JlclwiLCBcIk5vdmVtYmVyXCIsIFwiRGVjZW1iZXJcIl0sXG4gICAgc2hvcnRNb250aHM6IFtcIkphblwiLCBcIkZlYlwiLCBcIk1hclwiLCBcIkFwclwiLCBcIk1heVwiLCBcIkp1blwiLCBcIkp1bFwiLCBcIkF1Z1wiLCBcIlNlcFwiLCBcIk9jdFwiLCBcIk5vdlwiLCBcIkRlY1wiXVxuICB9KTtcblxuICB2YXIgdXRjRm9ybWF0ID0gX2xvY2FsZS51dGNGb3JtYXQ7XG5cbiAgdmFyIGZvcm1hdFVUQ1llYXIgPSB1dGNGb3JtYXQoXCIlWVwiKTtcblxuICB2YXIgZm9ybWF0VVRDTW9udGggPSB1dGNGb3JtYXQoXCIlQlwiKTtcblxuICB2YXIgZm9ybWF0VVRDV2VlayA9IHV0Y0Zvcm1hdChcIiViICVkXCIpO1xuXG4gIHZhciBmb3JtYXRVVENEYXkgPSB1dGNGb3JtYXQoXCIlYSAlZFwiKTtcblxuICB2YXIgdXRjV2VlayA9IHV0Y1N1bmRheTtcblxuICB2YXIgdXRjTW9udGggPSBuZXdJbnRlcnZhbChmdW5jdGlvbihkYXRlKSB7XG4gICAgZGF0ZS5zZXRVVENIb3VycygwLCAwLCAwLCAwKTtcbiAgICBkYXRlLnNldFVUQ0RhdGUoMSk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFVUQ01vbnRoKGRhdGUuZ2V0VVRDTW9udGgoKSArIHN0ZXApO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIGVuZC5nZXRVVENNb250aCgpIC0gc3RhcnQuZ2V0VVRDTW9udGgoKSArIChlbmQuZ2V0VVRDRnVsbFllYXIoKSAtIHN0YXJ0LmdldFVUQ0Z1bGxZZWFyKCkpICogMTI7XG4gIH0pO1xuXG4gIHZhciBmb3JtYXRVVENIb3VyID0gdXRjRm9ybWF0KFwiJUkgJXBcIik7XG5cbiAgdmFyIGZvcm1hdFVUQ01pbnV0ZSA9IHV0Y0Zvcm1hdChcIiVJOiVNXCIpO1xuXG4gIHZhciB1dGNIb3VyID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWludXRlcygwLCAwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAzNmU1KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gMzZlNTtcbiAgfSk7XG5cbiAgdmFyIGZvcm1hdFVUQ1NlY29uZCA9IHV0Y0Zvcm1hdChcIjolU1wiKTtcblxuICB2YXIgdXRjTWludXRlID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDU2Vjb25kcygwLCAwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiA2ZTQpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyA2ZTQ7XG4gIH0pO1xuXG4gIHZhciBmb3JtYXRVVENNaWxsaXNlY29uZCA9IHV0Y0Zvcm1hdChcIi4lTFwiKTtcblxuICB2YXIgdXRjU2Vjb25kID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0VVRDTWlsbGlzZWNvbmRzKDApO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRUaW1lKCtkYXRlICsgc3RlcCAqIDFlMyk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDFlMztcbiAgfSk7XG5cbiAgZnVuY3Rpb24gX3RpY2tGb3JtYXQoZGF0ZSkge1xuICAgIHJldHVybiAodXRjU2Vjb25kKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdFVUQ01pbGxpc2Vjb25kXG4gICAgICAgIDogdXRjTWludXRlKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdFVUQ1NlY29uZFxuICAgICAgICA6IHV0Y0hvdXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0VVRDTWludXRlXG4gICAgICAgIDogdXRjRGF5KGRhdGUpIDwgZGF0ZSA/IGZvcm1hdFVUQ0hvdXJcbiAgICAgICAgOiB1dGNNb250aChkYXRlKSA8IGRhdGUgPyAodXRjV2VlayhkYXRlKSA8IGRhdGUgPyBmb3JtYXRVVENEYXkgOiBmb3JtYXRVVENXZWVrKVxuICAgICAgICA6IHV0Y1llYXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0VVRDTW9udGhcbiAgICAgICAgOiBmb3JtYXRVVENZZWFyKShkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld0RhdGUodCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSh0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYmluZChzY2FsZSwgbGluZWFyKSB7XG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4ID0gbGluZWFyLnJhbmdlLmFwcGx5KGxpbmVhciwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB4ID09PSBsaW5lYXIgPyBzY2FsZSA6IHg7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlUm91bmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4ID0gbGluZWFyLnJhbmdlUm91bmQuYXBwbHkobGluZWFyLCBhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIHggPT09IGxpbmVhciA/IHNjYWxlIDogeDtcbiAgICB9O1xuXG4gICAgc2NhbGUuY2xhbXAgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB4ID0gbGluZWFyLmNsYW1wLmFwcGx5KGxpbmVhciwgYXJndW1lbnRzKTtcbiAgICAgIHJldHVybiB4ID09PSBsaW5lYXIgPyBzY2FsZSA6IHg7XG4gICAgfTtcblxuICAgIHNjYWxlLmludGVycG9sYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IGxpbmVhci5pbnRlcnBvbGF0ZS5hcHBseShsaW5lYXIsIGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4geCA9PT0gbGluZWFyID8gc2NhbGUgOiB4O1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cblxuICB2YXIgZTIgPSBNYXRoLnNxcnQoMik7XG5cbiAgdmFyIGU1ID0gTWF0aC5zcXJ0KDEwKTtcblxuICB2YXIgZTEwID0gTWF0aC5zcXJ0KDUwKTtcblxuICBmdW5jdGlvbiB0aWNrUmFuZ2UoZG9tYWluLCBjb3VudCkge1xuICAgIGlmIChjb3VudCA9PSBudWxsKSBjb3VudCA9IDEwO1xuXG4gICAgdmFyIHN0YXJ0ID0gZG9tYWluWzBdLFxuICAgICAgICBzdG9wID0gZG9tYWluW2RvbWFpbi5sZW5ndGggLSAxXTtcblxuICAgIGlmIChzdG9wIDwgc3RhcnQpIGVycm9yID0gc3RvcCwgc3RvcCA9IHN0YXJ0LCBzdGFydCA9IGVycm9yO1xuXG4gICAgdmFyIHNwYW4gPSBzdG9wIC0gc3RhcnQsXG4gICAgICAgIHN0ZXAgPSBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhzcGFuIC8gY291bnQpIC8gTWF0aC5MTjEwKSksXG4gICAgICAgIGVycm9yID0gc3BhbiAvIGNvdW50IC8gc3RlcDtcblxuICAgIC8vIEZpbHRlciB0aWNrcyB0byBnZXQgY2xvc2VyIHRvIHRoZSBkZXNpcmVkIGNvdW50LlxuICAgIGlmIChlcnJvciA+PSBlMTApIHN0ZXAgKj0gMTA7XG4gICAgZWxzZSBpZiAoZXJyb3IgPj0gZTUpIHN0ZXAgKj0gNTtcbiAgICBlbHNlIGlmIChlcnJvciA+PSBlMikgc3RlcCAqPSAyO1xuXG4gICAgLy8gUm91bmQgc3RhcnQgYW5kIHN0b3AgdmFsdWVzIHRvIHN0ZXAgaW50ZXJ2YWwuXG4gICAgcmV0dXJuIFtcbiAgICAgIE1hdGguY2VpbChzdGFydCAvIHN0ZXApICogc3RlcCxcbiAgICAgIE1hdGguZmxvb3Ioc3RvcCAvIHN0ZXApICogc3RlcCArIHN0ZXAgLyAyLCAvLyBpbmNsdXNpdmVcbiAgICAgIHN0ZXBcbiAgICBdO1xuICB9XG5cbiAgdmFyIG1pbGxpc2Vjb25kc1BlclNlY29uZCA9IDEwMDA7XG4gIHZhciBtaWxsaXNlY29uZHNQZXJNaW51dGUgPSBtaWxsaXNlY29uZHNQZXJTZWNvbmQgKiA2MDtcbiAgdmFyIG1pbGxpc2Vjb25kc1BlckhvdXIgPSBtaWxsaXNlY29uZHNQZXJNaW51dGUgKiA2MDtcbiAgdmFyIG1pbGxpc2Vjb25kc1BlckRheSA9IG1pbGxpc2Vjb25kc1BlckhvdXIgKiAyNDtcblxuICB2YXIgbWlsbGlzZWNvbmRzUGVyWWVhciA9IG1pbGxpc2Vjb25kc1BlckRheSAqIDM2NTtcblxuICB2YXIgbWlsbGlzZWNvbmRzUGVyTW9udGggPSBtaWxsaXNlY29uZHNQZXJEYXkgKiAzMDtcblxuICB2YXIgbWlsbGlzZWNvbmRzUGVyV2VlayA9IG1pbGxpc2Vjb25kc1BlckRheSAqIDc7XG5cbiAgdmFyIHRpY2tJbnRlcnZhbHMgPSBbXG4gICAgW1wic2Vjb25kc1wiLCAgMSwgICAgICBtaWxsaXNlY29uZHNQZXJTZWNvbmRdLFxuICAgIFtcInNlY29uZHNcIiwgIDUsICA1ICogbWlsbGlzZWNvbmRzUGVyU2Vjb25kXSxcbiAgICBbXCJzZWNvbmRzXCIsIDE1LCAxNSAqIG1pbGxpc2Vjb25kc1BlclNlY29uZF0sXG4gICAgW1wic2Vjb25kc1wiLCAzMCwgMzAgKiBtaWxsaXNlY29uZHNQZXJTZWNvbmRdLFxuICAgIFtcIm1pbnV0ZXNcIiwgIDEsICAgICAgbWlsbGlzZWNvbmRzUGVyTWludXRlXSxcbiAgICBbXCJtaW51dGVzXCIsICA1LCAgNSAqIG1pbGxpc2Vjb25kc1Blck1pbnV0ZV0sXG4gICAgW1wibWludXRlc1wiLCAxNSwgMTUgKiBtaWxsaXNlY29uZHNQZXJNaW51dGVdLFxuICAgIFtcIm1pbnV0ZXNcIiwgMzAsIDMwICogbWlsbGlzZWNvbmRzUGVyTWludXRlXSxcbiAgICBbICBcImhvdXJzXCIsICAxLCAgICAgIG1pbGxpc2Vjb25kc1BlckhvdXIgIF0sXG4gICAgWyAgXCJob3Vyc1wiLCAgMywgIDMgKiBtaWxsaXNlY29uZHNQZXJIb3VyICBdLFxuICAgIFsgIFwiaG91cnNcIiwgIDYsICA2ICogbWlsbGlzZWNvbmRzUGVySG91ciAgXSxcbiAgICBbICBcImhvdXJzXCIsIDEyLCAxMiAqIG1pbGxpc2Vjb25kc1BlckhvdXIgIF0sXG4gICAgWyAgIFwiZGF5c1wiLCAgMSwgICAgICBtaWxsaXNlY29uZHNQZXJEYXkgICBdLFxuICAgIFsgICBcImRheXNcIiwgIDIsICAyICogbWlsbGlzZWNvbmRzUGVyRGF5ICAgXSxcbiAgICBbICBcIndlZWtzXCIsICAxLCAgICAgIG1pbGxpc2Vjb25kc1BlcldlZWsgIF0sXG4gICAgWyBcIm1vbnRoc1wiLCAgMSwgICAgICBtaWxsaXNlY29uZHNQZXJNb250aCBdLFxuICAgIFsgXCJtb250aHNcIiwgIDMsICAzICogbWlsbGlzZWNvbmRzUGVyTW9udGggXSxcbiAgICBbICBcInllYXJzXCIsICAxLCAgICAgIG1pbGxpc2Vjb25kc1BlclllYXIgIF1cbiAgXTtcblxuICBmdW5jdGlvbiBhc2NlbmRpbmcoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogYSA+PSBiID8gMCA6IE5hTjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFzY2VuZGluZ0NvbXBhcmF0b3IoZikge1xuICAgIHJldHVybiBmdW5jdGlvbihkLCB4KSB7XG4gICAgICByZXR1cm4gYXNjZW5kaW5nKGYoZCksIHgpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBiaXNlY3Rvcihjb21wYXJlKSB7XG4gICAgaWYgKGNvbXBhcmUubGVuZ3RoID09PSAxKSBjb21wYXJlID0gYXNjZW5kaW5nQ29tcGFyYXRvcihjb21wYXJlKTtcbiAgICByZXR1cm4ge1xuICAgICAgbGVmdDogZnVuY3Rpb24oYSwgeCwgbG8sIGhpKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgbG8gPSAwO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIGhpID0gYS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA8IDApIGxvID0gbWlkICsgMTtcbiAgICAgICAgICBlbHNlIGhpID0gbWlkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsbztcbiAgICAgIH0sXG4gICAgICByaWdodDogZnVuY3Rpb24oYSwgeCwgbG8sIGhpKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykgbG8gPSAwO1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDQpIGhpID0gYS5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChsbyA8IGhpKSB7XG4gICAgICAgICAgdmFyIG1pZCA9IGxvICsgaGkgPj4+IDE7XG4gICAgICAgICAgaWYgKGNvbXBhcmUoYVttaWRdLCB4KSA+IDApIGhpID0gbWlkO1xuICAgICAgICAgIGVsc2UgbG8gPSBtaWQgKyAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsbztcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIGJpc2VjdFRpY2tJbnRlcnZhbHMgPSBiaXNlY3RvcihmdW5jdGlvbihtZXRob2QpIHtcbiAgICByZXR1cm4gbWV0aG9kWzJdO1xuICB9KS5yaWdodDtcblxuICBmdW5jdGlvbiBjaG9vc2VUaWNrSW50ZXJ2YWwoc3RhcnQsIHN0b3AsIGNvdW50KSB7XG4gICAgdmFyIHRhcmdldCA9IE1hdGguYWJzKHN0b3AgLSBzdGFydCkgLyBjb3VudCxcbiAgICAgICAgaSA9IGJpc2VjdFRpY2tJbnRlcnZhbHModGlja0ludGVydmFscywgdGFyZ2V0KTtcbiAgICByZXR1cm4gaSA9PT0gdGlja0ludGVydmFscy5sZW5ndGggPyBbXCJ5ZWFyc1wiLCB0aWNrUmFuZ2UoW3N0YXJ0IC8gbWlsbGlzZWNvbmRzUGVyWWVhciwgc3RvcCAvIG1pbGxpc2Vjb25kc1BlclllYXJdLCBjb3VudClbMl1dXG4gICAgICAgIDogaSA/IHRpY2tJbnRlcnZhbHNbdGFyZ2V0IC8gdGlja0ludGVydmFsc1tpIC0gMV1bMl0gPCB0aWNrSW50ZXJ2YWxzW2ldWzJdIC8gdGFyZ2V0ID8gaSAtIDEgOiBpXVxuICAgICAgICA6IFtcIm1pbGxpc2Vjb25kc1wiLCB0aWNrUmFuZ2UoW3N0YXJ0LCBzdG9wXSwgY291bnQpWzJdXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1RpbWUobGluZWFyLCB0aW1lSW50ZXJ2YWwsIHRpY2tGb3JtYXQsIGZvcm1hdCkge1xuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuIGxpbmVhcih4KTtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gbmV3RGF0ZShsaW5lYXIuaW52ZXJ0KHgpKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gbGluZWFyLmRvbWFpbigpLm1hcChuZXdEYXRlKTtcbiAgICAgIGxpbmVhci5kb21haW4oeCk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHRpY2tJbnRlcnZhbChpbnRlcnZhbCwgc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICAgIGlmIChpbnRlcnZhbCA9PSBudWxsKSBpbnRlcnZhbCA9IDEwO1xuXG4gICAgICAvLyBJZiBhIGRlc2lyZWQgdGljayBjb3VudCBpcyBzcGVjaWZpZWQsIHBpY2sgYSByZWFzb25hYmxlIHRpY2sgaW50ZXJ2YWxcbiAgICAgIC8vIGJhc2VkIG9uIHRoZSBleHRlbnQgb2YgdGhlIGRvbWFpbiBhbmQgYSByb3VnaCBlc3RpbWF0ZSBvZiB0aWNrIHNpemUuXG4gICAgICAvLyBJZiBhIG5hbWVkIGludGVydmFsIHN1Y2ggYXMgXCJzZWNvbmRzXCIgd2FzIHNwZWNpZmllZCwgY29udmVydCB0byB0aGVcbiAgICAgIC8vIGNvcnJlc3BvbmRpbmcgdGltZSBpbnRlcnZhbCBhbmQgb3B0aW9uYWxseSBmaWx0ZXIgdXNpbmcgdGhlIHN0ZXAuXG4gICAgICAvLyBPdGhlcndpc2UsIGFzc3VtZSBpbnRlcnZhbCBpcyBhbHJlYWR5IGEgdGltZSBpbnRlcnZhbCBhbmQgdXNlIGl0LlxuICAgICAgc3dpdGNoICh0eXBlb2YgaW50ZXJ2YWwpIHtcbiAgICAgICAgY2FzZSBcIm51bWJlclwiOiBpbnRlcnZhbCA9IGNob29zZVRpY2tJbnRlcnZhbChzdGFydCwgc3RvcCwgaW50ZXJ2YWwpLCBzdGVwID0gaW50ZXJ2YWxbMV0sIGludGVydmFsID0gaW50ZXJ2YWxbMF07IGJyZWFrO1xuICAgICAgICBjYXNlIFwic3RyaW5nXCI6IHN0ZXAgPSBzdGVwID09IG51bGwgPyAxIDogTWF0aC5mbG9vcihzdGVwKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IHJldHVybiBpbnRlcnZhbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzRmluaXRlKHN0ZXApICYmIHN0ZXAgPiAwID8gdGltZUludGVydmFsKGludGVydmFsLCBzdGVwKSA6IG51bGw7XG4gICAgfVxuXG4gICAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihpbnRlcnZhbCwgc3RlcCkge1xuICAgICAgdmFyIGRvbWFpbiA9IGxpbmVhci5kb21haW4oKSxcbiAgICAgICAgICB0MCA9IGRvbWFpblswXSxcbiAgICAgICAgICB0MSA9IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV0sXG4gICAgICAgICAgdDtcblxuICAgICAgaWYgKHQxIDwgdDApIHQgPSB0MCwgdDAgPSB0MSwgdDEgPSB0O1xuXG4gICAgICByZXR1cm4gKGludGVydmFsID0gdGlja0ludGVydmFsKGludGVydmFsLCB0MCwgdDEsIHN0ZXApKVxuICAgICAgICAgID8gaW50ZXJ2YWwucmFuZ2UodDAsIHQxICsgMSkgLy8gaW5jbHVzaXZlIHN0b3BcbiAgICAgICAgICA6IFtdO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24oc3BlY2lmaWVyKSB7XG4gICAgICByZXR1cm4gc3BlY2lmaWVyID09IG51bGwgPyB0aWNrRm9ybWF0IDogZm9ybWF0KHNwZWNpZmllcik7XG4gICAgfTtcblxuICAgIHNjYWxlLm5pY2UgPSBmdW5jdGlvbihpbnRlcnZhbCwgc3RlcCkge1xuICAgICAgdmFyIGRvbWFpbiA9IGxpbmVhci5kb21haW4oKSxcbiAgICAgICAgICBpMCA9IDAsXG4gICAgICAgICAgaTEgPSBkb21haW4ubGVuZ3RoIC0gMSxcbiAgICAgICAgICB0MCA9IGRvbWFpbltpMF0sXG4gICAgICAgICAgdDEgPSBkb21haW5baTFdLFxuICAgICAgICAgIHQ7XG5cbiAgICAgIGlmICh0MSA8IHQwKSB7XG4gICAgICAgIHQgPSBpMCwgaTAgPSBpMSwgaTEgPSB0O1xuICAgICAgICB0ID0gdDAsIHQwID0gdDEsIHQxID0gdDtcbiAgICAgIH1cblxuICAgICAgaWYgKGludGVydmFsID0gdGlja0ludGVydmFsKGludGVydmFsLCB0MCwgdDEsIHN0ZXApKSB7XG4gICAgICAgIGRvbWFpbltpMF0gPSAraW50ZXJ2YWwuZmxvb3IodDApO1xuICAgICAgICBkb21haW5baTFdID0gK2ludGVydmFsLmNlaWwodDEpO1xuICAgICAgICBsaW5lYXIuZG9tYWluKGRvbWFpbik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld1RpbWUobGluZWFyLmNvcHkoKSwgdGltZUludGVydmFsLCB0aWNrRm9ybWF0LCBmb3JtYXQpO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmViaW5kKHNjYWxlLCBsaW5lYXIpO1xuICB9XG5cbiAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgIHZhciBrID0gMTtcbiAgICB3aGlsZSAoeCAqIGsgJSAxKSBrICo9IDEwO1xuICAgIHJldHVybiBrO1xuICB9XG5cbiAgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQsIHN0b3AsIHN0ZXApIHtcbiAgICBpZiAoKG4gPSBhcmd1bWVudHMubGVuZ3RoKSA8IDMpIHtcbiAgICAgIHN0ZXAgPSAxO1xuICAgICAgaWYgKG4gPCAyKSB7XG4gICAgICAgIHN0b3AgPSBzdGFydDtcbiAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBpID0gLTEsXG4gICAgICAgIG4gPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoKHN0b3AgLSBzdGFydCkgLyBzdGVwKSkgfCAwLFxuICAgICAgICBrID0gc2NhbGUoTWF0aC5hYnMoc3RlcCkpLFxuICAgICAgICByYW5nZSA9IG5ldyBBcnJheShuKTtcblxuICAgIHN0YXJ0ICo9IGs7XG4gICAgc3RlcCAqPSBrO1xuICAgIHdoaWxlICgrK2kgPCBuKSB7XG4gICAgICByYW5nZVtpXSA9IChzdGFydCArIGkgKiBzdGVwKSAvIGs7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJhbmdlO1xuICB9XG5cbiAgZnVuY3Rpb24gbWlsbGlzZWNvbmQoc3RlcCkge1xuICAgIHJldHVybiB7XG4gICAgICByYW5nZTogZnVuY3Rpb24oc3RhcnQsIHN0b3ApIHsgcmV0dXJuIHJhbmdlKE1hdGguY2VpbChzdGFydCAvIHN0ZXApICogc3RlcCwgc3RvcCwgc3RlcCkubWFwKG5ld0RhdGUpOyB9LFxuICAgICAgZmxvb3I6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIG5ld0RhdGUoTWF0aC5mbG9vcihkYXRlIC8gc3RlcCkgKiBzdGVwKTsgfSxcbiAgICAgIGNlaWw6IGZ1bmN0aW9uKGRhdGUpIHsgcmV0dXJuIG5ld0RhdGUoTWF0aC5jZWlsKGRhdGUgLyBzdGVwKSAqIHN0ZXApOyB9XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF90aW1lSW50ZXJ2YWwoaW50ZXJ2YWwsIHN0ZXApIHtcbiAgICBzd2l0Y2ggKGludGVydmFsKSB7XG4gICAgICBjYXNlIFwibWlsbGlzZWNvbmRzXCI6IHJldHVybiBtaWxsaXNlY29uZChzdGVwKTtcbiAgICAgIGNhc2UgXCJzZWNvbmRzXCI6IHJldHVybiBzdGVwID4gMSA/IHV0Y1NlY29uZC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRVVENTZWNvbmRzKCkgJSBzdGVwID09PSAwOyB9KSA6IHV0Y1NlY29uZDtcbiAgICAgIGNhc2UgXCJtaW51dGVzXCI6IHJldHVybiBzdGVwID4gMSA/IHV0Y01pbnV0ZS5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRVVENNaW51dGVzKCkgJSBzdGVwID09PSAwOyB9KSA6IHV0Y01pbnV0ZTtcbiAgICAgIGNhc2UgXCJob3Vyc1wiOiByZXR1cm4gc3RlcCA+IDEgPyB1dGNIb3VyLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldFVUQ0hvdXJzKCkgJSBzdGVwID09PSAwOyB9KSA6IHV0Y0hvdXI7XG4gICAgICBjYXNlIFwiZGF5c1wiOiByZXR1cm4gc3RlcCA+IDEgPyB1dGNEYXkuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIChkLmdldFVUQ0RhdGUoKSAtIDEpICUgc3RlcCA9PT0gMDsgfSkgOiB1dGNEYXk7XG4gICAgICBjYXNlIFwid2Vla3NcIjogcmV0dXJuIHN0ZXAgPiAxID8gdXRjV2Vlay5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gdXRjV2Vlay5jb3VudCgwLCBkKSAlIHN0ZXAgPT09IDA7IH0pIDogdXRjV2VlaztcbiAgICAgIGNhc2UgXCJtb250aHNcIjogcmV0dXJuIHN0ZXAgPiAxID8gdXRjTW9udGguZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0VVRDTW9udGgoKSAlIHN0ZXAgPT09IDA7IH0pIDogdXRjTW9udGg7XG4gICAgICBjYXNlIFwieWVhcnNcIjogcmV0dXJuIHN0ZXAgPiAxID8gdXRjWWVhci5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRVVENGdWxsWWVhcigpICUgc3RlcCA9PT0gMDsgfSkgOiB1dGNZZWFyO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlTnVtYmVyKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9ICthLCBiIC09IGEsIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBhICsgYiAqIHQ7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlT2JqZWN0KGEsIGIpIHtcbiAgICB2YXIgaSA9IHt9LFxuICAgICAgICBjID0ge30sXG4gICAgICAgIGs7XG5cbiAgICBmb3IgKGsgaW4gYSkge1xuICAgICAgaWYgKGsgaW4gYikge1xuICAgICAgICBpW2tdID0gaW50ZXJwb2xhdGUoYVtrXSwgYltrXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjW2tdID0gYVtrXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGsgaW4gYikge1xuICAgICAgaWYgKCEoayBpbiBhKSkge1xuICAgICAgICBjW2tdID0gYltrXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgZm9yIChrIGluIGkpIGNba10gPSBpW2tdKHQpO1xuICAgICAgcmV0dXJuIGM7XG4gICAgfTtcbiAgfVxuXG5cbiAgLy8gVE9ETyBzcGFyc2UgYXJyYXlzP1xuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZUFycmF5KGEsIGIpIHtcbiAgICB2YXIgeCA9IFtdLFxuICAgICAgICBjID0gW10sXG4gICAgICAgIG5hID0gYS5sZW5ndGgsXG4gICAgICAgIG5iID0gYi5sZW5ndGgsXG4gICAgICAgIG4wID0gTWF0aC5taW4oYS5sZW5ndGgsIGIubGVuZ3RoKSxcbiAgICAgICAgaTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBuMDsgKytpKSB4LnB1c2goaW50ZXJwb2xhdGUoYVtpXSwgYltpXSkpO1xuICAgIGZvciAoOyBpIDwgbmE7ICsraSkgY1tpXSA9IGFbaV07XG4gICAgZm9yICg7IGkgPCBuYjsgKytpKSBjW2ldID0gYltpXTtcblxuICAgIHJldHVybiBmdW5jdGlvbih0KSB7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbjA7ICsraSkgY1tpXSA9IHhbaV0odCk7XG4gICAgICByZXR1cm4gYztcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2Zvcm1hdChyLCBnLCBiKSB7XG4gICAgaWYgKGlzTmFOKHIpKSByID0gMDtcbiAgICBpZiAoaXNOYU4oZykpIGcgPSAwO1xuICAgIGlmIChpc05hTihiKSkgYiA9IDA7XG4gICAgcmV0dXJuIFwiI1wiXG4gICAgICAgICsgKHIgPCAxNiA/IFwiMFwiICsgci50b1N0cmluZygxNikgOiByLnRvU3RyaW5nKDE2KSlcbiAgICAgICAgKyAoZyA8IDE2ID8gXCIwXCIgKyBnLnRvU3RyaW5nKDE2KSA6IGcudG9TdHJpbmcoMTYpKVxuICAgICAgICArIChiIDwgMTYgPyBcIjBcIiArIGIudG9TdHJpbmcoMTYpIDogYi50b1N0cmluZygxNikpO1xuICB9XG5cbiAgZnVuY3Rpb24gUmdiKHIsIGcsIGIpIHtcbiAgICB0aGlzLnIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQocikpKTtcbiAgICB0aGlzLmcgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQoZykpKTtcbiAgICB0aGlzLmIgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigyNTUsIE1hdGgucm91bmQoYikpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbG9yKCkge31cblxuICBDb2xvci5wcm90b3R5cGUgPSB7XG4gICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMucmdiKCkgKyBcIlwiO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX3Byb3RvdHlwZSA9IFJnYi5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgdmFyIGRhcmtlciA9IC43O1xuXG4gIF9wcm90b3R5cGUuZGFya2VyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBkYXJrZXIgOiBNYXRoLnBvdyhkYXJrZXIsIGspO1xuICAgIHJldHVybiBuZXcgUmdiKHRoaXMuciAqIGssIHRoaXMuZyAqIGssIHRoaXMuYiAqIGspO1xuICB9O1xuXG4gIHZhciBicmlnaHRlciA9IDEgLyBkYXJrZXI7XG5cbiAgX3Byb3RvdHlwZS5icmlnaHRlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gYnJpZ2h0ZXIgOiBNYXRoLnBvdyhicmlnaHRlciwgayk7XG4gICAgcmV0dXJuIG5ldyBSZ2IodGhpcy5yICogaywgdGhpcy5nICogaywgdGhpcy5iICogayk7XG4gIH07XG5cbiAgX3Byb3RvdHlwZS5yZ2IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBfcHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIF9mb3JtYXQodGhpcy5yLCB0aGlzLmcsIHRoaXMuYik7XG4gIH07XG5cbiAgdmFyIG5hbWVkID0gKG5ldyBNYXApXG4gICAgICAuc2V0KFwiYWxpY2VibHVlXCIsIDB4ZjBmOGZmKVxuICAgICAgLnNldChcImFudGlxdWV3aGl0ZVwiLCAweGZhZWJkNylcbiAgICAgIC5zZXQoXCJhcXVhXCIsIDB4MDBmZmZmKVxuICAgICAgLnNldChcImFxdWFtYXJpbmVcIiwgMHg3ZmZmZDQpXG4gICAgICAuc2V0KFwiYXp1cmVcIiwgMHhmMGZmZmYpXG4gICAgICAuc2V0KFwiYmVpZ2VcIiwgMHhmNWY1ZGMpXG4gICAgICAuc2V0KFwiYmlzcXVlXCIsIDB4ZmZlNGM0KVxuICAgICAgLnNldChcImJsYWNrXCIsIDB4MDAwMDAwKVxuICAgICAgLnNldChcImJsYW5jaGVkYWxtb25kXCIsIDB4ZmZlYmNkKVxuICAgICAgLnNldChcImJsdWVcIiwgMHgwMDAwZmYpXG4gICAgICAuc2V0KFwiYmx1ZXZpb2xldFwiLCAweDhhMmJlMilcbiAgICAgIC5zZXQoXCJicm93blwiLCAweGE1MmEyYSlcbiAgICAgIC5zZXQoXCJidXJseXdvb2RcIiwgMHhkZWI4ODcpXG4gICAgICAuc2V0KFwiY2FkZXRibHVlXCIsIDB4NWY5ZWEwKVxuICAgICAgLnNldChcImNoYXJ0cmV1c2VcIiwgMHg3ZmZmMDApXG4gICAgICAuc2V0KFwiY2hvY29sYXRlXCIsIDB4ZDI2OTFlKVxuICAgICAgLnNldChcImNvcmFsXCIsIDB4ZmY3ZjUwKVxuICAgICAgLnNldChcImNvcm5mbG93ZXJibHVlXCIsIDB4NjQ5NWVkKVxuICAgICAgLnNldChcImNvcm5zaWxrXCIsIDB4ZmZmOGRjKVxuICAgICAgLnNldChcImNyaW1zb25cIiwgMHhkYzE0M2MpXG4gICAgICAuc2V0KFwiY3lhblwiLCAweDAwZmZmZilcbiAgICAgIC5zZXQoXCJkYXJrYmx1ZVwiLCAweDAwMDA4YilcbiAgICAgIC5zZXQoXCJkYXJrY3lhblwiLCAweDAwOGI4YilcbiAgICAgIC5zZXQoXCJkYXJrZ29sZGVucm9kXCIsIDB4Yjg4NjBiKVxuICAgICAgLnNldChcImRhcmtncmF5XCIsIDB4YTlhOWE5KVxuICAgICAgLnNldChcImRhcmtncmVlblwiLCAweDAwNjQwMClcbiAgICAgIC5zZXQoXCJkYXJrZ3JleVwiLCAweGE5YTlhOSlcbiAgICAgIC5zZXQoXCJkYXJra2hha2lcIiwgMHhiZGI3NmIpXG4gICAgICAuc2V0KFwiZGFya21hZ2VudGFcIiwgMHg4YjAwOGIpXG4gICAgICAuc2V0KFwiZGFya29saXZlZ3JlZW5cIiwgMHg1NTZiMmYpXG4gICAgICAuc2V0KFwiZGFya29yYW5nZVwiLCAweGZmOGMwMClcbiAgICAgIC5zZXQoXCJkYXJrb3JjaGlkXCIsIDB4OTkzMmNjKVxuICAgICAgLnNldChcImRhcmtyZWRcIiwgMHg4YjAwMDApXG4gICAgICAuc2V0KFwiZGFya3NhbG1vblwiLCAweGU5OTY3YSlcbiAgICAgIC5zZXQoXCJkYXJrc2VhZ3JlZW5cIiwgMHg4ZmJjOGYpXG4gICAgICAuc2V0KFwiZGFya3NsYXRlYmx1ZVwiLCAweDQ4M2Q4YilcbiAgICAgIC5zZXQoXCJkYXJrc2xhdGVncmF5XCIsIDB4MmY0ZjRmKVxuICAgICAgLnNldChcImRhcmtzbGF0ZWdyZXlcIiwgMHgyZjRmNGYpXG4gICAgICAuc2V0KFwiZGFya3R1cnF1b2lzZVwiLCAweDAwY2VkMSlcbiAgICAgIC5zZXQoXCJkYXJrdmlvbGV0XCIsIDB4OTQwMGQzKVxuICAgICAgLnNldChcImRlZXBwaW5rXCIsIDB4ZmYxNDkzKVxuICAgICAgLnNldChcImRlZXBza3libHVlXCIsIDB4MDBiZmZmKVxuICAgICAgLnNldChcImRpbWdyYXlcIiwgMHg2OTY5NjkpXG4gICAgICAuc2V0KFwiZGltZ3JleVwiLCAweDY5Njk2OSlcbiAgICAgIC5zZXQoXCJkb2RnZXJibHVlXCIsIDB4MWU5MGZmKVxuICAgICAgLnNldChcImZpcmVicmlja1wiLCAweGIyMjIyMilcbiAgICAgIC5zZXQoXCJmbG9yYWx3aGl0ZVwiLCAweGZmZmFmMClcbiAgICAgIC5zZXQoXCJmb3Jlc3RncmVlblwiLCAweDIyOGIyMilcbiAgICAgIC5zZXQoXCJmdWNoc2lhXCIsIDB4ZmYwMGZmKVxuICAgICAgLnNldChcImdhaW5zYm9yb1wiLCAweGRjZGNkYylcbiAgICAgIC5zZXQoXCJnaG9zdHdoaXRlXCIsIDB4ZjhmOGZmKVxuICAgICAgLnNldChcImdvbGRcIiwgMHhmZmQ3MDApXG4gICAgICAuc2V0KFwiZ29sZGVucm9kXCIsIDB4ZGFhNTIwKVxuICAgICAgLnNldChcImdyYXlcIiwgMHg4MDgwODApXG4gICAgICAuc2V0KFwiZ3JlZW5cIiwgMHgwMDgwMDApXG4gICAgICAuc2V0KFwiZ3JlZW55ZWxsb3dcIiwgMHhhZGZmMmYpXG4gICAgICAuc2V0KFwiZ3JleVwiLCAweDgwODA4MClcbiAgICAgIC5zZXQoXCJob25leWRld1wiLCAweGYwZmZmMClcbiAgICAgIC5zZXQoXCJob3RwaW5rXCIsIDB4ZmY2OWI0KVxuICAgICAgLnNldChcImluZGlhbnJlZFwiLCAweGNkNWM1YylcbiAgICAgIC5zZXQoXCJpbmRpZ29cIiwgMHg0YjAwODIpXG4gICAgICAuc2V0KFwiaXZvcnlcIiwgMHhmZmZmZjApXG4gICAgICAuc2V0KFwia2hha2lcIiwgMHhmMGU2OGMpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJcIiwgMHhlNmU2ZmEpXG4gICAgICAuc2V0KFwibGF2ZW5kZXJibHVzaFwiLCAweGZmZjBmNSlcbiAgICAgIC5zZXQoXCJsYXduZ3JlZW5cIiwgMHg3Y2ZjMDApXG4gICAgICAuc2V0KFwibGVtb25jaGlmZm9uXCIsIDB4ZmZmYWNkKVxuICAgICAgLnNldChcImxpZ2h0Ymx1ZVwiLCAweGFkZDhlNilcbiAgICAgIC5zZXQoXCJsaWdodGNvcmFsXCIsIDB4ZjA4MDgwKVxuICAgICAgLnNldChcImxpZ2h0Y3lhblwiLCAweGUwZmZmZilcbiAgICAgIC5zZXQoXCJsaWdodGdvbGRlbnJvZHllbGxvd1wiLCAweGZhZmFkMilcbiAgICAgIC5zZXQoXCJsaWdodGdyYXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRncmVlblwiLCAweDkwZWU5MClcbiAgICAgIC5zZXQoXCJsaWdodGdyZXlcIiwgMHhkM2QzZDMpXG4gICAgICAuc2V0KFwibGlnaHRwaW5rXCIsIDB4ZmZiNmMxKVxuICAgICAgLnNldChcImxpZ2h0c2FsbW9uXCIsIDB4ZmZhMDdhKVxuICAgICAgLnNldChcImxpZ2h0c2VhZ3JlZW5cIiwgMHgyMGIyYWEpXG4gICAgICAuc2V0KFwibGlnaHRza3libHVlXCIsIDB4ODdjZWZhKVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmF5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c2xhdGVncmV5XCIsIDB4Nzc4ODk5KVxuICAgICAgLnNldChcImxpZ2h0c3RlZWxibHVlXCIsIDB4YjBjNGRlKVxuICAgICAgLnNldChcImxpZ2h0eWVsbG93XCIsIDB4ZmZmZmUwKVxuICAgICAgLnNldChcImxpbWVcIiwgMHgwMGZmMDApXG4gICAgICAuc2V0KFwibGltZWdyZWVuXCIsIDB4MzJjZDMyKVxuICAgICAgLnNldChcImxpbmVuXCIsIDB4ZmFmMGU2KVxuICAgICAgLnNldChcIm1hZ2VudGFcIiwgMHhmZjAwZmYpXG4gICAgICAuc2V0KFwibWFyb29uXCIsIDB4ODAwMDAwKVxuICAgICAgLnNldChcIm1lZGl1bWFxdWFtYXJpbmVcIiwgMHg2NmNkYWEpXG4gICAgICAuc2V0KFwibWVkaXVtYmx1ZVwiLCAweDAwMDBjZClcbiAgICAgIC5zZXQoXCJtZWRpdW1vcmNoaWRcIiwgMHhiYTU1ZDMpXG4gICAgICAuc2V0KFwibWVkaXVtcHVycGxlXCIsIDB4OTM3MGRiKVxuICAgICAgLnNldChcIm1lZGl1bXNlYWdyZWVuXCIsIDB4M2NiMzcxKVxuICAgICAgLnNldChcIm1lZGl1bXNsYXRlYmx1ZVwiLCAweDdiNjhlZSlcbiAgICAgIC5zZXQoXCJtZWRpdW1zcHJpbmdncmVlblwiLCAweDAwZmE5YSlcbiAgICAgIC5zZXQoXCJtZWRpdW10dXJxdW9pc2VcIiwgMHg0OGQxY2MpXG4gICAgICAuc2V0KFwibWVkaXVtdmlvbGV0cmVkXCIsIDB4YzcxNTg1KVxuICAgICAgLnNldChcIm1pZG5pZ2h0Ymx1ZVwiLCAweDE5MTk3MClcbiAgICAgIC5zZXQoXCJtaW50Y3JlYW1cIiwgMHhmNWZmZmEpXG4gICAgICAuc2V0KFwibWlzdHlyb3NlXCIsIDB4ZmZlNGUxKVxuICAgICAgLnNldChcIm1vY2Nhc2luXCIsIDB4ZmZlNGI1KVxuICAgICAgLnNldChcIm5hdmFqb3doaXRlXCIsIDB4ZmZkZWFkKVxuICAgICAgLnNldChcIm5hdnlcIiwgMHgwMDAwODApXG4gICAgICAuc2V0KFwib2xkbGFjZVwiLCAweGZkZjVlNilcbiAgICAgIC5zZXQoXCJvbGl2ZVwiLCAweDgwODAwMClcbiAgICAgIC5zZXQoXCJvbGl2ZWRyYWJcIiwgMHg2YjhlMjMpXG4gICAgICAuc2V0KFwib3JhbmdlXCIsIDB4ZmZhNTAwKVxuICAgICAgLnNldChcIm9yYW5nZXJlZFwiLCAweGZmNDUwMClcbiAgICAgIC5zZXQoXCJvcmNoaWRcIiwgMHhkYTcwZDYpXG4gICAgICAuc2V0KFwicGFsZWdvbGRlbnJvZFwiLCAweGVlZThhYSlcbiAgICAgIC5zZXQoXCJwYWxlZ3JlZW5cIiwgMHg5OGZiOTgpXG4gICAgICAuc2V0KFwicGFsZXR1cnF1b2lzZVwiLCAweGFmZWVlZSlcbiAgICAgIC5zZXQoXCJwYWxldmlvbGV0cmVkXCIsIDB4ZGI3MDkzKVxuICAgICAgLnNldChcInBhcGF5YXdoaXBcIiwgMHhmZmVmZDUpXG4gICAgICAuc2V0KFwicGVhY2hwdWZmXCIsIDB4ZmZkYWI5KVxuICAgICAgLnNldChcInBlcnVcIiwgMHhjZDg1M2YpXG4gICAgICAuc2V0KFwicGlua1wiLCAweGZmYzBjYilcbiAgICAgIC5zZXQoXCJwbHVtXCIsIDB4ZGRhMGRkKVxuICAgICAgLnNldChcInBvd2RlcmJsdWVcIiwgMHhiMGUwZTYpXG4gICAgICAuc2V0KFwicHVycGxlXCIsIDB4ODAwMDgwKVxuICAgICAgLnNldChcInJlYmVjY2FwdXJwbGVcIiwgMHg2NjMzOTkpXG4gICAgICAuc2V0KFwicmVkXCIsIDB4ZmYwMDAwKVxuICAgICAgLnNldChcInJvc3licm93blwiLCAweGJjOGY4ZilcbiAgICAgIC5zZXQoXCJyb3lhbGJsdWVcIiwgMHg0MTY5ZTEpXG4gICAgICAuc2V0KFwic2FkZGxlYnJvd25cIiwgMHg4YjQ1MTMpXG4gICAgICAuc2V0KFwic2FsbW9uXCIsIDB4ZmE4MDcyKVxuICAgICAgLnNldChcInNhbmR5YnJvd25cIiwgMHhmNGE0NjApXG4gICAgICAuc2V0KFwic2VhZ3JlZW5cIiwgMHgyZThiNTcpXG4gICAgICAuc2V0KFwic2Vhc2hlbGxcIiwgMHhmZmY1ZWUpXG4gICAgICAuc2V0KFwic2llbm5hXCIsIDB4YTA1MjJkKVxuICAgICAgLnNldChcInNpbHZlclwiLCAweGMwYzBjMClcbiAgICAgIC5zZXQoXCJza3libHVlXCIsIDB4ODdjZWViKVxuICAgICAgLnNldChcInNsYXRlYmx1ZVwiLCAweDZhNWFjZClcbiAgICAgIC5zZXQoXCJzbGF0ZWdyYXlcIiwgMHg3MDgwOTApXG4gICAgICAuc2V0KFwic2xhdGVncmV5XCIsIDB4NzA4MDkwKVxuICAgICAgLnNldChcInNub3dcIiwgMHhmZmZhZmEpXG4gICAgICAuc2V0KFwic3ByaW5nZ3JlZW5cIiwgMHgwMGZmN2YpXG4gICAgICAuc2V0KFwic3RlZWxibHVlXCIsIDB4NDY4MmI0KVxuICAgICAgLnNldChcInRhblwiLCAweGQyYjQ4YylcbiAgICAgIC5zZXQoXCJ0ZWFsXCIsIDB4MDA4MDgwKVxuICAgICAgLnNldChcInRoaXN0bGVcIiwgMHhkOGJmZDgpXG4gICAgICAuc2V0KFwidG9tYXRvXCIsIDB4ZmY2MzQ3KVxuICAgICAgLnNldChcInR1cnF1b2lzZVwiLCAweDQwZTBkMClcbiAgICAgIC5zZXQoXCJ2aW9sZXRcIiwgMHhlZTgyZWUpXG4gICAgICAuc2V0KFwid2hlYXRcIiwgMHhmNWRlYjMpXG4gICAgICAuc2V0KFwid2hpdGVcIiwgMHhmZmZmZmYpXG4gICAgICAuc2V0KFwid2hpdGVzbW9rZVwiLCAweGY1ZjVmNSlcbiAgICAgIC5zZXQoXCJ5ZWxsb3dcIiwgMHhmZmZmMDApXG4gICAgICAuc2V0KFwieWVsbG93Z3JlZW5cIiwgMHg5YWNkMzIpO1xuXG4gIGZ1bmN0aW9uIHJnYm4obikge1xuICAgIHJldHVybiByZ2IobiA+PiAxNiAmIDB4ZmYsIG4gPj4gOCAmIDB4ZmYsIG4gJiAweGZmKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEhzbChoLCBzLCBsKSB7XG4gICAgdGhpcy5oID0gK2g7XG4gICAgdGhpcy5zID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oMSwgK3MpKTtcbiAgICB0aGlzLmwgPSBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCArbCkpO1xuICB9XG5cbiAgdmFyIHByb3RvdHlwZSA9IEhzbC5wcm90b3R5cGUgPSBuZXcgQ29sb3I7XG5cbiAgcHJvdG90eXBlLmJyaWdodGVyID0gZnVuY3Rpb24oaykge1xuICAgIGsgPSBrID09IG51bGwgPyBicmlnaHRlciA6IE1hdGgucG93KGJyaWdodGVyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cbiAgcHJvdG90eXBlLmRhcmtlciA9IGZ1bmN0aW9uKGspIHtcbiAgICBrID0gayA9PSBudWxsID8gZGFya2VyIDogTWF0aC5wb3coZGFya2VyLCBrKTtcbiAgICByZXR1cm4gbmV3IEhzbCh0aGlzLmgsIHRoaXMucywgdGhpcy5sICogayk7XG4gIH07XG5cblxuICAvKiBGcm9tIEZ2RCAxMy4zNywgQ1NTIENvbG9yIE1vZHVsZSBMZXZlbCAzICovXG4gIGZ1bmN0aW9uIGhzbDJyZ2IoaCwgbTEsIG0yKSB7XG4gICAgcmV0dXJuIChoIDwgNjAgPyBtMSArIChtMiAtIG0xKSAqIGggLyA2MFxuICAgICAgICA6IGggPCAxODAgPyBtMlxuICAgICAgICA6IGggPCAyNDAgPyBtMSArIChtMiAtIG0xKSAqICgyNDAgLSBoKSAvIDYwXG4gICAgICAgIDogbTEpICogMjU1O1xuICB9XG5cbiAgcHJvdG90eXBlLnJnYiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBoID0gdGhpcy5oICUgMzYwICsgKHRoaXMuaCA8IDApICogMzYwLFxuICAgICAgICBzID0gaXNOYU4oaCkgfHwgaXNOYU4odGhpcy5zKSA/IDAgOiB0aGlzLnMsXG4gICAgICAgIGwgPSB0aGlzLmwsXG4gICAgICAgIG0yID0gbCA8PSAuNSA/IGwgKiAoMSArIHMpIDogbCArIHMgLSBsICogcyxcbiAgICAgICAgbTEgPSAyICogbCAtIG0yO1xuICAgIHJldHVybiBuZXcgUmdiKFxuICAgICAgaHNsMnJnYihoID49IDI0MCA/IGggLSAyNDAgOiBoICsgMTIwLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoLCBtMSwgbTIpLFxuICAgICAgaHNsMnJnYihoIDwgMTIwID8gaCArIDI0MCA6IGggLSAxMjAsIG0xLCBtMilcbiAgICApO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGhzbChoLCBzLCBsKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGlmIChoIGluc3RhbmNlb2YgSHNsKSB7XG4gICAgICAgIGwgPSBoLmw7XG4gICAgICAgIHMgPSBoLnM7XG4gICAgICAgIGggPSBoLmg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIShoIGluc3RhbmNlb2YgQ29sb3IpKSBoID0gY29sb3IoaCk7XG4gICAgICAgIGlmIChoKSB7XG4gICAgICAgICAgaWYgKGggaW5zdGFuY2VvZiBIc2wpIHJldHVybiBoO1xuICAgICAgICAgIGggPSBoLnJnYigpO1xuICAgICAgICAgIHZhciByID0gaC5yIC8gMjU1LFxuICAgICAgICAgICAgICBnID0gaC5nIC8gMjU1LFxuICAgICAgICAgICAgICBiID0gaC5iIC8gMjU1LFxuICAgICAgICAgICAgICBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKSxcbiAgICAgICAgICAgICAgbWF4ID0gTWF0aC5tYXgociwgZywgYiksXG4gICAgICAgICAgICAgIHJhbmdlID0gbWF4IC0gbWluO1xuICAgICAgICAgIGwgPSAobWF4ICsgbWluKSAvIDI7XG4gICAgICAgICAgaWYgKHJhbmdlKSB7XG4gICAgICAgICAgICBzID0gbCA8IC41ID8gcmFuZ2UgLyAobWF4ICsgbWluKSA6IHJhbmdlIC8gKDIgLSBtYXggLSBtaW4pO1xuICAgICAgICAgICAgaWYgKHIgPT09IG1heCkgaCA9IChnIC0gYikgLyByYW5nZSArIChnIDwgYikgKiA2O1xuICAgICAgICAgICAgZWxzZSBpZiAoZyA9PT0gbWF4KSBoID0gKGIgLSByKSAvIHJhbmdlICsgMjtcbiAgICAgICAgICAgIGVsc2UgaCA9IChyIC0gZykgLyByYW5nZSArIDQ7XG4gICAgICAgICAgICBoICo9IDYwO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoID0gTmFOO1xuICAgICAgICAgICAgcyA9IGwgPiAwICYmIGwgPCAxID8gMCA6IGg7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGggPSBzID0gbCA9IE5hTjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IEhzbChoLCBzLCBsKTtcbiAgfVxuXG4gIHZhciByZUhzbFBlcmNlbnQgPSAvXmhzbFxcKFxccyooWy0rXT9cXGQrKD86XFwuXFxkKyk/KVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccyosXFxzKihbLStdP1xcZCsoPzpcXC5cXGQrKT8pJVxccypcXCkkLztcblxuICB2YXIgcmVSZ2JQZXJjZW50ID0gL15yZ2JcXChcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKixcXHMqKFstK10/XFxkKyg/OlxcLlxcZCspPyklXFxzKlxcKSQvO1xuXG4gIHZhciByZVJnYkludGVnZXIgPSAvXnJnYlxcKFxccyooWy0rXT9cXGQrKVxccyosXFxzKihbLStdP1xcZCspXFxzKixcXHMqKFstK10/XFxkKylcXHMqXFwpJC87XG5cbiAgdmFyIHJlSGV4NiA9IC9eIyhbMC05YS1mXXs2fSkkLztcblxuICB2YXIgcmVIZXgzID0gL14jKFswLTlhLWZdezN9KSQvO1xuXG4gIGZ1bmN0aW9uIGNvbG9yKGZvcm1hdCkge1xuICAgIHZhciBtO1xuICAgIGZvcm1hdCA9IChmb3JtYXQgKyBcIlwiKS50cmltKCkudG9Mb3dlckNhc2UoKTtcbiAgICByZXR1cm4gKG0gPSByZUhleDMuZXhlYyhmb3JtYXQpKSA/IChtID0gcGFyc2VJbnQobVsxXSwgMTYpLCByZ2IoKG0gPj4gOCAmIDB4ZikgfCAobSA+PiA0ICYgMHgwZjApLCAobSA+PiA0ICYgMHhmKSB8IChtICYgMHhmMCksICgobSAmIDB4ZikgPDwgNCkgfCAobSAmIDB4ZikpKSAvLyAjZjAwXG4gICAgICAgIDogKG0gPSByZUhleDYuZXhlYyhmb3JtYXQpKSA/IHJnYm4ocGFyc2VJbnQobVsxXSwgMTYpKSAvLyAjZmYwMDAwXG4gICAgICAgIDogKG0gPSByZVJnYkludGVnZXIuZXhlYyhmb3JtYXQpKSA/IHJnYihtWzFdLCBtWzJdLCBtWzNdKSAvLyByZ2IoMjU1LDAsMClcbiAgICAgICAgOiAobSA9IHJlUmdiUGVyY2VudC5leGVjKGZvcm1hdCkpID8gcmdiKG1bMV0gKiAyLjU1LCBtWzJdICogMi41NSwgbVszXSAqIDIuNTUpIC8vIHJnYigxMDAlLDAlLDAlKVxuICAgICAgICA6IChtID0gcmVIc2xQZXJjZW50LmV4ZWMoZm9ybWF0KSkgPyBoc2wobVsxXSwgbVsyXSAqIC4wMSwgbVszXSAqIC4wMSkgLy8gaHNsKDEyMCw1MCUsNTAlKVxuICAgICAgICA6IG5hbWVkLmhhcyhmb3JtYXQpID8gcmdibihuYW1lZC5nZXQoZm9ybWF0KSlcbiAgICAgICAgOiBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gcmdiKHIsIGcsIGIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgaWYgKCEociBpbnN0YW5jZW9mIENvbG9yKSkgciA9IGNvbG9yKHIpO1xuICAgICAgaWYgKHIpIHtcbiAgICAgICAgciA9IHIucmdiKCk7XG4gICAgICAgIGIgPSByLmI7XG4gICAgICAgIGcgPSByLmc7XG4gICAgICAgIHIgPSByLnI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByID0gZyA9IGIgPSBOYU47XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBuZXcgUmdiKHIsIGcsIGIpO1xuICB9XG5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGVSZ2IoYSwgYikge1xuICAgIGEgPSByZ2IoYSk7XG4gICAgYiA9IHJnYihiKTtcbiAgICB2YXIgYXIgPSBhLnIsXG4gICAgICAgIGFnID0gYS5nLFxuICAgICAgICBhYiA9IGEuYixcbiAgICAgICAgYnIgPSBiLnIgLSBhcixcbiAgICAgICAgYmcgPSBiLmcgLSBhZyxcbiAgICAgICAgYmIgPSBiLmIgLSBhYjtcbiAgICByZXR1cm4gZnVuY3Rpb24odCkge1xuICAgICAgcmV0dXJuIF9mb3JtYXQoTWF0aC5yb3VuZChhciArIGJyICogdCksIE1hdGgucm91bmQoYWcgKyBiZyAqIHQpLCBNYXRoLnJvdW5kKGFiICsgYmIgKiB0KSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlMChiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlMShiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBiKHQpICsgXCJcIjtcbiAgICB9O1xuICB9XG5cbiAgdmFyIHJlQSA9IC9bLStdPyg/OlxcZCtcXC4/XFxkKnxcXC4/XFxkKykoPzpbZUVdWy0rXT9cXGQrKT8vZztcbiAgdmFyIHJlQiA9IG5ldyBSZWdFeHAocmVBLnNvdXJjZSwgXCJnXCIpO1xuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlU3RyaW5nKGEsIGIpIHtcbiAgICB2YXIgYmkgPSByZUEubGFzdEluZGV4ID0gcmVCLmxhc3RJbmRleCA9IDAsIC8vIHNjYW4gaW5kZXggZm9yIG5leHQgbnVtYmVyIGluIGJcbiAgICAgICAgYW0sIC8vIGN1cnJlbnQgbWF0Y2ggaW4gYVxuICAgICAgICBibSwgLy8gY3VycmVudCBtYXRjaCBpbiBiXG4gICAgICAgIGJzLCAvLyBzdHJpbmcgcHJlY2VkaW5nIGN1cnJlbnQgbnVtYmVyIGluIGIsIGlmIGFueVxuICAgICAgICBpID0gLTEsIC8vIGluZGV4IGluIHNcbiAgICAgICAgcyA9IFtdLCAvLyBzdHJpbmcgY29uc3RhbnRzIGFuZCBwbGFjZWhvbGRlcnNcbiAgICAgICAgcSA9IFtdOyAvLyBudW1iZXIgaW50ZXJwb2xhdG9yc1xuXG4gICAgLy8gQ29lcmNlIGlucHV0cyB0byBzdHJpbmdzLlxuICAgIGEgPSBhICsgXCJcIiwgYiA9IGIgKyBcIlwiO1xuXG4gICAgLy8gSW50ZXJwb2xhdGUgcGFpcnMgb2YgbnVtYmVycyBpbiBhICYgYi5cbiAgICB3aGlsZSAoKGFtID0gcmVBLmV4ZWMoYSkpXG4gICAgICAgICYmIChibSA9IHJlQi5leGVjKGIpKSkge1xuICAgICAgaWYgKChicyA9IGJtLmluZGV4KSA+IGJpKSB7IC8vIGEgc3RyaW5nIHByZWNlZGVzIHRoZSBuZXh0IG51bWJlciBpbiBiXG4gICAgICAgIGJzID0gYi5zbGljZShiaSwgYnMpO1xuICAgICAgICBpZiAoc1tpXSkgc1tpXSArPSBiczsgLy8gY29hbGVzY2Ugd2l0aCBwcmV2aW91cyBzdHJpbmdcbiAgICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICAgIH1cbiAgICAgIGlmICgoYW0gPSBhbVswXSkgPT09IChibSA9IGJtWzBdKSkgeyAvLyBudW1iZXJzIGluIGEgJiBiIG1hdGNoXG4gICAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJtOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgICBlbHNlIHNbKytpXSA9IGJtO1xuICAgICAgfSBlbHNlIHsgLy8gaW50ZXJwb2xhdGUgbm9uLW1hdGNoaW5nIG51bWJlcnNcbiAgICAgICAgc1srK2ldID0gbnVsbDtcbiAgICAgICAgcS5wdXNoKHtpOiBpLCB4OiBpbnRlcnBvbGF0ZU51bWJlcihhbSwgYm0pfSk7XG4gICAgICB9XG4gICAgICBiaSA9IHJlQi5sYXN0SW5kZXg7XG4gICAgfVxuXG4gICAgLy8gQWRkIHJlbWFpbnMgb2YgYi5cbiAgICBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgICAgYnMgPSBiLnNsaWNlKGJpKTtcbiAgICAgIGlmIChzW2ldKSBzW2ldICs9IGJzOyAvLyBjb2FsZXNjZSB3aXRoIHByZXZpb3VzIHN0cmluZ1xuICAgICAgZWxzZSBzWysraV0gPSBicztcbiAgICB9XG5cbiAgICAvLyBTcGVjaWFsIG9wdGltaXphdGlvbiBmb3Igb25seSBhIHNpbmdsZSBtYXRjaC5cbiAgICAvLyBPdGhlcndpc2UsIGludGVycG9sYXRlIGVhY2ggb2YgdGhlIG51bWJlcnMgYW5kIHJlam9pbiB0aGUgc3RyaW5nLlxuICAgIHJldHVybiBzLmxlbmd0aCA8IDIgPyAocVswXVxuICAgICAgICA/IGludGVycG9sYXRlMShxWzBdLngpXG4gICAgICAgIDogaW50ZXJwb2xhdGUwKGIpKVxuICAgICAgICA6IChiID0gcS5sZW5ndGgsIGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBvOyBpIDwgYjsgKytpKSBzWyhvID0gcVtpXSkuaV0gPSBvLngodCk7XG4gICAgICAgICAgICByZXR1cm4gcy5qb2luKFwiXCIpO1xuICAgICAgICAgIH0pO1xuICB9XG5cbiAgdmFyIGludGVycG9sYXRvcnMgPSBbXG4gICAgZnVuY3Rpb24oYSwgYikge1xuICAgICAgdmFyIHQgPSB0eXBlb2YgYiwgYztcbiAgICAgIHJldHVybiAodCA9PT0gXCJzdHJpbmdcIiA/ICgoYyA9IGNvbG9yKGIpKSA/IChiID0gYywgaW50ZXJwb2xhdGVSZ2IpIDogaW50ZXJwb2xhdGVTdHJpbmcpXG4gICAgICAgICAgOiBiIGluc3RhbmNlb2YgY29sb3IgPyBpbnRlcnBvbGF0ZVJnYlxuICAgICAgICAgIDogQXJyYXkuaXNBcnJheShiKSA/IGludGVycG9sYXRlQXJyYXlcbiAgICAgICAgICA6IHQgPT09IFwib2JqZWN0XCIgJiYgaXNOYU4oYikgPyBpbnRlcnBvbGF0ZU9iamVjdFxuICAgICAgICAgIDogaW50ZXJwb2xhdGVOdW1iZXIpKGEsIGIpO1xuICAgIH1cbiAgXTtcblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShhLCBiKSB7XG4gICAgdmFyIGkgPSBpbnRlcnBvbGF0b3JzLmxlbmd0aCwgZjtcbiAgICB3aGlsZSAoLS1pID49IDAgJiYgIShmID0gaW50ZXJwb2xhdG9yc1tpXShhLCBiKSkpO1xuICAgIHJldHVybiBmO1xuICB9XG5cbiAgZnVuY3Rpb24gbmljZShkb21haW4sIHN0ZXApIHtcbiAgICBkb21haW4gPSBkb21haW4uc2xpY2UoKTtcbiAgICBpZiAoIXN0ZXApIHJldHVybiBkb21haW47XG5cbiAgICB2YXIgaTAgPSAwLFxuICAgICAgICBpMSA9IGRvbWFpbi5sZW5ndGggLSAxLFxuICAgICAgICB4MCA9IGRvbWFpbltpMF0sXG4gICAgICAgIHgxID0gZG9tYWluW2kxXSxcbiAgICAgICAgdDtcblxuICAgIGlmICh4MSA8IHgwKSB7XG4gICAgICB0ID0gaTAsIGkwID0gaTEsIGkxID0gdDtcbiAgICAgIHQgPSB4MCwgeDAgPSB4MSwgeDEgPSB0O1xuICAgIH1cblxuICAgIGRvbWFpbltpMF0gPSBNYXRoLmZsb29yKHgwIC8gc3RlcCkgKiBzdGVwO1xuICAgIGRvbWFpbltpMV0gPSBNYXRoLmNlaWwoeDEgLyBzdGVwKSAqIHN0ZXA7XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIHZhciBwcmVmaXhlcyA9IFtcInlcIixcInpcIixcImFcIixcImZcIixcInBcIixcIm5cIixcIsK1XCIsXCJtXCIsXCJcIixcImtcIixcIk1cIixcIkdcIixcIlRcIixcIlBcIixcIkVcIixcIlpcIixcIllcIl07XG5cblxuICAvLyBDb21wdXRlcyB0aGUgZGVjaW1hbCBjb2VmZmljaWVudCBhbmQgZXhwb25lbnQgb2YgdGhlIHNwZWNpZmllZCBudW1iZXIgeCB3aXRoXG4gIC8vIHNpZ25pZmljYW50IGRpZ2l0cyBwLCB3aGVyZSB4IGlzIHBvc2l0aXZlIGFuZCBwIGlzIGluIFsxLCAyMV0gb3IgdW5kZWZpbmVkLlxuICAvLyBGb3IgZXhhbXBsZSwgZm9ybWF0RGVjaW1hbCgxLjIzKSByZXR1cm5zIFtcIjEyM1wiLCAwXS5cbiAgZnVuY3Rpb24gZm9ybWF0RGVjaW1hbCh4LCBwKSB7XG4gICAgaWYgKChpID0gKHggPSBwID8geC50b0V4cG9uZW50aWFsKHAgLSAxKSA6IHgudG9FeHBvbmVudGlhbCgpKS5pbmRleE9mKFwiZVwiKSkgPCAwKSByZXR1cm4gbnVsbDsgLy8gTmFOLCDCsUluZmluaXR5XG4gICAgdmFyIGksIGNvZWZmaWNpZW50ID0geC5zbGljZSgwLCBpKTtcblxuICAgIC8vIFRoZSBzdHJpbmcgcmV0dXJuZWQgYnkgdG9FeHBvbmVudGlhbCBlaXRoZXIgaGFzIHRoZSBmb3JtIFxcZFxcLlxcZCtlWy0rXVxcZCtcbiAgICAvLyAoZS5nLiwgMS4yZSszKSBvciB0aGUgZm9ybSBcXGRlWy0rXVxcZCsgKGUuZy4sIDFlKzMpLlxuICAgIHJldHVybiBbXG4gICAgICBjb2VmZmljaWVudC5sZW5ndGggPiAxID8gY29lZmZpY2llbnRbMF0gKyBjb2VmZmljaWVudC5zbGljZSgyKSA6IGNvZWZmaWNpZW50LFxuICAgICAgK3guc2xpY2UoaSArIDEpXG4gICAgXTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGV4cG9uZW50KHgpIHtcbiAgICByZXR1cm4geCA9IGZvcm1hdERlY2ltYWwoTWF0aC5hYnMoeCkpLCB4ID8geFsxXSA6IE5hTjtcbiAgfVxuXG4gIHZhciBwcmVmaXhFeHBvbmVudDtcblxuICBmdW5jdGlvbiBmb3JtYXRQcmVmaXhBdXRvKHgsIHApIHtcbiAgICB2YXIgZCA9IGZvcm1hdERlY2ltYWwoeCwgcCk7XG4gICAgaWYgKCFkKSByZXR1cm4geCArIFwiXCI7XG4gICAgdmFyIGNvZWZmaWNpZW50ID0gZFswXSxcbiAgICAgICAgZXhwb25lbnQgPSBkWzFdLFxuICAgICAgICBpID0gZXhwb25lbnQgLSAocHJlZml4RXhwb25lbnQgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCAvIDMpKSkgKiAzKSArIDEsXG4gICAgICAgIG4gPSBjb2VmZmljaWVudC5sZW5ndGg7XG4gICAgcmV0dXJuIGkgPT09IG4gPyBjb2VmZmljaWVudFxuICAgICAgICA6IGkgPiBuID8gY29lZmZpY2llbnQgKyBuZXcgQXJyYXkoaSAtIG4gKyAxKS5qb2luKFwiMFwiKVxuICAgICAgICA6IGkgPiAwID8gY29lZmZpY2llbnQuc2xpY2UoMCwgaSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGkpXG4gICAgICAgIDogXCIwLlwiICsgbmV3IEFycmF5KDEgLSBpKS5qb2luKFwiMFwiKSArIGZvcm1hdERlY2ltYWwoeCwgcCArIGkgLSAxKVswXTsgLy8gbGVzcyB0aGFuIDF5IVxuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0Um91bmRlZCh4LCBwKSB7XG4gICAgdmFyIGQgPSBmb3JtYXREZWNpbWFsKHgsIHApO1xuICAgIGlmICghZCkgcmV0dXJuIHggKyBcIlwiO1xuICAgIHZhciBjb2VmZmljaWVudCA9IGRbMF0sXG4gICAgICAgIGV4cG9uZW50ID0gZFsxXTtcbiAgICByZXR1cm4gZXhwb25lbnQgPCAwID8gXCIwLlwiICsgbmV3IEFycmF5KC1leHBvbmVudCkuam9pbihcIjBcIikgKyBjb2VmZmljaWVudFxuICAgICAgICA6IGNvZWZmaWNpZW50Lmxlbmd0aCA+IGV4cG9uZW50ICsgMSA/IGNvZWZmaWNpZW50LnNsaWNlKDAsIGV4cG9uZW50ICsgMSkgKyBcIi5cIiArIGNvZWZmaWNpZW50LnNsaWNlKGV4cG9uZW50ICsgMSlcbiAgICAgICAgOiBjb2VmZmljaWVudCArIG5ldyBBcnJheShleHBvbmVudCAtIGNvZWZmaWNpZW50Lmxlbmd0aCArIDIpLmpvaW4oXCIwXCIpO1xuICB9XG5cbiAgZnVuY3Rpb24gZm9ybWF0RGVmYXVsdCh4LCBwKSB7XG4gICAgeCA9IHgudG9QcmVjaXNpb24ocCk7XG5cbiAgICBvdXQ6IGZvciAodmFyIG4gPSB4Lmxlbmd0aCwgaSA9IDEsIGkwID0gLTEsIGkxOyBpIDwgbjsgKytpKSB7XG4gICAgICBzd2l0Y2ggKHhbaV0pIHtcbiAgICAgICAgY2FzZSBcIi5cIjogaTAgPSBpMSA9IGk7IGJyZWFrO1xuICAgICAgICBjYXNlIFwiMFwiOiBpZiAoaTAgPT09IDApIGkwID0gaTsgaTEgPSBpOyBicmVhaztcbiAgICAgICAgY2FzZSBcImVcIjogYnJlYWsgb3V0O1xuICAgICAgICBkZWZhdWx0OiBpZiAoaTAgPiAwKSBpMCA9IDA7IGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpMCA+IDAgPyB4LnNsaWNlKDAsIGkwKSArIHguc2xpY2UoaTEgKyAxKSA6IHg7XG4gIH1cblxuICB2YXIgZm9ybWF0VHlwZXMgPSB7XG4gICAgXCJcIjogZm9ybWF0RGVmYXVsdCxcbiAgICBcIiVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4gKHggKiAxMDApLnRvRml4ZWQocCk7IH0sXG4gICAgXCJiXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMik7IH0sXG4gICAgXCJjXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHggKyBcIlwiOyB9LFxuICAgIFwiZFwiOiBmdW5jdGlvbih4KSB7IHJldHVybiBNYXRoLnJvdW5kKHgpLnRvU3RyaW5nKDEwKTsgfSxcbiAgICBcImVcIjogZnVuY3Rpb24oeCwgcCkgeyByZXR1cm4geC50b0V4cG9uZW50aWFsKHApOyB9LFxuICAgIFwiZlwiOiBmdW5jdGlvbih4LCBwKSB7IHJldHVybiB4LnRvRml4ZWQocCk7IH0sXG4gICAgXCJnXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIHgudG9QcmVjaXNpb24ocCk7IH0sXG4gICAgXCJvXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoOCk7IH0sXG4gICAgXCJwXCI6IGZ1bmN0aW9uKHgsIHApIHsgcmV0dXJuIGZvcm1hdFJvdW5kZWQoeCAqIDEwMCwgcCk7IH0sXG4gICAgXCJyXCI6IGZvcm1hdFJvdW5kZWQsXG4gICAgXCJzXCI6IGZvcm1hdFByZWZpeEF1dG8sXG4gICAgXCJYXCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7IH0sXG4gICAgXCJ4XCI6IGZ1bmN0aW9uKHgpIHsgcmV0dXJuIE1hdGgucm91bmQoeCkudG9TdHJpbmcoMTYpOyB9XG4gIH07XG5cblxuICAvLyBbW2ZpbGxdYWxpZ25dW3NpZ25dW3N5bWJvbF1bMF1bd2lkdGhdWyxdWy5wcmVjaXNpb25dW3R5cGVdXG4gIHZhciByZSA9IC9eKD86KC4pPyhbPD49Xl0pKT8oWytcXC1cXCggXSk/KFskI10pPygwKT8oXFxkKyk/KCwpPyhcXC5cXGQrKT8oW2EteiVdKT8kL2k7XG5cbiAgZnVuY3Rpb24gRm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllcikge1xuICAgIGlmICghKG1hdGNoID0gcmUuZXhlYyhzcGVjaWZpZXIpKSkgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBmb3JtYXQ6IFwiICsgc3BlY2lmaWVyKTtcblxuICAgIHZhciBtYXRjaCxcbiAgICAgICAgZmlsbCA9IG1hdGNoWzFdIHx8IFwiIFwiLFxuICAgICAgICBhbGlnbiA9IG1hdGNoWzJdIHx8IFwiPlwiLFxuICAgICAgICBzaWduID0gbWF0Y2hbM10gfHwgXCItXCIsXG4gICAgICAgIHN5bWJvbCA9IG1hdGNoWzRdIHx8IFwiXCIsXG4gICAgICAgIHplcm8gPSAhIW1hdGNoWzVdLFxuICAgICAgICB3aWR0aCA9IG1hdGNoWzZdICYmICttYXRjaFs2XSxcbiAgICAgICAgY29tbWEgPSAhIW1hdGNoWzddLFxuICAgICAgICBwcmVjaXNpb24gPSBtYXRjaFs4XSAmJiArbWF0Y2hbOF0uc2xpY2UoMSksXG4gICAgICAgIHR5cGUgPSBtYXRjaFs5XSB8fCBcIlwiO1xuXG4gICAgLy8gVGhlIFwiblwiIHR5cGUgaXMgYW4gYWxpYXMgZm9yIFwiLGdcIi5cbiAgICBpZiAodHlwZSA9PT0gXCJuXCIpIGNvbW1hID0gdHJ1ZSwgdHlwZSA9IFwiZ1wiO1xuXG4gICAgLy8gTWFwIGludmFsaWQgdHlwZXMgdG8gdGhlIGRlZmF1bHQgZm9ybWF0LlxuICAgIGVsc2UgaWYgKCFmb3JtYXRUeXBlc1t0eXBlXSkgdHlwZSA9IFwiXCI7XG5cbiAgICAvLyBJZiB6ZXJvIGZpbGwgaXMgc3BlY2lmaWVkLCBwYWRkaW5nIGdvZXMgYWZ0ZXIgc2lnbiBhbmQgYmVmb3JlIGRpZ2l0cy5cbiAgICBpZiAoemVybyB8fCAoZmlsbCA9PT0gXCIwXCIgJiYgYWxpZ24gPT09IFwiPVwiKSkgemVybyA9IHRydWUsIGZpbGwgPSBcIjBcIiwgYWxpZ24gPSBcIj1cIjtcblxuICAgIHRoaXMuZmlsbCA9IGZpbGw7XG4gICAgdGhpcy5hbGlnbiA9IGFsaWduO1xuICAgIHRoaXMuc2lnbiA9IHNpZ247XG4gICAgdGhpcy5zeW1ib2wgPSBzeW1ib2w7XG4gICAgdGhpcy56ZXJvID0gemVybztcbiAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgdGhpcy5jb21tYSA9IGNvbW1hO1xuICAgIHRoaXMucHJlY2lzaW9uID0gcHJlY2lzaW9uO1xuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gIH1cblxuICBGb3JtYXRTcGVjaWZpZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsbFxuICAgICAgICArIHRoaXMuYWxpZ25cbiAgICAgICAgKyB0aGlzLnNpZ25cbiAgICAgICAgKyB0aGlzLnN5bWJvbFxuICAgICAgICArICh0aGlzLnplcm8gPyBcIjBcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMud2lkdGggPT0gbnVsbCA/IFwiXCIgOiBNYXRoLm1heCgxLCB0aGlzLndpZHRoIHwgMCkpXG4gICAgICAgICsgKHRoaXMuY29tbWEgPyBcIixcIiA6IFwiXCIpXG4gICAgICAgICsgKHRoaXMucHJlY2lzaW9uID09IG51bGwgPyBcIlwiIDogXCIuXCIgKyBNYXRoLm1heCgwLCB0aGlzLnByZWNpc2lvbiB8IDApKVxuICAgICAgICArIHRoaXMudHlwZTtcbiAgfTtcblxuICBmdW5jdGlvbiBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKSB7XG4gICAgcmV0dXJuIG5ldyBGb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pZGVudGl0eSh4KSB7XG4gICAgcmV0dXJuIHg7XG4gIH1cblxuICBmdW5jdGlvbiBmb3JtYXRHcm91cChncm91cGluZywgdGhvdXNhbmRzKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlLCB3aWR0aCkge1xuICAgICAgdmFyIGkgPSB2YWx1ZS5sZW5ndGgsXG4gICAgICAgICAgdCA9IFtdLFxuICAgICAgICAgIGogPSAwLFxuICAgICAgICAgIGcgPSBncm91cGluZ1swXSxcbiAgICAgICAgICBsZW5ndGggPSAwO1xuXG4gICAgICB3aGlsZSAoaSA+IDAgJiYgZyA+IDApIHtcbiAgICAgICAgaWYgKGxlbmd0aCArIGcgKyAxID4gd2lkdGgpIGcgPSBNYXRoLm1heCgxLCB3aWR0aCAtIGxlbmd0aCk7XG4gICAgICAgIHQucHVzaCh2YWx1ZS5zdWJzdHJpbmcoaSAtPSBnLCBpICsgZykpO1xuICAgICAgICBpZiAoKGxlbmd0aCArPSBnICsgMSkgPiB3aWR0aCkgYnJlYWs7XG4gICAgICAgIGcgPSBncm91cGluZ1tqID0gKGogKyAxKSAlIGdyb3VwaW5nLmxlbmd0aF07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0LnJldmVyc2UoKS5qb2luKHRob3VzYW5kcyk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvY2FsZUZvcm1hdChsb2NhbGUpIHtcbiAgICB2YXIgZ3JvdXAgPSBsb2NhbGUuZ3JvdXBpbmcgJiYgbG9jYWxlLnRob3VzYW5kcyA/IGZvcm1hdEdyb3VwKGxvY2FsZS5ncm91cGluZywgbG9jYWxlLnRob3VzYW5kcykgOiBfaWRlbnRpdHksXG4gICAgICAgIGN1cnJlbmN5ID0gbG9jYWxlLmN1cnJlbmN5LFxuICAgICAgICBkZWNpbWFsID0gbG9jYWxlLmRlY2ltYWw7XG5cbiAgICBmdW5jdGlvbiBmb3JtYXQoc3BlY2lmaWVyKSB7XG4gICAgICBzcGVjaWZpZXIgPSBmb3JtYXRTcGVjaWZpZXIoc3BlY2lmaWVyKTtcblxuICAgICAgdmFyIGZpbGwgPSBzcGVjaWZpZXIuZmlsbCxcbiAgICAgICAgICBhbGlnbiA9IHNwZWNpZmllci5hbGlnbixcbiAgICAgICAgICBzaWduID0gc3BlY2lmaWVyLnNpZ24sXG4gICAgICAgICAgc3ltYm9sID0gc3BlY2lmaWVyLnN5bWJvbCxcbiAgICAgICAgICB6ZXJvID0gc3BlY2lmaWVyLnplcm8sXG4gICAgICAgICAgd2lkdGggPSBzcGVjaWZpZXIud2lkdGgsXG4gICAgICAgICAgY29tbWEgPSBzcGVjaWZpZXIuY29tbWEsXG4gICAgICAgICAgcHJlY2lzaW9uID0gc3BlY2lmaWVyLnByZWNpc2lvbixcbiAgICAgICAgICB0eXBlID0gc3BlY2lmaWVyLnR5cGU7XG5cbiAgICAgIC8vIENvbXB1dGUgdGhlIHByZWZpeCBhbmQgc3VmZml4LlxuICAgICAgLy8gRm9yIFNJLXByZWZpeCwgdGhlIHN1ZmZpeCBpcyBsYXppbHkgY29tcHV0ZWQuXG4gICAgICB2YXIgcHJlZml4ID0gc3ltYm9sID09PSBcIiRcIiA/IGN1cnJlbmN5WzBdIDogc3ltYm9sID09PSBcIiNcIiAmJiAvW2JveFhdLy50ZXN0KHR5cGUpID8gXCIwXCIgKyB0eXBlLnRvTG93ZXJDYXNlKCkgOiBcIlwiLFxuICAgICAgICAgIHN1ZmZpeCA9IHN5bWJvbCA9PT0gXCIkXCIgPyBjdXJyZW5jeVsxXSA6IC9bJXBdLy50ZXN0KHR5cGUpID8gXCIlXCIgOiBcIlwiO1xuXG4gICAgICAvLyBXaGF0IGZvcm1hdCBmdW5jdGlvbiBzaG91bGQgd2UgdXNlP1xuICAgICAgLy8gSXMgdGhpcyBhbiBpbnRlZ2VyIHR5cGU/XG4gICAgICAvLyBDYW4gdGhpcyB0eXBlIGdlbmVyYXRlIGV4cG9uZW50aWFsIG5vdGF0aW9uP1xuICAgICAgdmFyIGZvcm1hdFR5cGUgPSBmb3JtYXRUeXBlc1t0eXBlXSxcbiAgICAgICAgICBtYXliZVN1ZmZpeCA9ICF0eXBlIHx8IC9bZGVmZ3BycyVdLy50ZXN0KHR5cGUpO1xuXG4gICAgICAvLyBTZXQgdGhlIGRlZmF1bHQgcHJlY2lzaW9uIGlmIG5vdCBzcGVjaWZpZWQsXG4gICAgICAvLyBvciBjbGFtcCB0aGUgc3BlY2lmaWVkIHByZWNpc2lvbiB0byB0aGUgc3VwcG9ydGVkIHJhbmdlLlxuICAgICAgLy8gRm9yIHNpZ25pZmljYW50IHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMSwgMjFdLlxuICAgICAgLy8gRm9yIGZpeGVkIHByZWNpc2lvbiwgaXQgbXVzdCBiZSBpbiBbMCwgMjBdLlxuICAgICAgcHJlY2lzaW9uID0gcHJlY2lzaW9uID09IG51bGwgPyAodHlwZSA/IDYgOiAxMilcbiAgICAgICAgICA6IC9bZ3Byc10vLnRlc3QodHlwZSkgPyBNYXRoLm1heCgxLCBNYXRoLm1pbigyMSwgcHJlY2lzaW9uKSlcbiAgICAgICAgICA6IE1hdGgubWF4KDAsIE1hdGgubWluKDIwLCBwcmVjaXNpb24pKTtcblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHZhciB2YWx1ZVByZWZpeCA9IHByZWZpeCxcbiAgICAgICAgICAgIHZhbHVlU3VmZml4ID0gc3VmZml4O1xuXG4gICAgICAgIGlmICh0eXBlID09PSBcImNcIikge1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gZm9ybWF0VHlwZSh2YWx1ZSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsdWUgPSArdmFsdWU7XG5cbiAgICAgICAgICAvLyBDb252ZXJ0IG5lZ2F0aXZlIHRvIHBvc2l0aXZlLCBhbmQgY29tcHV0ZSB0aGUgcHJlZml4LlxuICAgICAgICAgIC8vIE5vdGUgdGhhdCAtMCBpcyBub3QgbGVzcyB0aGFuIDAsIGJ1dCAxIC8gLTAgaXMhXG4gICAgICAgICAgdmFyIHZhbHVlTmVnYXRpdmUgPSAodmFsdWUgPCAwIHx8IDEgLyB2YWx1ZSA8IDApICYmICh2YWx1ZSAqPSAtMSwgdHJ1ZSk7XG5cbiAgICAgICAgICAvLyBQZXJmb3JtIHRoZSBpbml0aWFsIGZvcm1hdHRpbmcuXG4gICAgICAgICAgdmFsdWUgPSBmb3JtYXRUeXBlKHZhbHVlLCBwcmVjaXNpb24pO1xuXG4gICAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcHJlZml4IGFuZCBzdWZmaXguXG4gICAgICAgICAgdmFsdWVQcmVmaXggPSAodmFsdWVOZWdhdGl2ZSA/IChzaWduID09PSBcIihcIiA/IHNpZ24gOiBcIi1cIikgOiBzaWduID09PSBcIi1cIiB8fCBzaWduID09PSBcIihcIiA/IFwiXCIgOiBzaWduKSArIHZhbHVlUHJlZml4O1xuICAgICAgICAgIHZhbHVlU3VmZml4ID0gdmFsdWVTdWZmaXggKyAodHlwZSA9PT0gXCJzXCIgPyBwcmVmaXhlc1s4ICsgcHJlZml4RXhwb25lbnQgLyAzXSA6IFwiXCIpICsgKHZhbHVlTmVnYXRpdmUgJiYgc2lnbiA9PT0gXCIoXCIgPyBcIilcIiA6IFwiXCIpO1xuXG4gICAgICAgICAgLy8gQnJlYWsgdGhlIGZvcm1hdHRlZCB2YWx1ZSBpbnRvIHRoZSBpbnRlZ2VyIOKAnHZhbHVl4oCdIHBhcnQgdGhhdCBjYW4gYmVcbiAgICAgICAgICAvLyBncm91cGVkLCBhbmQgZnJhY3Rpb25hbCBvciBleHBvbmVudGlhbCDigJxzdWZmaXjigJ0gcGFydCB0aGF0IGlzIG5vdC5cbiAgICAgICAgICBpZiAobWF5YmVTdWZmaXgpIHtcbiAgICAgICAgICAgIHZhciBpID0gLTEsIG4gPSB2YWx1ZS5sZW5ndGgsIGM7XG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbikge1xuICAgICAgICAgICAgICBpZiAoYyA9IHZhbHVlLmNoYXJDb2RlQXQoaSksIDQ4ID4gYyB8fCBjID4gNTcpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZVN1ZmZpeCA9IChjID09PSA0NiA/IGRlY2ltYWwgKyB2YWx1ZS5zbGljZShpICsgMSkgOiB2YWx1ZS5zbGljZShpKSkgKyB2YWx1ZVN1ZmZpeDtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDAsIGkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIGZpbGwgY2hhcmFjdGVyIGlzIG5vdCBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBiZWZvcmUgcGFkZGluZy5cbiAgICAgICAgaWYgKGNvbW1hICYmICF6ZXJvKSB2YWx1ZSA9IGdyb3VwKHZhbHVlLCBJbmZpbml0eSk7XG5cbiAgICAgICAgLy8gQ29tcHV0ZSB0aGUgcGFkZGluZy5cbiAgICAgICAgdmFyIGxlbmd0aCA9IHZhbHVlUHJlZml4Lmxlbmd0aCArIHZhbHVlLmxlbmd0aCArIHZhbHVlU3VmZml4Lmxlbmd0aCxcbiAgICAgICAgICAgIHBhZGRpbmcgPSBsZW5ndGggPCB3aWR0aCA/IG5ldyBBcnJheSh3aWR0aCAtIGxlbmd0aCArIDEpLmpvaW4oZmlsbCkgOiBcIlwiO1xuXG4gICAgICAgIC8vIElmIHRoZSBmaWxsIGNoYXJhY3RlciBpcyBcIjBcIiwgZ3JvdXBpbmcgaXMgYXBwbGllZCBhZnRlciBwYWRkaW5nLlxuICAgICAgICBpZiAoY29tbWEgJiYgemVybykgdmFsdWUgPSBncm91cChwYWRkaW5nICsgdmFsdWUsIHBhZGRpbmcubGVuZ3RoID8gd2lkdGggLSB2YWx1ZVN1ZmZpeC5sZW5ndGggOiBJbmZpbml0eSksIHBhZGRpbmcgPSBcIlwiO1xuXG4gICAgICAgIC8vIFJlY29uc3RydWN0IHRoZSBmaW5hbCBvdXRwdXQgYmFzZWQgb24gdGhlIGRlc2lyZWQgYWxpZ25tZW50LlxuICAgICAgICBzd2l0Y2ggKGFsaWduKSB7XG4gICAgICAgICAgY2FzZSBcIjxcIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgdmFsdWUgKyB2YWx1ZVN1ZmZpeCArIHBhZGRpbmc7XG4gICAgICAgICAgY2FzZSBcIj1cIjogcmV0dXJuIHZhbHVlUHJlZml4ICsgcGFkZGluZyArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICAgICAgY2FzZSBcIl5cIjogcmV0dXJuIHBhZGRpbmcuc2xpY2UoMCwgbGVuZ3RoID0gcGFkZGluZy5sZW5ndGggPj4gMSkgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXggKyBwYWRkaW5nLnNsaWNlKGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhZGRpbmcgKyB2YWx1ZVByZWZpeCArIHZhbHVlICsgdmFsdWVTdWZmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZvcm1hdFByZWZpeChzcGVjaWZpZXIsIHZhbHVlKSB7XG4gICAgICB2YXIgZiA9IGZvcm1hdCgoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlID0gXCJmXCIsIHNwZWNpZmllcikpLFxuICAgICAgICAgIGUgPSBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyxcbiAgICAgICAgICBrID0gTWF0aC5wb3coMTAsIC1lKSxcbiAgICAgICAgICBwcmVmaXggPSBwcmVmaXhlc1s4ICsgZSAvIDNdO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBmKGsgKiB2YWx1ZSkgKyBwcmVmaXg7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICAgIGZvcm1hdFByZWZpeDogZm9ybWF0UHJlZml4XG4gICAgfTtcbiAgfVxuXG4gIHZhciBsb2NhbGUgPSBsb2NhbGVGb3JtYXQoe1xuICAgIGRlY2ltYWw6IFwiLlwiLFxuICAgIHRob3VzYW5kczogXCIsXCIsXG4gICAgZ3JvdXBpbmc6IFszXSxcbiAgICBjdXJyZW5jeTogW1wiJFwiLCBcIlwiXVxuICB9KTtcblxuICB2YXIgX19mb3JtYXQgPSBsb2NhbGUuZm9ybWF0O1xuXG4gIGZ1bmN0aW9uIHByZWNpc2lvbkZpeGVkKHN0ZXApIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgLWV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICBmdW5jdGlvbiBwcmVjaXNpb25Sb3VuZChzdGVwLCBtYXgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgZXhwb25lbnQoTWF0aC5hYnMobWF4KSkgLSBleHBvbmVudChNYXRoLmFicyhzdGVwKSkpICsgMTtcbiAgfVxuXG4gIHZhciBmb3JtYXRQcmVmaXggPSBsb2NhbGUuZm9ybWF0UHJlZml4O1xuXG4gIGZ1bmN0aW9uIHByZWNpc2lvblByZWZpeChzdGVwLCB2YWx1ZSkge1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1heCgtOCwgTWF0aC5taW4oOCwgTWF0aC5mbG9vcihleHBvbmVudCh2YWx1ZSkgLyAzKSkpICogMyAtIGV4cG9uZW50KE1hdGguYWJzKHN0ZXApKSk7XG4gIH1cblxuICBmdW5jdGlvbiBfX3RpY2tGb3JtYXQoZG9tYWluLCBjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgdmFyIHJhbmdlID0gdGlja1JhbmdlKGRvbWFpbiwgY291bnQpO1xuICAgIGlmIChzcGVjaWZpZXIgPT0gbnVsbCkge1xuICAgICAgc3BlY2lmaWVyID0gXCIsLlwiICsgcHJlY2lzaW9uRml4ZWQocmFuZ2VbMl0pICsgXCJmXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN3aXRjaCAoc3BlY2lmaWVyID0gZm9ybWF0U3BlY2lmaWVyKHNwZWNpZmllciksIHNwZWNpZmllci50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJzXCI6IHtcbiAgICAgICAgICB2YXIgdmFsdWUgPSBNYXRoLm1heChNYXRoLmFicyhyYW5nZVswXSksIE1hdGguYWJzKHJhbmdlWzFdKSk7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvblByZWZpeChyYW5nZVsyXSwgdmFsdWUpO1xuICAgICAgICAgIHJldHVybiBmb3JtYXRQcmVmaXgoc3BlY2lmaWVyLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcIlwiOlxuICAgICAgICBjYXNlIFwiZVwiOlxuICAgICAgICBjYXNlIFwiZ1wiOlxuICAgICAgICBjYXNlIFwicFwiOlxuICAgICAgICBjYXNlIFwiclwiOiB7XG4gICAgICAgICAgaWYgKHNwZWNpZmllci5wcmVjaXNpb24gPT0gbnVsbCkgc3BlY2lmaWVyLnByZWNpc2lvbiA9IHByZWNpc2lvblJvdW5kKHJhbmdlWzJdLCBNYXRoLm1heChNYXRoLmFicyhyYW5nZVswXSksIE1hdGguYWJzKHJhbmdlWzFdKSkpIC0gKHNwZWNpZmllci50eXBlID09PSBcImVcIik7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSBcImZcIjpcbiAgICAgICAgY2FzZSBcIiVcIjoge1xuICAgICAgICAgIGlmIChzcGVjaWZpZXIucHJlY2lzaW9uID09IG51bGwpIHNwZWNpZmllci5wcmVjaXNpb24gPSBwcmVjaXNpb25GaXhlZChyYW5nZVsyXSkgLSAoc3BlY2lmaWVyLnR5cGUgPT09IFwiJVwiKSAqIDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9fZm9ybWF0KHNwZWNpZmllcik7XG4gIH1cblxuICBmdW5jdGlvbiB0aWNrcyhkb21haW4sIGNvdW50KSB7XG4gICAgcmV0dXJuIHJhbmdlLmFwcGx5KG51bGwsIHRpY2tSYW5nZShkb21haW4sIGNvdW50KSk7XG4gIH1cblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZVJvdW5kKGEsIGIpIHtcbiAgICByZXR1cm4gYSA9ICthLCBiIC09IGEsIGZ1bmN0aW9uKHQpIHtcbiAgICAgIHJldHVybiBNYXRoLnJvdW5kKGEgKyBiICogdCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaW50ZXJwb2xhdGVOdW1iZXIoYSwgYikge1xuICAgIGIgPSAoYiAtPSBhID0gK2EpIHx8IDEgLyBiO1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gKHggLSBhKSAvIGI7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHVuaW50ZXJwb2xhdGVDbGFtcChhLCBiKSB7XG4gICAgYiA9IChiIC09IGEgPSArYSkgfHwgMSAvIGI7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHgpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heCgwLCBNYXRoLm1pbigxLCAoeCAtIGEpIC8gYikpO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBiaWxpbmVhcihkb21haW4sIHJhbmdlLCB1bmludGVycG9sYXRlLCBpbnRlcnBvbGF0ZSkge1xuICAgIHZhciB1ID0gdW5pbnRlcnBvbGF0ZShkb21haW5bMF0sIGRvbWFpblsxXSksXG4gICAgICAgIGkgPSBpbnRlcnBvbGF0ZShyYW5nZVswXSwgcmFuZ2VbMV0pO1xuICAgIHJldHVybiBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gaSh1KHgpKTtcbiAgICB9O1xuICB9XG5cbiAgdmFyIGFzY2VuZGluZ0Jpc2VjdCA9IGJpc2VjdG9yKGFzY2VuZGluZyk7XG4gIHZhciBiaXNlY3RSaWdodCA9IGFzY2VuZGluZ0Jpc2VjdC5yaWdodDtcblxuICB2YXIgYmlzZWN0ID0gYmlzZWN0UmlnaHQ7XG5cbiAgZnVuY3Rpb24gcG9seWxpbmVhcihkb21haW4sIHJhbmdlLCB1bmludGVycG9sYXRlLCBpbnRlcnBvbGF0ZSkge1xuICAgIHZhciBrID0gTWF0aC5taW4oZG9tYWluLmxlbmd0aCwgcmFuZ2UubGVuZ3RoKSAtIDEsXG4gICAgICAgIHUgPSBuZXcgQXJyYXkoayksXG4gICAgICAgIGkgPSBuZXcgQXJyYXkoayksXG4gICAgICAgIGogPSAtMTtcblxuICAgIC8vIEhhbmRsZSBkZXNjZW5kaW5nIGRvbWFpbnMuXG4gICAgaWYgKGRvbWFpbltrXSA8IGRvbWFpblswXSkge1xuICAgICAgZG9tYWluID0gZG9tYWluLnNsaWNlKCkucmV2ZXJzZSgpO1xuICAgICAgcmFuZ2UgPSByYW5nZS5zbGljZSgpLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICB3aGlsZSAoKytqIDwgaykge1xuICAgICAgdVtqXSA9IHVuaW50ZXJwb2xhdGUoZG9tYWluW2pdLCBkb21haW5baiArIDFdKTtcbiAgICAgIGlbal0gPSBpbnRlcnBvbGF0ZShyYW5nZVtqXSwgcmFuZ2VbaiArIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oeCkge1xuICAgICAgdmFyIGogPSBiaXNlY3QoZG9tYWluLCB4LCAxLCBrKSAtIDE7XG4gICAgICByZXR1cm4gaVtqXSh1W2pdKHgpKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3TGluZWFyKGRvbWFpbiwgcmFuZ2UsIGludGVycG9sYXRlLCBjbGFtcCkge1xuICAgIHZhciBvdXRwdXQsXG4gICAgICAgIGlucHV0O1xuXG4gICAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICAgIHZhciBsaW5lYXIgPSBNYXRoLm1pbihkb21haW4ubGVuZ3RoLCByYW5nZS5sZW5ndGgpID4gMiA/IHBvbHlsaW5lYXIgOiBiaWxpbmVhcixcbiAgICAgICAgICB1bmludGVycG9sYXRlID0gY2xhbXAgPyB1bmludGVycG9sYXRlQ2xhbXAgOiB1bmludGVycG9sYXRlTnVtYmVyO1xuICAgICAgb3V0cHV0ID0gbGluZWFyKGRvbWFpbiwgcmFuZ2UsIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlKTtcbiAgICAgIGlucHV0ID0gbGluZWFyKHJhbmdlLCBkb21haW4sIHVuaW50ZXJwb2xhdGUsIGludGVycG9sYXRlTnVtYmVyKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gb3V0cHV0KHgpO1xuICAgIH1cblxuICAgIHNjYWxlLmludmVydCA9IGZ1bmN0aW9uKHkpIHtcbiAgICAgIHJldHVybiBpbnB1dCh5KTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChOdW1iZXIpO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZS5zbGljZSgpO1xuICAgICAgcmFuZ2UgPSB4LnNsaWNlKCk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZVJvdW5kID0gZnVuY3Rpb24oeCkge1xuICAgICAgcmV0dXJuIHNjYWxlLnJhbmdlKHgpLmludGVycG9sYXRlKGludGVycG9sYXRlUm91bmQpO1xuICAgIH07XG5cbiAgICBzY2FsZS5jbGFtcCA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGNsYW1wO1xuICAgICAgY2xhbXAgPSAhIXg7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGludGVycG9sYXRlO1xuICAgICAgaW50ZXJwb2xhdGUgPSB4O1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihjb3VudCkge1xuICAgICAgcmV0dXJuIHRpY2tzKGRvbWFpbiwgY291bnQpO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24oY291bnQsIHNwZWNpZmllcikge1xuICAgICAgcmV0dXJuIF9fdGlja0Zvcm1hdChkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpO1xuICAgIH07XG5cbiAgICBzY2FsZS5uaWNlID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIGRvbWFpbiA9IG5pY2UoZG9tYWluLCB0aWNrUmFuZ2UoZG9tYWluLCBjb3VudClbMl0pO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld0xpbmVhcihkb21haW4sIHJhbmdlLCBpbnRlcnBvbGF0ZSwgY2xhbXApO1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVzY2FsZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbGluZWFyKCkge1xuICAgIHJldHVybiBuZXdMaW5lYXIoWzAsIDFdLCBbMCwgMV0sIGludGVycG9sYXRlLCBmYWxzZSk7XG4gIH1cblxuICBmdW5jdGlvbiB1dGNUaW1lKCkge1xuICAgIHJldHVybiBuZXdUaW1lKGxpbmVhcigpLCBfdGltZUludGVydmFsLCBfdGlja0Zvcm1hdCwgdXRjRm9ybWF0KS5kb21haW4oW0RhdGUuVVRDKDIwMDAsIDAsIDEpLCBEYXRlLlVUQygyMDAwLCAwLCAyKV0pO1xuICB9XG5cbiAgdmFyIGZvcm1hdCA9IF9sb2NhbGUuZm9ybWF0O1xuXG4gIHZhciBmb3JtYXRZZWFyID0gZm9ybWF0KFwiJVlcIik7XG5cbiAgdmFyIGZvcm1hdE1vbnRoID0gZm9ybWF0KFwiJUJcIik7XG5cbiAgdmFyIGZvcm1hdFdlZWsgPSBmb3JtYXQoXCIlYiAlZFwiKTtcblxuICB2YXIgZm9ybWF0RGF5ID0gZm9ybWF0KFwiJWEgJWRcIik7XG5cbiAgdmFyIHdlZWsgPSBzdW5kYXk7XG5cbiAgdmFyIG1vbnRoID0gbmV3SW50ZXJ2YWwoZnVuY3Rpb24oZGF0ZSkge1xuICAgIGRhdGUuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgZGF0ZS5zZXREYXRlKDEpO1xuICB9LCBmdW5jdGlvbihkYXRlLCBzdGVwKSB7XG4gICAgZGF0ZS5zZXRNb250aChkYXRlLmdldE1vbnRoKCkgKyBzdGVwKTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBlbmQuZ2V0TW9udGgoKSAtIHN0YXJ0LmdldE1vbnRoKCkgKyAoZW5kLmdldEZ1bGxZZWFyKCkgLSBzdGFydC5nZXRGdWxsWWVhcigpKSAqIDEyO1xuICB9KTtcblxuICB2YXIgZm9ybWF0SG91ciA9IGZvcm1hdChcIiVJICVwXCIpO1xuXG4gIHZhciBmb3JtYXRNaW51dGUgPSBmb3JtYXQoXCIlSTolTVwiKTtcblxuICB2YXIgaG91ciA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldE1pbnV0ZXMoMCwgMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogMzZlNSk7XG4gIH0sIGZ1bmN0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gKGVuZCAtIHN0YXJ0KSAvIDM2ZTU7XG4gIH0pO1xuXG4gIHZhciBmb3JtYXRTZWNvbmQgPSBmb3JtYXQoXCI6JVNcIik7XG5cbiAgdmFyIG1pbnV0ZSA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldFNlY29uZHMoMCwgMCk7XG4gIH0sIGZ1bmN0aW9uKGRhdGUsIHN0ZXApIHtcbiAgICBkYXRlLnNldFRpbWUoK2RhdGUgKyBzdGVwICogNmU0KTtcbiAgfSwgZnVuY3Rpb24oc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiAoZW5kIC0gc3RhcnQpIC8gNmU0O1xuICB9KTtcblxuICB2YXIgZm9ybWF0TWlsbGlzZWNvbmQgPSBmb3JtYXQoXCIuJUxcIik7XG5cbiAgdmFyIHNlY29uZCA9IG5ld0ludGVydmFsKGZ1bmN0aW9uKGRhdGUpIHtcbiAgICBkYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcbiAgfSwgZnVuY3Rpb24oZGF0ZSwgc3RlcCkge1xuICAgIGRhdGUuc2V0VGltZSgrZGF0ZSArIHN0ZXAgKiAxZTMpO1xuICB9LCBmdW5jdGlvbihzdGFydCwgZW5kKSB7XG4gICAgcmV0dXJuIChlbmQgLSBzdGFydCkgLyAxZTM7XG4gIH0pO1xuXG4gIGZ1bmN0aW9uIHRpY2tGb3JtYXQoZGF0ZSkge1xuICAgIHJldHVybiAoc2Vjb25kKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdE1pbGxpc2Vjb25kXG4gICAgICAgIDogbWludXRlKGRhdGUpIDwgZGF0ZSA/IGZvcm1hdFNlY29uZFxuICAgICAgICA6IGhvdXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0TWludXRlXG4gICAgICAgIDogZGF5KGRhdGUpIDwgZGF0ZSA/IGZvcm1hdEhvdXJcbiAgICAgICAgOiBtb250aChkYXRlKSA8IGRhdGUgPyAod2VlayhkYXRlKSA8IGRhdGUgPyBmb3JtYXREYXkgOiBmb3JtYXRXZWVrKVxuICAgICAgICA6IHllYXIoZGF0ZSkgPCBkYXRlID8gZm9ybWF0TW9udGhcbiAgICAgICAgOiBmb3JtYXRZZWFyKShkYXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVJbnRlcnZhbChpbnRlcnZhbCwgc3RlcCkge1xuICAgIHN3aXRjaCAoaW50ZXJ2YWwpIHtcbiAgICAgIGNhc2UgXCJtaWxsaXNlY29uZHNcIjogcmV0dXJuIG1pbGxpc2Vjb25kKHN0ZXApO1xuICAgICAgY2FzZSBcInNlY29uZHNcIjogcmV0dXJuIHN0ZXAgPiAxID8gc2Vjb25kLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldFNlY29uZHMoKSAlIHN0ZXAgPT09IDA7IH0pIDogc2Vjb25kO1xuICAgICAgY2FzZSBcIm1pbnV0ZXNcIjogcmV0dXJuIHN0ZXAgPiAxID8gbWludXRlLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldE1pbnV0ZXMoKSAlIHN0ZXAgPT09IDA7IH0pIDogbWludXRlO1xuICAgICAgY2FzZSBcImhvdXJzXCI6IHJldHVybiBzdGVwID4gMSA/IGhvdXIuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgcmV0dXJuIGQuZ2V0SG91cnMoKSAlIHN0ZXAgPT09IDA7IH0pIDogaG91cjtcbiAgICAgIGNhc2UgXCJkYXlzXCI6IHJldHVybiBzdGVwID4gMSA/IGRheS5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gKGQuZ2V0RGF0ZSgpIC0gMSkgJSBzdGVwID09PSAwOyB9KSA6IGRheTtcbiAgICAgIGNhc2UgXCJ3ZWVrc1wiOiByZXR1cm4gc3RlcCA+IDEgPyB3ZWVrLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiB3ZWVrLmNvdW50KDAsIGQpICUgc3RlcCA9PT0gMDsgfSkgOiB3ZWVrO1xuICAgICAgY2FzZSBcIm1vbnRoc1wiOiByZXR1cm4gc3RlcCA+IDEgPyBtb250aC5maWx0ZXIoZnVuY3Rpb24oZCkgeyByZXR1cm4gZC5nZXRNb250aCgpICUgc3RlcCA9PT0gMDsgfSkgOiBtb250aDtcbiAgICAgIGNhc2UgXCJ5ZWFyc1wiOiByZXR1cm4gc3RlcCA+IDEgPyB5ZWFyLmZpbHRlcihmdW5jdGlvbihkKSB7IHJldHVybiBkLmdldEZ1bGxZZWFyKCkgJSBzdGVwID09PSAwOyB9KSA6IHllYXI7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdGltZSgpIHtcbiAgICByZXR1cm4gbmV3VGltZShsaW5lYXIoKSwgdGltZUludGVydmFsLCB0aWNrRm9ybWF0LCBmb3JtYXQpLmRvbWFpbihbbmV3IERhdGUoMjAwMCwgMCwgMSksIG5ldyBEYXRlKDIwMDAsIDAsIDIpXSk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdUaHJlc2hvbGQoZG9tYWluLCByYW5nZSwgbikge1xuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgaWYgKHggPD0geCkgcmV0dXJuIHJhbmdlW2Jpc2VjdChkb21haW4sIHgsIDAsIG4pXTtcbiAgICB9XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICAgIGRvbWFpbiA9IHguc2xpY2UoKSwgbiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCAtIDEpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIHJhbmdlLnNsaWNlKCk7XG4gICAgICByYW5nZSA9IHguc2xpY2UoKSwgbiA9IE1hdGgubWluKGRvbWFpbi5sZW5ndGgsIHJhbmdlLmxlbmd0aCAtIDEpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5pbnZlcnRFeHRlbnQgPSBmdW5jdGlvbih5KSB7XG4gICAgICByZXR1cm4geSA9IHJhbmdlLmluZGV4T2YoeSksIFtkb21haW5beSAtIDFdLCBkb21haW5beV1dO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3VGhyZXNob2xkKGRvbWFpbiwgcmFuZ2UpO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbGU7XG4gIH1cblxuICBmdW5jdGlvbiB0aHJlc2hvbGQoKSB7XG4gICAgcmV0dXJuIG5ld1RocmVzaG9sZChbLjVdLCBbMCwgMV0sIDEpO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3UG93KGxpbmVhciwgZXhwb25lbnQsIGRvbWFpbikge1xuXG4gICAgZnVuY3Rpb24gcG93cCh4KSB7XG4gICAgICByZXR1cm4geCA8IDAgPyAtTWF0aC5wb3coLXgsIGV4cG9uZW50KSA6IE1hdGgucG93KHgsIGV4cG9uZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwb3diKHgpIHtcbiAgICAgIHJldHVybiB4IDwgMCA/IC1NYXRoLnBvdygteCwgMSAvIGV4cG9uZW50KSA6IE1hdGgucG93KHgsIDEgLyBleHBvbmVudCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuIGxpbmVhcihwb3dwKHgpKTtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gcG93YihsaW5lYXIuaW52ZXJ0KHgpKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZXhwb25lbnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBleHBvbmVudDtcbiAgICAgIGV4cG9uZW50ID0gK3g7XG4gICAgICByZXR1cm4gc2NhbGUuZG9tYWluKGRvbWFpbik7XG4gICAgfTtcblxuICAgIHNjYWxlLmRvbWFpbiA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgICAgZG9tYWluID0geC5tYXAoTnVtYmVyKTtcbiAgICAgIGxpbmVhci5kb21haW4oZG9tYWluLm1hcChwb3dwKSk7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tzID0gZnVuY3Rpb24oY291bnQpIHtcbiAgICAgIHJldHVybiB0aWNrcyhkb21haW4sIGNvdW50KTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja0Zvcm1hdCA9IGZ1bmN0aW9uKGNvdW50LCBzcGVjaWZpZXIpIHtcbiAgICAgIHJldHVybiBfX3RpY2tGb3JtYXQoZG9tYWluLCBjb3VudCwgc3BlY2lmaWVyKTtcbiAgICB9O1xuXG4gICAgc2NhbGUubmljZSA9IGZ1bmN0aW9uKGNvdW50KSB7XG4gICAgICByZXR1cm4gc2NhbGUuZG9tYWluKG5pY2UoZG9tYWluLCB0aWNrUmFuZ2UoZG9tYWluLCBjb3VudClbMl0pKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld1BvdyhsaW5lYXIuY29weSgpLCBleHBvbmVudCwgZG9tYWluKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlYmluZChzY2FsZSwgbGluZWFyKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNxcnQoKSB7XG4gICAgcmV0dXJuIG5ld1BvdyhsaW5lYXIoKSwgLjUsIFswLCAxXSk7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdRdWFudGl6ZSh4MCwgeDEsIHJhbmdlKSB7XG4gICAgdmFyIGt4LCBpO1xuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgcmV0dXJuIHJhbmdlW01hdGgubWF4KDAsIE1hdGgubWluKGksIE1hdGguZmxvb3Ioa3ggKiAoeCAtIHgwKSkpKV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVzY2FsZSgpIHtcbiAgICAgIGt4ID0gcmFuZ2UubGVuZ3RoIC8gKHgxIC0geDApO1xuICAgICAgaSA9IHJhbmdlLmxlbmd0aCAtIDE7XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfVxuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gW3gwLCB4MV07XG4gICAgICB4MCA9ICt4WzBdO1xuICAgICAgeDEgPSAreFt4Lmxlbmd0aCAtIDFdO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZS5zbGljZSgpO1xuICAgICAgcmFuZ2UgPSB4LnNsaWNlKCk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5pbnZlcnRFeHRlbnQgPSBmdW5jdGlvbih5KSB7XG4gICAgICB5ID0gcmFuZ2UuaW5kZXhPZih5KTtcbiAgICAgIHkgPSB5IDwgMCA/IE5hTiA6IHkgLyBreCArIHgwO1xuICAgICAgcmV0dXJuIFt5LCB5ICsgMSAvIGt4XTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld1F1YW50aXplKHgwLCB4MSwgcmFuZ2UpOyAvLyBjb3B5IG9uIHdyaXRlXG4gICAgfTtcblxuICAgIHJldHVybiByZXNjYWxlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBxdWFudGl6ZSgpIHtcbiAgICByZXR1cm4gbmV3UXVhbnRpemUoMCwgMSwgWzAsIDFdKTtcbiAgfVxuXG5cbiAgLy8gUi03IHBlciA8aHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9RdWFudGlsZT5cbiAgZnVuY3Rpb24gcXVhbnRpbGUodmFsdWVzLCBwKSB7XG4gICAgdmFyIEggPSAodmFsdWVzLmxlbmd0aCAtIDEpICogcCArIDEsXG4gICAgICAgIGggPSBNYXRoLmZsb29yKEgpLFxuICAgICAgICB2ID0gK3ZhbHVlc1toIC0gMV0sXG4gICAgICAgIGUgPSBIIC0gaDtcbiAgICByZXR1cm4gZSA/IHYgKyBlICogKHZhbHVlc1toXSAtIHYpIDogdjtcbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1F1YW50aWxlKGRvbWFpbiwgcmFuZ2UpIHtcbiAgICB2YXIgdGhyZXNob2xkcztcblxuICAgIGZ1bmN0aW9uIHJlc2NhbGUoKSB7XG4gICAgICB2YXIgayA9IDAsXG4gICAgICAgICAgcSA9IHJhbmdlLmxlbmd0aDtcbiAgICAgIHRocmVzaG9sZHMgPSBbXTtcbiAgICAgIHdoaWxlICgrK2sgPCBxKSB0aHJlc2hvbGRzW2sgLSAxXSA9IHF1YW50aWxlKGRvbWFpbiwgayAvIHEpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIGlmICghaXNOYU4oeCA9ICt4KSkgcmV0dXJuIHJhbmdlW2Jpc2VjdCh0aHJlc2hvbGRzLCB4KV07XG4gICAgfVxuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluO1xuICAgICAgZG9tYWluID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMCwgbiA9IHgubGVuZ3RoLCB2OyBpIDwgbjsgKytpKSBpZiAodiA9IHhbaV0sIHYgIT0gbnVsbCAmJiAhaXNOYU4odiA9ICt2KSkgZG9tYWluLnB1c2godik7XG4gICAgICBkb21haW4uc29ydChhc2NlbmRpbmcpO1xuICAgICAgcmV0dXJuIHJlc2NhbGUoKTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2UgPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiByYW5nZS5zbGljZSgpO1xuICAgICAgcmFuZ2UgPSB4LnNsaWNlKCk7XG4gICAgICByZXR1cm4gcmVzY2FsZSgpO1xuICAgIH07XG5cbiAgICBzY2FsZS5xdWFudGlsZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aHJlc2hvbGRzO1xuICAgIH07XG5cbiAgICBzY2FsZS5pbnZlcnRFeHRlbnQgPSBmdW5jdGlvbih5KSB7XG4gICAgICB5ID0gcmFuZ2UuaW5kZXhPZih5KTtcbiAgICAgIHJldHVybiB5IDwgMCA/IFtOYU4sIE5hTl0gOiBbXG4gICAgICAgIHkgPiAwID8gdGhyZXNob2xkc1t5IC0gMV0gOiBkb21haW5bMF0sXG4gICAgICAgIHkgPCB0aHJlc2hvbGRzLmxlbmd0aCA/IHRocmVzaG9sZHNbeV0gOiBkb21haW5bZG9tYWluLmxlbmd0aCAtIDFdXG4gICAgICBdO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3UXVhbnRpbGUoZG9tYWluLCByYW5nZSk7IC8vIGNvcHkgb24gd3JpdGUhXG4gICAgfTtcblxuICAgIHJldHVybiByZXNjYWxlKCk7XG4gIH1cblxuICBmdW5jdGlvbiBfcXVhbnRpbGUoKSB7XG4gICAgcmV0dXJuIG5ld1F1YW50aWxlKFtdLCBbXSk7XG4gIH1cblxuICBmdW5jdGlvbiBwb3coKSB7XG4gICAgcmV0dXJuIG5ld1BvdyhsaW5lYXIoKSwgMSwgWzAsIDFdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0ZXBzKGxlbmd0aCwgc3RhcnQsIHN0ZXApIHtcbiAgICB2YXIgc3RlcHMgPSBuZXcgQXJyYXkobGVuZ3RoKSwgaSA9IC0xO1xuICAgIHdoaWxlICgrK2kgPCBsZW5ndGgpIHN0ZXBzW2ldID0gc3RhcnQgKyBzdGVwICogaTtcbiAgICByZXR1cm4gc3RlcHM7XG4gIH1cblxuICBmdW5jdGlvbiBuZXdPcmRpbmFsKGRvbWFpbiwgcmFuZ2VyKSB7XG4gICAgdmFyIGluZGV4LFxuICAgICAgICByYW5nZSxcbiAgICAgICAgcmFuZ2VCYW5kO1xuXG4gICAgZnVuY3Rpb24gc2NhbGUoeCkge1xuICAgICAgdmFyIGsgPSB4ICsgXCJcIiwgaSA9IGluZGV4LmdldChrKTtcbiAgICAgIGlmICghaSkge1xuICAgICAgICBpZiAocmFuZ2VyLnQgIT09IFwicmFuZ2VcIikgcmV0dXJuO1xuICAgICAgICBpbmRleC5zZXQoaywgaSA9IGRvbWFpbi5wdXNoKHgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiByYW5nZVsoaSAtIDEpICUgcmFuZ2UubGVuZ3RoXTtcbiAgICB9XG5cbiAgICBzY2FsZS5kb21haW4gPSBmdW5jdGlvbih4KSB7XG4gICAgICBpZiAoIWFyZ3VtZW50cy5sZW5ndGgpIHJldHVybiBkb21haW4uc2xpY2UoKTtcbiAgICAgIGRvbWFpbiA9IFtdO1xuICAgICAgaW5kZXggPSBuZXcgTWFwO1xuICAgICAgdmFyIGkgPSAtMSwgbiA9IHgubGVuZ3RoLCB4aSwgeGs7XG4gICAgICB3aGlsZSAoKytpIDwgbikgaWYgKCFpbmRleC5oYXMoeGsgPSAoeGkgPSB4W2ldKSArIFwiXCIpKSBpbmRleC5zZXQoeGssIGRvbWFpbi5wdXNoKHhpKSk7XG4gICAgICByZXR1cm4gc2NhbGVbcmFuZ2VyLnRdLmFwcGx5KHNjYWxlLCByYW5nZXIuYSk7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gcmFuZ2Uuc2xpY2UoKTtcbiAgICAgIHJhbmdlID0geC5zbGljZSgpO1xuICAgICAgcmFuZ2VCYW5kID0gMDtcbiAgICAgIHJhbmdlciA9IHt0OiBcInJhbmdlXCIsIGE6IGFyZ3VtZW50c307XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlUG9pbnRzID0gZnVuY3Rpb24oeCwgcGFkZGluZykge1xuICAgICAgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gMCA6ICtwYWRkaW5nO1xuICAgICAgdmFyIHN0YXJ0ID0gK3hbMF0sXG4gICAgICAgICAgc3RvcCA9ICt4WzFdLFxuICAgICAgICAgIHN0ZXAgPSBkb21haW4ubGVuZ3RoIDwgMiA/IChzdGFydCA9IChzdGFydCArIHN0b3ApIC8gMiwgMCkgOiAoc3RvcCAtIHN0YXJ0KSAvIChkb21haW4ubGVuZ3RoIC0gMSArIHBhZGRpbmcpO1xuICAgICAgcmFuZ2UgPSBzdGVwcyhkb21haW4ubGVuZ3RoLCBzdGFydCArIHN0ZXAgKiBwYWRkaW5nIC8gMiwgc3RlcCk7XG4gICAgICByYW5nZUJhbmQgPSAwO1xuICAgICAgcmFuZ2VyID0ge3Q6IFwicmFuZ2VQb2ludHNcIiwgYTogYXJndW1lbnRzfTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUucmFuZ2VSb3VuZFBvaW50cyA9IGZ1bmN0aW9uKHgsIHBhZGRpbmcpIHtcbiAgICAgIHBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IDAgOiArcGFkZGluZztcbiAgICAgIHZhciBzdGFydCA9ICt4WzBdLFxuICAgICAgICAgIHN0b3AgPSAreFsxXSxcbiAgICAgICAgICBzdGVwID0gZG9tYWluLmxlbmd0aCA8IDIgPyAoc3RhcnQgPSBzdG9wID0gTWF0aC5yb3VuZCgoc3RhcnQgKyBzdG9wKSAvIDIpLCAwKSA6IChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSAxICsgcGFkZGluZykgfCAwOyAvLyBiaXR3aXNlIGZsb29yIGZvciBzeW1tZXRyeVxuICAgICAgcmFuZ2UgPSBzdGVwcyhkb21haW4ubGVuZ3RoLCBzdGFydCArIE1hdGgucm91bmQoc3RlcCAqIHBhZGRpbmcgLyAyICsgKHN0b3AgLSBzdGFydCAtIChkb21haW4ubGVuZ3RoIC0gMSArIHBhZGRpbmcpICogc3RlcCkgLyAyKSwgc3RlcCk7XG4gICAgICByYW5nZUJhbmQgPSAwO1xuICAgICAgcmFuZ2VyID0ge3Q6IFwicmFuZ2VSb3VuZFBvaW50c1wiLCBhOiBhcmd1bWVudHN9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZUJhbmRzID0gZnVuY3Rpb24oeCwgcGFkZGluZywgb3V0ZXJQYWRkaW5nKSB7XG4gICAgICBwYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyAwIDogK3BhZGRpbmc7XG4gICAgICBvdXRlclBhZGRpbmcgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHBhZGRpbmcgOiArb3V0ZXJQYWRkaW5nO1xuICAgICAgdmFyIHJldmVyc2UgPSAreFsxXSA8ICt4WzBdLFxuICAgICAgICAgIHN0YXJ0ID0gK3hbcmV2ZXJzZSAtIDBdLFxuICAgICAgICAgIHN0b3AgPSAreFsxIC0gcmV2ZXJzZV0sXG4gICAgICAgICAgc3RlcCA9IChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSBwYWRkaW5nICsgMiAqIG91dGVyUGFkZGluZyk7XG4gICAgICByYW5nZSA9IHN0ZXBzKGRvbWFpbi5sZW5ndGgsIHN0YXJ0ICsgc3RlcCAqIG91dGVyUGFkZGluZywgc3RlcCk7XG4gICAgICBpZiAocmV2ZXJzZSkgcmFuZ2UucmV2ZXJzZSgpO1xuICAgICAgcmFuZ2VCYW5kID0gc3RlcCAqICgxIC0gcGFkZGluZyk7XG4gICAgICByYW5nZXIgPSB7dDogXCJyYW5nZUJhbmRzXCIsIGE6IGFyZ3VtZW50c307XG4gICAgICByZXR1cm4gc2NhbGU7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlUm91bmRCYW5kcyA9IGZ1bmN0aW9uKHgsIHBhZGRpbmcsIG91dGVyUGFkZGluZykge1xuICAgICAgcGFkZGluZyA9IGFyZ3VtZW50cy5sZW5ndGggPCAyID8gMCA6ICtwYWRkaW5nO1xuICAgICAgb3V0ZXJQYWRkaW5nID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyBwYWRkaW5nIDogK291dGVyUGFkZGluZztcbiAgICAgIHZhciByZXZlcnNlID0gK3hbMV0gPCAreFswXSxcbiAgICAgICAgICBzdGFydCA9ICt4W3JldmVyc2UgLSAwXSxcbiAgICAgICAgICBzdG9wID0gK3hbMSAtIHJldmVyc2VdLFxuICAgICAgICAgIHN0ZXAgPSBNYXRoLmZsb29yKChzdG9wIC0gc3RhcnQpIC8gKGRvbWFpbi5sZW5ndGggLSBwYWRkaW5nICsgMiAqIG91dGVyUGFkZGluZykpO1xuICAgICAgcmFuZ2UgPSBzdGVwcyhkb21haW4ubGVuZ3RoLCBzdGFydCArIE1hdGgucm91bmQoKHN0b3AgLSBzdGFydCAtIChkb21haW4ubGVuZ3RoIC0gcGFkZGluZykgKiBzdGVwKSAvIDIpLCBzdGVwKTtcbiAgICAgIGlmIChyZXZlcnNlKSByYW5nZS5yZXZlcnNlKCk7XG4gICAgICByYW5nZUJhbmQgPSBNYXRoLnJvdW5kKHN0ZXAgKiAoMSAtIHBhZGRpbmcpKTtcbiAgICAgIHJhbmdlciA9IHt0OiBcInJhbmdlUm91bmRCYW5kc1wiLCBhOiBhcmd1bWVudHN9O1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5yYW5nZUJhbmQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiByYW5nZUJhbmQ7XG4gICAgfTtcblxuICAgIHNjYWxlLnJhbmdlRXh0ZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgdCA9IHJhbmdlci5hWzBdLCBzdGFydCA9IHRbMF0sIHN0b3AgPSB0W3QubGVuZ3RoIC0gMV07XG4gICAgICBpZiAoc3RvcCA8IHN0YXJ0KSB0ID0gc3RvcCwgc3RvcCA9IHN0YXJ0LCBzdGFydCA9IHQ7XG4gICAgICByZXR1cm4gW3N0YXJ0LCBzdG9wXTtcbiAgICB9O1xuXG4gICAgc2NhbGUuY29weSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ld09yZGluYWwoZG9tYWluLCByYW5nZXIpO1xuICAgIH07XG5cbiAgICByZXR1cm4gc2NhbGUuZG9tYWluKGRvbWFpbik7XG4gIH1cblxuICBmdW5jdGlvbiBvcmRpbmFsKCkge1xuICAgIHJldHVybiBuZXdPcmRpbmFsKFtdLCB7dDogXCJyYW5nZVwiLCBhOiBbW11dfSk7XG4gIH1cblxuICB2YXIgdGlja0Zvcm1hdE90aGVyID0gX19mb3JtYXQoXCIsXCIpO1xuXG4gIHZhciB0aWNrRm9ybWF0MTAgPSBfX2Zvcm1hdChcIi4wZVwiKTtcblxuICBmdW5jdGlvbiBuZXdMb2cobGluZWFyLCBiYXNlLCBkb21haW4pIHtcblxuICAgIGZ1bmN0aW9uIGxvZyh4KSB7XG4gICAgICByZXR1cm4gKGRvbWFpblswXSA8IDAgPyAtTWF0aC5sb2coeCA+IDAgPyAwIDogLXgpIDogTWF0aC5sb2coeCA8IDAgPyAwIDogeCkpIC8gTWF0aC5sb2coYmFzZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcG93KHgpIHtcbiAgICAgIHJldHVybiBkb21haW5bMF0gPCAwID8gLU1hdGgucG93KGJhc2UsIC14KSA6IE1hdGgucG93KGJhc2UsIHgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNjYWxlKHgpIHtcbiAgICAgIHJldHVybiBsaW5lYXIobG9nKHgpKTtcbiAgICB9XG5cbiAgICBzY2FsZS5pbnZlcnQgPSBmdW5jdGlvbih4KSB7XG4gICAgICByZXR1cm4gcG93KGxpbmVhci5pbnZlcnQoeCkpO1xuICAgIH07XG5cbiAgICBzY2FsZS5iYXNlID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gYmFzZTtcbiAgICAgIGJhc2UgPSAreDtcbiAgICAgIHJldHVybiBzY2FsZS5kb21haW4oZG9tYWluKTtcbiAgICB9O1xuXG4gICAgc2NhbGUuZG9tYWluID0gZnVuY3Rpb24oeCkge1xuICAgICAgaWYgKCFhcmd1bWVudHMubGVuZ3RoKSByZXR1cm4gZG9tYWluLnNsaWNlKCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChOdW1iZXIpO1xuICAgICAgbGluZWFyLmRvbWFpbihkb21haW4ubWFwKGxvZykpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS5uaWNlID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgeCA9IG5pY2UobGluZWFyLmRvbWFpbigpLCAxKTtcbiAgICAgIGxpbmVhci5kb21haW4oeCk7XG4gICAgICBkb21haW4gPSB4Lm1hcChwb3cpO1xuICAgICAgcmV0dXJuIHNjYWxlO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHUgPSBkb21haW5bMF0sXG4gICAgICAgICAgdiA9IGRvbWFpbltkb21haW4ubGVuZ3RoIC0gMV07XG4gICAgICBpZiAodiA8IHUpIGkgPSB1LCB1ID0gdiwgdiA9IGk7XG4gICAgICB2YXIgaSA9IE1hdGguZmxvb3IobG9nKHUpKSxcbiAgICAgICAgICBqID0gTWF0aC5jZWlsKGxvZyh2KSksXG4gICAgICAgICAgayxcbiAgICAgICAgICB0LFxuICAgICAgICAgIG4gPSBiYXNlICUgMSA/IDIgOiBiYXNlLFxuICAgICAgICAgIHRpY2tzID0gW107XG5cbiAgICAgIGlmIChpc0Zpbml0ZShqIC0gaSkpIHtcbiAgICAgICAgaWYgKHUgPiAwKSB7XG4gICAgICAgICAgZm9yICgtLWosIGsgPSAxOyBrIDwgbjsgKytrKSBpZiAoKHQgPSBwb3coaSkgKiBrKSA8IHUpIGNvbnRpbnVlOyBlbHNlIHRpY2tzLnB1c2godCk7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGopIGZvciAoayA9IDE7IGsgPCBuOyArK2spIHRpY2tzLnB1c2gocG93KGkpICogayk7XG4gICAgICAgICAgZm9yIChrID0gMTsgayA8IG47ICsraykgaWYgKCh0ID0gcG93KGkpICogaykgPiB2KSBicmVhazsgZWxzZSB0aWNrcy5wdXNoKHQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAoKytpLCBrID0gbiAtIDE7IGsgPj0gMTsgLS1rKSBpZiAoKHQgPSBwb3coaSkgKiBrKSA8IHUpIGNvbnRpbnVlOyBlbHNlIHRpY2tzLnB1c2godCk7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGopIGZvciAoayA9IG4gLSAxOyBrID49IDE7IC0taykgdGlja3MucHVzaChwb3coaSkgKiBrKTtcbiAgICAgICAgICBmb3IgKGsgPSBuIC0gMTsgayA+PSAxOyAtLWspIGlmICgodCA9IHBvdyhpKSAqIGspID4gdikgYnJlYWs7IGVsc2UgdGlja3MucHVzaCh0KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGlja3M7XG4gICAgfTtcblxuICAgIHNjYWxlLnRpY2tGb3JtYXQgPSBmdW5jdGlvbihjb3VudCwgc3BlY2lmaWVyKSB7XG4gICAgICBpZiAoc3BlY2lmaWVyID09IG51bGwpIHNwZWNpZmllciA9IGJhc2UgPT09IDEwID8gdGlja0Zvcm1hdDEwIDogdGlja0Zvcm1hdE90aGVyO1xuICAgICAgZWxzZSBpZiAodHlwZW9mIHNwZWNpZmllciAhPT0gXCJmdW5jdGlvblwiKSBzcGVjaWZpZXIgPSBfX2Zvcm1hdChzcGVjaWZpZXIpO1xuICAgICAgaWYgKGNvdW50ID09IG51bGwpIHJldHVybiBzcGVjaWZpZXI7XG4gICAgICB2YXIgayA9IE1hdGgubWluKGJhc2UsIHNjYWxlLnRpY2tzKCkubGVuZ3RoIC8gY291bnQpLFxuICAgICAgICAgIGYgPSBkb21haW5bMF0gPiAwID8gKGUgPSAxZS0xMiwgTWF0aC5jZWlsKSA6IChlID0gLTFlLTEyLCBNYXRoLmZsb29yKSxcbiAgICAgICAgICBlO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGQpIHtcbiAgICAgICAgcmV0dXJuIHBvdyhmKGxvZyhkKSArIGUpKSAvIGQgPj0gayA/IHNwZWNpZmllcihkKSA6IFwiXCI7XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3TG9nKGxpbmVhci5jb3B5KCksIGJhc2UsIGRvbWFpbik7XG4gICAgfTtcblxuICAgIHJldHVybiByZWJpbmQoc2NhbGUsIGxpbmVhcik7XG4gIH1cblxuICBmdW5jdGlvbiBsb2coKSB7XG4gICAgcmV0dXJuIG5ld0xvZyhsaW5lYXIoKSwgMTAsIFsxLCAxMF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gbmV3SWRlbnRpdHkoZG9tYWluKSB7XG5cbiAgICBmdW5jdGlvbiBzY2FsZSh4KSB7XG4gICAgICByZXR1cm4gK3g7XG4gICAgfVxuXG4gICAgc2NhbGUuaW52ZXJ0ID0gc2NhbGU7XG5cbiAgICBzY2FsZS5kb21haW4gPSBzY2FsZS5yYW5nZSA9IGZ1bmN0aW9uKHgpIHtcbiAgICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkgcmV0dXJuIGRvbWFpbi5zbGljZSgpO1xuICAgICAgZG9tYWluID0geC5tYXAoTnVtYmVyKTtcbiAgICAgIHJldHVybiBzY2FsZTtcbiAgICB9O1xuXG4gICAgc2NhbGUudGlja3MgPSBmdW5jdGlvbihjb3VudCkge1xuICAgICAgcmV0dXJuIHRpY2tzKGRvbWFpbiwgY291bnQpO1xuICAgIH07XG5cbiAgICBzY2FsZS50aWNrRm9ybWF0ID0gZnVuY3Rpb24oY291bnQsIHNwZWNpZmllcikge1xuICAgICAgcmV0dXJuIF9fdGlja0Zvcm1hdChkb21haW4sIGNvdW50LCBzcGVjaWZpZXIpO1xuICAgIH07XG5cbiAgICBzY2FsZS5jb3B5ID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3SWRlbnRpdHkoZG9tYWluKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHNjYWxlO1xuICB9XG5cbiAgZnVuY3Rpb24gaWRlbnRpdHkoKSB7XG4gICAgcmV0dXJuIG5ld0lkZW50aXR5KFswLCAxXSk7XG4gIH1cblxuICBmdW5jdGlvbiBjYXRlZ29yeTIwYygpIHtcbiAgICByZXR1cm4gb3JkaW5hbCgpLnJhbmdlKFtcbiAgICAgIFwiIzMxODJiZFwiLCBcIiM2YmFlZDZcIiwgXCIjOWVjYWUxXCIsIFwiI2M2ZGJlZlwiLFxuICAgICAgXCIjZTY1NTBkXCIsIFwiI2ZkOGQzY1wiLCBcIiNmZGFlNmJcIiwgXCIjZmRkMGEyXCIsXG4gICAgICBcIiMzMWEzNTRcIiwgXCIjNzRjNDc2XCIsIFwiI2ExZDk5YlwiLCBcIiNjN2U5YzBcIixcbiAgICAgIFwiIzc1NmJiMVwiLCBcIiM5ZTlhYzhcIiwgXCIjYmNiZGRjXCIsIFwiI2RhZGFlYlwiLFxuICAgICAgXCIjNjM2MzYzXCIsIFwiIzk2OTY5NlwiLCBcIiNiZGJkYmRcIiwgXCIjZDlkOWQ5XCJcbiAgICBdKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhdGVnb3J5MjBiKCkge1xuICAgIHJldHVybiBvcmRpbmFsKCkucmFuZ2UoW1xuICAgICAgXCIjMzkzYjc5XCIsIFwiIzUyNTRhM1wiLCBcIiM2YjZlY2ZcIiwgXCIjOWM5ZWRlXCIsXG4gICAgICBcIiM2Mzc5MzlcIiwgXCIjOGNhMjUyXCIsIFwiI2I1Y2Y2YlwiLCBcIiNjZWRiOWNcIixcbiAgICAgIFwiIzhjNmQzMVwiLCBcIiNiZDllMzlcIiwgXCIjZTdiYTUyXCIsIFwiI2U3Y2I5NFwiLFxuICAgICAgXCIjODQzYzM5XCIsIFwiI2FkNDk0YVwiLCBcIiNkNjYxNmJcIiwgXCIjZTc5NjljXCIsXG4gICAgICBcIiM3YjQxNzNcIiwgXCIjYTU1MTk0XCIsIFwiI2NlNmRiZFwiLCBcIiNkZTllZDZcIlxuICAgIF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2F0ZWdvcnkyMCgpIHtcbiAgICByZXR1cm4gb3JkaW5hbCgpLnJhbmdlKFtcbiAgICAgIFwiIzFmNzdiNFwiLCBcIiNhZWM3ZThcIixcbiAgICAgIFwiI2ZmN2YwZVwiLCBcIiNmZmJiNzhcIixcbiAgICAgIFwiIzJjYTAyY1wiLCBcIiM5OGRmOGFcIixcbiAgICAgIFwiI2Q2MjcyOFwiLCBcIiNmZjk4OTZcIixcbiAgICAgIFwiIzk0NjdiZFwiLCBcIiNjNWIwZDVcIixcbiAgICAgIFwiIzhjNTY0YlwiLCBcIiNjNDljOTRcIixcbiAgICAgIFwiI2UzNzdjMlwiLCBcIiNmN2I2ZDJcIixcbiAgICAgIFwiIzdmN2Y3ZlwiLCBcIiNjN2M3YzdcIixcbiAgICAgIFwiI2JjYmQyMlwiLCBcIiNkYmRiOGRcIixcbiAgICAgIFwiIzE3YmVjZlwiLCBcIiM5ZWRhZTVcIlxuICAgIF0pO1xuICB9XG5cbiAgZnVuY3Rpb24gY2F0ZWdvcnkxMCgpIHtcbiAgICByZXR1cm4gb3JkaW5hbCgpLnJhbmdlKFtcbiAgICAgIFwiIzFmNzdiNFwiLFxuICAgICAgXCIjZmY3ZjBlXCIsXG4gICAgICBcIiMyY2EwMmNcIixcbiAgICAgIFwiI2Q2MjcyOFwiLFxuICAgICAgXCIjOTQ2N2JkXCIsXG4gICAgICBcIiM4YzU2NGJcIixcbiAgICAgIFwiI2UzNzdjMlwiLFxuICAgICAgXCIjN2Y3ZjdmXCIsXG4gICAgICBcIiNiY2JkMjJcIixcbiAgICAgIFwiIzE3YmVjZlwiXG4gICAgXSk7XG4gIH1cblxuICBleHBvcnRzLmNhdGVnb3J5MTAgPSBjYXRlZ29yeTEwO1xuICBleHBvcnRzLmNhdGVnb3J5MjAgPSBjYXRlZ29yeTIwO1xuICBleHBvcnRzLmNhdGVnb3J5MjBiID0gY2F0ZWdvcnkyMGI7XG4gIGV4cG9ydHMuY2F0ZWdvcnkyMGMgPSBjYXRlZ29yeTIwYztcbiAgZXhwb3J0cy5pZGVudGl0eSA9IGlkZW50aXR5O1xuICBleHBvcnRzLmxpbmVhciA9IGxpbmVhcjtcbiAgZXhwb3J0cy5sb2cgPSBsb2c7XG4gIGV4cG9ydHMub3JkaW5hbCA9IG9yZGluYWw7XG4gIGV4cG9ydHMucG93ID0gcG93O1xuICBleHBvcnRzLnF1YW50aWxlID0gX3F1YW50aWxlO1xuICBleHBvcnRzLnF1YW50aXplID0gcXVhbnRpemU7XG4gIGV4cG9ydHMuc3FydCA9IHNxcnQ7XG4gIGV4cG9ydHMudGhyZXNob2xkID0gdGhyZXNob2xkO1xuICBleHBvcnRzLnRpbWUgPSB0aW1lO1xuICBleHBvcnRzLnV0Y1RpbWUgPSB1dGNUaW1lO1xuXG59KSk7IiwidmFyIHNjYWxlcyA9IHJlcXVpcmUoXCJkMy1zY2FsZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIFwiZGFya1wiOiBcIiM0NDQ0NDRcIixcbiAgXCJsaWdodFwiOiBcIiNmN2Y3ZjdcIixcbiAgXCJtaXNzaW5nXCI6IFwiI2NjY2NjY1wiLFxuICBcIm9mZlwiOiBcIiNiMjIyMDBcIixcbiAgXCJvblwiOiBcIiMyMjRmMjBcIixcbiAgXCJzY2FsZVwiOiBzY2FsZXMub3JkaW5hbCgpLnJhbmdlKFtcbiAgICBcIiNiMjIyMDBcIiwgXCIjZWFjZTNmXCIsIFwiIzI4MmY2YlwiLCBcIiNiMzVjMWVcIiwgXCIjMjI0ZjIwXCIsIFwiIzVmNDg3Y1wiLFxuICAgIFwiIzc1OTE0M1wiLCBcIiM0MTkzOTFcIiwgXCIjOTkzYzg4XCIsIFwiI2U4OWM4OVwiLCBcIiNmZmVlOGRcIiwgXCIjYWZkNWU4XCIsXG4gICAgXCIjZjdiYTc3XCIsIFwiI2E1YzY5N1wiLCBcIiNjNWI1ZTVcIiwgXCIjZDFkMzkyXCIsIFwiI2JiZWZkMFwiLCBcIiNlMDk5Y2ZcIlxuICBdKVxufTtcbiIsInZhciBkMyA9IHtcbiAgYXJyYXk6IHJlcXVpcmUoXCJkMy1hcnJheXNcIiksXG4gIGNvbG9yOiByZXF1aXJlKFwiZDMtY29sb3JcIilcbn07XG5cbnZhciBzZXR0aW5ncyA9IHJlcXVpcmUoXCIuL2RlZmF1bHRzLmpzXCIpO1xuXG5jbGFzcyBDb2xvciB7XG5cbiAgLyoqXG4gICAgICBAcGFyYW0ge0NvbG9yfFN0cmluZ3xOdW1iZXJ8dHJ1ZXxmYWxzZXxudWxsfHVuZGVmaW5lZH0gY29sb3JcbiAgICAgIEBwYXJhbSB7b2JqZWN0fSBbZGVmYXVsdHMgPSBzcmMvZGVmYXVsdHMuanNdXG4gICovXG4gIGNvbnN0cnVjdG9yKGNvbG9yLCBkZWZhdWx0cykge1xuXG4gICAgdGhpcy52YWx1ZSA9IGNvbG9yO1xuICAgIHRoaXMuZGVmYXVsdHMgPSBkZWZhdWx0cyB8fCBzZXR0aW5ncztcblxuICAgIC8vIElmIHRoZSB2YWx1ZSBpcyBudWxsIG9yIHVuZGVmaW5lZCwgc2V0IHRvIGdyZXkuXG4gICAgaWYgKFtudWxsLCB1bmRlZmluZWRdLmluZGV4T2YoY29sb3IpID49IDApIHtcbiAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmRlZmF1bHRzLm1pc3Npbmc7XG4gICAgfVxuICAgIC8vIEVsc2UgaWYgdGhlIHZhbHVlIGlzIHRydWUsIHNldCB0byBncmVlbi5cbiAgICBlbHNlIGlmIChjb2xvciA9PT0gdHJ1ZSkge1xuICAgICAgdGhpcy5jb2xvciA9IHRoaXMuZGVmYXVsdHMub247XG4gICAgfVxuICAgIC8vIEVsc2UgaWYgdGhlIHZhbHVlIGlzIGZhbHNlLCBzZXQgdG8gcmVkLlxuICAgIGVsc2UgaWYgKGNvbG9yID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5jb2xvciA9IHRoaXMuZGVmYXVsdHMub2ZmO1xuICAgIH1cblxuICAgIHRoaXMuZDMgPSBkMy5jb2xvci5jb2xvcih0aGlzLmNvbG9yIHx8IGNvbG9yKTtcbiAgICAvLyBJZiB0aGUgdmFsdWUgaXMgbm90IGEgdmFsaWQgY29sb3Igc3RyaW5nLCB1c2UgdGhlIGNvbG9yIHNjYWxlLlxuICAgIGlmICghdGhpcy5kMykge1xuICAgICAgdGhpcy5jb2xvciA9IHRoaXMuZGVmYXVsdHMuc2NhbGUoY29sb3IpO1xuICAgICAgdGhpcy5kMyA9IGQzLmNvbG9yLmNvbG9yKHRoaXMuY29sb3IpO1xuICAgIH1cbiAgICBlbHNlIGlmICghdGhpcy5jb2xvcikge1xuICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cblxuICB9XG5cblxuICAvKipcbiAgICAgIE1peGVzIGEgc2Vjb25kIGNvbG9yLCByZXR1cm5pbmcgYSBuZXcgQ29sb3Igb2JqZWN0LlxuICAgICAgQHBhcmFtIHtDb2xvcn0gYzIgLSBUaGUgY29sb3IgdG8gYmUgbWl4ZWQgaW4uIElmIGl0IGlzIG5vdCBhIGQzcGx1cy1jb2xvciBPYmplY3QsIHRoZW4gaXQgd2lsbCBiZSBwYXJzZWQgaW50byBvbmUuXG4gICAgICBAcmV0dXJucyB7Q29sb3J9XG4gICovXG4gIGFkZChjMikge1xuICAgIGlmIChjMi5jb25zdHJ1Y3RvciAhPT0gQ29sb3IpIHsgYzIgPSBuZXcgQ29sb3IoYzIpOyB9XG4gICAgdmFyIG8xID0gdGhpcy5vcGFjaXR5KCksIG8yID0gYzIub3BhY2l0eSgpLCBjMSA9IHRoaXMuaHNsKCk7XG4gICAgYzIgPSBjMi5oc2woKTtcbiAgICB2YXIgZCA9IE1hdGguYWJzKGMyLmggKiBvMiAtIGMxLmggKiBvMSk7XG4gICAgaWYgKGQgPiAxODApIHsgZCA9IGQgLSAzNjA7IH1cbiAgICB2YXIgaCA9IChkMy5hcnJheS5taW4oW2MxLmgsIGMyLmhdKSArIGQgLyAyKSAlIDM2MCxcbiAgICAgICAgcyA9IGMxLnMgKyAoYzIucyAqIG8yIC0gYzEucyAqIG8xKSAvIDIsXG4gICAgICAgIGwgPSBjMS5sICsgKGMyLmwgKiBvMiAtIGMxLmwgKiBvMSkgLyAyO1xuICAgICAgICAvLyBhID0gbzEgKyAobzIgLSBvMSkgLyAyO1xuICAgIGlmIChoIDwgMCkgeyBoID0gMzYwICsgaDsgfVxuICAgIHJldHVybiBuZXcgQ29sb3IoXCJoc2woXCIgKyBbaCwgcyAqIDEwMCArIFwiJVwiLCBsICogMTAwICsgXCIlXCJdLmpvaW4oXCIsXCIpICsgXCIpXCIpO1xuICAgIC8vIHJldHVybiBuZXcgQ29sb3IoXCJoc2xhKFwiICsgW2gsIHMgKiAxMDAgKyBcIiVcIiwgbCAqIDEwMCArIFwiJVwiLCBhXS5qb2luKFwiLFwiKSArIFwiKVwiKTtcbiAgfVxuXG4gIC8qKlxuICAgICAgUmV0dXJucyB0cnVlIGlmIHRoZSBjb2xvciBpcyBkaXNwbGF5YWJsZS5cbiAgICAgIEByZXR1cm5zIHtCb29sZWFufVxuICAqL1xuICBkaXNwbGF5YWJsZSgpIHtcbiAgICByZXR1cm4gdGhpcy5kMy5kaXNwbGF5YWJsZSgpO1xuICB9XG5cbiAgLyoqXG4gICAgICBSZXR1cm5zIHRoZSBoZXhpZGVjaW1hbCB2YWx1ZS5cbiAgICAgIEByZXR1cm5zIHtTdHJpbmd9XG4gICovXG4gIGhleCgpIHtcbiAgICByZXR1cm4gdGhpcy50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqIFJldHVybnMgdGhlIEQzIGhzbCBvYmplY3QuICovXG4gIGhzbCgpIHtcbiAgICByZXR1cm4gZDMuY29sb3IuaHNsKHRoaXMuZDMpO1xuICB9XG5cbiAgLyoqXG4gICAgICBEYXJrZW5zIHRoZSBjb2xvciBpZiBpdCBpcyB0b28gbGlnaHQgdG8gYXBwZWFyIG9uIHdoaXRlLlxuICAgICAgQHJldHVybnMge0NvbG9yfVxuICAqL1xuICBsZWdpYmxlKCkge1xuICAgIHZhciBjID0gdGhpcy5oc2woKTtcbiAgICBpZiAoYy5sID4gMC40NSkge1xuICAgICAgaWYgKGMucyA+IDAuOCkgeyBjLnMgPSAwLjg7IH1cbiAgICAgIGMubCA9IDAuNDU7XG4gICAgfVxuICAgIHJldHVybiBuZXcgQ29sb3IoYy50b1N0cmluZygpKTtcbiAgfVxuXG4gIC8qKlxuICAgICAgTGlnaHRlbnMgdGhlIGNvbG9yIHdoaWxlIGFsc28gcmVkdWNpbmcgdGhlIHNhdHVyYXRpb24uXG4gICAgICBAcmV0dXJucyB7Q29sb3J9XG4gICovXG4gIGxpZ2h0ZXIoaSkge1xuICAgIGlmICghaSkgeyBpID0gMC41OyB9XG4gICAgdmFyIGMgPSB0aGlzLmhzbCgpO1xuICAgIGkgPSAoMSAtIGMubCkgKiBpO1xuICAgIGMubCArPSBpOyBjLnMgLT0gaTtcbiAgICByZXR1cm4gbmV3IENvbG9yKGMudG9TdHJpbmcoKSk7XG4gIH1cblxuICAvLyBQYXJzZXMgb3BhY2l0eSBmcm9tIG9yaWdpbmFsIHJnYmEgb3IgaHNsYSB2YWx1ZS5cbiAgb3BhY2l0eSgpIHtcbiAgICByZXR1cm4gMTtcbiAgICAvLyB2YXIgYyA9IHRoaXMudmFsdWU7XG4gICAgLy8gaWYgKCFjIHx8IGMuY29uc3RydWN0b3IgIT09IFN0cmluZykgeyByZXR1cm4gMTsgfVxuICAgIC8vIGMgPSBjLnJlcGxhY2UoUmVnRXhwKFwiIFwiLCBcImdcIiksIFwiXCIpLnRvTG93ZXJDYXNlKCk7XG4gICAgLy8gaWYgKGMuaW5kZXhPZihcImhzbGEoXCIpID09PSAwIHx8IGMuaW5kZXhPZihcInJnYmEoXCIpID09PSAwKSB7XG4gICAgLy8gICByZXR1cm4gcGFyc2VGbG9hdChjLnNwbGl0KFwiKVwiKVswXS5zcGxpdChcIixcIilbM10sIDEwKTtcbiAgICAvLyB9XG4gICAgLy8gZWxzZSB7XG4gICAgLy8gICByZXR1cm4gMTtcbiAgICAvLyB9XG4gIH1cblxuICAvKiogUmV0dXJucyB0aGUgRDMgcmdiIG9iamVjdC4gKi9cbiAgcmdiKCkge1xuICAgIHJldHVybiB0aGlzLmQzO1xuICB9XG5cbiAgLyoqXG4gICAgICBTdWJ0cmFjdHMgYSBzZWNvbmQgY29sb3IsIHJldHVybmluZyBhIG5ldyBDb2xvciBvYmplY3QuXG4gICAgICBAcGFyYW0ge0NvbG9yfSBjMiAtIFRoZSBjb2xvciB0byBiZSBzdWJ0cmFjdGVkIG91dC4gSWYgaXQgaXMgbm90IGEgZDNwbHVzLWNvbG9yIE9iamVjdCwgdGhlbiBpdCB3aWxsIGJlIHBhcnNlZCBpbnRvIG9uZS5cbiAgICAgIEByZXR1cm5zIHtDb2xvcn1cbiAgKi9cbiAgc3VidHJhY3QoYzIpIHtcbiAgICBpZiAoYzIuY29uc3RydWN0b3IgIT09IENvbG9yKSB7IGMyID0gbmV3IENvbG9yKGMyKTsgfVxuICAgIHZhciBvMSA9IHRoaXMub3BhY2l0eSgpLCBvMiA9IGMyLm9wYWNpdHkoKSwgYzEgPSB0aGlzLmhzbCgpO1xuICAgIGMyID0gYzIuaHNsKCk7XG4gICAgdmFyIGQgPSAoYzIuaCAqIG8yIC0gYzEuaCAqIG8xKTtcbiAgICBpZiAoTWF0aC5hYnMoZCkgPiAxODApIHsgZCA9IGQgLSAzNjA7IH1cbiAgICB2YXIgaCA9IChjMS5oIC0gZCkgJSAzNjAsXG4gICAgICAgIHMgPSBjMS5zIC0gKGMyLnMgKiBvMiAtIGMxLnMgKiBvMSkgLyAyLFxuICAgICAgICBsID0gYzEubCAtIChjMi5sICogbzIgLSBjMS5sICogbzEpIC8gMjtcbiAgICAgICAgLy8gYSA9IG8xIC0gKG8yIC0gbzEpIC8gMjtcbiAgICBpZiAoaCA8IDApIHsgaCA9IDM2MCArIGg7IH1cbiAgICByZXR1cm4gbmV3IENvbG9yKFwiaHNsKFwiICsgW2gsIHMgKiAxMDAgKyBcIiVcIiwgbCAqIDEwMCArIFwiJVwiXS5qb2luKFwiLFwiKSArIFwiKVwiKTtcbiAgICAvLyByZXR1cm4gbmV3IENvbG9yKFwiaHNsYShcIiArIFtoLCBzICogMTAwICsgXCIlXCIsIGwgKiAxMDAgKyBcIiVcIiwgYV0uam9pbihcIixcIikgKyBcIilcIik7XG4gIH1cblxuICAvKipcbiAgICAgIEFuYWx5emVzIHRoZSBjb2xvciBhbmQgZGV0ZXJtaW5lcyBhbiBhcHByb3ByaWF0ZSBjb2xvciBmb3IgdGV4dCB0byBiZSBwbGFjZWQgb24gdG9wIG9mIHRoZSBjb2xvci5cbiAgICAgIEByZXR1cm5zIHtDb2xvcn1cbiAgKi9cbiAgdGV4dCgpIHtcbiAgICB2YXIgcmdiID0gdGhpcy5yZ2IoKSwgciA9IHJnYi5yLCBnID0gcmdiLmcsIGIgPSByZ2IuYixcbiAgICAgICAgeWlxID0gKHIgKiAyOTkgKyBnICogNTg3ICsgYiAqIDExNCkgLyAxMDAwLFxuICAgICAgICBjID0geWlxID49IDEyOCA/IHRoaXMuZGVmYXVsdHMuZGFyayA6IHRoaXMuZGVmYXVsdHMubGlnaHQ7XG4gICAgcmV0dXJuIG5ldyBDb2xvcihjKTtcbiAgfVxuXG4gIC8qKlxuICAgICAgUGFzcy10aHJvdWdoIG1ldGhvZCBmb3IgRDMgdG9TdHJpbmcgZnVuY3Rpb24uXG4gICAgICBAcmV0dXJucyB7U3RyaW5nfVxuICAqL1xuICB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5kMy50b1N0cmluZygpO1xuICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb2xvcjtcbiJdfQ==
