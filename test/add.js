import zora from "zora";
import {default as add} from "../src/add.js";

export default zora()
  .test("add", assert => {
    assert.equal("rgb(255, 128, 0)", add("#ff0000", "#ffff00"));
    assert.equal("rgb(255, 128, 0)", add("#ffff00", "#ff0000"));
    assert.equal("rgb(0, 255, 128)", add("#ffff00", "#0000ff"));
    assert.equal("rgb(0, 255, 128)", add("#0000ff", "#ffff00"));
    assert.equal("rgb(255, 0, 255)", add("#0000ff", "#ff0000"));
    assert.equal("rgb(255, 0, 255)", add("#ff0000", "#0000ff"));
  });
