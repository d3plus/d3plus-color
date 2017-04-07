import zora from "zora";
import {default as lighter} from "../src/lighter.js";

export default zora()
  .test("lighter", assert => {
    assert.equal("rgb(207, 82, 82)", lighter("#440000"));
    assert.equal("rgb(82, 207, 82)", lighter("#004400"));
    assert.equal("rgb(82, 82, 207)", lighter("#000044"));
  });
