# d3plus-color

[![NPM Release](http://img.shields.io/npm/v/d3plus-color.svg?style=flat-square)](https://www.npmjs.org/package/d3plus-color)
[![Build Status](https://travis-ci.org/d3plus/d3plus-color.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-color)
[![Dependency Status](http://img.shields.io/david/d3plus/d3plus-color.svg?style=flat-square)](https://david-dm.org/d3plus/d3plus-color)
[![Dependency Status](http://img.shields.io/david/dev/d3plus/d3plus-color.svg?style=flat-square)](https://david-dm.org/d3plus/d3plus-color#info=devDependencies)

<a name="Color"></a>
## Color
Color functions that extent the ability of d3-color.

**Kind**: global class  

* [Color](#Color)
  * [new Color(color, [defaults])](#new_Color_new)
  * [.add(c2)](#Color+add) ⇒ <code>[Color](#Color)</code>
  * [.displayable()](#Color+displayable) ⇒ <code>Boolean</code>
  * [.hex()](#Color+hex) ⇒ <code>String</code>
  * [.hsl()](#Color+hsl)
  * [.legible()](#Color+legible) ⇒ <code>[Color](#Color)</code>
  * [.lighter()](#Color+lighter) ⇒ <code>[Color](#Color)</code>
  * [.rgb()](#Color+rgb)
  * [.subtract(c2)](#Color+subtract) ⇒ <code>[Color](#Color)</code>
  * [.text()](#Color+text) ⇒ <code>[Color](#Color)</code>
  * [.toString()](#Color+toString) ⇒ <code>String</code>

<a name="new_Color_new"></a>
### new Color(color, [defaults])

| Param | Type | Default |
| --- | --- | --- |
| color | <code>[Color](#Color)</code> &#124; <code>String</code> &#124; <code>Number</code> &#124; <code>true</code> &#124; <code>false</code> &#124; <code>null</code> &#124; <code>undefined</code> |  | 
| [defaults] | <code>object</code> | <code>src/defaults.js</code> | 

<a name="Color+add"></a>
### color.add(c2) ⇒ <code>[Color](#Color)</code>
Mixes a second color, returning a new Color object.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| c2 | <code>[Color](#Color)</code> | The color to be mixed in. If it is not a d3plus-color Object, then it will be parsed into one. |

<a name="Color+displayable"></a>
### color.displayable() ⇒ <code>Boolean</code>
Returns true if the color is displayable.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+hex"></a>
### color.hex() ⇒ <code>String</code>
Returns the hexidecimal value.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+hsl"></a>
### color.hsl()
Returns the D3 hsl object.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+legible"></a>
### color.legible() ⇒ <code>[Color](#Color)</code>
Darkens the color if it is too light to appear on white.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+lighter"></a>
### color.lighter() ⇒ <code>[Color](#Color)</code>
Lightens the color while also reducing the saturation.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+rgb"></a>
### color.rgb()
Returns the D3 rgb object.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+subtract"></a>
### color.subtract(c2) ⇒ <code>[Color](#Color)</code>
Subtracts a second color, returning a new Color object.

**Kind**: instance method of <code>[Color](#Color)</code>  

| Param | Type | Description |
| --- | --- | --- |
| c2 | <code>[Color](#Color)</code> | The color to be subtracted out. If it is not a d3plus-color Object, then it will be parsed into one. |

<a name="Color+text"></a>
### color.text() ⇒ <code>[Color](#Color)</code>
Analyzes the color and determines an appropriate color for text to be placed on top of the color.

**Kind**: instance method of <code>[Color](#Color)</code>  
<a name="Color+toString"></a>
### color.toString() ⇒ <code>String</code>
Pass-through method for D3 toString function.

**Kind**: instance method of <code>[Color](#Color)</code>  
