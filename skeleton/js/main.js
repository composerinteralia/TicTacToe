var View = require('./ttt-view');
var Game = require('../../ttt-core-solution/game');

$(function () {
  // Your code here
  window.TTT = window.TTT || {};

  var $ttt = $(".ttt");

  View = window.TTT.View = new View(new Game(), $ttt);
  View.setupBoard();
  View.bindEvents();

});
