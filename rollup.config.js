import json from "rollup-plugin-json";
import babel from "rollup-plugin-babel";

export default {
  dest: "build/d3plus-color.js",
  entry: "index.js",
  format: "umd",
  globals: function(id) { return id.replace(/-/g, "_"); },
  moduleId: "d3plus-color",
  moduleName: "d3plus_color",
  plugins: [json(), babel({"presets": ["es2015-rollup"]})]
};
