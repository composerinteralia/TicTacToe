var MoveError = require("./moveError");

var View = function (game, $el) {
  this.game = game;
  this.$el = $el;

  this.setupBoard();
  this.bindEvents();
};

View.prototype.bindEvents = function () {
  this.$el.on("click", "li", function (e) {
    this.makeMove($(e.currentTarget));
  }.bind(this));
};

View.PositionsMap = {
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

View.prototype.makeMove = function ($square) {
  var $allTiles = $square.parent().children();
  var posIdx = $allTiles.index($square);
  var pos = View.PositionsMap[posIdx]

  if ($square.hasClass("clicked")) {
    console.log("spot taken");
  } else {
    $square.addClass("clicked");
    $square.append(this.game.currentPlayer);
    this.game.playMove(pos);
  }

  if (this.game.isOver()) {
    var winner = this.game.board.winner();
    var $message = $("<p>");
    if (winner) {
      $message.html(winner + " wins!")
      this.flash();
    } else {
      $message.html("It's a draw!");
    }
    $('body').append($message);

    this.$el.off('click');
  }
};

View.prototype.randomColor = function () {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

View.prototype.flash = function () {
  window.setInterval(function () {
    $('body').css({"background": this.randomColor})
  }.bind(this),100)

  window.setInterval(function () {
    $('*').css({"color": this.randomColor})
  }.bind(this), 150)

  window.setInterval(function () {
    $('li').css({"background": this.randomColor, "border-color": this.randomColor})
  }.bind(this), 125)

  window.setInterval(function () {
    $('ul').css({"border-color": this.randomColor})
  }.bind(this), 175)
};

View.prototype.setupBoard = function () {
  var $ul = $("<ul>").addClass("group")
  for (var i = 0; i < 9; i++) {
    $ul.append($("<li>"))
  }

  this.$el.append($ul);
};

module.exports = View;
