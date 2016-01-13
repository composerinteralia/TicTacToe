var MoveError = require("../../ttt-core-solution/moveError");

var View = function (game, $el) {
  this.game = game;
  this.$el = $el;
};

View.prototype.bindEvents = function () {
  this.$el.on("click", "li", function (e) {
    this.makeMove($(e.currentTarget));
  }.bind(this));
};

View.prototype.makeMove = function ($square) {

  var $allTiles = $square.parent().children();
  var posIdx = $allTiles.index($square);

  var PositionsMap = {
    0: [0, 0],
    1: [0, 1],
    2: [0, 2],
    3: [1, 0],
    4: [1, 1],
    5: [1, 2],
    6: [2, 0],
    7: [2, 1],
    8: [2, 2]
  };

  if ($square.hasClass("clicked")) {
    console.log("spot taken");
  } else {
    $square.addClass("clicked");
    $square.append(this.game.currentPlayer);
    this.game.playMove(PositionsMap[posIdx]);
  }

  if (this.game.isOver()) {
    var winner = this.game.board.winner();

    var $message = $("<p></p>");

    if (winner) {
      $message.append(winner).append(" wins!");
    } else {
      $message.append("It's a draw!");
    }
    $('body').append($message);

    $('.ttt').off('click');
  }

};

View.prototype.setupBoard = function () {

  var snip = "<ul class=\"group\"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>";
  this.$el.append(snip);

};

module.exports = View;
