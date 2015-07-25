var scales = require("d3-scale");

module.exports = {
  "dark": "#444444",
  "light": "#f7f7f7",
  "missing": "#cccccc",
  "off": "#b22200",
  "on": "#224f20",
  "scale": scales.ordinal().range([
    "#b22200", "#eace3f", "#282f6b", "#b35c1e", "#224f20", "#5f487c",
    "#759143", "#419391", "#993c88", "#e89c89", "#ffee8d", "#afd5e8",
    "#f7ba77", "#a5c697", "#c5b5e5", "#d1d392", "#bbefd0", "#e099cf"
  ])
};
