import zora from "zora";
import {default as assign} from "../src/assign.js";
import {default as defaults} from "../src/defaults.js";

export default zora()
  .test("assign", assert => {
    assert.equal(defaults.missing, assign(null), "null");
    assert.equal(defaults.missing, assign(undefined), "undefined");

    assert.equal(defaults.on, assign(true), "true");
    assert.equal(defaults.off, assign(false), "false");

    const range = defaults.scale.range();
    assert.ok(range[0] === assign("Alpha") &&
              range[1] === assign("Beta") &&
              range[2] === assign(45) &&
              range[3] === assign(85.235), "value scale");
  });
