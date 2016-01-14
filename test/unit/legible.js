import {default as color} from "../../";
import {test} from "tape";

test("darkening colors to be visible on white", (assert) => {
  assert.equal("#cf1717", color.legible("#ffaaaa"));
  assert.equal("#17cf17", color.legible("#ccffcc"));
  assert.equal("#1717cf", color.legible("#ccccff"));
  assert.end();
});
