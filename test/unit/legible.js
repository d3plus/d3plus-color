var color = require("../../build/d3plus-color"),
    tape = require("tape");

tape("darkening colors to be visible on white", function(test){
  test.equal("#cf1717", color.legible("#ffaaaa"));
  test.equal("#17cf17", color.legible("#ccffcc"));
  test.equal("#1717cf", color.legible("#ccccff"));
  test.end();
});
