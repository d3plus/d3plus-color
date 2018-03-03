import test from "zora";
import {default as subtract} from "../src/subtract.js";

test("subtract", assert => {
  assert.equal("rgb(254, 255, 0)", subtract("#ff8000", "#ff0000"));
  assert.equal("rgb(254, 255, 0)", subtract("#00ff80", "#0000ff"));
  assert.equal("rgb(1, 0, 255)", subtract("#00ff80", "#ffff00"));
  assert.equal("rgb(0, 0, 255)", subtract("#ff00ff", "#ff0000"));
  assert.equal("rgb(255, 0, 0)", subtract("#ff00ff", "#0000ff"));
  assert.equal("rgb(255, 1, 0)", subtract("#ff8000", "#ffff00"));
});

export default test;
