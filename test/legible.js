import zora from "zora";
import {default as legible} from "../src/legible.js";

export default zora()
  .test("legible", assert => {
    assert.equal("rgb(207, 23, 23)", legible("#ffaaaa"));
    assert.equal("rgb(23, 207, 23)", legible("#ccffcc"));
    assert.equal("rgb(23, 23, 207)", legible("#ccccff"));
  });
