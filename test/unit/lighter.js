import {default as color} from "../../";
import {test} from "tape";

test("color lightening", (assert) => {
  assert.equal("#cf5252", color.lighter("#440000"));
  assert.equal("#52cf52", color.lighter("#004400"));
  assert.equal("#5252cf", color.lighter("#000044"));
  assert.end();
});
