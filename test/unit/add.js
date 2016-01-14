import {default as color} from "../../";
import {test} from "tape";

test("color addition", (assert) => {
  assert.equal("#ff8000", color.add("#ff0000", "#ffff00"));
  assert.equal("#00ff80", color.add("#ffff00", "#0000ff"));
  assert.equal("#ff00ff", color.add("#0000ff", "#ff0000"));
  assert.equal("#ff8000", color.add("#ffff00", "#ff0000"));
  assert.equal("#00ff80", color.add("#0000ff", "#ffff00"));
  assert.equal("#ff00ff", color.add("#ff0000", "#0000ff"));
  assert.end();
});
