# d3plus-color

[![NPM Release](http://img.shields.io/npm/v/d3plus-color.svg?style=flat)](https://www.npmjs.org/package/d3plus-color) [![Build Status](https://travis-ci.org/d3plus/d3plus-color.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-color) [![Dependency Status](http://img.shields.io/david/d3plus/d3plus-color.svg?style=flat)](https://david-dm.org/d3plus/d3plus-color) [![Gitter](https://img.shields.io/gitter/room/nwjs/nw.js.svg?style=flat)](https://gitter.im/d3plus/)

Color functions that extent the ability of d3-color.

## Installing

If you use NPM, run `npm install d3plus-color --save`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-color/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-color.v0.6.full.min.js"></script>
```


## API Reference

##### 
* [colorAdd](#colorAdd) - Adds two colors together.
* [colorAssign](#colorAssign) - Assigns a color to a value using a predefined set of defaults.
* [colorContrast](#colorContrast) - A set of default color values used when assigning colors based on data.
* [colorLegible](#colorLegible) - Darkens a color so that it will appear legible on a white background.
* [colorLighter](#colorLighter) - Similar to d3.color.brighter, except that this also reduces saturation so that colors don't appear neon.
* [colorSubtract](#colorSubtract) - Subtracts one color from another.

##### 
* [colorDefaults](#colorDefaults) - A set of default color values used when assigning colors based on data.

| Name | Default | Description |
|---|---|---|
| dark | #444444 | Used in the [contrast](#contrast) function when the color given is very light. |
| light | #f7f7f7 | Used in the [contrast](#contrast) function when the color given is very dark. |
| missing | #cccccc | Used in the [assign](#assign) function when the value passed is `null` or `undefined`. |
| off | #b22200 | Used in the [assign](#assign) function when the value passed is `false`. |
| on | #224f20 | Used in the [assign](#assign) function when the value passed is `true`. |
| scale | #b22200, #eace3f, #282f6b, #b35c1e, #224f20, #5f487c, #759143, #419391, #993c88, #e89c89, #ffee8d, #afd5e8, #f7ba77, #a5c697, #c5b5e5, #d1d392, #bbefd0, #e099cf | An ordinal scale used in the [assign](#assign) function for non-valid color strings and numbers. |

---

<a name="colorAdd"></a>
#### d3plus.**colorAdd**(c1, c2, [o1], [o2]) [<>](https://github.com/d3plus/d3plus-color/blob/master/src/add.js#L3)

Adds two colors together.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c1 | <code>String</code> |  | The first color, a valid CSS color string. |
| c2 | <code>String</code> |  | The second color, also a valid CSS color string. |
| [o1] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |
| [o2] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |


---

<a name="colorAssign"></a>
#### d3plus.**colorAssign**(c, [u]) [<>](https://github.com/d3plus/d3plus-color/blob/master/src/assign.js#L4)

Assigns a color to a value using a predefined set of defaults.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [u] | <code>Object</code> | <code>defaults</code> | An object containing overrides of the default colors. |


---

<a name="colorContrast"></a>
#### d3plus.**colorContrast**(c, [u]) [<>](https://github.com/d3plus/d3plus-color/blob/master/src/contrast.js#L4)

A set of default color values used when assigning colors based on data.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [u] | <code>Object</code> | <code>defaults</code> | An object containing overrides of the default colors. |


---

<a name="colorLegible"></a>
#### d3plus.**colorLegible**(c) [<>](https://github.com/d3plus/d3plus-color/blob/master/src/legible.js#L3)

Darkens a color so that it will appear legible on a white background.


This is a global function.

---

<a name="colorLighter"></a>
#### d3plus.**colorLighter**(c, [i]) [<>](https://github.com/d3plus/d3plus-color/blob/master/src/lighter.js#L3)

Similar to d3.color.brighter, except that this also reduces saturation so that colors don't appear neon.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [i] | <code>String</code> | <code>0.5</code> | A value from 0 to 1 dictating the strength of the function. |


---

<a name="colorSubtract"></a>
#### d3plus.**colorSubtract**(c1, c2, [o1], [o2]) [<>](https://github.com/d3plus/d3plus-color/blob/master/src/subtract.js#L3)

Subtracts one color from another.


This is a global function.

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c1 | <code>String</code> |  | The base color, a valid CSS color string. |
| c2 | <code>String</code> |  | The color to remove from the base color, also a valid CSS color string. |
| [o1] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |
| [o2] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |


---

<a name="colorDefaults"></a>
#### **colorDefaults** [<>](https://github.com/d3plus/d3plus-color/blob/master/src/defaults.js#L3)

A set of default color values used when assigning colors based on data.

| Name | Default | Description |
|---|---|---|
| dark | #444444 | Used in the [contrast](#contrast) function when the color given is very light. |
| light | #f7f7f7 | Used in the [contrast](#contrast) function when the color given is very dark. |
| missing | #cccccc | Used in the [assign](#assign) function when the value passed is `null` or `undefined`. |
| off | #b22200 | Used in the [assign](#assign) function when the value passed is `false`. |
| on | #224f20 | Used in the [assign](#assign) function when the value passed is `true`. |
| scale | #b22200, #eace3f, #282f6b, #b35c1e, #224f20, #5f487c, #759143, #419391, #993c88, #e89c89, #ffee8d, #afd5e8, #f7ba77, #a5c697, #c5b5e5, #d1d392, #bbefd0, #e099cf | An ordinal scale used in the [assign](#assign) function for non-valid color strings and numbers. |


This is a global namespace.

---



###### <sub>Documentation generated on Thu, 21 Dec 2017 20:47:44 GMT</sub>
