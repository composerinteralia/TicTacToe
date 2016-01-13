var View = function (game, $el) {
  this.game = game;
  this.$el = $el;
};

View.prototype.bindEvents = function () {
  this.$el.on("click", "li", function (e) {
    var $li = $(e.currentTarget);
    $li.toggleClass("clicked");
    this.makeMove($li);
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

  this.game.playMove(PositionsMap[posIdx]);
  // console.log(this.game.board.print());
};

View.prototype.setupBoard = function () {

  var snip = "<ul class=\"group\"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul>";
  this.$el.append(snip);

};

module.exports = View;
