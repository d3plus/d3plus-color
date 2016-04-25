# d3plus-color

[![NPM Release](http://img.shields.io/npm/v/d3plus-color.svg?style=flat-square)](https://www.npmjs.org/package/d3plus-color)
[![Build Status](https://travis-ci.org/d3plus/d3plus-color.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-color)
[![Dependency Status](http://img.shields.io/david/d3plus/d3plus-color.svg?style=flat-square)](https://david-dm.org/d3plus/d3plus-color)
[![Dependency Status](http://img.shields.io/david/dev/d3plus/d3plus-color.svg?style=flat-square)](https://david-dm.org/d3plus/d3plus-color#info=devDependencies)

d3plus-color is a collection of color utility functions that build upon the popular [d3-color](https://github.com/d3/d3-color) library.

## Installation Options

* [NPM](#install.npm)
* [Browser](#install.browser)
* [AMD and CommonJS](#install.amd)
* [Custom Builds](#install.custom)

<a name="install.npm"></a>
### NPM
```sh
npm install d3plus-color
```

<a name="install.browser"></a>
### Browser
In a vanilla environment, a `d3plus_color` global is exported. To use a compiled version hosted on [d3plus.org](https://d3plus.org) that includes all dependencies:

```html
<script src="https://d3plus.org/js/d3plus-color.v0.3.full.min.js"></script>
```

For development purposes, you can also load all dependencies separately:

```html
<script src="https://d3js.org/d3-array.v0.7.min.js"></script>
<script src="https://d3js.org/d3-collection.v0.1.min.js"></script>
<script src="https://d3js.org/d3-color.v0.4.min.js"></script>
<script src="https://d3js.org/d3-format.v0.5.min.js"></script>
<script src="https://d3js.org/d3-interpolate.v0.7.min.js"></script>
<script src="https://d3js.org/d3-time.v0.2.min.js"></script>
<script src="https://d3js.org/d3-time-format.v0.3.min.js"></script>
<script src="https://d3js.org/d3-scale.v0.6.min.js"></script>

<script src="https://d3plus.org/js/d3plus-color.v0.3.min.js"></script>
```

Otherwise, [click here](https://github.com/d3plus/d3plus-color/releases/latest) to download the latest release.

<a name="install.amd"></a>
### AMD and CommonJS
The released bundle natively supports both AMD and CommonJS, and vanilla environments.

<a name="install.custom"></a>
### Custom Builds
The source code is written using standard `import` and `export` statements. Create a custom build using [Rollup](https://github.com/rollup/rollup) or your preferred bundler. Take a look at the  [index.js](https://github.com/d3plus/d3plus-color/blob/master/index.js) file to see the modules exported.

---

# API Reference
* [add](#add) `Function`
* [assign](#assign) `Function`
* [contrast](#contrast) `Function`
* [legible](#legible) `Function`
* [lighter](#lighter) `Function`
* [subtract](#subtract) `Function`
* [defaults](#defaults) `[object Object]`

<a name="add"></a>

## add(c1, c2, [o1], [o2]) ⇒ <code>String</code>
Adds two colors together.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c1 | <code>String</code> |  | The first color, a valid CSS color string. |
| c2 | <code>String</code> |  | The second color, also a valid CSS color string. |
| [o1] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |
| [o2] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |

<a name="assign"></a>

## assign(c, [u]) ⇒ <code>String</code>
Assigns a color to a value using a predefined set of defaults.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [u] | <code>Object</code> | <code>defaults</code> | An object containing overrides of the default colors. |

<a name="contrast"></a>

## contrast(c, [u]) ⇒ <code>String</code>
A set of default color values used when assigning colors based on data.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [u] | <code>Object</code> | <code>defaults</code> | An object containing overrides of the default colors. |

<a name="legible"></a>

## legible(c) ⇒ <code>String</code>
Darkens a color so that it will appear legible on a white background.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| c | <code>String</code> | A valid CSS color string. |

<a name="lighter"></a>

## lighter(c, [i]) ⇒ <code>String</code>
Similar to d3.color.brighter, except that this also reduces saturation so that colors don't appear neon.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [i] | <code>String</code> | <code>0.5</code> | A value from 0 to 1 dictating the strength of the function. |

<a name="subtract"></a>

## subtract(c1, c2, [o1], [o2]) ⇒ <code>String</code>
Subtracts one color from another.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c1 | <code>String</code> |  | The base color, a valid CSS color string. |
| c2 | <code>String</code> |  | The color to remove from the base color, also a valid CSS color string. |
| [o1] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |
| [o2] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |


---

<a name="module_defaults"></a>

## defaults : <code>Object</code>
A set of default color values used when assigning colors based on data.

| Name | Default | Description |
|---|---|---|
| dark | #444444 | Used in the [contrast](#contrast) function when the color given is very light. |
| light | #f7f7f7 | Used in the [contrast](#contrast) function when the color given is very dark. |
| missing | #cccccc | Used in the [assign](#assign) function when the value passed is `null` or `undefined`. |
| off | #b22200 | Used in the [assign](#assign) function when the value passed is `false`. |
| on | #224f20 | Used in the [assign](#assign) function when the value passed is `true`. |
| scale | `scale.ordinal().range([ "#b22200", "#eace3f", "#282f6b", "#b35c1e", "#224f20", "#5f487c", "#759143", "#419391", "#993c88", "#e89c89", "#ffee8d", "#afd5e8", "#f7ba77", "#a5c697", "#c5b5e5", "#d1d392", "#bbefd0", "#e099cf"])` | An ordinal scale used in the [assign](#assign) function for non-valid color strings and numbers. |

