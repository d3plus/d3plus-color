import {default as color} from "../";
import {test} from "tape";

test("legible", (assert) => {
  assert.equal("rgb(207, 23, 23)", color.legible("#ffaaaa"));
  assert.equal("rgb(23, 207, 23)", color.legible("#ccffcc"));
  assert.equal("rgb(23, 23, 207)", color.legible("#ccccff"));
  assert.end();
});
