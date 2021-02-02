# d3plus-color

[![NPM Release](http://img.shields.io/npm/v/d3plus-color.svg?style=flat)](https://www.npmjs.org/package/d3plus-color) [![Build Status](https://travis-ci.org/d3plus/d3plus-color.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-color) [![Dependency Status](http://img.shields.io/david/d3plus/d3plus-color.svg?style=flat)](https://david-dm.org/d3plus/d3plus-color) [![Gitter](https://img.shields.io/badge/-chat_on_gitter-brightgreen.svg?style=flat&logo=gitter-white)](https://gitter.im/d3plus/)

Color functions that extent the ability of d3-color.

## Installing

If you use NPM, `npm install d3plus-color`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-color/releases/latest). You can also load d3plus-color as a standalone library or as part of [D3plus](https://github.com/d3plus/d3plus). ES modules, AMD, CommonJS, and vanilla environments are supported. In vanilla, a `d3plus` global is exported:

```html
<script src="https://cdn.jsdelivr.net/npm/d3plus-color@1"></script>
<script>
  console.log(d3plus);
</script>
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
| dark | "#555555" | Used in the [contrast](#contrast) function when the color given is very light. |
| light | "#f7f7f7" | Used in the [contrast](#contrast) function when the color given is very dark. |
| missing | "#cccccc" | Used in the [assign](#assign) function when the value passed is `null` or `undefined`. |
| off | "#C44536" | Used in the [assign](#assign) function when the value passed is `false`. |
| on | "#6A994E" | Used in the [assign](#assign) function when the value passed is `true`. |
| scale | "#4281A4", "#F6AE2D", "#C44536", "#2A9D8F", "#6A994E", "#CEB54A", "#5E548E", "#C08497", "#99582A", "#8C8C99", "#1D3557", "#D08C60", "#6D2E46", "#8BB19C", "#52796F", "#5E60CE", "#985277", "#5C374C" | An ordinal scale used in the [assign](#assign) function for non-valid color strings and numbers. |

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
| dark | "#555555" | Used in the [contrast](#contrast) function when the color given is very light. |
| light | "#f7f7f7" | Used in the [contrast](#contrast) function when the color given is very dark. |
| missing | "#cccccc" | Used in the [assign](#assign) function when the value passed is `null` or `undefined`. |
| off | "#C44536" | Used in the [assign](#assign) function when the value passed is `false`. |
| on | "#6A994E" | Used in the [assign](#assign) function when the value passed is `true`. |
| scale | "#4281A4", "#F6AE2D", "#C44536", "#2A9D8F", "#6A994E", "#CEB54A", "#5E548E", "#C08497", "#99582A", "#8C8C99", "#1D3557", "#D08C60", "#6D2E46", "#8BB19C", "#52796F", "#5E60CE", "#985277", "#5C374C" | An ordinal scale used in the [assign](#assign) function for non-valid color strings and numbers. |


This is a global namespace.

---



###### <sub>Documentation generated on Tue, 02 Feb 2021 14:25:49 GMT</sub>
