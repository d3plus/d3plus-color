import buble from "rollup-plugin-buble";
import json from "rollup-plugin-json";

export default {
  dest: "build/d3plus-color.js",
  entry: "index.js",
  format: "umd",
  globals: function(id) { return id.replace(/-/g, "_"); },
  moduleId: "d3plus-color",
  moduleName: "d3plus_color",
  plugins: [json(), buble()]
};
