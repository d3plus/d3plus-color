import {default as color} from "../";
import {test} from "tape";

test("contrast", (assert) => {
  assert.true(color.defaults.light === color.contrast("#000") &&
              color.defaults.light === color.contrast("#777") &&
              color.defaults.light === color.contrast("#c00") &&
              color.defaults.light === color.contrast("#0b0") &&
              color.defaults.light === color.contrast("#00f") &&
              color.defaults.light === color.contrast("#880") &&
              color.defaults.light === color.contrast("#0aa") &&
              color.defaults.light === color.contrast("#c0c"), "light");


  assert.true(color.defaults.dark === color.contrast("#fff") &&
              color.defaults.dark === color.contrast("#888") &&
              color.defaults.dark === color.contrast("#fcc") && 
              color.defaults.dark === color.contrast("#8c8") &&
              color.defaults.dark === color.contrast("#990") &&
              color.defaults.dark === color.contrast("#0bb") &&
              color.defaults.dark === color.contrast("#fcf"), "dark");

  assert.end();
});
