# d3plus-color

[![NPM Release](http://img.shields.io/npm/v/d3plus-color.svg?style=flat)](https://www.npmjs.org/package/d3plus-color)
[![Build Status](https://travis-ci.org/d3plus/d3plus-color.svg?branch=master)](https://travis-ci.org/d3plus/d3plus-color)
[![Dependency Status](http://img.shields.io/david/d3plus/d3plus-color.svg?style=flat)](https://david-dm.org/d3plus/d3plus-color)
[![Slack](https://img.shields.io/badge/Slack-Click%20to%20Join!-green.svg?style=social)](https://goo.gl/forms/ynrKdvusekAwRMPf2)

Color functions that extent the ability of d3-color.

## Installing

If you use NPM, `npm install d3plus-color`. Otherwise, download the [latest release](https://github.com/d3plus/d3plus-color/releases/latest). The released bundle supports AMD, CommonJS, and vanilla environments. Create a [custom bundle using Rollup](https://github.com/rollup/rollup) or your preferred bundler. You can also load directly from [d3plus.org](https://d3plus.org):

```html
<script src="https://d3plus.org/js/d3plus-color.v0.5.full.min.js"></script>
```


## API Reference
### Modules

<dl>
<dt><a href="#module_defaults">defaults</a> : <code>Object</code></dt>
<dd><p>A set of default color values used when assigning colors based on data.</p>
<table>
<thead>
<tr>
<th>Name</th>
<th>Default</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>dark</td>
<td>#444444</td>
<td>Used in the <a href="#contrast">contrast</a> function when the color given is very light.</td>
</tr>
<tr>
<td>light</td>
<td>#f7f7f7</td>
<td>Used in the <a href="#contrast">contrast</a> function when the color given is very dark.</td>
</tr>
<tr>
<td>missing</td>
<td>#cccccc</td>
<td>Used in the <a href="#assign">assign</a> function when the value passed is <code>null</code> or <code>undefined</code>.</td>
</tr>
<tr>
<td>off</td>
<td>#b22200</td>
<td>Used in the <a href="#assign">assign</a> function when the value passed is <code>false</code>.</td>
</tr>
<tr>
<td>on</td>
<td>#224f20</td>
<td>Used in the <a href="#assign">assign</a> function when the value passed is <code>true</code>.</td>
</tr>
<tr>
<td>scale</td>
<td><code>scale.ordinal().range([ &quot;#b22200&quot;, &quot;#eace3f&quot;, &quot;#282f6b&quot;, &quot;#b35c1e&quot;, &quot;#224f20&quot;, &quot;#5f487c&quot;, &quot;#759143&quot;, &quot;#419391&quot;, &quot;#993c88&quot;, &quot;#e89c89&quot;, &quot;#ffee8d&quot;, &quot;#afd5e8&quot;, &quot;#f7ba77&quot;, &quot;#a5c697&quot;, &quot;#c5b5e5&quot;, &quot;#d1d392&quot;, &quot;#bbefd0&quot;, &quot;#e099cf&quot;])</code></td>
<td>An ordinal scale used in the <a href="#assign">assign</a> function for non-valid color strings and numbers.</td>
</tr>
</tbody>
</table>
</dd>
</dl>

### Functions

<dl>
<dt><a href="#add">add(c1, c2, [o1], [o2])</a> ⇒ <code>String</code></dt>
<dd><p>Adds two colors together.</p>
</dd>
<dt><a href="#assign">assign(c, [u])</a> ⇒ <code>String</code></dt>
<dd><p>Assigns a color to a value using a predefined set of defaults.</p>
</dd>
<dt><a href="#contrast">contrast(c, [u])</a> ⇒ <code>String</code></dt>
<dd><p>A set of default color values used when assigning colors based on data.</p>
</dd>
<dt><a href="#legible">legible(c)</a> ⇒ <code>String</code></dt>
<dd><p>Darkens a color so that it will appear legible on a white background.</p>
</dd>
<dt><a href="#lighter">lighter(c, [i])</a> ⇒ <code>String</code></dt>
<dd><p>Similar to d3.color.brighter, except that this also reduces saturation so that colors don&#39;t appear neon.</p>
</dd>
<dt><a href="#subtract">subtract(c1, c2, [o1], [o2])</a> ⇒ <code>String</code></dt>
<dd><p>Subtracts one color from another.</p>
</dd>
</dl>

<a name="module_defaults"></a>

### defaults : <code>Object</code>
A set of default color values used when assigning colors based on data.

| Name | Default | Description |
|---|---|---|
| dark | #444444 | Used in the [contrast](#contrast) function when the color given is very light. |
| light | #f7f7f7 | Used in the [contrast](#contrast) function when the color given is very dark. |
| missing | #cccccc | Used in the [assign](#assign) function when the value passed is `null` or `undefined`. |
| off | #b22200 | Used in the [assign](#assign) function when the value passed is `false`. |
| on | #224f20 | Used in the [assign](#assign) function when the value passed is `true`. |
| scale | `scale.ordinal().range([ "#b22200", "#eace3f", "#282f6b", "#b35c1e", "#224f20", "#5f487c", "#759143", "#419391", "#993c88", "#e89c89", "#ffee8d", "#afd5e8", "#f7ba77", "#a5c697", "#c5b5e5", "#d1d392", "#bbefd0", "#e099cf"])` | An ordinal scale used in the [assign](#assign) function for non-valid color strings and numbers. |

<a name="add"></a>

### add(c1, c2, [o1], [o2]) ⇒ <code>String</code>
Adds two colors together.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c1 | <code>String</code> |  | The first color, a valid CSS color string. |
| c2 | <code>String</code> |  | The second color, also a valid CSS color string. |
| [o1] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |
| [o2] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |

<a name="assign"></a>

### assign(c, [u]) ⇒ <code>String</code>
Assigns a color to a value using a predefined set of defaults.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [u] | <code>Object</code> | <code>defaults</code> | An object containing overrides of the default colors. |

<a name="contrast"></a>

### contrast(c, [u]) ⇒ <code>String</code>
A set of default color values used when assigning colors based on data.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [u] | <code>Object</code> | <code>defaults</code> | An object containing overrides of the default colors. |

<a name="legible"></a>

### legible(c) ⇒ <code>String</code>
Darkens a color so that it will appear legible on a white background.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| c | <code>String</code> | A valid CSS color string. |

<a name="lighter"></a>

### lighter(c, [i]) ⇒ <code>String</code>
Similar to d3.color.brighter, except that this also reduces saturation so that colors don't appear neon.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c | <code>String</code> |  | A valid CSS color string. |
| [i] | <code>String</code> | <code>0.5</code> | A value from 0 to 1 dictating the strength of the function. |

<a name="subtract"></a>

### subtract(c1, c2, [o1], [o2]) ⇒ <code>String</code>
Subtracts one color from another.

**Kind**: global function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| c1 | <code>String</code> |  | The base color, a valid CSS color string. |
| c2 | <code>String</code> |  | The color to remove from the base color, also a valid CSS color string. |
| [o1] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |
| [o2] | <code>String</code> | <code>1</code> | Value from 0 to 1 of the first color's opacity. |



###### <sub>Documentation generated on Mon, 31 Oct 2016 20:30:46 GMT</sub>
