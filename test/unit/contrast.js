import {default as color} from "../../";
import {test} from "tape";

test("text color for dark backgrounds", (assert) => {
  assert.equal(color.defaults.light, color.contrast("#000"));
  assert.equal(color.defaults.light, color.contrast("#777"));
  assert.equal(color.defaults.light, color.contrast("#c00"));
  assert.equal(color.defaults.light, color.contrast("#0b0"));
  assert.equal(color.defaults.light, color.contrast("#00f"));
  assert.equal(color.defaults.light, color.contrast("#880"));
  assert.equal(color.defaults.light, color.contrast("#0aa"));
  assert.equal(color.defaults.light, color.contrast("#c0c"));
  assert.end();
});

test("text color for light backgrounds", (assert) => {
  assert.equal(color.defaults.dark, color.contrast("#fff"));
  assert.equal(color.defaults.dark, color.contrast("#888"));
  assert.equal(color.defaults.dark, color.contrast("#fcc"));
  assert.equal(color.defaults.dark, color.contrast("#8c8"));
  assert.equal(color.defaults.dark, color.contrast("#990"));
  assert.equal(color.defaults.dark, color.contrast("#0bb"));
  assert.equal(color.defaults.dark, color.contrast("#fcf"));
  assert.end();
});
