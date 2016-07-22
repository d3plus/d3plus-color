import {default as contrast} from "../src/contrast.js";
import {default as defaults} from "../src/defaults.js";
import {test} from "tape";

test("contrast", assert => {
  assert.true(defaults.light === contrast("#000") &&
              defaults.light === contrast("#777") &&
              defaults.light === contrast("#c00") &&
              defaults.light === contrast("#0b0") &&
              defaults.light === contrast("#00f") &&
              defaults.light === contrast("#880") &&
              defaults.light === contrast("#0aa") &&
              defaults.light === contrast("#c0c"), "light");


  assert.true(defaults.dark === contrast("#fff") &&
              defaults.dark === contrast("#888") &&
              defaults.dark === contrast("#fcc") &&
              defaults.dark === contrast("#8c8") &&
              defaults.dark === contrast("#990") &&
              defaults.dark === contrast("#0bb") &&
              defaults.dark === contrast("#fcf"), "dark");

  assert.end();
});
