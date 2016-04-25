import {default as color} from "../";
import {test} from "tape";

test("assign", (assert) => {
  assert.equal(color.defaults.missing, color.assign(null), "null");
  assert.equal(color.defaults.missing, color.assign(undefined), "undefined");

  assert.equal(color.defaults.on, color.assign(true), "true");
  assert.equal(color.defaults.off, color.assign(false), "false");

  const range = color.defaults.scale.range();
  assert.true(range[0] === color.assign("Alpha") &&
              range[1] === color.assign("Beta") &&
              range[2] === color.assign(45) &&
              range[3] === color.assign(85.235), "value scale");

  assert.end();
});
