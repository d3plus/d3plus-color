import {default as color} from "../../";
import {test} from "tape";

test("parsing null values to grey", (assert) => {
  assert.equal(color.defaults.missing, color.assign(null), "null");
  assert.equal(color.defaults.missing, color.assign(undefined), "undefined");
  assert.end();
});

test("parsing booleans to red/green", (assert) => {
  assert.equal(color.defaults.on, color.assign(true), "true");
  assert.equal(color.defaults.off, color.assign(false), "false");
  assert.end();
});

test("mapping non-color values to a color scale", (assert) => {
  const range = color.defaults.scale.range();
  assert.equal(range[0], color.assign("Alpha"));
  assert.equal(range[1], color.assign("Beta"));
  assert.equal(range[2], color.assign(45));
  assert.equal(range[3], color.assign(85.235));
  assert.end();
});
