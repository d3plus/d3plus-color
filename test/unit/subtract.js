import {default as color} from "../../";
import {test} from "tape";

test("color subtraction", (assert) => {
  assert.equal("#feff00", color.subtract("#ff8000", "#ff0000"));
  assert.equal("#0100ff", color.subtract("#00ff80", "#ffff00"));
  assert.equal("#ff0000", color.subtract("#ff00ff", "#0000ff"));
  assert.equal("#ff0100", color.subtract("#ff8000", "#ffff00"));
  assert.equal("#feff00", color.subtract("#00ff80", "#0000ff"));
  assert.equal("#0000ff", color.subtract("#ff00ff", "#ff0000"));
  assert.end();
});
