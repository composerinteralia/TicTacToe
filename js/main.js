var View = require('./ttt-view');
var Game = require('./game');

$(function () {
  var $ttt = $(".ttt");
  new View(new Game(), $ttt);
});
